import React from 'react';
import HeroMint from '../components/mint-page/HeroMint';
import MintProgression from '../components/mint-page/MintProgression';
import MintCredit from '../components/mint-page/MintCredit';

const MintNFT: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Header Section */}
          <HeroMint />
          <MintCredit />
          <MintProgression />
        </div>
      </div>
    </div>
  );
};

export default MintNFT;