// Part 3: Remaining content without images (unchanged)
export default function InfoSection() {
    return (
        <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-black py-20">
            <div className="relative container mx-auto px-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-12 text-center tracking-tight">
                    <span className="text-gray-200">TO DRIVE A </span>
                    <span className="text-teal-400">CARBON-NEUTRAL</span>
                    <br />
                    <span className="text-gray-200">FUTURE THROUGH TRANSPARENT</span>
                    <br />
                    <span className="text-gray-200">ACCESSIBLE </span>
                    <span className="text-teal-400">BLOCKCHAIN</span>
                    <span className="text-gray-200"> INNOVATIONS</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
                    <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🌍</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Transparent Trading</h3>
                        <p className="text-gray-400">Every transaction is recorded on blockchain, ensuring complete transparency and traceability.</p>
                    </div>

                    <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">⚡</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Instant Access</h3>
                        <p className="text-gray-400">Buy, trade, or retire carbon credits in seconds with our streamlined platform.</p>
                    </div>

                    <div className="bg-gray-800/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
                        <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl">🔒</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Secure & Verified</h3>
                        <p className="text-gray-400">All credits are verified and secured through blockchain technology.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}