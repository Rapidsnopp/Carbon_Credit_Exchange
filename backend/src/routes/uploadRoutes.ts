import { Router } from 'express';
import { 
  uploadImage, 
  uploadMiddleware, 
  uploadJson,
  getIpfsContent,
  ipfsToHttp 
} from '../controllers/uploadController';

const router = Router();

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image to IPFS
 * @access  Public (Nên thêm auth sau)
 */
router.post('/image', uploadMiddleware, uploadImage);

/**
 * @route   POST /api/upload/json
 * @desc    Upload JSON metadata to IPFS
 * @access  Public (Nên thêm auth sau)
 */
router.post('/json', uploadJson);

/**
 * @route   GET /api/upload/ipfs/:hash
 * @desc    Get content from IPFS (proxy để tránh CORS)
 * @access  Public
 */
router.get('/ipfs/:hash', getIpfsContent);

/**
 * @route   GET /api/upload/convert
 * @desc    Convert IPFS URI to HTTP URL
 * @access  Public
 */
router.get('/convert', (req, res) => {
  const { uri } = req.query;
  
  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({ 
      success: false, 
      error: 'URI parameter required' 
    });
  }
  
  const httpUrl = ipfsToHttp(uri);
  
  res.json({
    success: true,
    ipfsUri: uri,
    httpUrl: httpUrl,
  });
});

export default router;