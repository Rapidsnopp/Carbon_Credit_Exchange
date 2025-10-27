/**
 * IPFS Utilities
 * Helper functions để làm việc với IPFS URIs
 */

const PINATA_GATEWAY = 'https://gateway.pinata.cloud/ipfs/';
// @ts-ignore
const BACKEND_PROXY = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

/**
 * Convert IPFS URI to HTTP URL
 * ipfs://QmXXX -> https://gateway.pinata.cloud/ipfs/QmXXX
 */
export const ipfsToHttp = (ipfsUri: string): string => {
  if (!ipfsUri) return '';
  
  // Nếu đã là HTTP URL, return nguyên
  if (ipfsUri.startsWith('http')) return ipfsUri;
  
  // Convert ipfs://QmXXX -> https://gateway.pinata.cloud/ipfs/QmXXX
  if (ipfsUri.startsWith('ipfs://')) {
    const hash = ipfsUri.replace('ipfs://', '');
    return `${PINATA_GATEWAY}${hash}`;
  }
  
  // Nếu chỉ là hash (QmXXX)
  return `${PINATA_GATEWAY}${ipfsUri}`;
};

/**
 * Get IPFS content via backend proxy (tránh CORS)
 */
export const getIpfsContent = async (ipfsUri: string): Promise<any> => {
  try {
    const hash = ipfsUri.replace('ipfs://', '');
    const response = await fetch(`${BACKEND_PROXY}/api/upload/ipfs/${hash}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch IPFS content');
    }
    
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return await response.json();
    }
    
    // For images, return blob URL
    if (contentType?.includes('image')) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error fetching IPFS content:', error);
    throw error;
  }
};

/**
 * Validate IPFS hash
 */
export const isValidIpfsHash = (hash: string): boolean => {
  // IPFS CIDv0 starts with Qm and is 46 characters
  // IPFS CIDv1 starts with b and is variable length
  const cidv0Regex = /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/;
  const cidv1Regex = /^b[A-Za-z2-7]{58,}$/;
  
  const cleanHash = hash.replace('ipfs://', '');
  
  return cidv0Regex.test(cleanHash) || cidv1Regex.test(cleanHash);
};

/**
 * Get IPFS hash from URI
 */
export const extractIpfsHash = (uri: string): string => {
  if (!uri) return '';
  
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', '');
  }
  
  if (uri.includes('/ipfs/')) {
    const parts = uri.split('/ipfs/');
    return parts[1].split('/')[0];
  }
  
  return uri;
};
