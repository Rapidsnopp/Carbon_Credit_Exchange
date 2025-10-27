
import React from 'react'; // Bỏ `useState`
// Bỏ `Globe`
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';
import CategoriesTabs from '../components/home-page/CategoriesTabs';

const HomePage: React.FC = () => {

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      <ImpactStats />
      <HowItWorks />
      {/* Featured Projects - Tabbed Interface */}
      <CategoriesTabs />
      {/* More Information Section */}
      <MoreInfor />
    </div >
  );
}

export default HomePage;