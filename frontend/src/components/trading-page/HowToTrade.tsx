export default function HowToTrade() {
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-white text-center mb-12">How Carbon Credit Trading Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-lg font-bold text-teal-400">1</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 text-center">Select Credits</h3>
                    <p className="text-gray-400 text-sm text-center">
                        Browse verified carbon credit projects and select the ones that align with your sustainability goals.
                    </p>
                </div>
                <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-lg font-bold text-teal-400">2</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 text-center">Trade Securely</h3>
                    <p className="text-gray-400 text-sm text-center">
                        Execute trades using our secure blockchain platform with transparent pricing and instant settlement.
                    </p>
                </div>
                <div className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <span className="text-lg font-bold text-teal-400">3</span>
                    </div>
                    <h3 className="font-bold text-white mb-2 text-center">Track Impact</h3>
                    <p className="text-gray-400 text-sm text-center">
                        Monitor your carbon offset impact and retirement status through our comprehensive dashboard.
                    </p>
                </div>
            </div>
        </div>
    )
}