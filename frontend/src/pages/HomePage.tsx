import { useState } from 'react';
import { Globe } from 'lucide-react';

import HeroSection from '../components/home-page/HeroSection';
import ImpactStats from '../components/home-page/ImpactStats';
import HowItWorks from '../components/home-page/HowItWorks';
import MoreInfor from '../components/home-page/MoreInfor';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'forest' | 'ocean' | 'renewable'>('forest');

  const projectCategories = {
    forest: [
      {
        title: "ForestForFuture",
        location: "Afforestation, Brazil",
        image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
        credits: 76,
        price: "0.025 ETH",
        impact: "2,400 tons CO₂/year"
      },
      {
        title: "Amazon Rainforest Protection",
        location: "Conservation, Peru",
        image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80",
        credits: 120,
        price: "0.029 ETH",
        impact: "3,800 tons CO₂/year"
      }
    ],
    ocean: [
      {
        title: "OceanGuardian",
        location: "Marine Conservation, Australia",
        image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80",
        credits: 150,
        price: "0.032 ETH",
        impact: "4,200 tons CO₂/year"
      },
      {
        title: "Coral Reef Restoration",
        location: "Southeast Asia",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&q=80",
        credits: 89,
        price: "0.027 ETH",
        impact: "2,900 tons CO₂/year"
      }
    ],
    renewable: [
      {
        title: "Solar Power Initiative",
        location: "Kenya",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
        credits: 200,
        price: "0.035 ETH",
        impact: "5,600 tons CO₂/year"
      },
      {
        title: "Wind Energy Farm",
        location: "Scotland",
        image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=400&q=80",
        credits: 165,
        price: "0.033 ETH",
        impact: "5,100 tons CO₂/year"
      }
    ]
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

                  <button className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
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