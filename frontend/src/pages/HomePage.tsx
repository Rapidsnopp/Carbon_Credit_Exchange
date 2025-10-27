import React from 'react'; // Bỏ `useState`
// Bỏ `Globe`
import { useNavigate } from 'react-router-dom';

import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';

// BƯỚC 1: Xóa import data ETH cũ
// import { getProjectCategoriesForHome } from '../constant/mockData'; 

// BƯỚC 2: Import component Collection (SOL)
import { Collection } from '../components/trading-page/Collection';

const HomePage: React.FC = () => {
  // BƯỚC 3: Xóa tất cả state và logic cũ (activeTab, projectCategories...)
  const navigate = useNavigate();

  // Bỏ hàm handleViewDetails (vì CollectionCard đã tự xử lý)

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <ImpactStats />
      <HowItWorks />

      {/* Featured Projects - BƯỚC 4: Thay thế toàn bộ code cũ */}
      <section className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Explore Impact Projects</h2>
            <p className="text-gray-400 text-lg">
              Các dự án đã được xác minh trên Solana
            </p>
          </div>

          {/* Xóa bỏ các Tabs (Forest, Ocean...) */}

          {/* BƯỚC 5: Render component <Collection /> */}
          {/* Component này sẽ tự động gọi API và hiển thị 
              data thật hoặc mock data SOL của chúng ta */}
          <Collection />
          
        </div>
      </section>

      {/* More Information Section */}
      <MoreInfor />
    </div >
  );
}

export default HomePage;