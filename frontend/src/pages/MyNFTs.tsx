import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet, Package, ShoppingCart, CheckCircle, Flame } from 'lucide-react';

// 1. Import Context và API thật
import { useWallet } from '@solana/wallet-adapter-react';
import api from '../lib/axios';

// 2. Import components và types của SOLANA
import { CollectionItem } from '../types/collection.types';
import { CollectionCard } from '../components/trading-page/CollectionCard';
// import { useAnchorWallet } from '@solana/wallet-adapter-react'; // Sẽ cần cho bước "List"

// Define NFT categories
type NFTCategory = 'minted' | 'listed' | 'purchased' | 'retired';

interface CategorizedNFTs {
  minted: CollectionItem[];
  listed: CollectionItem[];
  purchased: CollectionItem[];
  retired: CollectionItem[];
}

const MyNFTs: React.FC = () => {
  const [allNFTs, setAllNFTs] = useState<CollectionItem[]>([]);
  const [categorizedNFTs, setCategorizedNFTs] = useState<CategorizedNFTs>({
    minted: [],
    listed: [],
    purchased: [],
    retired: [],
  });
  const [activeCategory, setActiveCategory] = useState<NFTCategory | 'all'>('all');
  const [loading, setLoading] = useState(true);
  
  // 3. Lấy ví của người dùng từ Solana Wallet Adapter
  const { publicKey } = useWallet();
  // const anchorWallet = useAnchorWallet(); // Sẽ cần cho bước "List"
  
  const navigate = useNavigate();

  // 4. Gọi API để lấy NFT thật khi ví thay đổi
  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!publicKey) {
        console.log('⚠️ No wallet connected');
        setLoading(false);
        setAllNFTs([]);
        setCategorizedNFTs({
          minted: [],
          listed: [],
          purchased: [],
          retired: [],
        });
        return;
      }

      console.log('🔍 Fetching NFTs for wallet:', publicKey.toBase58());
      setLoading(true);
      try {
        // Gọi API backend để lấy tất cả NFT của ví
        const apiUrl = `/carbon-credits/wallet/${publicKey.toBase58()}`;
        console.log('📡 API Call:', apiUrl);
        const response = await api.get(apiUrl);
        
        console.log('✅ API Response:', response.data);
        if (response.data.success) {
          const nfts = response.data.data;
          setAllNFTs(nfts);
          
          // Phân loại NFT theo trạng thái
          const categorized: CategorizedNFTs = {
            minted: [],
            listed: [],
            purchased: [],
            retired: [],
          };
          
          nfts.forEach((nft: any) => {
            // NFT đã retired
            if (nft.isRetired || nft.retirement) {
              categorized.retired.push(nft);
            }
            // NFT đang list trên sàn (chưa bán)
            else if (nft.isListed || nft.listing) {
              categorized.listed.push(nft);
            }
            // NFT đã mua từ người khác (owner khác với creator/minter)
            // Note: Cần thêm logic để phân biệt minted vs purchased
            // Tạm thời: nếu không có listing và không retired thì là minted
            else {
              // TODO: Thêm trường 'originalMinter' trong metadata để phân biệt
              // Hiện tại tất cả NFT chưa list và chưa retired sẽ được coi là minted
              categorized.minted.push(nft);
            }
          });
          
          setCategorizedNFTs(categorized);
          
          console.log('📊 NFT Categories:', {
            total: nfts.length,
            minted: categorized.minted.length,
            listed: categorized.listed.length,
            purchased: categorized.purchased.length,
            retired: categorized.retired.length,
          });
        } else {
          console.warn('⚠️ API returned success: false');
        }
      } catch (error: any) {
        console.error('❌ Error fetching owned NFTs:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [publicKey]); // Chạy lại mỗi khi ví thay đổi
  
  // Get NFTs to display based on active category
  const getDisplayNFTs = (): CollectionItem[] => {
    if (activeCategory === 'all') {
      return allNFTs;
    }
    return categorizedNFTs[activeCategory];
  };
  
  const displayNFTs = getDisplayNFTs();

  // 5. Hàm xử lý "List for Sale" (Đăng bán)
  const handleListForSale = async (nft: CollectionItem) => {
    // TODO: Đây là logic phức tạp nhất
    // 1. Hiển thị một Modal (popup) hỏi người dùng giá bán (price_in_sol)
    const priceInSol = prompt(`Nhập giá bán cho ${nft.metadata.name} (SOL):`);
    if (!priceInSol || isNaN(parseFloat(priceInSol))) {
      alert("Giá không hợp lệ");
      return;
    }
    
    // 2. Chuyển SOL sang Lamports
    // const priceInLamports = parseFloat(priceInSol) * LAMPORTS_PER_SOL;

    // 3. Lấy `program` từ Anchor (cần thiết lập AnchorProvider)
    // const program = getProgram(anchorWallet); 

    // 4. Gọi hàm `list` trên smart contract
    // await program.methods.list(new BN(priceInLamports))
    //   .accounts({
    //     //... truyền tất cả các account cần thiết (listing, mint, owner, ownerAta...)
    //   })
    //   .rpc();
    
    alert(`TODO: Gọi smart contract để list ${nft.mint} với giá ${priceInSol} SOL`);
    
    // 5. Nếu thành công, điều hướng đến trang Trading
    // navigate('/trading');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              My Carbon Credits
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Quản lý các tín chỉ carbon (NFT) bạn sở hữu trên Solana
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full">
              <Wallet className="w-4 h-4 text-teal-400" />
              <span className="text-gray-300 text-sm">
                {publicKey ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}` : 'Wallet Not Connected'}
              </span>
            </div>
          </div>

          {/* Category Tabs */}
          {publicKey && !loading && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <button
                onClick={() => setActiveCategory('all')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === 'all'
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
                All ({allNFTs.length})
              </button>
              
              <button
                onClick={() => setActiveCategory('minted')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === 'minted'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
                Minted ({categorizedNFTs.minted.length})
              </button>
              
              <button
                onClick={() => setActiveCategory('listed')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === 'listed'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Listed ({categorizedNFTs.listed.length})
              </button>
              
              <button
                onClick={() => setActiveCategory('purchased')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === 'purchased'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Purchased ({categorizedNFTs.purchased.length})
              </button>
              
              <button
                onClick={() => setActiveCategory('retired')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeCategory === 'retired'
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Flame className="w-4 h-4" />
                Retired ({categorizedNFTs.retired.length})
              </button>
            </div>
          )}

          {/* NFT Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : displayNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {displayNFTs.map((nft: any) => (
                <div key={nft.mint}>
                  {/* Dùng component CollectionCard */}
                  <CollectionCard item={nft} />
                  
                  {/* Status Badge */}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {nft.isRetired || nft.retirement ? (
                      <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full border border-red-500/30">
                        🔥 Retired
                      </span>
                    ) : nft.isListed || nft.listing ? (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
                        🏷️ Listed for Sale
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                        ✨ Owned
                      </span>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  {!nft.isRetired && !nft.retirement && (
                    <div className="mt-2">
                      {nft.isListed || nft.listing ? (
                        <button 
                          onClick={() => alert('TODO: Unlist NFT')}
                          className="w-full py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                        >
                          Unlist from Sale
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleListForSale(nft)}
                          className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                        >
                          List for Sale
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-bold text-white mb-2">
                {activeCategory === 'all' 
                  ? 'No NFTs in your wallet'
                  : `No ${activeCategory} NFTs`
                }
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                {activeCategory === 'all'
                  ? 'Bạn chưa sở hữu tín chỉ carbon nào. Hãy đi mint hoặc mua.'
                  : `Bạn không có NFT nào trong danh mục ${activeCategory}.`
                }
              </p>
              <Link 
                to="/mint"
                className="inline-block px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 mr-4"
              >
                Mint NFT
              </Link>
              <Link 
                to="/trading"
                className="inline-block px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Browse Marketplace
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;