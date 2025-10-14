import React, { useState } from 'react';
import Header from '../components/Header';

const MintNFT = () => {
  const [projectDetails, setProjectDetails] = useState({
    projectName: '',
    projectLocation: '',
    projectType: '',
    creditAmount: '',
    creditStandard: '',
    certificationBody: '',
    verificationDate: '',
    description: ''
  });

  const [isMinting, setIsMinting] = useState(false);
  const [mintedNFT, setMintedNFT] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMint = async (e) => {
    e.preventDefault();
    setIsMinting(true);

    // Simulate minting process
    setTimeout(() => {
      const mockNFT = {
        id: Math.floor(Math.random() * 10000),
        name: projectDetails.projectName,
        tokenId: `CC-${Date.now()}`,
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mint Carbon Credit NFT
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Create and tokenize verified carbon credits as NFTs on the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Minting Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Project Details</h2>
              
              <form onSubmit={handleMint}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={projectDetails.projectName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Location
                    </label>
                    <input
                      type="text"
                      name="projectLocation"
                      value={projectDetails.projectLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter project location"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={projectDetails.projectType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      <option value="afforestation">Afforestation</option>
                      <option value="reforestation">Reforestation</option>
                      <option value="renewable-energy">Renewable Energy</option>
                      <option value="maritime">Marine Conservation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credit Amount
                    </label>
                    <input
                      type="number"
                      name="creditAmount"
                      value={projectDetails.creditAmount}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter number of credits"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Credit Standard
                    </label>
                    <select
                      name="creditStandard"
                      value={projectDetails.creditStandard}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select credit standard</option>
                      <option value="vcs">VCS (Verified Carbon Standard)</option>
                      <option value="ccp">CCP (Climate Community & Biodiversity)</option>
                      <option value="gold">Gold Standard</option>
                      <option value="ccbs">CCB Standard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Certification Body
                    </label>
                    <input
                      type="text"
                      name="certificationBody"
                      value={projectDetails.certificationBody}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Enter certification body name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Verification Date
                    </label>
                    <input
                      type="date"
                      name="verificationDate"
                      value={projectDetails.verificationDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Description
                    </label>
                    <textarea
                      name="description"
                      value={projectDetails.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Describe the environmental impact of this project"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isMinting}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                      isMinting
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                  >
                    {isMinting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Minting NFT...
                      </span>
                    ) : (
                      'Mint Carbon Credit NFT'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preview/Result Section */}
            <div>
              {mintedNFT ? (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">NFT Minted Successfully!</h2>
                    <p className="text-gray-400">Your carbon credit has been tokenized on the blockchain</p>
                  </div>

                  <div className="bg-gray-700/50 rounded-xl p-6 mb-6">
                    <div className="aspect-square bg-gray-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={mintedNFT.image} 
                        alt={mintedNFT.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{mintedNFT.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">Token ID: {mintedNFT.tokenId}</p>
                    
                    <div className="space-y-2">
                      {mintedNFT.attributes.map((attr, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">{attr.trait_type}:</span>
                          <span className="text-white">{attr.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors">
                      View on Marketplace
                    </button>
                    <button className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                      Download Certificate
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 h-full flex flex-col">
                  <h2 className="text-2xl font-bold text-white mb-6">NFT Preview</h2>
                  
                  <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                        </svg>
                      </div>
                      <p className="text-gray-400">Fill in project details to see NFT preview</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* How Minting Works */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How NFT Minting Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">1</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Project Verification</h3>
                <p className="text-gray-400 text-xs text-center">
                  Verify your carbon offset project meets international standards
                </p>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">2</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Data Submission</h3>
                <p className="text-gray-400 text-xs text-center">
                  Submit project details and verification documents
                </p>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">3</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">NFT Creation</h3>
                <p className="text-gray-400 text-xs text-center">
                  Mint your verified credits as blockchain-secured NFTs
                </p>
              </div>
              <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-lg">4</span>
                </div>
                <h3 className="font-bold text-white mb-2 text-center">Market Trading</h3>
                <p className="text-gray-400 text-xs text-center">
                  Trade your carbon credits on our decentralized marketplace
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MintNFT;