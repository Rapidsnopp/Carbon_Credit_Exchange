import { Request, Response } from 'express';
import SolanaService from '../services/solanaService';

/**
 * GET /api/carbon-credits
 * Get all carbon credit NFTs (listings)
 */
export const getAllCarbonCredits = async (req: Request, res: Response) => {
  try {
    const listings = await SolanaService.getAllListings();
    
    // Enrich with metadata if needed
    const enrichedListings = await Promise.all(
      listings.map(async (listing) => {
        const metadata = await SolanaService.getNFTMetadata(listing.mint);
        return {
          ...listing,
          metadata,
        };
      })
    );
    
    res.json({
      success: true,
      data: enrichedListings,
      count: enrichedListings.length,
    });
  } catch (error: any) {
    console.error('Error fetching carbon credits:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch carbon credits',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/:mint
 * Get specific carbon credit NFT by mint address
 */
export const getCarbonCreditByMint = async (req: Request, res: Response) => {
  try {
    const { mint } = req.params;
    
    // Get listing info
    const listing = await SolanaService.getListingInfo(mint);
    
    // Get metadata
    const metadata = await SolanaService.getNFTMetadata(mint);
    
    // Check if retired
    const retirement = await SolanaService.getRetirementRecord(mint);
    
    if (!listing && !retirement) {
      return res.status(404).json({
        success: false,
        error: 'Carbon credit not found',
      });
    }
    
    res.json({
      success: true,
      data: {
        mint,
        listing,
        metadata,
        retirement,
        isRetired: !!retirement,
      },
    });
  } catch (error: any) {
    console.error('Error fetching carbon credit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch carbon credit',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/wallet/:address
 * Get all carbon credits owned by a wallet
 */
export const getCarbonCreditsByWallet = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const nfts = await SolanaService.getWalletNFTs(address);
    
    // Enrich with metadata and listing info
    const enrichedNFTs = await Promise.all(
      nfts.map(async (nft) => {
        const [metadata, listing, retirement] = await Promise.all([
          SolanaService.getNFTMetadata(nft.mint),
          SolanaService.getListingInfo(nft.mint),
          SolanaService.getRetirementRecord(nft.mint),
        ]);
        
        return {
          ...nft,
          metadata,
          listing,
          retirement,
          isListed: !!listing,
          isRetired: !!retirement,
        };
      })
    );
    
    res.json({
      success: true,
      data: enrichedNFTs,
      count: enrichedNFTs.length,
    });
  } catch (error: any) {
    console.error('Error fetching wallet NFTs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch wallet NFTs',
      message: error.message,
    });
  }
};

/**
 * GET /api/carbon-credits/stats
 * Get statistics about carbon credits
 */
export const getCarbonCreditStats = async (req: Request, res: Response) => {
  try {
    const exchange = await SolanaService.getExchangeInfo();
    const listings = await SolanaService.getAllListings();
    
    res.json({
      success: true,
      data: {
        totalMinted: exchange?.totalCredits || 0,
        activeListings: listings.length,
        exchangeAddress: exchange?.address,
        exchangeAuthority: exchange?.authority,
      },
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
      message: error.message,
    });
  }
};

/**
 * POST /api/carbon-credits/verify
 * Verify a carbon credit NFT authenticity
 */
export const verifyCarbonCredit = async (req: Request, res: Response) => {
  try {
    const { mint } = req.body;
    
    if (!mint) {
      return res.status(400).json({
        success: false,
        error: 'Mint address is required',
      });
    }
    
    // Check metadata
    const metadata = await SolanaService.getNFTMetadata(mint);
    
    // Check if it's from our program
    const listing = await SolanaService.getListingInfo(mint);
    const retirement = await SolanaService.getRetirementRecord(mint);
    
    const isValid = !!(metadata && (listing || retirement));
    
    res.json({
      success: true,
      data: {
        mint,
        isValid,
        metadata,
        listing,
        retirement,
        verifiedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Error verifying carbon credit:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify carbon credit',
      message: error.message,
    });
  }
};

export const CarbonCreditController = {
  getAllCarbonCredits,
  getCarbonCreditByMint,
  getCarbonCreditsByWallet,
  getCarbonCreditStats,
  verifyCarbonCredit,
};

export default CarbonCreditController;
