import React from 'react';
import { CollectionItem } from '../../types/collection.types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useNavigate } from 'react-router-dom'; // <-- BƯỚC 1: Import hook

// --- Helper Functions (Giữ nguyên) ---
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

// --- Prop Types (Giữ nguyên) ---
type CollectionCardProps = {
  item: CollectionItem;
};

// --- Component Chính ---
export const CollectionCard: React.FC<CollectionCardProps> = ({ item }) => {
  // --- BƯỚC 2: Khởi tạo hook ---
  const navigate = useNavigate();

  // Lấy ra các thuộc tính (Giữ nguyên)
  const projectType = item.metadata.attributes.find(a => a.trait_type === 'Loại')?.value;
  const vintageYear = item.metadata.attributes.find(a => a.trait_type === 'Năm')?.value;

  // --- BƯỚC 3: Tạo hàm xử lý click ---
  const handleViewDetails = () => {
    // Điều hướng đến trang NFTDetails với "mint address"
    navigate(`/nft/${item.mint}`); 
  };

  return (
    <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden shadow-lg ...">
      
      {/* (Phần Hình ảnh, Tên, Tags... giữ nguyên) */}
      <div className="w-full h-48 bg-gray-900">
        <img
          src={item.metadata.image}
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

          {/* --- BƯỚC 4: Thêm onClick vào nút --- */}
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