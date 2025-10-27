import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BadgeCheck, ChevronLeft, Globe2 } from 'lucide-react';
import { fetchMetadata } from '../services/metaplex';
import { getProgram } from '../services/solana';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useToast } from '../contexts/ToastContext';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  location?: string;
  category?: string;
  price?: number;
  credits?: number;
  impact?: string;
  tokenId?: string;
}

const NFTDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { addToast }: any = useToast();
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNFTData = async () => {
      if (!id || !connection) return;

      try {
        const mintPubkey = new PublicKey(id);
        const metaplexData = await fetchMetadata(connection, mintPubkey);

        // Create provider if wallet is connected
        const provider = wallet.connected
          ? new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' })
          : null;

        const program = provider ? getProgram(connection, provider) : null;
        let listingData = null;

        if (program) {
          try {
            // Fetch listing data if available
            const listings = await program.account.listing.all([
              {
                memcmp: {
                  offset: 8, // Offset for mint field
                  bytes: mintPubkey.toBase58()
                }
              }
            ]);
            if (listings.length > 0) {
              listingData = listings[0].account;
            }
          } catch (error) {
            console.error('Error fetching listing:', error);
          }
        }

        let jsonMetadata: any = {};

        if (metaplexData.data.uri) {
          if (metaplexData.data.uri.startsWith('data:application/json;base64,')) {
            const base64Data = metaplexData.data.uri.replace('data:application/json;base64,', '');
            const decodedData = atob(base64Data);
            jsonMetadata = JSON.parse(decodedData);
          } else if (metaplexData.data.uri.startsWith('ipfs://')) {
            const ipfsGatewayURL = metaplexData.data.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
            const response = await fetch(ipfsGatewayURL);
            if (response.ok) {
              jsonMetadata = await response.json();
            }
          } else if (metaplexData.data.uri.startsWith('http')) {
            const response = await fetch(metaplexData.data.uri);
            if (response.ok) {
              jsonMetadata = await response.json();
            }
          }
        }

        const nftData: NFTMetadata = {
          name: metaplexData.data.name || `Carbon Credit #${id.slice(0, 8)}`,
          description: jsonMetadata.description || 'This NFT represents verified carbon credits tied to a real-world climate project.',
          image: jsonMetadata.image || 'https://placehold.co/400x400',
          tokenId: id,
          attributes: jsonMetadata.attributes || [],
          location: jsonMetadata.location,
          category: jsonMetadata.category || jsonMetadata.attributes?.find((a: any) => a.trait_type === 'Project Type')?.value,
          credits: jsonMetadata.attributes?.find((a: any) => a.trait_type === 'Credits')?.value || 1,
          impact: jsonMetadata.attributes?.find((a: any) => a.trait_type === 'Impact')?.value,
          price: listingData ? listingData.price.toNumber() / 1e9 : undefined // Convert from lamports to SOL
        };

        setMetadata(nftData);
      } catch (error) {
        console.error('Error loading NFT data:', error);
        addToast('Failed to load NFT data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadNFTData();
  }, [id, connection, wallet, addToast]);

  if (!id || (!loading && !metadata)) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-5xl text-white">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">NFT Not Found</h2>
              <p className="text-gray-400 mb-6">The NFT you're looking for doesn't exist.</p>
              <button
                onClick={() => navigate('/trading')}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 transition"
              >
                Browse Available NFTs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !metadata) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-5xl text-white">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Loading NFT details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Image & Attributes */}
            <div className="lg:w-1/2">
              {/* NFT Image */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors">
                <img
                  src={metadata.image}
                  alt={metadata.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Attributes Grid */}
              <div className="mt-6">
                <h3 className="text-white font-semibold text-lg mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {metadata.attributes.map((attr, idx) => (
                    <div
                      key={`${attr.trait_type}-${idx}`}
                      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-teal-500/30 transition-colors"
                    >
                      <div className="text-xs text-gray-400 uppercase tracking-wide">
                        {attr.trait_type}
                      </div>
                      <div className="text-white font-semibold mt-1">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="lg:w-1/2 space-y-6">
              {/* Main Info Card */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                {/* Category Badge */}
                {metadata.category && (
                  <div className="inline-block mb-3">
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-medium">
                      {metadata.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-2">{metadata.name}</h1>

                {/* Token ID */}
                <div className="text-gray-400 text-sm mb-6">
                  <span className="font-medium">Token ID:</span>{' '}
                  <span className="font-mono break-all">{metadata.tokenId}</span>
                </div>

                {/* Price & Credits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Current Price</div>
                    <div className="text-white text-2xl font-bold">
                      {metadata.price ? `${metadata.price.toFixed(3)} SOL` : 'Not Listed'}
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      {metadata.price && `≈ $${(metadata.price * 20).toFixed(2)} USD`}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Available Credits</div>
                    <div className="text-white text-2xl font-bold">{metadata.credits}</div>
                    <div className="text-teal-400 text-xs mt-1">
                      {metadata.impact}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {metadata.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/trading')}
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50"
                  >
                    Trade NFT
                  </button>
                  <button
                    onClick={() => navigate('/verify-credits')}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
                  >
                    Verify Credits
                  </button>
                </div>
              </div>

              {/* Project Overview Card */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-teal-400" />
                  Project Overview
                </h2>
                <ul className="text-gray-300 space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Backed by independent verification bodies (VCS/Gold Standard)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Immutable on-chain record of issuance and retirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Supports transparent carbon accounting and reporting</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-400 mt-1">•</span>
                    <span>Contributes to global climate action and sustainability goals</span>
                  </li>
                </ul>
              </div>

              {/* Location Info if available */}
              {metadata.location && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                  <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <Globe2 className="w-5 h-5 text-teal-400" />
                    Project Location
                  </h2>
                  <p className="text-gray-300">{metadata.location}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;