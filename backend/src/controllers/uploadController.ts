import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

// Kiểm tra biến môi trường
if (!process.env.PINATA_JWT) {
  console.error('⚠️ PINATA_JWT not found in environment variables!');
}

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';

// Đảm bảo thư mục uploads tồn tại
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

// Cấu hình Multer để lưu file tạm thời
const upload = multer({ 
  dest: uploadsDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

/**
 * Helper function: Convert IPFS URI to HTTP URL
 */
export const ipfsToHttp = (ipfsUri: string): string => {
  if (!ipfsUri) return '';
  
  // Nếu đã là HTTP URL, return nguyên
  if (ipfsUri.startsWith('http')) return ipfsUri;
  
  // Convert ipfs://QmXXX -> https://gateway.pinata.cloud/ipfs/QmXXX
  if (ipfsUri.startsWith('ipfs://')) {
    const hash = ipfsUri.replace('ipfs://', '');
    return `${PINATA_GATEWAY}${hash}`;
  }
  
  // Nếu chỉ là hash (QmXXX)
  return `${PINATA_GATEWAY}${ipfsUri}`;
};

export const uploadImage = async (req: Request, res: Response) => {
  console.log('📤 Upload image request received');
  console.log('File:', req.file);
  
  if (!req.file) {
    console.error('❌ No file in request');
    return res.status(400).json({ 
      success: false,
      error: 'No file uploaded.' 
    });
  }

  const filePath = req.file.path;
  console.log('📁 File path:', filePath);

  try {
    // Kiểm tra file tồn tại
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found after upload');
    }

    console.log('⬆️ Uploading to Pinata...');
    
    // Tạo FormData để upload
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    
    // Optional: Thêm metadata
    const pinataMetadata = JSON.stringify({
      name: req.file.originalname,
    });
    formData.append('pinataMetadata', pinataMetadata);
    
    // Upload lên Pinata sử dụng REST API
    const response = await axios.post(PINATA_API_URL, formData, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'Authorization': `Bearer ${PINATA_JWT}`
      }
    });

    const ipfsHash = response.data.IpfsHash;
    console.log('✅ Upload successful:', ipfsHash);

    // Xóa file tạm sau khi upload
    fs.unlinkSync(filePath);

    // Trả về IPFS Hash (CID)
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to IPFS',
      ipfsHash: ipfsHash,
      imageUrl: `ipfs://${ipfsHash}`,
      // Thêm HTTP URL để frontend có thể hiển thị ngay
      httpUrl: ipfsToHttp(`ipfs://${ipfsHash}`),
    });

  } catch (error: any) {
    console.error('❌ Error uploading to Pinata:', error);
    
    // Xóa file tạm nếu có lỗi
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload image',
      message: error.message 
    });
  }
};

/**
 * Upload JSON metadata to IPFS
 */
export const uploadJson = async (req: Request, res: Response) => {
  try {
    const metadata = req.body;
    
    if (!metadata || Object.keys(metadata).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No metadata provided' 
      });
    }
    
    console.log('📤 Uploading JSON to Pinata...');
    
    // Upload JSON to Pinata sử dụng REST API
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      {
        pinataContent: metadata,
        pinataMetadata: {
          name: metadata.name || 'carbon-credit-metadata',
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PINATA_JWT}`
        }
      }
    );
    
    const ipfsHash = response.data.IpfsHash;
    console.log('✅ JSON uploaded successfully:', ipfsHash);
    
    res.status(200).json({
      success: true,
      message: 'Metadata uploaded successfully to IPFS',
      ipfsHash: ipfsHash,
      metadataUri: `ipfs://${ipfsHash}`,
      httpUrl: ipfsToHttp(`ipfs://${ipfsHash}`),
    });
    
  } catch (error: any) {
    console.error('❌ Error uploading JSON to Pinata:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to upload metadata',
      message: error.message 
    });
  }
};

/**
 * Get IPFS content via backend (proxy)
 * This helps with CORS issues
 */
export const getIpfsContent = async (req: Request, res: Response) => {
  try {
    const { hash } = req.params;
    
    if (!hash) {
      return res.status(400).json({ 
        success: false, 
        error: 'IPFS hash required' 
      });
    }
    
    const httpUrl = ipfsToHttp(hash);
    
    // Fetch from IPFS gateway
    const response = await fetch(httpUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from IPFS');
    }
    
    const contentType = response.headers.get('content-type');
    
    // If JSON, parse and return
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    }
    
    // If image, pipe the stream
    if (contentType?.includes('image')) {
      res.setHeader('Content-Type', contentType);
      const buffer = await response.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }
    
    // Default: return as text
    const text = await response.text();
    res.send(text);
    
  } catch (error: any) {
    console.error('Error fetching IPFS content:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch IPFS content',
      message: error.message 
    });
  }
};

// Middleware của Multer
export const uploadMiddleware = upload.single('image');