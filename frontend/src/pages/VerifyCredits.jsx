import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import Header from '../components/layout/Header';
import api from '../services/api';

const VerifyCredits = () => {
  const { addToast } = useToast();
  const [creditId, setCreditId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!creditId.trim()) {
      addToast('Please enter a mint address', 'warning');
      return;
    }
    
    setIsLoading(true);
    setVerificationResult(null);
    
    try {
      // Call real API to verify carbon credit
      console.log('🚀 Calling verify API with mint:', creditId.trim());
      const response = await api.verifyCarbonCredit(creditId.trim());
      
      console.log('📥 Raw response:', response);
      
      if (response.success && response.data) {
        const { data } = response;
        
        console.log('✅ Verification response:', data);
        console.log('📦 Metadata:', data.metadata);
        console.log('💾 DB Data:', data.dbData);
        console.log('🔍 Debug values:');
        console.log('  - metadata.projectName:', data.metadata?.projectName);
        console.log('  - metadata.name:', data.metadata?.name);
        console.log('  - metadata.location:', data.metadata?.location);
        console.log('  - metadata.carbonAmount:', data.metadata?.carbonAmount);
        console.log('  - metadata.verificationStandard:', data.metadata?.verificationStandard);
        console.log('  - metadata.projectType:', data.metadata?.projectType);
        console.log('  - metadata.verifier:', data.metadata?.verifier);
        console.log('  - metadata.validator:', data.metadata?.validator);
        console.log('  - metadata.attributes:', data.metadata?.attributes);
        console.log('  - dbData?.projectName:', data.dbData?.projectName);
        console.log('  - dbData?.location:', data.dbData?.location);
        console.log('  - dbData?.carbonAmount:', data.dbData?.carbonAmount);
        
        // Transform backend data to UI format
        // Backend already merged data into metadata object, so prioritize metadata
        const result = {
          id: data.mint,
          isValid: data.isValid,
          // Backend merged data is in metadata.projectName (not metadata.name)
          project: data.metadata?.projectName || 
                  data.metadata?.name || 
                  data.dbData?.projectName || 
                  'Unknown Project',
          // Backend already formatted location to string
          location: data.metadata?.location || 
                   data.dbData?.location?.country ||
                   data.metadata?.attributes?.find(a => a.trait_type === 'Country')?.value || 
                   'Unknown',
          // Backend merged carbonAmount into metadata
          credits: data.metadata?.carbonAmount || 
                  data.metadata?.credits ||
                  data.dbData?.carbonAmount ||
                  data.metadata?.attributes?.find(a => a.trait_type === 'Amount')?.value || 
                  0,
          vintage: data.metadata?.vintageYear || 
                  data.metadata?.vintage ||
                  data.dbData?.vintageYear ||
                  data.metadata?.attributes?.find(a => a.trait_type === 'Vintage Year')?.value || 
                  'N/A',
          standard: (data.metadata?.verificationStandard || 
                   data.dbData?.verificationStandard ||
                   data.metadata?.attributes?.find(a => a.trait_type === 'Standard')?.value || 
                   'N/A').toUpperCase(), // Uppercase for consistency
          projectType: data.metadata?.projectType || 
                      data.dbData?.projectType ||
                      data.metadata?.attributes?.find(a => a.trait_type === 'Project Type')?.value || 
                      'N/A',
          validator: data.metadata?.verifier || // From MongoDB verificationDetails.verifier (new NFTs)
                    data.metadata?.validator || // Fallback to old field
                    data.metadata?.attributes?.find(a => a.trait_type === 'Validator')?.value || 
                    data.metadata?.attributes?.find(a => a.trait_type === 'Certification Body')?.value || // Support old NFTs
                    'N/A',
          // Additional DB data
          projectDescription: data.metadata?.projectDescription || data.dbData?.projectDescription || '',
          // Real blockchain info
          blockchain: 'Solana',
          network: 'Devnet',
          issuedDate: new Date(data.verifiedAt).toLocaleDateString() || 'N/A',
          status: data.retirement ? 'Retired' : (data.listing ? 'Active' : 'Minted'),
          transactionHash: data.mint, // Use mint address as transaction identifier
          // Additional info
          isListed: !!data.listing,
          isRetired: !!data.retirement,
          listingPrice: data.listing?.price ? (parseFloat(data.listing.price) / 1e9).toFixed(3) : null,
          verifiedAt: data.verifiedAt
        };
        
        console.log('📊 Formatted result:', result);
        console.log('🔍 Validator value chain:');
        console.log('  1. metadata.verifier:', data.metadata?.verifier);
        console.log('  2. metadata.validator:', data.metadata?.validator);
        console.log('  3. attributes.Validator:', data.metadata?.attributes?.find(a => a.trait_type === 'Validator')?.value);
        console.log('  4. attributes.Certification Body:', data.metadata?.attributes?.find(a => a.trait_type === 'Certification Body')?.value);
        console.log('  → Final validator:', result.validator);
        
        setVerificationResult(result);
        
        if (data.isValid) {
          addToast('✅ Carbon credit verified successfully!', 'success');
        } else {
          addToast('⚠️ Could not verify this carbon credit', 'warning');
        }
      } else {
        addToast(response.error || 'Verification failed', 'error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      addToast(error.message || 'Failed to verify. Please check the mint address and try again.', 'error');
      
      // Set error result
      setVerificationResult({
        id: creditId,
        isValid: false,
        project: 'Verification Failed',
        location: 'N/A',
        credits: 0,
        vintage: 'N/A',
        standard: 'N/A',
        blockchain: 'Solana',
        issuedDate: 'N/A',
        status: 'Error',
        transactionHash: creditId
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Verify Carbon Credits
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Authenticate and verify the legitimacy of carbon credit NFTs on Solana blockchain
            </p>
          </div>

          {/* Verification Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-12">
            <form onSubmit={handleVerification}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="creditId" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter NFT Mint Address
                  </label>
                  <input
                    type="text"
                    id="creditId"
                    value={creditId}
                    onChange={(e) => setCreditId(e.target.value)}
                    placeholder="Enter NFT mint address (e.g., 7Xw9Y3Z4V5N6M7K8...)"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isLoading || !creditId.trim()}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${
                      isLoading || !creditId.trim()
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-teal-500 hover:bg-teal-600 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      'Verify Credit'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`rounded-2xl border p-6 mb-8 transition-all duration-300 ${
              verificationResult.isValid 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    verificationResult.isValid ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {verificationResult.isValid ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {verificationResult.isValid ? 'Verification Successful' : 'Verification Failed'}
                    </h3>
                    <p className="text-gray-400">
                      Credit ID: {verificationResult.id}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  verificationResult.status === 'Active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {verificationResult.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Project</span>
                    <span className="text-white font-medium">{verificationResult.project}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white font-medium">{verificationResult.location}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Credits</span>
                    <span className="text-white font-medium">{verificationResult.credits}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Vintage</span>
                    <span className="text-white font-medium">{verificationResult.vintage}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Standard</span>
                    <span className="text-white font-medium">{verificationResult.standard}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Validator</span>
                    <span className="text-white font-medium">{verificationResult.validator}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Project Type</span>
                    <span className="text-white font-medium">{verificationResult.projectType}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Network</span>
                    <span className="text-white font-medium">
                      {verificationResult.blockchain} {verificationResult.network && `(${verificationResult.network})`}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Project Description */}
              {verificationResult.projectDescription && (
                <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                  <h4 className="text-gray-400 text-sm font-medium mb-2">Project Description</h4>
                  <p className="text-white text-sm leading-relaxed">{verificationResult.projectDescription}</p>
                </div>
              )}
              
              {/* Mint Address Display */}
              <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Mint Address:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-teal-400 font-mono text-xs">
                      {verificationResult.transactionHash.slice(0, 8)}...{verificationResult.transactionHash.slice(-8)}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(verificationResult.transactionHash);
                        addToast('Mint address copied!', 'success');
                      }}
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                      title="Copy mint address"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                      </svg>
                    </button>
                    <a
                      href={`https://explorer.solana.com/address/${verificationResult.transactionHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-teal-400 transition-colors"
                      title="View on Solana Explorer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Additional Status Info */}
              {verificationResult.isListed && verificationResult.listingPrice && (
                <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                    <span className="text-blue-400 font-medium">Listed on Marketplace</span>
                    <span className="ml-auto text-white font-bold">{verificationResult.listingPrice} SOL</span>
                  </div>
                </div>
              )}
              
              {verificationResult.isRetired && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <span className="text-red-400 font-medium">This credit has been retired (cannot be traded)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Blockchain Verification</h3>
              <p className="text-gray-400 text-sm">
                All carbon credits are verified on the blockchain ensuring transparency and immutability.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-time Validation</h3>
              <p className="text-gray-400 text-sm">
                Instant validation of carbon credit authenticity and ownership status.
              </p>
            </div>

            <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
              <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Certified Projects</h3>
              <p className="text-gray-400 text-sm">
                Only verified and certified carbon offset projects are included in our system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCredits;