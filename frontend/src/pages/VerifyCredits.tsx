import React, { useState } from 'react';
import Header from '../components/Header';

type VerificationResult = {
  id: string;
  isValid: boolean;
  project: string;
  location: string;
  credits: number;
  vintage: string;
  standard: string;
  issuedDate: string;
  status: 'Active' | 'Retired' | string;
  blockchain?: string;
  transactionHash?: string;
};

const VerifyCredits: React.FC = () => {
  const [creditId, setCreditId] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditId.trim()) return;

    setIsLoading(true);

    // Simulate API call to verify credit
    setTimeout(() => {
      // Mock verification result - in a real app, this would come from an API
      const mockResult = {
        id: creditId,
        isValid: Math.random() > 0.3, // 70% chance of being valid for demo
        project: 'ForestForFuture',
        location: 'Afforestation, Brazil',
        credits: Math.floor(Math.random() * 100) + 50,
        vintage: '2022',
        standard: 'VCS',
        issuedDate: '2022-06-15',
        status: Math.random() > 0.2 ? 'Active' : 'Retired',
        blockchain: 'Polygon',
        transactionHash: '0x' + Math.random().toString(16).substr(2, 40)
      };

      setVerificationResult(mockResult);
      setIsLoading(false);
    }, 1500);
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
              Authenticate and verify the legitimacy of carbon credits using blockchain technology
            </p>
          </div>

          {/* Verification Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-12">
            <form onSubmit={handleVerification}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <label htmlFor="creditId" className="block text-sm font-medium text-gray-300 mb-2">
                    Enter Carbon Credit ID
                  </label>
                  <input
                    type="text"
                    id="creditId"
                    value={creditId}
                    onChange={(e) => setCreditId(e.target.value)}
                    placeholder="Enter credit ID or transaction hash"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={isLoading || !creditId.trim()}
                    className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium transition-colors ${isLoading || !creditId.trim()
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
            <div className={`rounded-2xl border p-6 mb-8 transition-all duration-300 ${verificationResult.isValid
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
              }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${verificationResult.isValid ? 'bg-green-500/20' : 'bg-red-500/20'
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${verificationResult.status === 'Active'
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
                    <span className="text-gray-400">Blockchain</span>
                    <span className="text-white font-medium">{verificationResult.blockchain}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Issued Date</span>
                    <span className="text-white font-medium">{verificationResult.issuedDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-700 pb-2">
                    <span className="text-gray-400">Transaction</span>
                    <div className="text-right">
                      <p className="text-white font-mono text-sm truncate max-w-[150px]">{verificationResult.transactionHash}</p>
                    </div>
                  </div>
                </div>
              </div>
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