import React from "react";
import { VerificationResult } from "../../types";

type VerificationResultProps = {
    verificationResult: VerificationResult;
    setVerificationResult: React.Dispatch<React.SetStateAction<VerificationResult | null>>;
}

export default function VerifyResult({ verificationResult }: VerificationResultProps) {
    return (
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
    )
}