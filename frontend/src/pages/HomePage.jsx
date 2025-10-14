import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import { useEffect, useState } from 'react';

const HomePage = () => {
  const [stats, setStats] = useState({
    totalCredits: 0,
    verifiedProjects: 0,
    treesPreserved: 0,
    co2Offset: 0
  });

  useEffect(() => {
    // Simulate loading stats with animations
    const targetValues = {
      totalCredits: 12458,
      verifiedProjects: 245,
      treesPreserved: 156789,
      co2Offset: 45678
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // number of animation steps
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
        // Ensure final values are exact
        setStats(targetValues);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <HeroSection />
      
      {/* Stats/KPI Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                {stats.totalCredits.toLocaleString()}+
              </div>
              <div className="text-gray-400">Carbon Credits Traded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                {stats.verifiedProjects.toLocaleString()}
              </div>
              <div className="text-gray-400">Verified Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                {stats.treesPreserved.toLocaleString()}+
              </div>
              <div className="text-gray-400">Trees Preserved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-teal-400 mb-2">
                {stats.co2Offset.toLocaleString()}+
              </div>
              <div className="text-gray-400">CO₂ Tons Offset</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-gray-800/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold text-teal-400">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Connect Wallet</h3>
              <p className="text-gray-400 text-center">
                Connect your crypto wallet to start exploring verified carbon credit projects.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold text-teal-400">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Browse Projects</h3>
              <p className="text-gray-400 text-center">
                Explore verified projects with transparent impact metrics and documentation.
              </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-xl font-bold text-teal-400">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 text-center">Buy/Trade/Retire</h3>
              <p className="text-gray-400 text-center">
                Purchase, trade, or retire carbon credits securely on our blockchain platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" 
                alt="ForestForFuture Project" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">ForestForFuture</h3>
                <p className="text-gray-400 mb-3">Afforestation, Brazil</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Credits Available: 76</span>
                  <span className="text-teal-400">0.025 ETH</span>
                </div>
                <button className="mt-4 w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
                  View Project
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80" 
                alt="OceanGuardian Project" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">OceanGuardian</h3>
                <p className="text-gray-400 mb-3">Marine Conservation, Australia</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Credits Available: 150</span>
                  <span className="text-teal-400">0.032 ETH</span>
                </div>
                <button className="mt-4 w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
                  View Project
                </button>
              </div>
            </div>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80" 
                alt="MountainShield Project" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">MountainShield</h3>
                <p className="text-gray-400 mb-3">Mountain Preservation, Nepal</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Credits Available: 95</span>
                  <span className="text-teal-400">0.028 ETH</span>
                </div>
                <button className="mt-4 w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors">
                  View Project
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-teal-600/20 to-cyan-600/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join our platform to buy, trade, or retire carbon credits and contribute to a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/trading" 
              className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors"
            >
              Start Trading
            </a>
            <a 
              href="/mint-nft" 
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors border border-gray-600"
            >
              Mint Carbon Credits
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HomePage;