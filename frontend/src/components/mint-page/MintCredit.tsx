import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, Sparkles, Shield, Award, Leaf } from 'lucide-react';
import { CarbonCreditType, MintedNFT } from "../../types/";
import program from '../../services/solana'
import metadata from '../../services/metadata';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export default function MintCredit() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [projectDetails, setProjectDetails] = useState<CarbonCreditType>({
        mint: '',
        owner: '',

        projectName: '',
        location: { country: '', region: '', coordinates: { latitude: undefined, longitude: undefined } },

        vintageYear: new Date().getFullYear(),
        carbonAmount: 1,
        verificationStandard: 'VCS',

        metadata: {
            name: '',
            symbol: '',
            uri: '',
            description: '',
            image: '',
            attributes: [],
        },

        projectType: 'Other',
        projectDescription: '',
        projectDocuments: [],

        verificationDetails: { verifier: '', verificationDate: undefined, certificateNumber: '', status: 'Pending' },

        isListed: false,
        listingPrice: 0,

        isRetired: false,
        retirementDetails: {},

        views: 0,
        favorites: 0,
        status: 'Active',
    });


    const [isMinting, setIsMinting] = useState<boolean>(false);
    const [mintedNFT, setMintedNFT] = useState<MintedNFT | null>(null);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Nếu là số, parseInt
        const numericFields = ['carbonAmount', 'vintageYear', 'listingPrice'];
        const parsedValue = numericFields.includes(name) ? parseInt(value) || 0 : value;

        setProjectDetails(prev => ({
            ...prev,
            [name]: parsedValue,
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMint = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!wallet?.publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        try {
            setIsMinting(true);

            // 1️⃣ Tạo metadata JSON từ projectDetails và uploadedImage
            const metadataJSON = metadata.generateMetadata(projectDetails, uploadedImage);

            // 2️⃣ Upload metadata lên IPFS/Arweave
            const uploaded = await metadata.uploadMetadata(metadataJSON);

            // 3️⃣ Chuẩn bị carbonData cho on-chain
            const carbonData = {
                projectName: projectDetails.projectName || "Unknown Project",
                projectId: projectDetails.mint || `PROJECT_ID_${Date.now()}`,
                vintageYear: Number(projectDetails.vintageYear) || new Date().getFullYear(),
                metricTons: Number(projectDetails.carbonAmount) || 1,
                validator: projectDetails.verificationDetails?.verifier || "Unknown",
                standard: projectDetails.verificationStandard || "VCS",
                projectType: projectDetails.projectType || "Other",
                country: projectDetails.location.country || "Unknown",
            };

            // 4️⃣ Mint NFT bằng chương trình on-chain
            const mintResult = await program.mintCarbonCredit(
                connection,
                wallet,
                carbonData,
                uploaded.uri,
                projectDetails.projectName || "Carbon Credit NFT",
                "CARBON"
            );

            console.log("✅ Mint successful:", mintResult);
            alert("Mint successful!");
        } catch (err) {
            console.error("❌ Mint failed:", err);
            alert("Mint failed! See console for details.");
        } finally {
            setIsMinting(false);
        }
    };


    const getProjectTypeColor = (type: string) => {
        const colors = {
            'afforestation': 'from-green-500 to-emerald-500',
            'reforestation': 'from-green-600 to-teal-500',
            'renewable-energy': 'from-amber-500 to-orange-500',
            'maritime': 'from-blue-500 to-cyan-500',
            'other': 'from-purple-500 to-pink-500'
        };
        return (colors as Record<string, string>)[type] || 'from-gray-500 to-gray-600';
    };

    useEffect(() => {
        if (wallet.publicKey) {
            setProjectDetails(prev => ({
                ...prev,
                walletAddress: wallet.publicKey?.toBase58() || '',
            }));
        }
    }, [wallet.publicKey]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Minting Form - Takes 3 columns */}
            <div className="lg:col-span-3 border border-gray-700/50 rounded-3xl p-8 bg-gray-800/50 backdrop-blur-sm shadow-2xl">
                <form onSubmit={handleMint} className="space-y-6">
                    {/* Project Image */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-3">Project Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                        <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer">
                            {uploadedImage ? (
                                <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <Upload className="w-12 h-12 mx-auto mb-3" />
                                    <p>Click to upload project image</p>
                                </div>
                            )}
                        </label>
                    </div>

                    {/* Project Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Project Name *</label>
                        <input
                            type="text"
                            name="projectName"
                            value={projectDetails.projectName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                            placeholder="e.g., Amazon Forest Protection"
                        />
                    </div>

                    {/* Project Location */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Project Country *</label>
                        <input
                            type="text"
                            name="location.country"
                            value={projectDetails.location.country}
                            onChange={e =>
                                setProjectDetails(prev => ({
                                    ...prev,
                                    location: { ...prev.location, country: e.target.value },
                                }))
                            }
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                            placeholder="e.g., Brazil"
                        />
                    </div>

                    {/* Project Type */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Project Type *</label>
                        <select
                            name="projectType"
                            value={projectDetails.projectType}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                        >
                            <option value="Forestry">🌳 Forestry</option>
                            <option value="Renewable Energy">⚡ Renewable Energy</option>
                            <option value="Agriculture">🌾 Agriculture</option>
                            <option value="Waste Management">🗑️ Waste Management</option>
                            <option value="Industrial">🏭 Industrial</option>
                            <option value="Other">📦 Other</option>
                        </select>
                    </div>

                    {/* Carbon Amount */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Carbon Amount (tCO2e) *</label>
                        <input
                            type="number"
                            name="carbonAmount"
                            value={projectDetails.carbonAmount}
                            onChange={handleInputChange}
                            required
                            min={1}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                        />
                    </div>

                    {/* Verification Standard */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Verification Standard *</label>
                        <select
                            name="verificationStandard"
                            value={projectDetails.verificationStandard}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                        >
                            <option value="VCS">VCS</option>
                            <option value="Gold Standard">Gold Standard</option>
                            <option value="CDM">CDM</option>
                            <option value="CAR">CAR</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Verification Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Verification Date</label>
                        <input
                            type="date"
                            name="verificationDetails.verificationDate"
                            value={projectDetails.verificationDetails?.verificationDate?.toISOString().split('T')[0] || ''}
                            onChange={e =>
                                setProjectDetails(prev => ({
                                    ...prev,
                                    verificationDetails: { ...prev.verificationDetails, verificationDate: new Date(e.target.value) },
                                }))
                            }
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                        />
                    </div>

                    {/* Vintage Year */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Vintage Year</label>
                        <input
                            type="number"
                            name="vintageYear"
                            value={projectDetails.vintageYear}
                            onChange={handleInputChange}
                            min={2000}
                            max={new Date().getFullYear()}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white"
                        />
                    </div>

                    {/* Project Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">Project Description</label>
                        <textarea
                            name="projectDescription"
                            value={projectDetails.projectDescription}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white resize-none"
                        ></textarea>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isMinting}
                        className={`w-full py-4 px-6 rounded-xl font-bold text-lg ${isMinting
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white'
                            }`}
                    >
                        {isMinting ? 'Minting...' : 'Mint Carbon Credit NFT'}
                    </button>
                </form>
            </div>

            {/* Preview/Result Section - Takes 2 columns */}
            <div className="lg:col-span-2">
                <div className="top-24">
                    {mintedNFT ? (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50 animate-pulse">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">Success!</h2>
                                <p className="text-gray-400">Your NFT has been minted on the blockchain</p>
                            </div>

                            <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-600/50">
                                <div className="relative aspect-square bg-gray-600 rounded-xl mb-4 overflow-hidden group">
                                    <img
                                        src={mintedNFT.image}
                                        alt={mintedNFT.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 right-3 bg-teal-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                        <span className="text-white font-bold text-sm">#{mintedNFT.id}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{mintedNFT.name}</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield className="w-4 h-4 text-teal-400" />
                                    <p className="text-gray-400 text-sm">Token ID: {mintedNFT.tokenId}</p>
                                </div>

                                <div className="space-y-3 bg-gray-900/50 rounded-xl p-4">
                                    {mintedNFT.attributes.map((attr, index) => (
                                        <div key={index} className="flex justify-between items-center pb-2 border-b border-gray-700/50 last:border-0 last:pb-0">
                                            <span className="text-gray-400 text-sm">{attr.trait_type}</span>
                                            <span className="text-white font-semibold text-sm">{attr.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <button className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
                                    View on Marketplace
                                </button>
                                <button className="w-full py-3 px-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-bold transition-all border border-gray-600">
                                    Download Certificate
                                </button>
                                <button
                                    onClick={() => {
                                        setMintedNFT(null);
                                        setProjectDetails({
                                            mint: '',
                                            owner: '',

                                            projectName: '',
                                            location: { country: '', region: '', coordinates: { latitude: undefined, longitude: undefined } },

                                            vintageYear: new Date().getFullYear(),
                                            carbonAmount: 1,
                                            verificationStandard: 'VCS',

                                            metadata: {
                                                name: '',
                                                symbol: '',
                                                uri: '',
                                                description: '',
                                                image: '',
                                                attributes: [],
                                            },

                                            projectType: 'Other',
                                            projectDescription: '',
                                            projectDocuments: [],

                                            verificationDetails: { verifier: '', verificationDate: undefined, certificateNumber: '', status: 'Pending' },

                                            isListed: false,
                                            listingPrice: 0,

                                            isRetired: false,
                                            retirementDetails: {},

                                            views: 0,
                                            favorites: 0,
                                            status: 'Active',
                                        });
                                        setUploadedImage(null);
                                    }}
                                    className="w-full py-3 px-4 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl font-medium transition-all border border-gray-700"
                                >
                                    Mint Another NFT
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Live Preview</h2>
                                    <p className="text-gray-400 text-sm">See your NFT as you create it</p>
                                </div>
                            </div>

                            {(projectDetails.projectName || projectDetails.projectType || uploadedImage) ? (
                                <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50">

                                    {/* Image / Icon */}
                                    <div className={`relative aspect-square bg-gradient-to-br ${getProjectTypeColor(projectDetails?.projectType || 'Other')} rounded-xl mb-4 overflow-hidden flex items-center justify-center`}>
                                        {uploadedImage ? (
                                            <img src={uploadedImage as string} alt="Project Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <Leaf className="w-24 h-24 text-white/30" />
                                        )}
                                    </div>

                                    {/* Project Name */}
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {projectDetails.projectName || 'Your Project Name'}
                                    </h3>

                                    {/* Location */}
                                    <p className="text-gray-400 text-sm mb-3">
                                        {projectDetails.location?.country || 'Project Location'}
                                    </p>

                                    {/* Credit Amount */}
                                    {projectDetails.carbonAmount != null && (
                                        <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-400 text-sm">Carbon Credits (tCO2e)</span>
                                                <span className="text-teal-400 font-bold">{projectDetails.carbonAmount}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Verification Standard */}
                                    {projectDetails.verificationStandard && (
                                        <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-2">
                                            <Award className="w-4 h-4 text-teal-400" />
                                            <span className="text-teal-300 text-sm font-medium">{projectDetails.verificationStandard}</span>
                                        </div>
                                    )}

                                    {/* Vintage Year */}
                                    {projectDetails.vintageYear && (
                                        <div className="text-gray-400 text-sm mb-1">
                                            Vintage Year: <span className="text-white">{projectDetails.vintageYear}</span>
                                        </div>
                                    )}

                                    {/* Project Type */}
                                    {projectDetails.projectType && (
                                        <div className="text-gray-400 text-sm mb-1">
                                            Project Type: <span className="text-white">{projectDetails.projectType}</span>
                                        </div>
                                    )}

                                    {/* Optional Description */}
                                    {projectDetails.projectDescription && (
                                        <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                                            {projectDetails.projectDescription}
                                        </p>
                                    )}

                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className="w-32 h-32 bg-gray-700/30 rounded-3xl flex items-center justify-center mb-6">
                                        <FileText className="w-16 h-16 text-gray-500" />
                                    </div>
                                    <p className="text-gray-400 text-center mb-2">Start filling the form</p>
                                    <p className="text-gray-500 text-sm text-center">Your NFT preview will appear here</p>
                                </div>
                            )}
                        </div>

                    )}
                </div>
            </div>
        </div>
    )
}