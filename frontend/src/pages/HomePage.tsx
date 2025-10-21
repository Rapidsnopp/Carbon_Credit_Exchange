import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';
import CategoriesTabs from '../components/home-page/CategoriesTabs';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      {/* Impact Stats with Gradient Background */}
      < ImpactStats />
      {/* How It Works - Timeline Style */}
      <HowItWorks />
      {/* Featured Projects - Tabbed Interface */}
      <CategoriesTabs />
      {/* More Information Section */}
      <MoreInfor />
    </div >
  );
}

export default HomePage;