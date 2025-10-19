export default function HowItWorks() {
    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-3">Your Journey to Impact</h2>
                    <p className="text-gray-400 text-lg">Three simple steps to start making a difference</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Timeline Line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 transform -translate-y-1/2"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="relative">
                            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 backdrop-blur-sm p-8 rounded-3xl border border-teal-500/30 hover:border-teal-500/50 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-teal-500/50">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 text-center">Connect Wallet</h3>
                                <p className="text-gray-400 text-center leading-relaxed">
                                    Securely link your Web3 wallet to access the world's most transparent carbon credit marketplace
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm p-8 rounded-3xl border border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-cyan-500/50">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 text-center">Explore Projects</h3>
                                <p className="text-gray-400 text-center leading-relaxed">
                                    Browse verified environmental projects with real-time impact data and full documentation
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm p-8 rounded-3xl border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300">
                                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mb-6 mx-auto shadow-lg shadow-blue-500/50">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4 text-center">Take Action</h3>
                                <p className="text-gray-400 text-center leading-relaxed">
                                    Buy, trade, or retire carbon credits instantly on our blockchain-powered platform
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}