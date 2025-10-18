import React from 'react';
// components/FloatingCard.tsx
type Size = 'sm' | 'md' | 'lg';

interface FloatingCardProps {
  image: string;
  title: string;
  location?: string;
  credits?: number | string;
  year?: string | number;
  size?: Size;
  delay?: number;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ image, title, location = '', credits = '', year = '', size = 'md', delay = 0 }) => {
  const sizeClasses: Record<Size, string> = {
    sm: 'w-48 h-56',
    md: 'w-56 h-64',
    lg: 'w-72 h-80'
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl`}
      style={{
        animation: `float ${4 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    >
      <div className="relative w-full h-full group">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Credit Badge - Top Right */}
        <div className="absolute top-3 right-3 bg-teal-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <span className="text-white text-xs">◆</span>
          <span className="text-white font-semibold text-sm">{credits}</span>
        </div>

        {/* Info Overlay - Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
          <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
          <p className="text-gray-300 text-xs mb-2">{location}</p>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <span className="bg-teal-500/80 text-white text-xs px-2 py-1 rounded">REDD+</span>
              <span className="bg-teal-500/80 text-white text-xs px-2 py-1 rounded">VCS</span>
            </div>
            <div className="flex items-center gap-1 text-gray-300 text-xs">
              <span className="text-white">◆</span>
              <span className="font-semibold">{credits}</span>
              <span className="text-gray-400 ml-2">{year}</span>
              <span className="text-gray-400">Vintage</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCard;