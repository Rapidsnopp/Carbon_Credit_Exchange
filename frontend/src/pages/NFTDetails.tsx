import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiService from '../services/api';
import { CollectionItem } from '../types/collection.types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '../contexts/ToastContext';
import { BadgeCheck } from 'lucide-react';

type ChainResponse = {
  mint: string;
  listing?: { price?: number | string } | null;
  metadata?: any;
  retirement?: any;
  isRetired?: boolean;
};

const NFTDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id: mintAddress } = useParams<{ id: string }>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { addToast } = useToast();

  const [nft, setNft] = useState<CollectionItem | null>(null);
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get category badge styling
  const getCategoryBadge = (category: string) => {
    const styles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
      'Renewable Energy': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: '⚡' },
      'Forestry': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: '🌲' },
      'Agriculture': { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/20', icon: '🌾' },
      'Waste Management': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: '♻️' },
      'Industrial': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: '🏭' },
      'Afforestation': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🌳' },
      'Reforestation': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: '🌿' },
      'Other': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: '📋' },
    };

    return styles[category] || styles['Other'];
  };

  useEffect(() => {
    if (!mintAddress) {
      setError('No mint address provided');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Prefer the merged endpoint which returns on-chain + DB metadata
        const chainRes = await apiService.getCarbonCreditByMint(mintAddress);
        if (chainRes.data && chainRes.data.success) {
          const data: ChainResponse = chainRes.data.data;

          // merged metadata may be in data.metadata or from db
          const merged = data.metadata || {};

          const metadata = {
            name: merged.projectName || merged.name || merged.metadata?.name || merged.name,
            description:
              merged.projectDescription || merged.description || merged.metadata?.description || '',
            image:
              merged.metadata?.image || merged.image || merged.metadata?.image || merged.image ||
              'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
            category: merged.projectType || merged.category || merged.metadata?.category || 'Other',
            location: merged.location || merged.metadata?.location,
            credits: merged.carbonAmount || merged.credits || merged.metadata?.credits || 0,
            attributes: merged.metadata?.attributes || merged.attributes || [],
          };

          setNft({
            mint: data.mint,
            owner: (merged as any).owner || '',
            price: data.listing?.price ? String(data.listing.price) : '0',
            metadata,
          });

          setListing(data.listing || null);
          setLoading(false);
          return;
        }

        // Fallback: try to get metadata from /api/metadata
        const metaRes = await apiService.getCarbonCreditByMint(mintAddress);
        if (metaRes.data && metaRes.data.success) {
          const metadataDoc = metaRes.data.data;
          const image = metadataDoc.metadata?.image || metadataDoc.image || '';

          setNft({
            mint: metadataDoc.mint,
            owner: metadataDoc.owner || '',
            price: String(metadataDoc.listingPrice || 0),
            metadata: {
              name: metadataDoc.projectName || metadataDoc.metadata?.name || '',
              description: metadataDoc.projectDescription || metadataDoc.metadata?.description || '',
              image: image || 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
              category: metadataDoc.projectType || metadataDoc.metadata?.category || 'Other',
              location: metadataDoc.location || metadataDoc.metadata?.location,
              credits: metadataDoc.carbonAmount || metadataDoc.metadata?.credits || 0,
              attributes: metadataDoc.metadata?.attributes || [],
            },
          });
        } else {
          setError('NFT not found');
        }
      } catch (err: any) {
        console.error('Failed to fetch NFT details', err);
        setError(err?.message || 'Failed to fetch NFT details');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [mintAddress]);

  const handleBuyNow = async () => {
    if (!listing || !wallet.connected) {
      addToast('Please connect your wallet first', 'error');
      return;
    }

    const priceLamports = Number(listing.price || 0);
    const priceInSol = priceLamports / LAMPORTS_PER_SOL;

    try {
      addToast('Processing purchase...', 'info');
      // TODO: Implement actual purchase logic
      alert(`TODO: Invoke smart contract to BUY NFT ${mintAddress} for ${priceInSol} SOL`);
    } catch (error: any) {
      console.error('Buy error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      addToast(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-300">
          <div className="text-2xl font-semibold mb-2">{error}</div>
          <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-teal-600 rounded">Go Back</button>
        </div>
      </div>
    );
  }

  if (!nft) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">NFT not found</div>
      </div>
    );
  }

  const priceInSol = Number(nft.price || 0) / LAMPORTS_PER_SOL;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <button onClick={() => navigate(-1)} className="mb-6 inline-block px-4 py-2 bg-gray-800/60 rounded text-white">Back</button>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors">
                <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-[400px] object-cover" />
              </div>

              <div className="mt-6">
                <h3 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-teal-400" />
                  Attributes
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {Array.isArray(nft.metadata.attributes) && nft.metadata.attributes.length > 0 ? (
                    nft.metadata.attributes.map((attr, idx) => (
                      <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-teal-500/30 transition-colors">
                        <div className="text-xs text-gray-400 uppercase tracking-wide">{attr.trait_type}</div>
                        <div className="text-white font-semibold mt-1">{attr.value.toString()}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No attributes available</div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 space-y-6">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                {/* Category Badge */}
                {nft.metadata.category && (
                  <div className="inline-block mb-3">
                    {(() => {
                      const badge = getCategoryBadge(nft.metadata.category);
                      return (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text} border ${badge.border}`}>
                          {badge.icon} {nft.metadata.category}
                        </span>
                      );
                    })()}
                  </div>
                )}

                <h1 className="text-3xl font-bold text-white mb-2">{nft.metadata.name}</h1>
                <div className="text-gray-400 text-sm mb-6">
                  <span className="font-medium">Mint:</span>{' '}
                  <span className="font-mono break-all">{nft.mint}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Current Price</div>
                    <div className="text-white text-2xl font-bold">
                      {listing ? `${priceInSol} SOL` : 'Not for Sale'}</div>
                    {listing && (
                      <div className="text-gray-500 text-xs mt-1">
                        ≈ ${(priceInSol * 20).toFixed(2)} USD
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Credits Information */}
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                <div className="text-gray-400 text-sm mb-1">Available Credits</div>
                <div className="text-white text-2xl font-bold">
                  {nft.metadata.credits} tCO2e
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-300 leading-relaxed">{nft.metadata.description}</p>
              </div>

              {/* Action Buttons */}
              {listing ? (
                <button
                  onClick={handleBuyNow}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30"
                >
                  Buy Now for {priceInSol} SOL
                </button>
              ) : wallet?.connected && nft.owner === wallet.publicKey?.toBase58() && (
                <button
                  onClick={() => navigate('/trading')}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30"
                >
                  List for Sale
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;