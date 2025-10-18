import React, { useState } from 'react';
import Header from '../components/Header';
import { Upload, FileText, CheckCircle, Sparkles, Shield, Award, Leaf } from 'lucide-react';

type ProjectDetails = {
  projectName: string;
  projectLocation: string;
  projectType: string;
  creditAmount: string | number;
  creditStandard: string;
  certificationBody: string;
  verificationDate: string;
  description: string;
};

type MintedNFT = {
  id: number | string;
  name: string;
  tokenId: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
};

const MintNFT: React.FC = () => {
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsMinting(true);

    setTimeout(() => {
      const mockNFT = {
        id: Math.floor(Math.random() * 10000),
        name: projectDetails.projectName,
        tokenId: `CC-${Date.now()}`,
        image: uploadedImage || 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
        attributes: [
          { trait_type: 'Project Name', value: projectDetails.projectName },
          { trait_type: 'Location', value: projectDetails.projectLocation },
          { trait_type: 'Type', value: projectDetails.projectType },
          { trait_type: 'Credits', value: projectDetails.creditAmount },
          { trait_type: 'Standard', value: projectDetails.creditStandard },
          { trait_type: 'Certification Body', value: projectDetails.certificationBody },
          { trait_type: 'Verification Date', value: projectDetails.verificationDate }
        ]
      };

      setMintedNFT(mockNFT);
      setIsMinting(false);
    }, 3000);
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-7xl">
          {/* Hero Header Section */}
          <div className="relative mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-cyan-600/20 to-blue-600/20 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_70%)]"></div>

            <div className="relative text-center py-16 px-6">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-2 mb-6">
                <span className="text-teal-300 font-medium">Blockchain-Verified Carbon Credits</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                Mint Carbon Credit NFT
              </h1>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                Transform your verified environmental projects into tradable digital assets.
                Create NFTs that represent real-world carbon offset impact.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Minting Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/50">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Project Details</h2>
                    <p className="text-gray-400 text-sm">Fill in your carbon credit information</p>
                  </div>
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
                          className="flex flex-col items-center justify-center w-full h-48 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer hover:bg-gray-700/50 hover:border-teal-500/50 transition-all duration-300"
                        >
                          {uploadedImage ? (
                            <img src={uploadedImage as string} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <div className="text-center">
                              <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                              <p className="text-gray-400 mb-1">Click to upload project image</p>
                              <p className="text-gray-500 text-xs">PNG, JPG up to 10MB</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          name="projectName"
                          value={projectDetails.projectName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="e.g., Amazon Forest Protection"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Project Location *
                        </label>
                        <input
                          type="text"
                          name="projectLocation"
                          value={projectDetails.projectLocation}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="e.g., Brazil, South America"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Project Type *
                        </label>
                        <select
                          name="projectType"
                          value={projectDetails.projectType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select project type</option>
                          <option value="afforestation">🌲 Afforestation</option>
                          <option value="reforestation">🌳 Reforestation</option>
                          <option value="renewable-energy">⚡ Renewable Energy</option>
                          <option value="maritime">🌊 Marine Conservation</option>
                          <option value="other">📦 Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Credit Amount *
                        </label>
                        <input
                          type="number"
                          name="creditAmount"
                          value={projectDetails.creditAmount}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                          placeholder="e.g., 1000"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Credit Standard *
                        </label>
                        <select
                          name="creditStandard"
                          value={projectDetails.creditStandard}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        >
                          <option value="">Select standard</option>
                          <option value="vcs">VCS (Verified Carbon Standard)</option>
                          <option value="ccp">CCP (Climate Community)</option>
                          <option value="gold">Gold Standard</option>
                          <option value="ccbs">CCB Standard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                          Verification Date *
                        </label>
                        <input
                          type="date"
                          name="verificationDate"
                          value={projectDetails.verificationDate}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Certification Body *
                      </label>
                      <input
                        type="text"
                        name="certificationBody"
                        value={projectDetails.certificationBody}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        placeholder="e.g., Verra Registry"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Project Description
                      </label>
                      <textarea
                        name="description"
                        value={projectDetails.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none"
                        placeholder="Describe the environmental impact and goals of this project..."
                      ></textarea>
                    </div>

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
            </div>

            {/* Preview/Result Section - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
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
                            projectName: '',
                            projectLocation: '',
                            projectType: '',
                            creditAmount: '',
                            creditStandard: '',
                            certificationBody: '',
                            verificationDate: '',
                            description: ''
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
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Live Preview</h2>
                        <p className="text-gray-400 text-sm">See your NFT as you create it</p>
                      </div>
                    </div>

                    {projectDetails.projectName || projectDetails.projectType || uploadedImage ? (
                      <div className="bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/50">
                        <div className={`relative aspect-square bg-gradient-to-br ${getProjectTypeColor(projectDetails.projectType)} rounded-xl mb-4 overflow-hidden flex items-center justify-center`}>
                          {uploadedImage ? (
                            <img src={uploadedImage as string} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <Leaf className="w-24 h-24 text-white/30" />
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          {projectDetails.projectName || 'Your Project Name'}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">
                          {projectDetails.projectLocation || 'Project Location'}
                        </p>

                        {projectDetails.creditAmount && (
                          <div className="bg-gray-900/50 rounded-lg p-3 mb-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm">Carbon Credits</span>
                              <span className="text-teal-400 font-bold">{projectDetails.creditAmount}</span>
                            </div>
                          </div>
                        )}

                        {projectDetails.creditStandard && (
                          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2">
                            <Award className="w-4 h-4 text-teal-400" />
                            <span className="text-teal-300 text-sm font-medium">{projectDetails.creditStandard}</span>
                          </div>
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

          {/* How Minting Works */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">How NFT Minting Works</h2>
              <p className="text-gray-400 text-lg">A simple 4-step process to tokenize your carbon credits</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-teal-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Verification</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Ensure your carbon offset project meets international standards and certification requirements
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/50 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Submission</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Submit comprehensive project details, verification documents, and impact metrics
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Creation</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Mint your verified credits as immutable, blockchain-secured NFT tokens
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Trading</h3>
                  <p className="text-gray-400 leading-relaxed">
                    List and trade your carbon credits on our decentralized marketplace instantly
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-20 bg-gradient-to-br from-teal-600/10 via-cyan-600/10 to-blue-600/10 rounded-3xl p-12 border border-teal-500/20">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Mint Carbon Credit NFTs?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Immutable Proof</h3>
                <p className="text-gray-400">Blockchain technology ensures permanent, tamper-proof verification of your carbon offset achievements</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Global Trading</h3>
                <p className="text-gray-400">Access a worldwide marketplace to trade credits instantly with buyers around the globe</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Real Impact</h3>
                <p className="text-gray-400">Every NFT represents verified environmental action with measurable, transparent results</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;