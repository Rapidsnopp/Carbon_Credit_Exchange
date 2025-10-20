import React, { useState } from 'react';
import { VerificationResult } from "../types"
import VerifyInfor from '../components/verify-page/VerifyInfor';
import VerifyResult from '../components/verify-page/VerifyResult';

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
            <VerifyResult verificationResult={verificationResult} setVerificationResult={setVerificationResult} />
          )}

          {/* Information Section */}
          <VerifyInfor />
        </div>
      </div>
    </div>
  );
};

export default VerifyCredits;