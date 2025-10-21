/**
 * API Service for Carbon Credit Exchange
 * Handles all HTTP requests to the backend
 */

import { CONFIG } from '../config/constants';

const API_URL = CONFIG.API_URL;

class ApiService {
  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${API_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // ==================== Health & Info ====================

  /**
   * Check backend health
   */
  async checkHealth() {
    return this.request('/health');
  }

  /**
   * Get program info
   */
  async getProgramInfo() {
    return this.request('/api/program-info');
  }

  /**
   * Get program events
   */
  async getEvents(limit = 10) {
    return this.request(`/api/events?limit=${limit}`);
  }

  // ==================== Carbon Credits ====================

  /**
   * Get all carbon credits
   */
  async getAllCarbonCredits() {
    return this.request('/api/carbon-credits');
  }

  /**
   * Get carbon credit statistics
   */
  async getCarbonCreditStats() {
    return this.request('/api/carbon-credits/stats');
  }

  /**
   * Get carbon credits by wallet address
   */
  async getCarbonCreditsByWallet(walletAddress) {
    return this.request(`/api/carbon-credits/wallet/${walletAddress}`);
  }

  /**
   * Get specific carbon credit by mint address
   */
  async getCarbonCreditByMint(mintAddress) {
    return this.request(`/api/carbon-credits/${mintAddress}`);
  }

  /**
   * Verify a carbon credit NFT
   */
  async verifyCarbonCredit(mintAddress) {
    return this.request('/api/carbon-credits/verify', {
      method: 'POST',
      body: JSON.stringify({ mintAddress }),
    });
  }

  // ==================== Marketplace ====================

  /**
   * Get all marketplace listings
   */
  async getAllListings() {
    return this.request('/api/marketplace/listings');
  }

  /**
   * Get marketplace statistics
   */
  async getMarketplaceStats() {
    return this.request('/api/marketplace/stats');
  }

  /**
   * Get listings by seller address
   */
  async getListingsBySeller(sellerAddress) {
    return this.request(`/api/marketplace/seller/${sellerAddress}`);
  }

  /**
   * Get specific listing by mint address
   */
  async getListingByMint(mintAddress) {
    return this.request(`/api/marketplace/listings/${mintAddress}`);
  }

  // ==================== Metadata ====================

  /**
   * Get metadata by URI
   */
  async getMetadataByUri(uri) {
    return this.request('/api/metadata/uri', {
      method: 'POST',
      body: JSON.stringify({ uri }),
    });
  }

  /**
   * Get metadata by mint address
   */
  async getMetadataByMint(mintAddress) {
    return this.request(`/api/metadata/${mintAddress}`);
  }
}

// Export singleton instance
export default new ApiService();
