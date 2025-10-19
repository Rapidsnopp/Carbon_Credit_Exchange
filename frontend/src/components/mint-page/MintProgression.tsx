import { FileText, Sparkles, Shield, Award, Leaf } from 'lucide-react';

export default function MintProgression() {
    return (
        <div>
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
    )
}