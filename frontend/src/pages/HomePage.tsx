
import React from 'react'; // Bỏ `useState`
// Bỏ `Globe`
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';
import CategoriesTabs from '../components/home-page/CategoriesTabs';
import { Collection } from '../components/trading-page/Collection';

const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <ImpactStats />
      <HowItWorks />
      {/* Featured Projects - Tabbed Interface */}
      {/* <CategoriesTabs /> */}
      {/* Featured Projects: Thay thế toàn bộ code cũ */}
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
      </section>      {/* More Information Section */}
      <MoreInfor />
    </div >
  );
}

export default HomePage;