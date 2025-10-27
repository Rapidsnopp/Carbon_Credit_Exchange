import { Request, Response } from 'express';
import SolanaService from '../services/solanaService';
import CarbonCredit from '../models/carbonCredit';

/**
 * Helper function to convert IPFS URI to HTTP URL
 */
const convertIPFStoHTTP = (uri: string | undefined): string | undefined => {
  if (!uri) return undefined;
  if (uri.startsWith('ipfs://')) {
    const hash = uri.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }
  return uri;
};

/**
 * Helper function to enrich listing with metadata from both on-chain and MongoDB
 */
const enrichListingWithMetadata = async (listing: any) => {
  // Get on-chain metadata
  const onChainMetadata = await SolanaService.getNFTMetadata(listing.mint);
  
  // Get off-chain metadata from MongoDB
  const dbMetadata = await CarbonCredit.findOne({ mint: listing.mint });
  
  console.log(`📊 Enriching listing ${listing.mint}:`);
  console.log(`  - On-chain image: ${onChainMetadata?.image}`);
  console.log(`  - MongoDB image: ${dbMetadata?.metadata?.image}`);
  
  // Get image URL (convert IPFS if needed)
  let imageUrl = dbMetadata?.metadata?.image || onChainMetadata?.image;
  imageUrl = convertIPFStoHTTP(imageUrl);
  
  console.log(`  - Final image: ${imageUrl}`);
  
  // Merge metadata, prioritizing MongoDB data
  const metadata = {
    ...onChainMetadata,
    // Use converted HTTP URL
    image: imageUrl,
    name: dbMetadata?.projectName || onChainMetadata?.name,
    location: dbMetadata?.location?.country || onChainMetadata?.location,
    credits: dbMetadata?.carbonAmount || onChainMetadata?.credits,
    category: dbMetadata?.projectType || onChainMetadata?.category,
    // Include all MongoDB data
    dbData: dbMetadata ? {
      projectName: dbMetadata.projectName,
      projectType: dbMetadata.projectType,
      projectDescription: dbMetadata.projectDescription,
      vintageYear: dbMetadata.vintageYear,
      verificationStandard: dbMetadata.verificationStandard,
      carbonAmount: dbMetadata.carbonAmount,
      location: dbMetadata.location,
    } : null,
  };
  
  return {
    ...listing,
    metadata,
  };
};

/**
 * GET /api/marketplace/listings
 * Get all active marketplace listings
 */
export const getAllListings = async (req: Request, res: Response) => {
  try {
    const listings = await SolanaService.getAllListings();
    
    // Enrich with metadata from both on-chain and MongoDB
    const enrichedListings = await Promise.all(
      listings.map(enrichListingWithMetadata)
    );
    
    // Debug: Log sample enriched listing
    if (enrichedListings.length > 0) {
      console.log('📦 Sample enriched listing:', JSON.stringify(enrichedListings[0], null, 2));
    }
    
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
    
    // Enrich with metadata
    const enrichedListing = await enrichListingWithMetadata(listing);
    
    res.json({
      success: true,
      data: enrichedListing,
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
    
    // Enrich with metadata from both on-chain and MongoDB
    const enrichedListings = await Promise.all(
      sellerListings.map(enrichListingWithMetadata)
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
