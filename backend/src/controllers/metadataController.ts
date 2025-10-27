/**
 * Metadata Controller - Extended with MongoDB integration
 * 
 * TODO: Implement metadata upload and IPFS integration
 * - Connect to IPFS/Arweave for decentralized storage
 * - Implement metadata validation
 * - Add image processing
 */

import { Request, Response } from 'express';
import CarbonCredit from '../models/carbonCredit';
import SolanaService from '../services/solanaService';

/**
 * POST /api/metadata/create
 * Create off-chain metadata for a carbon credit
 * 
 * TODO: Implement this endpoint
 * - Validate input data
 * - Upload images to IPFS
 * - Store metadata in MongoDB
 * - Return metadata URI
 */
export const createMetadata = async (req: Request, res: Response) => {
  try {
    console.log('📝 Creating metadata for NFT...');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const {
      mint,
      owner,
      projectName,
      location,
      vintageYear,
      carbonAmount,
      verificationStandard,
      projectType,
      projectDescription,
      verifier, // Add verifier field
      metadata,
    } = req.body;
    
    // Validate required fields
    if (!mint || !owner || !projectName) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: mint, owner, projectName',
      });
    }
    
    // Helper function to normalize enum values (capitalize first letter)
    const normalizeEnumValue = (value: string): string => {
      if (!value) return value;
      return value.charAt(0).toUpperCase() + value.slice(1);
    };
    
    // Helper function to normalize verification standard (handle acronyms)
    const normalizeVerificationStandard = (value: string): string => {
      if (!value) return 'Other';
      // Handle known acronyms
      const upperValue = value.toUpperCase();
      const validAcronyms = ['VCS', 'CDM', 'CAR', 'CCP'];
      if (validAcronyms.includes(upperValue)) {
        return upperValue;
      }
      // Handle full names (capitalize each word)
      if (value.toLowerCase() === 'gold standard') return 'Gold Standard';
      if (value.toLowerCase() === 'verra') return 'Verra';
      // Default to 'Other' for unknown values
      return 'Other';
    };
    
    // Normalize enum values to match schema expectations
    const normalizedVerificationStandard = normalizeVerificationStandard(verificationStandard);
    const normalizedProjectType = projectType 
      ? normalizeEnumValue(projectType) 
      : 'Other';
    
    console.log('🔄 Normalized values:');
    console.log(`  verificationStandard: "${verificationStandard}" → "${normalizedVerificationStandard}"`);
    console.log(`  projectType: "${projectType}" → "${normalizedProjectType}"`);
    
    // Check if mint already exists
    const existing = await CarbonCredit.findOne({ mint });
    if (existing) {
      console.log('⚠️ Metadata already exists, updating instead...');
      // Update existing record instead of returning error
      existing.owner = owner;
      existing.projectName = projectName;
      if (location) existing.location = location;
      if (vintageYear) existing.vintageYear = vintageYear;
      if (carbonAmount) existing.carbonAmount = carbonAmount;
      if (verificationStandard) existing.verificationStandard = normalizedVerificationStandard as any;
      if (projectType) existing.projectType = normalizedProjectType as any;
      if (projectDescription) existing.projectDescription = projectDescription;
      if (verifier) {
        if (!existing.verificationDetails) {
          existing.verificationDetails = {
            verifier: verifier,
            status: 'Pending',
          } as any;
        } else {
          existing.verificationDetails.verifier = verifier;
        }
      }
      if (metadata) existing.metadata = metadata;
      
      await existing.save();
      
      return res.status(200).json({
        success: true,
        data: existing,
        message: 'Metadata updated',
      });
    }
    
    // Create new carbon credit metadata
    const carbonCredit = new CarbonCredit({
      mint,
      owner,
      projectName,
      location: location || { country: 'Unknown' },
      vintageYear: vintageYear || new Date().getFullYear(),
      carbonAmount: carbonAmount || 0,
      verificationStandard: normalizedVerificationStandard,
      projectType: normalizedProjectType,
      projectDescription: projectDescription || '',
      verificationDetails: verifier ? {
        verifier: verifier,
        status: 'Pending',
      } : undefined,
      metadata: metadata || {},
    });
    
    await carbonCredit.save();
    console.log('✅ Metadata saved to MongoDB');
    
    res.status(201).json({
      success: true,
      data: carbonCredit,
      message: 'Metadata created successfully',
    });
  } catch (error: any) {
    console.error('❌ Error creating metadata:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create metadata',
      message: error.message,
    });
  }
};

/**
 * GET /api/metadata/:mint
 * Get metadata for a specific carbon credit
 */
export const getMetadata = async (req: Request, res: Response) => {
  try {
    const { mint } = req.params;
    
    const carbonCredit = await CarbonCredit.findOne({ mint });
    
    if (!carbonCredit) {
      return res.status(404).json({
        success: false,
        error: 'Metadata not found',
      });
    }
    
    // Increment views
    carbonCredit.views += 1;
    await carbonCredit.save();
    
    res.json({
      success: true,
      data: carbonCredit,
    });
  } catch (error: any) {
    console.error('Error fetching metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metadata',
      message: error.message,
    });
  }
};

/**
 * PUT /api/metadata/:mint
 * Update metadata
 * 
 * TODO: Add authorization - only owner can update
 */
export const updateMetadata = async (req: Request, res: Response) => {
  try {
    const { mint } = req.params;
    const updates = req.body;
    
    // TODO: Validate owner
    // TODO: Validate fields that can be updated
    
    const carbonCredit = await CarbonCredit.findOneAndUpdate(
      { mint },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!carbonCredit) {
      return res.status(404).json({
        success: false,
        error: 'Metadata not found',
      });
    }
    
    res.json({
      success: true,
      data: carbonCredit,
    });
  } catch (error: any) {
    console.error('Error updating metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update metadata',
      message: error.message,
    });
  }
};

/**
 * POST /api/metadata/sync
 * Sync on-chain data with off-chain database
 * 
 * TODO: Implement background sync job
 * - Fetch all on-chain NFTs
 * - Compare with database
 * - Update ownership, listing status, etc.
 */
export const syncMetadata = async (req: Request, res: Response) => {
  try {
    // TODO: Implement full sync logic
    // 1. Get all listings from Solana
    // 2. Update database with current state
    // 3. Mark retired credits
    
    res.json({
      success: true,
      message: 'Sync completed',
      // TODO: Return sync statistics
    });
  } catch (error: any) {
    console.error('Error syncing metadata:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync metadata',
      message: error.message,
    });
  }
};

export const MetadataController = {
  createMetadata,
  getMetadata,
  updateMetadata,
  syncMetadata,
};

export default MetadataController;
