import { Leaf, Globe, Shield, Award, Users } from 'lucide-react';

export default function MoreInfor() {
    return (<div>
        {/* Why Choose Us */}
        < section className="py-20 bg-gray-900" >
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-3">Why Choose Our Platform</h2>
                    <p className="text-gray-400 text-lg">Leading the future of carbon credit trading</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300">
                        <Shield className="w-12 h-12 text-teal-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Blockchain Security</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Every transaction is secured and verified on the blockchain, ensuring complete transparency and immutability
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
                        <Award className="w-12 h-12 text-cyan-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Verified Projects</h3>
                        <p className="text-gray-400 leading-relaxed">
                            All projects undergo rigorous verification by international standards including Gold Standard and Verra
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                        <Users className="w-12 h-12 text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Join thousands of individuals and organizations committed to creating a sustainable future together
                        </p>
                    </div>
                </div>
            </div>
        </section >

        {/* CTA Section - Enhanced */}
        < section className="relative py-24 overflow-hidden" >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 via-cyan-600/20 to-blue-600/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(20,184,166,0.2),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.2),transparent_50%)]"></div>

            <div className="container mx-auto px-6 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Start Your Climate Action Today
                </h2>
                <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                    Every credit you trade or retire brings us one step closer to a sustainable planet. Join the movement and make your impact count.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <a
                        href="/trading"
                        className="group px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/70 hover:transform hover:scale-105"
                    >
                        Explore Marketplace
                        <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                    <a
                        href="/mint-nft"
                        className="px-10 py-4 bg-gray-800/80 backdrop-blur-sm hover:bg-gray-700 text-white font-bold rounded-xl transition-all duration-300 border-2 border-gray-600 hover:border-teal-500"
                    >
                        Mint Your Credits
                    </a>
                </div>

                <div className="mt-12 flex justify-center items-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-teal-400" />
                        <span>Secure & Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-emerald-400" />
                        <span>Real Impact</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Globe className="w-5 h-5 text-cyan-400" />
                        <span>Global Reach</span>
                    </div>
                </div>
            </div>
        </section >
    </div>
    )
}
