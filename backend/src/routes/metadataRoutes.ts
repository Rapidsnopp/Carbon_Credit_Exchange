import { Router } from 'express';
import MetadataController from '../controllers/metadataController';

const router = Router();

/**
 * @route   POST /api/metadata/create
 * @desc    Create off-chain metadata for a carbon credit
 * @access  Public (TODO: Add authentication)
 */
router.post('/create', MetadataController.createMetadata);

/**
 * @route   GET /api/metadata/:mint
 * @desc    Get metadata for a specific mint
 * @access  Public
 */
router.get('/:mint', MetadataController.getMetadata);

/**
 * @route   PUT /api/metadata/:mint
 * @desc    Update metadata
 * @access  Protected (TODO: Add owner verification)
 */
router.put('/:mint', MetadataController.updateMetadata);

/**
 * @route   POST /api/metadata/sync
 * @desc    Sync on-chain data with database
 * @access  Protected (TODO: Add admin authentication)
 */
router.post('/sync', MetadataController.syncMetadata);

export default router;
