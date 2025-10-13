import React from 'react';
import FloatingCard from './FloatingCard';
import { useState, useRef } from 'react';

const HeroSection = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const cards = [
    {
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
      title: 'ForestForFuture',
      location: 'Afforestation, Brazil',
      credits: '76',
      year: '2022',
      size: 'lg',
      delay: 0
    },
    {
      image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
      title: 'ForestForFuture',
      location: 'Afforestation, Brazil',
      credits: '76',
      year: '2022',
      size: 'md',
      delay: 1
    },
    {
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80',
      title: 'ForestForFuture',
      location: 'Afforestation, Brazil',
      credits: '220',
      year: '2022',
      size: 'sm',
      delay: 2
    },
    {
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80',
      title: 'OceanGuardian',
      location: 'Marine Conservation, Australia',
      credits: '150',
      year: '2023',
      size: 'md',
      delay: 0.5
    },
    {
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
      title: 'MountainShield',
      location: 'Mountain Preservation, Nepal',
      credits: '95',
      year: '2023',
      size: 'lg',
      delay: 1.5
    }
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Part 1: Large text with buttons (full width text)
  const HeroTextSection = () => (
    <section className="relative bg-gradient-to-b from-gray-900 to-gray-900 overflow-hidden py-20">
      <div className="relative z-50 container mx-auto px-6">
        <div className="max-w-full"> {/* Changed from max-w-6xl to max-w-full */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight text-wrap">
            <span className="text-gray-100">BUILDING A </span>
            <span className="text-teal-400">CARBON-NEUTRAL WORLD WITH BLOCKCHAIN</span>
          </h1>
          
          <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
            With Caelum, anyone—from individuals to businesses—can buy, trade, or retire carbon credits 
            in just a few clicks. Thanks to blockchain and fractional ownership, every action is transparent, 
            secure, and trackable in real time. Join the waitlist today or follow your sustainability journey on X.
          </p>
          
          {/* <div className="flex gap-4">
            <button className="px-8 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-300">
              Join Waitlist
            </button>
            <button className="px-8 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-300">
              Join Journey
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );

  // Part 2: Images with cards (shorter height, ensure background image displays)
  const ImageCardSection = () => (
    <section className="relative min-h-[60vh] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Background Image Layer with rounded corners */}
      <div 
        className="absolute inset-0 z-10 bg-cover bg-center opacity-50 rounded-b-[40px]" 
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      {/* Dark Overlay with rounded corners */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80 rounded-b-[40px]"></div>
      
      {/* Floating Cards Container */}
      <div 
        ref={scrollRef}
        className="absolute inset-0 z-30 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="relative min-w-max h-full px-20">
          <div className="absolute top-[35%] left-20 z-10">
            <FloatingCard {...cards[2]} />
          </div>
          <div className="absolute top-[40%] left-[40%] z-20">
            <FloatingCard {...cards[0]} />
          </div>
          <div className="absolute top-[30%] right-[25%] z-10">
            <FloatingCard {...cards[1]} />
          </div>
          <div className="absolute top-[45%] right-32 z-20">
            <FloatingCard {...cards[4]} />
          </div>
        </div>
      </div>
    </section>
  );

  // Part 3: Remaining content without images (unchanged)
  const InfoSection = () => (
    <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black py-20">
      <div className="relative container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-12 text-center tracking-tight">
          <span className="text-gray-200">TO DRIVE A </span>
          <span className="text-teal-400">CARBON-NEUTRAL</span>
          <br />
          <span className="text-gray-200">FUTURE THROUGH TRANSPARENT</span>
          <br />
          <span className="text-gray-200">ACCESSIBLE </span>
          <span className="text-teal-400">BLOCKCHAIN</span>
          <span className="text-gray-200"> INNOVATIONS</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Transparent Trading</h3>
            <p className="text-gray-400">Every transaction is recorded on blockchain, ensuring complete transparency and traceability.</p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Instant Access</h3>
            <p className="text-gray-400">Buy, trade, or retire carbon credits in seconds with our streamlined platform.</p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Verified</h3>
            <p className="text-gray-400">All credits are verified and secured through blockchain technology.</p>
          </div>
        </div>
      </div>
    </section>
  );

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