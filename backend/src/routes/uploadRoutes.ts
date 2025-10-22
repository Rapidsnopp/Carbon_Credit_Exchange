import { Router } from 'express';
import { uploadImage, uploadMiddleware } from '../controllers/uploadController';

const router = Router();

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image to IPFS
 * @access  Public (Nên thêm auth sau)
 */
router.post('/image', uploadMiddleware, uploadImage);

export default router;