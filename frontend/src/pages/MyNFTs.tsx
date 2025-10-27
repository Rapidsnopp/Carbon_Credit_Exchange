import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

// 1. Import Context và API thật
import { useWalletContext } from '../contexts'; // Giả sử đây là context của bạn
import api from '../lib/axios';

// 2. Import components và types của SOLANA
import { CollectionItem } from '../types/collection.types';
import { CollectionCard } from '../components/trading-page/CollectionCard';
// import { useAnchorWallet } from '@solana/wallet-adapter-react'; // Sẽ cần cho bước "List"

const MyNFTs: React.FC = () => {
  const [ownedNFTs, setOwnedNFTs] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 3. Lấy ví của người dùng từ Context
  const { wallet } = useWalletContext(); // Hoặc wallet.publicKey
  const publicKey = wallet?.adapter.publicKey;
  // const anchorWallet = useAnchorWallet(); // Sẽ cần cho bước "List"
  
  const navigate = useNavigate();

  // 4. Gọi API để lấy NFT thật khi ví thay đổi
  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (!publicKey) {
        setLoading(false);
        setOwnedNFTs([]);
        return;
      }

      setLoading(true);
      try {
        // Gọi API backend của bạn
        const response = await api.get(`/api/carbon-credits/wallet/${publicKey.toBase58()}`);
        
        if (response.data.success) {
          // Lọc ra những NFT chưa bị "retired" (đốt)
          const validNFTs = response.data.data.filter((nft: any) => !nft.isRetired);
          setOwnedNFTs(validNFTs);
        }
      } catch (error) {
        console.error('Error fetching owned NFTs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnedNFTs();
  }, [publicKey]); // Chạy lại mỗi khi ví thay đổi

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
              My Carbon Credits (SOL)
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Quản lý các tín chỉ carbon (NFT) bạn sở hữu trên Solana.
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

          {/* NFT Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          ) : ownedNFTs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
              {ownedNFTs.map((nft) => (
                <div key={nft.mint}>
                  {/* Dùng component CollectionCard (SOL) đã tạo */}
                  <CollectionCard item={nft} />
                  
                  {/* Thêm nút "List for Sale" */}
                  <button 
                    onClick={() => handleListForSale(nft)}
                    className="w-full mt-2 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                  >
                    List for Sale
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              {/* ... (UI "No NFTs in your wallet" giữ nguyên) ... */}
              <h3 className="text-2xl font-bold text-white mb-2">No NFTs in your wallet</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Bạn chưa sở hữu tín chỉ carbon nào. Hãy đi mint hoặc mua.
              </p>
              <Link to="/trading" className="...">Browse Marketplace</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyNFTs;