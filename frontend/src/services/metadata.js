/**
 * Metadata Service
 * Handles metadata generation and upload
 * 
 * TODO: Integrate with IPFS/Arweave for decentralized storage
 * Current implementation uses data URLs as temporary solution
 */

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
 * Upload metadata to temporary storage (data URL)
 * 
 * TODO: Replace with actual IPFS/Arweave upload
 * This is a temporary solution for testing
 */
export const uploadMetadata = async (metadata) => {
  // For now, convert to data URL (NOT for production!)
  // In production, this should upload to IPFS/Arweave
  
  console.warn('⚠️ Using temporary metadata storage. Implement IPFS for production!');
  
  const metadataJson = JSON.stringify(metadata, null, 2);
  const dataUrl = `data:application/json;base64,${btoa(metadataJson)}`;
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    uri: dataUrl,
    metadata: metadata,
  };
};

/**
 * Upload metadata via backend API (recommended approach)
 * Backend will handle IPFS upload
 */
export const uploadMetadataViaBackend = async (projectDetails, imageFile) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  try {
    // Create FormData for file upload
    const formData = new FormData();
    
    // Add project details
    Object.keys(projectDetails).forEach(key => {
      formData.append(key, projectDetails[key]);
    });
    
    // Add image file if exists
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    // Upload to backend
    const response = await fetch(`${API_URL}/api/metadata/create`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload metadata via backend');
    }
    
    const data = await response.json();
    
    return {
      uri: data.uri,
      metadata: data.metadata,
    };
    
  } catch (error) {
    console.error('Backend metadata upload failed:', error);
    
    // Fallback to temporary solution
    console.warn('Falling back to temporary metadata storage');
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
