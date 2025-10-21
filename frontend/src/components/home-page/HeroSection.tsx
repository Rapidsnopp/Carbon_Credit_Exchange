import React from 'react';
import HeroTextSection from './HeroTextSection';
import ImageCardSection from './ImageCardSection';
import InfoSection from './InfoSection';

const HeroSection: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <HeroTextSection />
      <ImageCardSection />
      <InfoSection />
    </>
  );
};

export default HeroSection;