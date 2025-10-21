import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../contexts';
import { NFTProject, getNFTById } from '../constant/mockData';
import { Wallet } from 'lucide-react';

// Mock data for user's owned NFTs - in real implementation, this would come from the blockchain
const mockOwnedNFTs = [
  { id: '1', tokenId: '0x0000000000000000000000000000000000000000000000000000000000000001' },
  { id: '2', tokenId: '0x0000000000000000000000000000000000000000000000000000000000000002' },
  { id: '6', tokenId: '0x0000000000000000000000000000000000000000000000000000000000000006' },
  { id: '9', tokenId: '0x0000000000000000000000000000000000000000000000000000000000000009' },
];

const MyNFTs: React.FC = () => {
  const [ownedNFTs, setOwnedNFTs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { } = useWalletContext(); // Using wallet context for wallet connection status

  useEffect(() => {
    // Simulate fetching user's NFTs
    const fetchOwnedNFTs = async () => {
      try {
        // In a real implementation, this would fetch from the blockchain/Solana
        // For now, we'll map our mock owned NFTs to full NFT details
        const nftDetails = mockOwnedNFTs.map(owned => {
          const nft = getNFTById(owned.id);
          return {
            ...nft,
            tokenId: owned.tokenId
          };
        }).filter(Boolean); // Remove undefined values if NFT not found
        
        setOwnedNFTs(nftDetails);
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
                    key={nft.tokenId} 
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
                  >
                    <div className="relative overflow-hidden h-56">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-teal-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white font-bold text-sm">{nft.credits} Credits</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-white truncate">{nft.name}</h3>
                        <span className="bg-gray-700 text-teal-400 text-xs px-2 py-1 rounded-full">
                          {nft.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-400 text-sm mb-3 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {nft.location}
                      </p>

                      <div className="flex items-center justify-between mb-4 p-3 bg-gray-900/50 rounded-xl">
                        <div>
                          <div className="text-xs text-gray-500">Annual Impact</div>
                          <div className="text-teal-400 font-semibold">{nft.impact}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="text-white font-bold">{nft.price} ETH</div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/nft/${nft.id}`}
                          className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                        >
                          View Details
                        </Link>
                        <button 
                          className="p-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                          title="More options"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
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
                      {ownedNFTs.reduce((sum, nft) => sum + (nft.credits || 0), 0)}
                    </div>
                    <div className="text-gray-400">Total Credits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">
                      {Math.max(...ownedNFTs.map(nft => nft.price || 0)).toFixed(3)} ETH
                    </div>
                    <div className="text-gray-400">Highest Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-teal-400">
                      {ownedNFTs.reduce((sum, nft) => sum + (nft.price || 0), 0).toFixed(3)} ETH
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