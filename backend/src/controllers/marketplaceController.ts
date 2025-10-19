import { Request, Response } from 'express';
import SolanaService from '../services/solanaService';

/**
 * GET /api/marketplace/listings
 * Get all active marketplace listings
 */
export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await SolanaService.getAllListings();
    
    // Enrich with metadata
    const enrichedListings = await Promise.all(
      listings.map(async (listing: any) => {
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
    console.error('Error fetching listings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings',
      message: error.message,
    });
  }
};

/**
 * GET /api/marketplace/listings/:mint
 * Get specific listing by mint address
 */
export const getListingByMint = async (req: Request, res: Response) => {
  try {
    const { mint } = req.params;
    
    const listing = await SolanaService.getListingInfo(mint);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found',
      });
    }
    
    const metadata = await SolanaService.getNFTMetadata(mint);
    
    res.json({
      success: true,
      data: {
        ...listing,
        metadata,
      },
    });
  } catch (error: any) {
    console.error('Error fetching listing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listing',
      message: error.message,
    });
  }
};

/**
 * GET /api/marketplace/seller/:address
 * Get all listings from a specific seller
 */
export const getListingsBySeller = async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    
    const allListings = await SolanaService.getAllListings();
    const sellerListings = allListings.filter((listing: any) => listing.owner === address);
    
    // Enrich with metadata
    const enrichedListings = await Promise.all(
      sellerListings.map(async (listing: any) => {
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
    console.error('Error fetching seller listings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch seller listings',
      message: error.message,
    });
  }
};

/**
 * GET /api/marketplace/stats
 * Get marketplace statistics
 */
export const getMarketplaceStats = async (req: Request, res: Response) => {
  try {
    const listings = await SolanaService.getAllListings();
    
    // Calculate statistics
    const prices = listings.map((l: any) => parseFloat(l.price) / 1e9); // Convert lamports to SOL
    const totalVolume = prices.reduce((sum, price) => sum + price, 0);
    const avgPrice = prices.length > 0 ? totalVolume / prices.length : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    
    // Get unique sellers
    const uniqueSellers = new Set(listings.map((l: any) => l.owner));
    
    res.json({
      success: true,
      data: {
        totalListings: listings.length,
        totalVolume: totalVolume.toFixed(2),
        averagePrice: avgPrice.toFixed(2),
        minPrice: minPrice.toFixed(2),
        maxPrice: maxPrice.toFixed(2),
        activeSellers: uniqueSellers.size,
      },
    });
  } catch (error: any) {
    console.error('Error fetching marketplace stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch marketplace statistics',
      message: error.message,
    });
  }
};

export const MarketplaceController = {
  getAllListings,
  getListingByMint,
  getListingsBySeller,
  getMarketplaceStats,
};

export default MarketplaceController;
