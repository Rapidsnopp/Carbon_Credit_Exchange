import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, Shield, Award, Leaf } from 'lucide-react';
import { ProjectDetails, MintedNFT } from "../../types";

// --- IMPORTS CHO LOGIC ---
import api from '../../lib/axios';
import { useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import {
    Keypair,
    Transaction,
    SystemProgram,
    PublicKey,
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    createInitializeMintInstruction,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction,
    getAssociatedTokenAddress
} from "@solana/spl-token";
import {
    createCreateMetadataAccountV3Instruction,
    PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
} from "@metaplex-foundation/mpl-token-metadata";
import { Buffer } from 'buffer';

export default function MintCredit() {
    // --- State cho Form ---
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
    const [imageFile, setImageFile] = useState<File | null>(null);
    const { connection } = useConnection();
    const anchorWallet = useAnchorWallet();

    // --- Các hàm xử lý Input ---
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
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- HÀM MINT (GỌI BACKEND) ---
    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // 1. Kiểm tra cơ bản
        if (!imageFile || !anchorWallet || !projectDetails.projectName) {
            alert("Vui lòng kết nối ví, upload ảnh và điền Tên dự án!");
            return;
        }

        setIsMinting(true);
        try {
            // --- BƯỚC 1: Tạo FormData ---
            // Chúng ta cần gửi cả file VÀ dữ liệu JSON trong một request
            const formData = new FormData();
            
            // Thêm file ảnh
            formData.append('image', imageFile);

            // Thêm tất cả chi tiết dự án
            // (Backend sẽ đọc chúng từ req.body)
            Object.keys(projectDetails).forEach(key => {
                formData.append(key, (projectDetails as any)[key]);
            });

            // Thêm public key của người dùng
            formData.append('userPublicKey', anchorWallet.publicKey.toBase58());

            // --- BƯỚC 2: Gọi API Backend ---
            const mintRes = await api.post('/carbon-credits', formData, {
                headers: {
                    // Quan trọng: Để trình duyệt tự đặt Content-Type
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = mintRes.data;
            console.log("✅ Mint thành công từ backend:", data);

            // --- BƯỚC 3: Hiển thị kết quả  ---
            setMintedNFT({
                id: data.mint,
                name: projectDetails.projectName,
                tokenId: data.mint,
                image: uploadedImage || '...', // Dùng ảnh preview để hiển thị ngay
                attributes: [
                    { trait_type: 'Project Name', value: projectDetails.projectName },
                    { trait_type: 'Location', value: projectDetails.projectLocation },
                ]
            });

        } catch (error) {
            console.error("Mint failed:", error);
            alert("Mint thất bại! (Xem console log để biết chi tiết)");
        } finally {
            setIsMinting(false);
        }
    };

    // --- PHẦN UI ---
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Minting Form - Takes 3 columns */}
            <div className="lg:col-span-3">
                {/* --- Logic: Ẩn form khi đã mint xong --- */}
                {!mintedNFT ? (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <FileText className="w-6 h-6 text-teal-400" />
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
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl h-48 flex flex-col items-center justify-center text-gray-400 hover:border-teal-500 hover:text-teal-400 transition-all duration-300"
                                        >
                                            {uploadedImage ? (
                                                <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="w-10 h-10 mb-2" />
                                                    <span className="font-semibold">Click to upload</span>
                                                    <span className="text-xs">PNG, JPG or GIF (max. 5MB)</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                {/* Text Input Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        name="projectName"
                                        value={projectDetails.projectName}
                                        onChange={handleInputChange}
                                        placeholder="Project Name"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    />
                                    <input
                                        name="projectLocation"
                                        value={projectDetails.projectLocation}
                                        onChange={handleInputChange}
                                        placeholder="Project Location (e.g., Brazil)"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>
                                <select
                                    name="projectType"
                                    value={projectDetails.projectType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                >
                                    <option value="">Select Project Type</option>
                                    <option value="Forestry">Forestry</option>
                                    <option value="Renewable Energy">Renewable Energy</option>
                                    <option value="Marine Conservation">Marine Conservation</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input
                                    name="creditAmount"
                                    value={projectDetails.creditAmount}
                                    onChange={handleInputChange}
                                    type="number"
                                    placeholder="Total Carbon Credits (e.g., 1000)"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input
                                        name="creditStandard"
                                        value={projectDetails.creditStandard}
                                        onChange={handleInputChange}
                                        placeholder="Credit Standard (e.g., VCS)"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    />
                                    <input
                                        name="certificationBody"
                                        value={projectDetails.certificationBody}
                                        onChange={handleInputChange}
                                        placeholder="Certification Body (e.g., Verra)"
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>
                                <input
                                    name="verificationDate"
                                    value={projectDetails.verificationDate}
                                    onChange={handleInputChange}
                                    type="date"
                                    placeholder="Verification Date"
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                />
                                <textarea
                                    name="description"
                                    value={projectDetails.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    placeholder="Project Description..."
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white"
                                />

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
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
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
                ) : (
                    // --- UI Hiển thị sau khi MINT THÀNH CÔNG ---
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-green-500/50 p-8 shadow-2xl text-center">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                        <p className="text-gray-300 mb-6">Your Carbon Credit NFT has been minted.</p>
                        <div className="w-full rounded-2xl overflow-hidden mb-4">
                            <img src={mintedNFT.image} alt={mintedNFT.name} className="w-full h-auto object-cover" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{mintedNFT.name}</h3>
                        <p className="text-gray-400 text-sm font-mono break-all">Mint: {mintedNFT.tokenId}</p>
                    </div>
                )}
            </div>

            {/* Preview/Result Section - Takes 2 columns */}
            <div className="lg:col-span-2">
                <div className="sticky top-24">
                    {/* --- Logic: Hiển thị Preview hoặc Kết quả --- */}
                    {mintedNFT ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                           <h2 className="text-2xl font-bold text-white mb-6">NFT Attributes</h2>
                           <div className="space-y-3">
                                {mintedNFT.attributes.map((attr, index) => (
                                    <div key={index} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                        <span className="text-gray-400 text-sm font-medium">{attr.trait_type}</span>
                                        <span className="text-white font-semibold">{attr.value}</span>
                                    </div>
                                ))}
                           </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Live Preview</h2>
                            <div className="w-full bg-gray-700/50 rounded-2xl overflow-hidden">
                                <div className="w-full h-56 flex items-center justify-center">
                                    {uploadedImage ? (
                                        <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-500">Image Preview</span>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-bold text-white truncate">
                                        {projectDetails.projectName || "Project Name"}
                                    </h3>
                                    <p className="text-sm text-gray-400 truncate">
                                        {projectDetails.projectLocation || "Location"}
                                    </p>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs text-gray-500">Credits</span>
                                        <span className="text-white font-semibold">
                                            {projectDetails.creditAmount || "0"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}