import { Router } from 'express';
import MarketplaceController from '../controllers/marketplaceController';

const router = Router();

/**
 * @route   GET /api/marketplace/listings
 * @desc    Get all active listings
 * @access  Public
 */
router.get('/listings', MarketplaceController.getAllListings);

/**
 * @route   GET /api/marketplace/stats
 * @desc    Get marketplace statistics
 * @access  Public
 */
router.get('/stats', MarketplaceController.getMarketplaceStats);

/**
 * @route   GET /api/marketplace/seller/:address
 * @desc    Get listings by seller address
 * @access  Public
 */
router.get('/seller/:address', MarketplaceController.getListingsBySeller);

/**
 * @route   GET /api/marketplace/listings/:mint
 * @desc    Get specific listing by mint address
 * @access  Public
 */
router.get('/listings/:mint', MarketplaceController.getListingByMint);

export default router;
