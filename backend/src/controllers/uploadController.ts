import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import PinataClient from '@pinata/sdk';

// Cấu hình Pinata
const pinata = new PinataClient({
  pinataJWTKey: process.env.PINATA_JWT,
});

// Cấu hình Multer để lưu file tạm thời
const upload = multer({ dest: 'uploads/' });

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const fileStream = fs.createReadStream(filePath);

  try {
    // Upload lên Pinata (IPFS)
    const result = await pinata.pinFileToIPFS(fileStream, {
      pinataMetadata: {
        name: req.file.originalname,
      },
    });

    // Xóa file tạm sau khi upload
    fs.unlinkSync(filePath);

    // Trả về IPFS Hash (CID)
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully to IPFS',
      ipfsHash: result.IpfsHash,
      // Đây là URI bạn sẽ lưu vào MongoDB
      imageUrl: `ipfs://${result.IpfsHash}`, 
    });

  } catch (error: any) {
    // Xóa file tạm nếu có lỗi
    fs.unlinkSync(filePath);
    console.error('Error uploading to Pinata:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
};

// Middleware của Multer
export const uploadMiddleware = upload.single('image');