import React, { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import * as anchor from "@coral-xyz/anchor";
import { TradingAsset } from "../types"
import HowToTrade from '../components/trading-page/HowToTrade';
import { getTradingAssets, getMarketStats } from '../constant/mockData';
import { useToast } from '../contexts/ToastContext';
import { buyCarbonCredit, listForSale, checkNFTOwnership, getProgram, getExchangePDA } from '../services/solana';
import { fetchMetadata } from '../services/metaplex';
import apiService from '../services/api';

// Helper function to get category badge styling
const getCategoryBadge = (category: string) => {
  const styles: Record<string, { bg: string; text: string; border: string; icon: string }> = {
    'Renewable Energy': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: '⚡' },
    'Forestry': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: '🌲' },
    'Agriculture': { bg: 'bg-lime-500/10', text: 'text-lime-400', border: 'border-lime-500/20', icon: '🌾' },
    'Waste Management': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', icon: '♻️' },
    'Industrial': { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: '🏭' },
    'Afforestation': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: '🌳' },
    'Reforestation': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', icon: '🌿' },
    'Other': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: '📋' },
  };

  return styles[category] || styles['Other'];
};

const Trading: React.FC = () => {
  // Default placeholder used when listing image is missing or fails to load
  const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80';
  const [activeTab, setActiveTab] = useState<'buy' | 'sell' | 'list'>('buy');
  const [selectedAsset, setSelectedAsset] = useState<TradingAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [transactionStatus, setTransactionStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const itemsPerPage = 4;

  // Real blockchain data states
  interface MarketStats {
    totalVolume: string;
    change24h: number;
    activeTrades: number;
    avgPrice: string;
  }

  const [realListings, setRealListings] = useState<TradingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [useRealData, setUseRealData] = useState(true); // Toggle between real/mock data

  // Wallet and connection hooks
  const { connection } = useConnection();
  const wallet = useWallet();
  const { addToast } = useToast();

  // List NFT states
  const [listMintAddress, setListMintAddress] = useState('');
  const [listPrice, setListPrice] = useState('');

  const navigate = useNavigate();

  const handleViewDetails = (assetId: string | number) => {
    navigate(`/nft/${assetId}`);
  };

  // Expanded mock data for trading assets
  const allTradingAssets = getTradingAssets();
  const marketData = getMarketStats();

  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');

  // Fetch listings from blockchain
  const fetchListings = async () => {
    try {
      setLoading(true);

      if (!connection || !wallet) {
        throw new Error('Connection and wallet are required');
      }

      console.log('Fetching listings...');
      const program = getProgram(connection, wallet);

      // Get exchange PDA
      const exchangePda = await getExchangePDA();
      console.log('Exchange PDA:', exchangePda.toBase58());

      // Get all listings from program
      const allListings = await program.account.listing.all();
      console.log('Found listings:', allListings.length);

      // Chạy gọi ở bên backend
      const response = await apiService.getAllListings();

      // Format listings and fetch metadata
      const formattedListings = await Promise.all(allListings.map(async (item: any) => {
        const listing = item.account;
        const mint = new PublicKey(listing.mint);

        try {
          // Fetch and decode metadata
          const metadata = await fetchMetadata(connection, mint);
          console.log('Fetched metadata:', metadata);

          let jsonMetadata = null;
          if (metadata.data.uri) {
            if (metadata.data.uri.startsWith('data:application/json;base64,')) {
              // Handle base64 encoded JSON
              try {
                const base64Data = metadata.data.uri.replace('data:application/json;base64,', '');
                const decodedData = atob(base64Data);
                jsonMetadata = JSON.parse(decodedData);
                console.log('Parsed base64 metadata:', jsonMetadata);
              } catch (err) {
                console.error('Error parsing base64 metadata:', err);
              }
            } else if (metadata.data.uri.startsWith('ipfs://')) {
              // Handle IPFS URI
              try {
                const ipfsGatewayURL = metadata.data.uri.replace('ipfs://', 'https://ipfs.io/ipfs/');
                const response = await fetch(ipfsGatewayURL);
                if (response.ok) {
                  jsonMetadata = await response.json();
                  console.log('Fetched IPFS metadata:', jsonMetadata);
                }
              } catch (err) {
                console.error('Error fetching IPFS metadata:', err);
              }
            }
          }

          return {
            id: mint.toBase58(),
            name: metadata.data.name || `Carbon Credit #${mint.toBase58().slice(0, 8)}`,
            location: jsonMetadata?.location || 'Unknown Location',
            credits: jsonMetadata?.attributes?.find((a: any) => a.trait_type === 'Credits')?.value || 0,
            price: listing.price.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
            change: 0,
            image: jsonMetadata?.image || 'https://placehold.co/400x400',
            category: jsonMetadata?.attributes?.find((a: any) => a.trait_type === 'Project Type')?.value || 'Carbon Credit',
            mint: mint.toBase58()
          };
        } catch (error) {
          console.error('Error processing metadata for mint:', mint.toBase58(), error);
          return {
            id: mint.toBase58(),
            name: `Carbon Credit #${mint.toBase58().slice(0, 8)}`,
            location: 'Unknown Location',
            credits: 0,
            price: listing.price.toNumber() / anchor.web3.LAMPORTS_PER_SOL,
            change: 0,
            image: 'https://placehold.co/400x400',
            category: 'Carbon Credit',
            mint: mint.toBase58()
          };
        }
      }));

      setRealListings(formattedListings);
      setUseRealData(true);
      console.log('✅ Loaded real blockchain listings:', formattedListings.length);
      console.log('📊 Sample listing:', formattedListings[0]); // Debug log

      // Calculate market stats
      if (formattedListings.length > 0) {
        const totalVolume = formattedListings.reduce((sum, listing) =>
          sum + (listing.price * listing.credits), 0);
        const avgPrice = formattedListings.reduce((sum, listing) =>
          sum + listing.price, 0) / formattedListings.length;

        setMarketStats({
          totalVolume: totalVolume.toFixed(1),
          change24h: 0,
          activeTrades: formattedListings.length,
          avgPrice: avgPrice.toFixed(3)
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching listings:', error);
      // On error, fall back to mock data
      setRealListings([]);
      setUseRealData(false);
      setLoading(false);
      addToast('Failed to load blockchain listings. Using demo data.', 'warning');
    }
  };

  // Load listings on mount
  useEffect(() => {
    fetchListings();
  }, []);

  // Use real listings if available and enabled, otherwise use mock data
  const displayAssets = (useRealData && realListings.length > 0) ? realListings : allTradingAssets;

  // Calculate market stats based on current data source
  const currentMarketStats = React.useMemo(() => {
    if (useRealData && realListings.length > 0) {
      // Calculate stats from real data
      const totalVolume = realListings.reduce((sum: number, listing: any) =>
        sum + (listing.price * listing.credits), 0);
      const avgPrice = realListings.reduce((sum: number, listing: any) =>
        sum + listing.price, 0) / realListings.length;

      return {
        totalVolume: totalVolume.toFixed(1),
        change24h: 0, // Calculate from historical data if available
        activeTrades: realListings.length,
        avgPrice: avgPrice.toFixed(3)
      };
    } else {
      // Use mock market stats
      return marketData;
    }
  }, [useRealData, realListings, marketData]);

  // Filter assets based on search and category
  const filteredAssets = displayAssets.filter(asset => {
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

  const handleBuy = async () => {
    try {
      setTransactionStatus('');
      setErrorMessage('');

      if (!buyAmount || !selectedAsset) {
        setErrorMessage('Please select an asset and enter amount');
        addToast('Please select an asset and enter amount', 'warning');
        return;
      }

      // Check if wallet is connected
      if (!wallet.connected) {
        setErrorMessage('Please connect your wallet first');
        addToast('Please connect your wallet first', 'error');
        return;
      }

      // Check if this is real blockchain data
      if (!selectedAsset.mint) {
        setTransactionStatus(`Demo: Buying ${buyAmount} credits of ${selectedAsset.name}`);
        alert(`Demo mode: Would buy ${buyAmount} credits of ${selectedAsset.name}`);
        setBuyAmount('');
        return;
      }

      setTransactionStatus('Processing purchase...');
      addToast('Processing purchase...', 'info');

      const result = await buyCarbonCredit(
        connection,
        wallet,
        selectedAsset.mint
      );

      setTransactionStatus(`Purchase successful! TX: ${result.signature.slice(0, 8)}...`);
      addToast(`Successfully purchased ${selectedAsset.name}! TX: ${result.signature.slice(0, 8)}...`, 'success');
      setBuyAmount('');

      // Refresh listings
      fetchListings();
    } catch (error) {
      console.error('Buy error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Purchase failed. Please try again.';
      setErrorMessage(errorMsg);
      setTransactionStatus('');
      addToast(errorMsg, 'error');
    }
  };

  const handleSell = () => {
    try {
      setTransactionStatus('');
      setErrorMessage('');

      if (sellAmount && selectedAsset) {
        setTransactionStatus(`Successfully sold ${sellAmount} credits of ${selectedAsset.name}`);
        alert(`Successfully sold ${sellAmount} credits of ${selectedAsset.name}`);
        setSellAmount('');
      } else {
        setErrorMessage('Please select an asset and enter amount');
      }
    } catch (error) {
      console.error('Sell error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Sale failed. Please try again.';
      setErrorMessage(errorMsg);
      setTransactionStatus('');
      addToast(errorMsg, 'error');
    }
  };

  const handleListNFT = async () => {
    try {
      setTransactionStatus('');
      setErrorMessage('');

      if (!listMintAddress || !listPrice) {
        setErrorMessage('Please enter NFT mint address and price');
        addToast('Please enter NFT mint address and price', 'warning');
        return;
      }

      if (!wallet.connected) {
        setErrorMessage('Please connect your wallet first');
        addToast('Please connect your wallet first', 'error');
        return;
      }

      const priceInSOL = parseFloat(listPrice);
      if (isNaN(priceInSOL) || priceInSOL <= 0) {
        setErrorMessage('Please enter a valid price');
        addToast('Please enter a valid price', 'warning');
        return;
      }

      setTransactionStatus('Verifying NFT ownership...');
      addToast('Verifying NFT ownership...', 'info');

      const ownership = await checkNFTOwnership(
        connection,
        wallet,
        listMintAddress
      );

      if (!ownership.owned) {
        const errorMsg = ownership.error || 'You do not own this NFT. Cannot list for sale.';
        setErrorMessage(errorMsg);
        addToast(errorMsg, 'error');
        return;
      }

      setTransactionStatus(`✅ Verified! You own this NFT (Balance: ${ownership.balance})`);
      addToast(`✅ Verified! You own this NFT (Balance: ${ownership.balance})`, 'success');

      setTransactionStatus('Listing NFT on marketplace...');
      addToast('Listing NFT on marketplace...', 'info');

      const result = await listForSale(
        connection,
        wallet,
        listMintAddress,
        priceInSOL
      );

      setTransactionStatus(`Successfully listed NFT! Listing: ${result.listing.slice(0, 8)}...`);
      addToast(`Successfully listed NFT! Listing: ${result.listing.slice(0, 8)}...`, 'success');
      setListMintAddress('');
      setListPrice('');

      addToast('Refreshing marketplace listings...', 'info');
      await fetchListings();
    } catch (error) {
      console.error('List error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to list NFT. Please try again.';
      setErrorMessage(errorMsg);
      setTransactionStatus('');
      addToast(errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Marketplace
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Buy, sell, and trade verified carbon credits on our decentralized marketplace
            </p>

            {/* Data Source Indicator */}
            <div className="mt-4 flex items-center justify-center gap-3">
              {loading ? (
                <span className="text-yellow-400 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  Loading blockchain data...
                </span>
              ) : useRealData && realListings.length > 0 ? (
                <>
                  <span className="text-green-400 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Live blockchain data ({realListings.length} listings)
                  </span>
                  <button
                    onClick={fetchListings}
                    className="text-xs px-3 py-1 bg-gray-700/50 hover:bg-gray-700 text-gray-300 rounded-lg transition-all border border-gray-600"
                  >
                    🔄 Refresh
                  </button>
                </>
              ) : (
                <>
                  <span className="text-orange-400 text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    Demo mode (mock data)
                  </span>
                  <button
                    onClick={fetchListings}
                    className="text-xs px-3 py-1 bg-teal-600/50 hover:bg-teal-600 text-white rounded-lg transition-all"
                  >
                    🔄 Try Loading Real Data
                  </button>
                </>
              )}
            </div>
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
                      <option>Renewable Energy</option>
                      <option>Forestry</option>
                      <option>Agriculture</option>
                      <option>Waste Management</option>
                      <option>Industrial</option>
                      <option>Afforestation</option>
                      <option>Reforestation</option>
                      <option>Other</option>
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
                            onError={(e) => {
                              const target = e.currentTarget as HTMLImageElement;
                              if (target.src !== DEFAULT_PLACEHOLDER) target.src = DEFAULT_PLACEHOLDER;
                            }}
                          />
                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-white text-lg">{asset.name}</h3>
                                <p className="text-gray-400 text-sm">{asset.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white font-bold">
                                  {asset.price.toFixed(3)} {useRealData && realListings.length > 0 ? 'SOL' : 'ETH'}
                                </p>
                                <p className={`text-sm ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {asset.change >= 0 ? '+' : ''}{asset.change}%
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-gray-400 text-sm">Credits: {asset.credits} tCO2e</span>
                              {(() => {
                                const badge = getCategoryBadge(asset.category);
                                return (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text} border ${badge.border}`}>
                                    {badge.icon} {asset.category}
                                  </span>
                                );
                              })()}
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
                  <button
                    className={`flex-1 py-2 px-4 text-center font-medium transition-all ${activeTab === 'list'
                      ? 'text-teal-400 border-b-2 border-teal-400'
                      : 'text-gray-400 hover:text-white'
                      }`}
                    onClick={() => setActiveTab('list')}
                  >
                    List NFT
                  </button>
                </div>

                {activeTab === 'list' ? (
                  <>
                    <h3 className="font-bold text-white text-lg mb-4">List Your NFT</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      List your Carbon Credit NFT on the marketplace
                    </p>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        NFT Mint Address
                      </label>
                      <input
                        type="text"
                        value={listMintAddress}
                        onChange={(e) => setListMintAddress(e.target.value)}
                        placeholder="Enter NFT mint address"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                      />
                      <p className="text-gray-400 text-xs mt-2">
                        The mint address of the NFT you want to list
                      </p>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Price (SOL)
                      </label>
                      <input
                        type="number"
                        step="0.001"
                        value={listPrice}
                        onChange={(e) => setListPrice(e.target.value)}
                        placeholder="Enter price in SOL"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <p className="text-gray-400 text-xs mt-2">
                        Listing price in SOL
                      </p>
                    </div>

                    <button
                      onClick={handleListNFT}
                      disabled={!wallet.connected || loading}
                      className={`w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/30 ${(!wallet.connected || loading) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                      {!wallet.connected ? 'Connect Wallet to List' : loading ? 'Loading...' : 'List NFT for Sale'}
                    </button>
                  </>
                ) : selectedAsset ? (
                  <>
                    <div className="mb-6">
                      <img
                        src={selectedAsset.image}
                        alt={selectedAsset.name}
                        className="w-full h-40 rounded-lg object-cover mb-4"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          if (target.src !== DEFAULT_PLACEHOLDER) target.src = DEFAULT_PLACEHOLDER;
                        }}
                      />
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-lg">{selectedAsset.name}</h3>
                        <button
                          // 4. Call the handler with the asset's ID
                          onClick={() => handleViewDetails(selectedAsset.id)}
                          className="text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors flex items-center p-2 rounded-full hover:bg-gray-700/50"
                          title="View NFT Details"
                        >
                          Details
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{selectedAsset.location}</p>
                      <div className="flex justify-between text-sm bg-gray-900/50 p-3 rounded-lg">
                        <span className="text-gray-400">Credits: {selectedAsset.credits}</span>
                        <div>
                          <span className="text-white font-bold block">
                            {selectedAsset.price.toFixed(3)} {useRealData && realListings.length > 0 ? 'SOL' : 'ETH'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ≈ ${(selectedAsset.price * 20).toFixed(2)} USD
                          </span>
                        </div>
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

                    {/* Transaction Status/Error Display */}
                    {transactionStatus && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-sm text-green-400">
                          {transactionStatus}
                        </p>
                      </div>
                    )}
                    {errorMessage && (
                      <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-sm text-red-400">
                          {errorMessage}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={activeTab === 'buy' ? handleBuy : handleSell}
                      disabled={loading || !wallet.connected}
                      className={`w-full py-3 ${activeTab === 'buy'
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
                        } text-white font-medium rounded-lg transition-all shadow-lg ${activeTab === 'buy' ? 'shadow-teal-500/30' : 'shadow-cyan-500/30'
                        } ${(loading || !wallet.connected) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Processing...' : !wallet.connected ? 'Connect Wallet' : activeTab === 'buy' ? 'Buy Credits' : 'Sell Credits'}
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

              {/* Market Overview removed as requested */}
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