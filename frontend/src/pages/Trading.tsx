import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { TradingAsset, CarbonCreditType } from "../types"
import HowToTrade from '../components/trading-page/HowToTrade';
import { getTradingAssets } from '../constant/mockData';
import MarketStats from '../components/trading-page/MarketStats';
import ApiService from "../services/api"

const Trading: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<CarbonCreditType | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 4;

  const navigate = useNavigate();

  const handleViewDetails = (assetId: string | number) => {
    navigate(`/nft/${assetId}`);
  };
  const [allTradingAssets, setAllTradingAssets] = useState<CarbonCreditType[]>([]);

  useEffect(() => {
    // Expanded mock data for trading assets
    const fetchTradingAssets = async () => {
      const assets = await await ApiService.getAllCarbonCredits().then((response) => {
        console.log("Fetched trading assets:", response.data);
        return response.data as CarbonCreditType[];
      });
      setAllTradingAssets(assets);
    }
    fetchTradingAssets();
    // const allTradingAssets = getTradingAssets();
  }, []);

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  // Filter assets based on search and category
  const filteredAssets = allTradingAssets.filter(asset => {
    const matchesSearch = asset.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.location.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Projects' || asset.projectType === selectedCategory;
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
      alert(`Successfully bought ${buyAmount} credits of ${selectedAsset.metadata}`);
      setBuyAmount('');
    }
  };

  const handleSell = () => {
    if (sellAmount && selectedAsset) {
      alert(`Successfully sold ${sellAmount} credits of ${selectedAsset.metadata}`);
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
          <MarketStats />

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
                    currentAssets.map((asset, id) => (
                      <div
                        key={id}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAsset?.mint === asset.mint
                          ? 'border-teal-500 bg-teal-500/10 shadow-lg shadow-teal-500/20'
                          : 'border-gray-700 hover:border-cyan-500 hover:bg-gray-800/30'
                          }`}
                        onClick={() => setSelectedAsset(asset)}
                      > \
                        <div className="flex items-center">
                          <img
                            src={(asset.metadata?.image)}
                            alt={(asset.metadata?.image)}
                            className="w-16 h-16 rounded-lg object-cover mr-4"
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-white text-lg">{(asset.metadata?.name)}</h3>
                                <p className="text-gray-400 text-sm">{(asset.location.country)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-bold">{(asset.listingPrice)} ETH</p>
                                <p className={`text-sm ${(asset.carbonAmount) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {(asset.carbonAmount) >= 0 ? '+' : ''}{(asset.carbonAmount)}%
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between mt-2">
                              <span className="text-gray-400 text-sm">Credits: {asset.mint}</span>
                              <span className="text-teal-400 text-sm">{asset.listingPrice}</span>
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
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 top-24">
                {selectedAsset ? (
                  <>
                    <div className="mb-6">
                      <img
                        src={selectedAsset.metadata?.image}
                        alt={selectedAsset.metadata?.name}
                        className="w-full h-40 rounded-lg object-cover mb-4"
                      />
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">{selectedAsset.metadata?.name}</h3>
                        <button
                          // 4. Call the handler with the asset's ID
                          onClick={() => handleViewDetails(selectedAsset.mint)}
                          className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center p-2 rounded-full hover:bg-gray-700/50"
                          title="View NFT Details"
                        >
                          Details
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{selectedAsset.location.country}</p>
                      <div className="flex justify-between text-sm bg-gray-900/50 p-3 rounded-lg">
                        <span className="text-gray-400">Credits: {selectedAsset.mint}</span>
                        <span className="text-white font-bold">{selectedAsset.listingPrice} ETH</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        {'Amount to Buy'}
                      </label>
                      <input
                        type="number"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)
                        }
                        placeholder={`amount`}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-gray-400 text-xs mt-2">'Available balance: 10 ETH ${selectedAsset.mint}`
                      </p>
                    </div>

                    <button
                      onClick={handleBuy}
                      className={`w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                      } text-white font-medium rounded-lg transition-all shadow-lg 'shadow-teal-500/30'
                        }`}>
                      Buy Credits
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


            </div>
          </div>

          {/* How Trading Works */}
          <HowToTrade />
        </div>
      </div>
    </div >
  );
};

export default Trading;