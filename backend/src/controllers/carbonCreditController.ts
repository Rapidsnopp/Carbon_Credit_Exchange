import { Request, Response } from 'express';
import SolanaService from '../services/solanaService';
import CarbonCredit from '../models/carbonCredit';

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
    // Support both "mint" and "mintAddress" for backward compatibility
    const { mint, mintAddress } = req.body;
    const mintAddr = mint || mintAddress;
    
    if (!mintAddr) {
      return res.status(400).json({
        success: false,
        error: 'Mint address is required',
      });
    }
    
    console.log('🔍 Verifying carbon credit:', mintAddr);
    console.log('📍 Querying MongoDB for mint:', mintAddr);
    console.log('📏 Mint length:', mintAddr.length);
    console.log('🔤 Mint trimmed:', mintAddr.trim());
    
    // Get on-chain metadata
    const metadata = await SolanaService.getNFTMetadata(mintAddr);
    
    // Get MongoDB data - try exact match first
    let dbData = await CarbonCredit.findOne({ mint: mintAddr });
    
    // If not found, try trimmed version
    if (!dbData && mintAddr.trim() !== mintAddr) {
      console.log('⚠️ Trying trimmed version...');
      dbData = await CarbonCredit.findOne({ mint: mintAddr.trim() });
    }
    
    console.log('🔍 Raw MongoDB query result:', dbData ? 'Found ✅' : 'Not found ❌');
    if (!dbData) {
      // Try to find all mints to debug
      const allMints = await CarbonCredit.find({}, { mint: 1, projectName: 1 }).limit(5);
      console.log('📋 Sample mints in database:');
      allMints.forEach((doc: any) => {
        console.log(`  - "${doc.mint}" (${doc.projectName})`);
        console.log(`    Length: ${doc.mint.length}, Match: ${doc.mint === mintAddr}`);
      });
    }
    
    if (dbData) {
      console.log('📄 MongoDB document:', {
        mint: dbData.mint,
        projectName: dbData.projectName,
        location: dbData.location,
        carbonAmount: dbData.carbonAmount,
        projectType: dbData.projectType,
        verificationDetails: dbData.verificationDetails,
        verifier: dbData.verificationDetails?.verifier,
      });
    }
    
    // Check if it's from our program
    const listing = await SolanaService.getListingInfo(mintAddr);
    const retirement = await SolanaService.getRetirementRecord(mintAddr);
    
    const isValid = !!(metadata || dbData);
    
    console.log('✅ Verification result:');
    console.log(`  - Valid: ${isValid}`);
    console.log(`  - Has on-chain metadata: ${!!metadata}`);
    console.log(`  - Has MongoDB data: ${!!dbData}`);
    console.log(`  - Is listed: ${!!listing}`);
    console.log(`  - Is retired: ${!!retirement}`);
    
    if (dbData) {
      console.log('💾 MongoDB data:');
      console.log(`  - projectName: ${dbData.projectName}`);
      console.log(`  - location: ${JSON.stringify(dbData.location)}`);
      console.log(`  - carbonAmount: ${dbData.carbonAmount}`);
      console.log(`  - projectType: ${dbData.projectType}`);
    }
    
    if (metadata) {
      console.log('⛓️  On-chain metadata:');
      console.log(`  - name: ${metadata.name}`);
      console.log(`  - location: ${metadata.location}`);
    }
    
    // Merge data from on-chain and MongoDB
    const mergedMetadata = {
      ...metadata,
      // Add MongoDB data with proper formatting
      projectName: dbData?.projectName || metadata?.name,
      projectType: dbData?.projectType || metadata?.projectType,
      projectDescription: dbData?.projectDescription,
      location: dbData?.location?.country || dbData?.location || metadata?.location,
      vintageYear: dbData?.vintageYear || (metadata as any)?.vintage,
      carbonAmount: dbData?.carbonAmount || metadata?.credits,
      verificationStandard: dbData?.verificationStandard,
      verifier: dbData?.verificationDetails?.verifier, // Add verifier from MongoDB
      // Add database metadata if available
      ...(dbData?.metadata || {}),
    };
    
    console.log('📦 Merged metadata:');
    console.log(`  - projectName: ${mergedMetadata.projectName}`);
    console.log(`  - location: ${mergedMetadata.location}`);
    console.log(`  - verifier (from dbData): ${dbData?.verificationDetails?.verifier}`);
    console.log(`  - verifier (merged): ${mergedMetadata.verifier}`);
    
    res.json({
      success: true,
      data: {
        mint: mintAddr,
        isValid,
        metadata: mergedMetadata,
        listing,
        retirement,
        verifiedAt: new Date().toISOString(),
        // Include raw DB data
        dbData: dbData ? {
          projectName: dbData.projectName,
          projectType: dbData.projectType,
          projectDescription: dbData.projectDescription,
          location: dbData.location,
          vintageYear: dbData.vintageYear,
          carbonAmount: dbData.carbonAmount,
          verificationStandard: dbData.verificationStandard,
        } : null,
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
