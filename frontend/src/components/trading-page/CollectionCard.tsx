import React from 'react';
import { CollectionItem } from '../../types/collection.types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom'; 
import { ipfsToGatewayUrl } from '../../lib/utils';

// --- Helper Functions ---
const formatPrice = (priceInLamports: string): number => {
  try {
    const price = parseFloat(priceInLamports);
    return price / LAMPORTS_PER_SOL;
  } catch (error) {
    return 0;
  }
};

const formatAddress = (address: string, chars = 4): string => {
  if (!address) return 'N/A';
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

// --- Prop Types ---
type CollectionCardProps = {
  item: CollectionItem;
};

// --- Component Chính ---
export const CollectionCard: React.FC<CollectionCardProps> = ({ item }) => {
  // Khởi tạo hook ---
  const navigate = useNavigate();

  if (!item || !item.metadata) {
    return (
      <div className="bg-gray-800/40 rounded-2xl border border-gray-700/50 p-4 shadow-lg animate-pulse">
        <div className="w-full h-48 bg-gray-700 rounded-lg"></div>
        <div className="h-4 bg-gray-700 rounded-md w-3/4 mt-4"></div>
        <div className="h-3 bg-gray-700 rounded-md w-1/2 mt-2"></div>
      </div>
    );
  }

  // Lấy ra các thuộc tính
  const projectType = item.metadata.attributes.find(a => a.trait_type === 'Loại')?.value;
  const vintageYear = item.metadata.attributes.find(a => a.trait_type === 'Năm')?.value;

  // --- Tạo hàm xử lý click ---
  const handleViewDetails = () => {
    // Điều hướng đến trang NFTDetails với "mint address"
    navigate(`/nft/${item.mint}`); 
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-lg ...">
      
      {/* (Phần Hình ảnh, Tên, Tags...) */}
      <div className="w-full h-48 bg-gray-900">
        <img
          src={ipfsToGatewayUrl(item.metadata.image)}
          alt={item.metadata.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        {/* ... (Tags, Tên, Seller...) ... */}
        
        <h3 className="font-bold text-white text-lg mb-2 truncate" title={item.metadata.name}>
          {item.metadata.name}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Seller: <span className="font-mono text-gray-300">{formatAddress(item.owner)}</span>
        </p>

        {/* 2d. Giá và Nút Mua */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
            <p className="text-xl font-bold text-white">
              {formatPrice(item.price)} <span className="text-teal-400">SOL</span>
            </p>
          </div>

          {/* --- Thêm onClick vào nút --- */}
          <button 
            onClick={handleViewDetails} 
            className="bg-teal-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ..."
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;