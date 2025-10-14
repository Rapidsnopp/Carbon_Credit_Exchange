import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { useEffect, useState } from 'react';
import { Leaf, Globe, Shield, TrendingUp, Award, Users } from 'lucide-react';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalCredits: 0,
    verifiedProjects: 0,
    treesPreserved: 0,
    co2Offset: 0
  });

  const [activeTab, setActiveTab] = useState('forest');

  useEffect(() => {
    const targetValues = {
      totalCredits: 12458,
      verifiedProjects: 245,
      treesPreserved: 156789,
      co2Offset: 45678
    };

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const increment = {
      totalCredits: targetValues.totalCredits / steps,
      verifiedProjects: targetValues.verifiedProjects / steps,
      treesPreserved: targetValues.treesPreserved / steps,
      co2Offset: targetValues.co2Offset / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      setStats(prev => ({
        totalCredits: Math.min(Math.floor(prev.totalCredits + increment.totalCredits), targetValues.totalCredits),
        verifiedProjects: Math.min(Math.floor(prev.verifiedProjects + increment.verifiedProjects), targetValues.verifiedProjects),
        treesPreserved: Math.min(Math.floor(prev.treesPreserved + increment.treesPreserved), targetValues.treesPreserved),
        co2Offset: Math.min(Math.floor(prev.co2Offset + increment.co2Offset), targetValues.co2Offset)
      }));

      currentStep++;
      if (currentStep >= steps) {
        clearInterval(timer);
        setStats(targetValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

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
      <Header />
      <HeroSection />
      
      {/* Impact Stats with Gradient Background */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-cyan-600/10 to-blue-600/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-3">Real-Time Global Impact</h2>
            <p className="text-gray-400 text-lg">Together, we're making a measurable difference</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-2xl mb-4">
                <TrendingUp className="w-7 h-7 text-teal-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stats.totalCredits.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium">Carbon Credits Traded</div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-14 h-14 bg-cyan-500/20 rounded-2xl mb-4">
                <Award className="w-7 h-7 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stats.verifiedProjects.toLocaleString()}
              </div>
              <div className="text-gray-400 font-medium">Verified Projects</div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-14 h-14 bg-emerald-500/20 rounded-2xl mb-4">
                <Leaf className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stats.treesPreserved.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium">Trees Preserved</div>
            </div>
            
            <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-4">
                <Globe className="w-7 h-7 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {stats.co2Offset.toLocaleString()}+
              </div>
              <div className="text-gray-400 font-medium">CO₂ Tons Offset</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">Your Journey to Impact</h2>
            <p className="text-gray-400 text-lg">Three simple steps to start making a difference</p>
          </div>
          
          <div className="relative max-w-5xl mx-auto">
            {/* Timeline Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm p-8 rounded-3xl border border-teal-500/30 hover:border-teal-500/50 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-teal-500/50">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">Connect Wallet</h3>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Securely link your Web3 wallet to access the world's most transparent carbon credit marketplace
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-cyan-500/50">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">Explore Projects</h3>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Browse verified environmental projects with real-time impact data and full documentation
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm p-8 rounded-3xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-blue-500/50">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 text-center">Take Action</h3>
                  <p className="text-gray-400 text-center leading-relaxed">
                    Buy, trade, or retire carbon credits instantly on our blockchain-powered platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'forest'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
              }`}
            >
              🌲 Forest Conservation
            </button>
            <button
              onClick={() => setActiveTab('ocean')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'ocean'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
              }`}
            >
              🌊 Ocean Protection
            </button>
            <button
              onClick={() => setActiveTab('renewable')}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'renewable'
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

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-3">Why Choose Our Platform</h2>
            <p className="text-gray-400 text-lg">Leading the future of carbon credit trading</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
              <Shield className="w-12 h-12 text-teal-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Blockchain Security</h3>
              <p className="text-gray-400 leading-relaxed">
                Every transaction is secured and verified on the blockchain, ensuring complete transparency and immutability
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
              <Award className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Verified Projects</h3>
              <p className="text-gray-400 leading-relaxed">
                All projects undergo rigorous verification by international standards including Gold Standard and Verra
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
              <Users className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
              <p className="text-gray-400 leading-relaxed">
                Join thousands of individuals and organizations committed to creating a sustainable future together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.2),transparent_50%)]"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Climate Action Today
          </h2>
          <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Every credit you trade or retire brings us one step closer to a sustainable planet. Join the movement and make your impact count.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="/trading"
              className="group px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/70 hover:transform hover:scale-105"
            >
              Explore Marketplace
              <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/mint-nft"
              className="px-10 py-4 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300 border-2 border-gray-600 hover:border-teal-500"
            >
              Mint Your Credits
            </a>
          </div>
          
          <div className="mt-12 flex justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400" />
              <span>Real Impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              <span>Global Reach</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;