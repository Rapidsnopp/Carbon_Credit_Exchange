import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, Shield, Award, Leaf } from 'lucide-react';
import { ProjectDetails, MintedNFT } from "../../types"; // Giữ nguyên types của bạn

// --- IMPORTS CHO LOGIC THẬT ---
import api from '../../lib/axios'; // Import axios instance
import { useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react'; // Hook quan trọng
import { PublicKey } from "@solana/web3.js";
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
// ------------------------------


export default function MintCredit() {
    // --- State cho Form (Giữ nguyên) ---
    const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
        projectName: '',
        projectLocation: '',
        projectType: '',
        creditAmount: '',
        creditStandard: '',
        certificationBody: '',
        verificationDate: '',
        description: ''
    });

    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [mintedNFT, setMintedNFT] = useState<MintedNFT | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // --- State cho Logic Thật ---
    const [imageFile, setImageFile] = useState<File | null>(null); // State để giữ file thật
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet(); // Ví để ký giao dịch

    // --- Các hàm xử lý (Cập nhật) ---

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setProjectDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            // 1. Lưu file thật để upload
            setImageFile(file);
            
            // 2. Tạo preview (giữ nguyên logic)
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- HÀM MINT THẬT (Thay thế hoàn toàn logic mock) ---
    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!imageFile || !anchorWallet || !connection) {
            alert("Vui lòng kết nối ví và upload ảnh dự án!");
            return;
        }

        setIsMinting(true);
        try {
            const payer = anchorWallet; // Ví của bạn

            // --- BƯỚC 1: Upload ảnh lên IPFS (qua backend) ---
            console.log("📤 Bắt đầu upload ảnh...", imageFile);
            const formData = new FormData();
            formData.append('image', imageFile);
            
            console.log("🌐 Gọi API upload...");
            const uploadRes = await api.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            console.log("✅ Response từ backend:", uploadRes.data);
            
            if (!uploadRes.data.success) {
                throw new Error(uploadRes.data.error || 'Upload ảnh thất bại');
            }
            
            const imageUrl = uploadRes.data.imageUrl; // (vd: "ipfs://Qm...")
            console.log("✅ Image uploaded:", imageUrl);

            // --- BƯỚC 2: Upload JSON metadata lên IPFS ---
            const metadataJson = {
                name: projectDetails.projectName,
                description: projectDetails.description,
                image: imageUrl,
                attributes: [
                    { trait_type: 'Location', value: projectDetails.projectLocation },
                    { trait_type: 'Type', value: projectDetails.projectType },
                    { trait_type: 'Credits', value: projectDetails.creditAmount },
                    { trait_type: 'Standard', value: projectDetails.creditStandard },
                ]
            };
            
            console.log("📤 Upload metadata JSON...");
            const metaUploadRes = await api.post('/upload/json', metadataJson);
            
            if (!metaUploadRes.data.success) {
                throw new Error(metaUploadRes.data.error || 'Upload metadata thất bại');
            }
            
            const metadataUri = metaUploadRes.data.metadataUri;
            console.log("✅ Metadata URI:", metadataUri);


            // --- BƯỚC 3: Mint NFT trên Solana sử dụng Metaplex ---
            console.log("🎨 Tạo NFT với Metaplex...");
            
            // Tạo Metaplex instance
            const metaplex = Metaplex.make(connection)
                .use(walletAdapterIdentity(anchorWallet));

            // Mint NFT
            const { nft } = await metaplex.nfts().create({
                uri: metadataUri,
                name: projectDetails.projectName,
                symbol: "CO2C",
                sellerFeeBasisPoints: 500, // 5% royalty
                creators: [
                    {
                        address: anchorWallet.publicKey,
                        share: 100,
                    }
                ],
            });

            console.log("✅ NFT Mint address:", nft.address.toBase58());
            const newMintAddress = nft.address.toBase58();

            // --- BƯỚC 4: Lưu bản sao vào MongoDB (qua backend) ---
            console.log("💾 Lưu vào MongoDB...");
            await api.post('/metadata/create', {
                mint: newMintAddress,
                owner: anchorWallet.publicKey.toBase58(),
                projectName: projectDetails.projectName,
                location: { country: projectDetails.projectLocation },
                vintageYear: new Date(projectDetails.verificationDate).getFullYear(),
                carbonAmount: Number(projectDetails.creditAmount),
                verificationStandard: projectDetails.creditStandard,
                projectType: projectDetails.projectType,
                projectDescription: projectDetails.description,
            });
            console.log("Saved to MongoDB");

            // --- BƯỚC 5: Hiển thị kết quả (Giữ nguyên UI của bạn) ---
            setMintedNFT({
                id: newMintAddress, // Dùng Mint thật
                name: projectDetails.projectName,
                tokenId: newMintAddress, // Dùng Mint thật
                image: uploadedImage || '...',
                attributes: [
                    { trait_type: 'Project Name', value: projectDetails.projectName },
                    { trait_type: 'Location', value: projectDetails.projectLocation },
                    { trait_type: 'Credits', value: projectDetails.creditAmount },
                    { trait_type: 'Standard', value: projectDetails.creditStandard },
                ]
            });

        } catch (error) {
            console.error("Mint failed:", error);
            alert("Mint thất bại! (Xem console log để biết chi tiết)");
        } finally {
            setIsMinting(false);
        }
    };

    // --- PHẦN UI (Giữ nguyên 100%) ---
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Minting Form - Takes 3 columns */}
            <div className="lg:col-span-3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                    <div className="flex items-center gap-3 mb-8">
                        {/* ... (Toàn bộ UI của bạn) ... */}
                        <h2 className="text-2xl font-bold text-white">Project Details</h2>
                    </div>

                    <form onSubmit={handleMint}>
                        <div className="space-y-6">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-300 mb-3">
                                    Project Image
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload} // Đã cập nhật
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    {/* ... (Toàn bộ UI Image Upload) ... */}
                                </div>
                            </div>

                            {/* ... (Toàn bộ UI các trường input: Project Name, Location, v.v...) ... */}
                            {/* ... (Đảm bảo tất cả các input đều có value, onChange, name) ... */}

                            <button
                                type="submit"
                                disabled={isMinting}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${isMinting
                                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/50 hover:shadow-teal-500/70 hover:transform hover:scale-[1.02]'
                                    }`}
                            >
                                {isMinting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" /* ... */ ></svg>
                                        Minting Your NFT...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="w-5 h-5" />
                                        Mint Carbon Credit NFT
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Preview/Result Section - Takes 2 columns */}
            <div className="lg:col-span-2">
                <div className="sticky top-24">
                    {mintedNFT ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                           {/* ... (Toàn bộ UI Success) ... */}
                           <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                           <img src={mintedNFT.image} alt={mintedNFT.name} />
                           <h3 className="text-2xl font-bold text-white mb-2">{mintedNFT.name}</h3>
                           <p className="text-gray-400 text-sm">Token ID: {mintedNFT.tokenId}</p>
                           {/* ... (Rest of success UI) ... */}
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                            {/* ... (Toàn bộ UI Live Preview) ... */}
                            <h2 className="text-2xl font-bold text-white">Live Preview</h2>
                            {/* ... (Rest of preview UI) ... */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}