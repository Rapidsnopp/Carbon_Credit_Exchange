import React, { useState } from 'react';
import Header from '../components/Header';

const Trading = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Mock data for trading assets
  const tradingAssets = [
    {
      id: 1,
      name: 'ForestForFuture',
      location: 'Afforestation, Brazil',
      credits: 76,
      price: 0.025,
      change: 2.5,
      image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80'
    },
    {
      id: 2,
      name: 'OceanGuardian',
      location: 'Marine Conservation, Australia',
      credits: 150,
      price: 0.032,
      change: -1.2,
      image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80'
    },
    {
      id: 3,
      name: 'MountainShield',
      location: 'Mountain Preservation, Nepal',
      credits: 95,
      price: 0.028,
      change: 0.8,
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80'
    },
    {
      id: 4,
      name: 'GreenEnergy',
      location: 'Renewable Energy, India',
      credits: 200,
      price: 0.022,
      change: 3.1,
      image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80'
    }
  ];

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  
  // Mock market data
  const marketData = {
    totalVolume: '1,245.8',
    change24h: 2.4, // positive change
    activeTrades: 24,
    avgPrice: '0.027'
  };

  const handleBuy = () => {
    if (buyAmount && selectedAsset) {
      alert(`Successfully bought ${buyAmount} credits of ${selectedAsset.name}`);
      setBuyAmount('');
    }
  };

  const handleSell = () => {
    if (sellAmount && selectedAsset) {
      alert(`Successfully sold ${sellAmount} credits of ${selectedAsset.name}`);
      setSellAmount('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-env-teal-400 to-env-cyan-400 bg-clip-text text-transparent mb-4">
              Carbon Credit Trading
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Buy, sell, and trade verified carbon credits on our decentralized marketplace
            </p>
          </div>

          {/* Trading Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Asset List */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Available Assets</h2>
                  <div className="relative">
                    <select className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-env-teal-500">
                      <option>All Projects</option>
                      <option>Forestry</option>
                      <option>Renewable Energy</option>
                      <option>Marine Conservation</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {tradingAssets.map((asset) => (
                    <div 
                      key={asset.id} 
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAsset?.id === asset.id 
                          ? 'border-env-teal-500 bg-env-teal-500/10' 
                          : 'border-gray-700 hover:border-env-cyan-500'
                      }`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="flex items-center">
                        <img 
                          src={asset.image} 
                          alt={asset.name}
                          className="w-16 h-16 rounded-lg object-cover mr-4"
                        />
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-white text-lg">{asset.name}</h3>
                              <p className="text-gray-400 text-sm">{asset.location}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white font-bold">{asset.price} ETH</p>
                              <p className={`text-sm ${asset.change >= 0 ? 'text-env-green-400' : 'text-env-cyan-400'}`}>
                                {asset.change >= 0 ? '+' : ''}{asset.change}%
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-gray-400">Credits: {asset.credits}</span>
                            <span className="text-gray-400">Standard: VCS</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Trading Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <div className="flex border-b border-gray-700/50 mb-6">
                  <button
                    className={`flex-1 py-2 px-4 text-center font-medium ${
                      activeTab === 'buy'
                        ? 'text-env-teal-400 border-b-2 border-env-teal-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('buy')}
                  >
                    Buy
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 text-center font-medium ${
                      activeTab === 'sell'
                        ? 'text-env-teal-400 border-b-2 border-env-teal-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab('sell')}
                  >
                    Sell
                  </button>
                </div>

                {selectedAsset ? (
                  <>
                    <div className="mb-6">
                      <h3 className="font-bold text-white text-lg mb-2">{selectedAsset.name}</h3>
                      <p className="text-gray-400 text-sm mb-1">{selectedAsset.location}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Credits: {selectedAsset.credits}</span>
                        <span className="text-white">Price: {selectedAsset.price} ETH</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {activeTab === 'buy' ? 'Amount to Buy' : 'Amount to Sell'}
                      </label>
                      <input
                        type="number"
                        value={activeTab === 'buy' ? buyAmount : sellAmount}
                        onChange={(e) => 
                          activeTab === 'buy' 
                            ? setBuyAmount(e.target.value) 
                            : setSellAmount(e.target.value)
                        }
                        placeholder={`Enter ${activeTab === 'buy' ? 'buy' : 'sell'} amount`}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-env-teal-500 focus:border-transparent"
                      />
                      <p className="text-gray-400 text-xs mt-2">
                        {activeTab === 'buy' 
                          ? 'Available balance: 10 ETH' 
                          : `Available credits: ${selectedAsset.credits}`}
                      </p>
                    </div>

                    <button
                      onClick={activeTab === 'buy' ? handleBuy : handleSell}
                      className={`w-full py-3 ${
                        activeTab === 'buy' 
                          ? 'bg-env-teal-500 hover:bg-env-teal-600' 
                          : 'bg-env-cyan-500 hover:bg-env-cyan-600'
                      } text-white font-medium rounded-lg transition-colors`}
                    >
                      {activeTab === 'buy' ? 'Buy Credits' : 'Sell Credits'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-400">Select an asset to trade</p>
                  </div>
                )}
              </div>

              {/* Market Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mt-6">
                <h3 className="font-bold text-white text-lg mb-4">Market Overview</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-white">{marketData.totalVolume} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={marketData.change24h >= 0 ? 'text-env-green-400' : 'text-env-cyan-400'}>
                      {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Trades</span>
                    <span className="text-white">{marketData.activeTrades}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Price</span>
                    <span className="text-white">{marketData.avgPrice} ETH</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How Trading Works */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How Carbon Credit Trading Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">1</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Select Credits</h3>
                <p className="text-gray-400 text-xs text-center">
                  Browse verified carbon credit projects and select the ones that align with your sustainability goals.
                </p>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">2</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Trade Securely</h3>
                <p className="text-gray-400 text-xs text-center">
                  Execute trades using our secure blockchain platform with transparent pricing and instant settlement.
                </p>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">3</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Track Impact</h3>
                <p className="text-gray-400 text-xs text-center">
                  Monitor your carbon offset impact and retirement status through our comprehensive dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;