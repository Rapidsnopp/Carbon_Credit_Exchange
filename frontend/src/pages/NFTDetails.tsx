import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getNFTById, defaultNFT, type MintedNFT } from '../constant/mockData';

const NFTDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const nft: MintedNFT | undefined = id
    ? getNFTById(id) ?? {
      ...defaultNFT,
      id: id,
      name: `Carbon Credit NFT #${id}`,
    }
    : undefined;

  if (!id || !nft) {
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

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Image & Attributes */}
            <div className="lg:w-1/2">
              {/* NFT Image */}
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden hover:border-teal-500/50 transition-colors">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-[400px] object-cover"
                />
              </div>

              {/* Attributes Grid */}
              <div className="mt-6">
                <h3 className="text-white font-semibold text-lg mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.attributes.map((attr, idx) => (
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
                {nft.category && (
                  <div className="inline-block mb-3">
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs font-medium">
                      {nft.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-white mb-2">{nft.name}</h1>

                {/* Token ID */}
                <div className="text-gray-400 text-sm mb-6">
                  <span className="font-medium">Token ID:</span>{' '}
                  <span className="font-mono break-all">{nft.tokenId}</span>
                </div>

                {/* Price & Credits Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Current Price</div>
                    <div className="text-white text-2xl font-bold">
                      {nft.price?.toFixed(3)} ETH
                    </div>
                    <div className="text-gray-500 text-xs mt-1">
                      ≈ ${(nft.price! * 2400).toFixed(2)} USD
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Available Credits</div>
                    <div className="text-white text-2xl font-bold">{nft.credits}</div>
                    <div className="text-teal-400 text-xs mt-1">
                      {nft.impact}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">
                    {nft.description ||
                      'This NFT represents verified carbon credits tied to a real-world climate project. Ownership allows trading, offset claims, and on-chain provenance of environmental impact.'}
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
                  <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
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
              {nft.location && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                  <h2 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Project Location
                  </h2>
                  <p className="text-gray-300">{nft.location}</p>
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