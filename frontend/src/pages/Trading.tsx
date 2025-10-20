import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { TradingAsset } from "../types"
import HowToTrade from '../components/trading-page/HowToTrade';
import { getTradingAssets, getMarketStats } from '../constant/mockData';

const Trading: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedAsset, setSelectedAsset] = useState<TradingAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  // Expanded mock data for trading assets
  const allTradingAssets = getTradingAssets();
  const marketData = getMarketStats();

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');



  // Filter assets based on search and category
  const filteredAssets = allTradingAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Projects' || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  // Reset to page 1 when search or filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedAsset(null); // Deselect asset when changing page
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
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
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
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Available Assets</h2>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {/* Search Box */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search NFT name..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                      />
                    </div>

                    {/* Category Filter */}
                    <select
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                      className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <option>All Projects</option>
                      <option>Forestry</option>
                      <option>Renewable Energy</option>
                      <option>Marine Conservation</option>
                    </select>
                  </div>
                </div>

                {/* Results count */}
                <div className="text-gray-400 text-sm mb-4">
                  Showing {currentAssets.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} results
                </div>

                {/* Asset Cards */}
                <div className="space-y-4 mb-6">
                  {currentAssets.length > 0 ? (
                    currentAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAsset?.id === asset.id
                          ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20'
                          : 'border-gray-700 hover:border-cyan-500 hover:bg-gray-800/30'
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
                                <p className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400 text-sm">Credits: {asset.credits}</span>
                              <span className="text-teal-400 text-sm">{asset.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="text-gray-400">No assets found matching your search</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {filteredAssets.length > itemsPerPage && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPage === 1
                        ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                        }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg transition-all ${currentPage === page
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/50'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentPage === totalPages
                        ? 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-700/50 text-white hover:bg-gray-700'
                        }`}
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Trading Panel */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 sticky top-24">
                <div className="flex border-b border-gray-700/50 mb-6">
                  <button
                    className={`flex-1 py-2 px-4 text-center font-medium transition-all ${activeTab === 'buy'
                      ? 'text-teal-400 border-b-2 border-teal-400'
                      : 'text-gray-400 hover:text-white'
                      }`}
                    onClick={() => setActiveTab('buy')}
                  >
                    Buy
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 text-center font-medium transition-all ${activeTab === 'sell'
                      ? 'text-teal-400 border-b-2 border-teal-400'
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
                      <img
                        src={selectedAsset.image}
                        alt={selectedAsset.name}
                        className="w-full h-40 rounded-lg object-cover mb-4"
                      />
                      <h3 className="font-bold text-white text-lg mb-2">{selectedAsset.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{selectedAsset.location}</p>
                      <div className="flex justify-between text-sm bg-gray-900/50 p-3 rounded-lg">
                        <span className="text-gray-400">Credits: {selectedAsset.credits}</span>
                        <span className="text-white font-bold">{selectedAsset.price} ETH</span>
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
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-gray-400 text-xs mt-2">
                        {activeTab === 'buy'
                          ? 'Available balance: 10 ETH'
                          : `Available credits: ${selectedAsset.credits}`}
                      </p>
                    </div>

                    <button
                      onClick={activeTab === 'buy' ? handleBuy : handleSell}
                      className={`w-full py-3 ${activeTab === 'buy'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                        } text-white font-medium rounded-lg transition-all shadow-lg ${activeTab === 'buy' ? 'shadow-teal-500/30' : 'shadow-cyan-500/30'
                        }`}
                    >
                      {activeTab === 'buy' ? 'Buy Credits' : 'Sell Credits'}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className={marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
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
          <HowToTrade />
        </div>
      </div>
    </div>
  );
};

export default Trading;