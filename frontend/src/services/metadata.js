/**
 * Metadata Service
 * Handles metadata generation and upload to IPFS via backend
 */

import api from '../lib/axios';

/**
 * Generate metadata JSON for Carbon Credit NFT
 */
export const generateMetadata = (projectDetails, imageUrl) => {
  const metadata = {
    name: projectDetails.projectName || 'Carbon Credit NFT',
    symbol: 'CARBON',
    description: projectDetails.description || `Carbon Credit from ${projectDetails.projectName}`,
    image: imageUrl || 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
    external_url: `https://carbon-credit-exchange.com/credit/${Date.now()}`,
    attributes: [
      {
        trait_type: 'Project Name',
        value: projectDetails.projectName || 'Unknown',
      },
      {
        trait_type: 'Project Type',
        value: projectDetails.projectType || 'Reforestation',
      },
      {
        trait_type: 'Location',
        value: projectDetails.projectLocation || 'Global',
      },
      {
        trait_type: 'Credit Amount (tCO2e)',
        value: projectDetails.creditAmount || '1',
        display_type: 'number',
      },
      {
        trait_type: 'Standard',
        value: projectDetails.creditStandard || 'VCS',
      },
      {
        trait_type: 'Certification Body',
        value: projectDetails.certificationBody || 'Verra',
      },
      {
        trait_type: 'Verification Date',
        value: projectDetails.verificationDate || new Date().toISOString().split('T')[0],
        display_type: 'date',
      },
      {
        trait_type: 'Vintage Year',
        value: projectDetails.vintageYear || new Date().getFullYear(),
        display_type: 'number',
      },
    ],
    properties: {
      category: 'carbon_credit',
      files: [
        {
          uri: imageUrl || 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
          type: 'image/jpeg',
        },
      ],
      creators: [
        {
          address: projectDetails.walletAddress || '',
          share: 100,
        },
      ],
    },
  };

  return metadata;
};

/**
 * Upload image to IPFS via backend
 */
export const uploadImage = async (file) => {
  try {
    console.log('📤 Uploading image to IPFS...');
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    console.log('✅ Image uploaded:', response.data.imageUrl);
    
    return {
      ipfsHash: response.data.ipfsHash,
      imageUrl: response.data.imageUrl,
      httpUrl: response.data.httpUrl,
    };
  } catch (error) {
    console.error('❌ Error uploading image:', error);
    throw new Error('Failed to upload image to IPFS: ' + error.message);
  }
};

/**
 * Upload metadata JSON to IPFS via backend
 */
export const uploadMetadata = async (metadata) => {
  try {
    console.log('📤 Uploading metadata to IPFS...');
    
    const response = await api.post('/upload/json', metadata);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Upload failed');
    }
    
    console.log('✅ Metadata uploaded:', response.data.metadataUri);
    
    return {
      uri: response.data.metadataUri,
      ipfsHash: response.data.ipfsHash,
      httpUrl: response.data.httpUrl,
      metadata: metadata,
    };
  } catch (error) {
    console.error('❌ Error uploading metadata:', error);
    throw new Error('Failed to upload metadata to IPFS: ' + error.message);
  }
};

/**
 * Upload metadata via backend API (recommended approach)
 * Backend will handle IPFS upload
 */
export const uploadMetadataViaBackend = async (projectDetails, imageFile) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    let imageUrl = null;
    
    // 1. Upload image to IPFS (if provided)
    if (imageFile) {
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);
      
      const imageResponse = await fetch(`${API_URL}/api/upload/image`, {
        method: 'POST',
        body: imageFormData,
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to upload image to IPFS');
      }
      
      const imageData = await imageResponse.json();
      imageUrl = imageData.imageUrl; // ipfs://QmXXX
      console.log('✅ Image uploaded to IPFS:', imageUrl);
    }
    
    // 2. Create metadata JSON
    const metadata = generateMetadata(projectDetails, imageUrl);
    
    // 3. Upload metadata JSON to IPFS
    const metadataResponse = await fetch(`${API_URL}/api/upload/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });
    
    if (!metadataResponse.ok) {
      throw new Error('Failed to upload metadata to IPFS');
    }
    
    const metadataData = await metadataResponse.json();
    console.log('✅ Metadata uploaded to IPFS:', metadataData.metadataUri);
    
    return {
      uri: metadataData.metadataUri, // ipfs://QmYYY
      httpUrl: metadataData.httpUrl, // https://gateway.pinata.cloud/ipfs/QmYYY
      metadata: metadata,
      imageUrl: imageUrl,
    };
    
  } catch (error) {
    console.error('Backend metadata upload failed:', error);
    
    // Fallback to temporary solution
    console.warn('⚠️ Falling back to temporary metadata storage');
    const metadata = generateMetadata(projectDetails, imageFile ? URL.createObjectURL(imageFile) : null);
    return uploadMetadata(metadata);
  }
};

/**
 * Get metadata from URI
 */
export const getMetadata = async (uri) => {
  try {
    if (uri.startsWith('data:')) {
      // Data URL - decode it
      const base64Data = uri.split(',')[1];
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString);
    } else if (uri.startsWith('http')) {
      // HTTP URL - fetch it
      const response = await fetch(uri);
      return await response.json();
    } else {
      throw new Error('Unsupported URI format');
    }
  } catch (error) {
    console.error('Failed to fetch metadata:', error);
    throw error;
  }
};

/**
 * Validate metadata structure
 */
export const validateMetadata = (metadata) => {
  const required = ['name', 'image', 'attributes'];
  
  for (const field of required) {
    if (!metadata[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (!Array.isArray(metadata.attributes)) {
    throw new Error('attributes must be an array');
  }
  
  return true;
};

export default {
  generateMetadata,
  uploadMetadata,
  uploadMetadataViaBackend,
  getMetadata,
  validateMetadata,
};
