import React from 'react';

// Import CÁC component của hệ thống SOLANA
import { Collection } from '../components/trading-page/Collection';
import HowToTrade from '../components/trading-page/HowToTrade';

const Trading: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Marketplace
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Khám phá, giao dịch và bù đắp dấu chân carbon của bạn trên Solana.
            </p>
          </div>

          {/* Đây là component hiển thị Collection (SOL)  */}
          {/* Nó sẽ tự động:
              - Hiển thị mock data SOL (từ src/data/mocks.ts)
              - Hoặc hiển thị data thật từ API (nếu có)
          */}
          <Collection />

          {/* Component hướng dẫn */}
          <HowToTrade />
        </div>
      </div>
    </div>
  );
};

export default Trading;