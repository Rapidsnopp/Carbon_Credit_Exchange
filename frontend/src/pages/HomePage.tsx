import { useState } from 'react';
import { Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';
import { getProjectCategoriesForHome } from '../constant/mockData';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forest' | 'ocean' | 'renewable'>('forest');

  const projectCategories = getProjectCategoriesForHome();
  const navigate = useNavigate();

  const handleViewDetails = (projectId: string | number) => {
    // Navigate to the dynamic route 'nft/{id}'
    navigate(`/nft/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <HeroSection />
      {/* Impact Stats with Gradient Background */}
      < ImpactStats />
      {/* How It Works - Timeline Style */}
      <HowItWorks />

      {/* Featured Projects - Tabbed Interface */}
      <section className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Explore Impact Projects</h2>
            <p className="text-gray-400 text-lg">Choose from verified projects across different categories</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveTab('forest')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === 'forest'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                }`}
            >
              🌲 Forest Conservation
            </button>
            <button
              onClick={() => setActiveTab('ocean')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === 'ocean'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                }`}
            >
              🌊 Ocean Protection
            </button>
            <button
              onClick={() => setActiveTab('renewable')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === 'renewable'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                }`}
            >
              ⚡ Renewable Energy
            </button>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projectCategories[activeTab].map((project, index) => (
              <div
                key={index}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden hover:border-teal-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="relative overflow-hidden h-56">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-teal-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-white font-bold text-sm">{project.credits} Credits</span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {project.location}
                  </p>

                  <div className="flex items-center justify-between mb-4 p-3 bg-gray-900/50 rounded-xl">
                    <div>
                      <div className="text-sm text-gray-500">Annual Impact</div>
                      <div className="text-teal-400 font-semibold">{project.impact}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Price per Credit</div>
                      <div className="text-white font-bold text-lg">{project.price}</div>
                    </div>
                  </div>

                  <button onClick={() => handleViewDetails(project.id)} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Information Section */}
      <MoreInfor />
    </div >
  );
}

export default HomePage;