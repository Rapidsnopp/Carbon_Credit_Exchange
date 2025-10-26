import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { useWalletContext } from '../contexts';
import { useWallet } from '@solana/wallet-adapter-react';
import ApiService from "../services/api"
import MyNftCard from '../components/my-nft-page/MyNftCard';
import { CarbonCreditType, MarketplaceListingType } from '../types';

const MyNFTs: React.FC = () => {
  const [ownedNFTs, setOwnedNFTs] = useState<CarbonCreditType[]>([]);
  const [marketplaceListings, setMarketplaceListings] = useState<MarketplaceListingType[]>([]);
  const [loading, setLoading] = useState(true);
  const { publicKey, connected, connect, disconnect, signTransaction } = useWallet();
  const { } = useWalletContext(); // Using wallet context for wallet connection status

  useEffect(() => {
    // Simulate fetching user's NFTs
    const fetchOwnedNFTs = async () => {
      try {
        const nftDetails = await ApiService.getCarbonCreditsByWallet(publicKey?.toString() || "")
        setOwnedNFTs(nftDetails);
        nftDetails.forEach(async (nft: CarbonCreditType) => {
          if (nft.isListed) {
            const listing = await ApiService.getListingByMint(nft.mint);
            if (listing) {
              setMarketplaceListings((prev) => [...prev, listing]);
            }
          }
        });
      } catch (error) {
        console.error('Error fetching owned NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              My Carbon Credits
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              View and manage the carbon credit NFTs you currently own
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full">
              <Wallet className="w-4 h-4 text-teal-400" />
              <span className="text-gray-300 text-sm">Wallet Connected</span>
            </div>
          </div>

          {/* NFT Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : ownedNFTs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {ownedNFTs.map((nft) => (
                  <div
                    key={nft.mint}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    <MyNftCard {...nft} />
                  </div>
                ))}
              </div>

              {/* Stats Summary */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-12">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Portfolio Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">{ownedNFTs.length}</div>
                    <div className="text-gray-400">Total NFTs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">
                      {ownedNFTs.reduce((sum, nft) => sum + (nft.carbonAmount || 0), 0)}
                    </div>
                    <div className="text-gray-400">Total Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">
                      {Math.max(...ownedNFTs.map(nft => nft.listingPrice || 0)).toFixed(3)} ETH
                    </div>
                    <div className="text-gray-400">Highest Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">
                      {ownedNFTs.reduce((sum, nft) => sum + (nft.listingPrice || 0), 0).toFixed(3)} ETH
                    </div>
                    <div className="text-gray-400">Portfolio Value</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Wallet className="w-12 h-12 text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No NFTs in your wallet</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                You don't own any carbon credit NFTs yet. Start by browsing and purchasing from our marketplace.
              </p>
              <Link
                to="/trading"
                className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30"
              >
                Browse Marketplace
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          {ownedNFTs.length > 0 && (
            <div className="text-center">
              <Link
                to="/trading"
                className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30 mr-4"
              >
                Browse More NFTs
              </Link>
              <Link
                to="/verify-credits"
                className="inline-block px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors"
              >
                Verify Credits
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;