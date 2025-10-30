// Part 1: Large text with buttons (full width text)
export default function HeroTextSection() {
    return (
        <section className="relative bg-gradient-to-b from-gray-900 to-gray-900 overflow-hidden pt-24 pb-20"> {/* Added pt-24 to account for fixed header */}
            <div className="relative z-0 container mx-auto px-6">
                <div className="max-w-full"> {/* Changed from max-w-6xl to max-w-full */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight text-wrap">
                        <span className="text-gray-100">BUILDING A </span>
                        <span className="text-teal-400">CARBON-NEUTRAL WORLD WITH BLOCKCHAIN</span>
                    </h1>

                    <p className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed">
                        With verdeX, anyone—from individuals to businesses—can buy, trade, or retire carbon credits
                        in just a few clicks. Thanks to blockchain and fractional ownership, every action is transparent,
                        secure, and trackable in real time. Join the waitlist today or follow your sustainability journey on X.
                    </p>

                    {/* <div className="flex gap-4">
            <button className="px-8 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-300">
              Join Waitlist
            </button>
            <button className="px-8 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 font-medium rounded-lg transition-all duration-300">
              Join Journey
            </button>
          </div> */}
                </div>
            </div>
        </section>
    )
};