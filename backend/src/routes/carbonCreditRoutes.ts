import { Router } from 'express';
import CarbonCreditController from '../controllers/carbonCreditController';
import { mintCarbonCredit } from '../controllers/carbonCreditController'; 
import { uploadMiddleware } from '../controllers/uploadController';

const router = Router();

/**
 * @route   GET /api/carbon-credits
 * @desc    Get all carbon credit NFTs
 * @access  Public
 */
router.get('/', CarbonCreditController.getAllCarbonCredits);

/**
 * @route   GET /api/carbon-credits/stats
 * @desc    Get carbon credit statistics
 * @access  Public
 */
router.get('/stats', CarbonCreditController.getCarbonCreditStats);

/**
 * @route   GET /api/carbon-credits/wallet/:address
 * @desc    Get carbon credits owned by a wallet
 * @access  Public
 */
router.get('/wallet/:address', CarbonCreditController.getCarbonCreditsByWallet);

/**
 * @route   POST /api/carbon-credits/verify
 * @desc    Verify a carbon credit NFT
 * @access  Public
 */
router.post('/verify', CarbonCreditController.verifyCarbonCredit);

/**
 * @route   GET /api/carbon-credits/:mint
 * @desc    Get specific carbon credit by mint address
 * @access  Public
 */
router.get('/:mint', CarbonCreditController.getCarbonCreditByMint);
router.post('/', uploadMiddleware, mintCarbonCredit);

export default router;
