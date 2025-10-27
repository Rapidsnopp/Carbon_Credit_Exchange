import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../lib/axios';
import { CollectionItem } from '../types/collection.types';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { useAnchorWallet } from '@solana/wallet-adapter-react'; // Sẽ cần cho "Buy"

const NFTDetails: React.FC = () => {
  const navigate = useNavigate();
  // `id` bây giờ là `mintAddress`
  const { id: mintAddress } = useParams<{ id: string }>(); 
  
  const [nft, setNft] = useState<CollectionItem | null>(null);
  const [listing, setListing] = useState<any>(null); // State cho listing on-chain
  const [loading, setLoading] = useState(true);
  // const anchorWallet = useAnchorWallet(); // Sẽ cần cho "Buy"

  useEffect(() => {
    if (!mintAddress) {
      setLoading(false);
      return;
    }
    
    const fetchDetails = async () => {
      setLoading(true);
      try {
        // 1. Lấy metadata (từ MongoDB)
        const metaRes = await api.get(`/metadata/${mintAddress}`);
        
        // 2. Lấy thông tin on-chain (listing, retirement)
        const chainRes = await api.get(`/carbon-credits/${mintAddress}`);

        if (metaRes.data.success) {
          // Gộp data từ 2 APIs
          const metadata = metaRes.data.data;
          const chainData = chainRes.data.data;
          
          setNft({
            mint: metadata.mint,
            owner: metadata.owner, // Lấy owner từ MongoDB
            price: chainData.listing ? chainData.listing.price : '0',
            metadata: {
              name: metadata.projectName,
              description: metadata.projectDescription,
              image: metadata.metadata.image || 'https://via.placeholder.com/400',
              attributes: metadata.metadata.attributes || [],
            },
          });
          
          setListing(chainData.listing); // Lưu trữ thông tin listing (nếu có)
        }
      } catch (error) {
        console.error("Failed to fetch NFT details", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [mintAddress]);

  const handleBuyNow = async () => {
    if (!listing) return;
    
    // TODO: Đây là logic Mua 
    // 1. Lấy `program` từ Anchor
    // const program = getProgram(anchorWallet);

    // 2. Gọi hàm `purchase` trên smart contract
    // await program.methods.purchase()
    //   .accounts({
    //     //... truyền tất cả các account cần thiết (buyer, seller, listing, mint, ATAs...)
    //   })
    //   .rpc();
    
    const priceInSol = parseFloat(listing.price) / LAMPORTS_PER_SOL;
    alert(`TODO: Gọi smart contract để MUA NFT ${mintAddress} với giá ${priceInSol} SOL`);
    
    // 3. Nếu thành công, điều hướng đến "My NFTs"
    // navigate('/my-nfts');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!nft) {
    return (
      // ... (UI "NFT Not Found" giữ nguyên) ...
      <div className="min-h-screen bg-gray-900">...NFT Not Found...</div>
    );
  }

  const priceInSol = parseFloat(nft.price) / LAMPORTS_PER_SOL;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="...">Back</button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Image & Attributes */}
            <div className="lg:w-1/2">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl overflow-hidden">
                <img src={nft.metadata.image} alt={nft.metadata.name} className="w-full h-[400px] object-cover" />
              </div>
              
              {/* Attributes Grid (nếu có) */}
              <div className="mt-6">
                <h3 className="text-white font-semibold text-lg mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.metadata.attributes.map((attr, idx) => (
                    <div key={idx} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4">
                      <div className="text-xs text-gray-400 uppercase">{attr.trait_type}</div>
                      <div className="text-white font-semibold mt-1">{attr.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="lg:w-1/2 space-y-6">
              <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                <h1 className="text-3xl font-bold text-white mb-2">{nft.metadata.name}</h1>
                <div className="text-gray-400 text-sm mb-6">
                  <span className="font-medium">Mint:</span>{' '}
                  <span className="font-mono break-all">{nft.mint}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/30">
                    <div className="text-gray-400 text-sm mb-1">Current Price</div>
                    <div className="text-white text-2xl font-bold">
                      {listing ? `${priceInSol} SOL` : 'Not for Sale'}
                    </div>
                  </div>
                  {/* Bạn có thể thêm các ô khác như "Credits", "Impact" nếu metadata có */}
                </div>

                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed">{nft.metadata.description}</p>
                </div>

                {/* Nút Mua (Chỉ hiển thị nếu đang được list) */}
                {listing && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium hover:from-teal-600 hover:to-cyan-600 transition-all shadow-lg shadow-teal-500/30"
                  >
                    Buy Now for {priceInSol} SOL
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetails;