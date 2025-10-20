export default function VerifyInfor() {
    return (
        <div>
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
    )
}