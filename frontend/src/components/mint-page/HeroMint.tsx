export default function HeroMint() {
    return (
        <div className="relative mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-cyan-600/20 to-blue-600/20 rounded-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_70%)]"></div>

            <div className="relative text-center py-16 px-6">
                <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full px-6 py-2 mb-6">
                    <span className="text-teal-300 font-medium">Blockchain-Verified Carbon Credits</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-6">
                    Mint Carbon Credit NFT
                </h1>
                <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                    Transform your verified environmental projects into tradable digital assets.
                    Create NFTs that represent real-world carbon offset impact.
                </p>
            </div>
        </div>
    )
}