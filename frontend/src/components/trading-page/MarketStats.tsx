import { getMarketStats } from "../../constant/mockData"

export default function MarketStats() {
    const marketData = getMarketStats();

    return (
        < div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 my-6 " >
            <h3 className="font-bold text-white text-lg mb-4">Market Overview</h3>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-400">Total Volume</span>
                    <span className="text-white">{marketData.totalVolume} ETH</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">24h Change</span>
                    <span className={marketData.change24h >= 0 ? 'text-green-400' : 'text-red-400'}>
                        {marketData.change24h >= 0 ? '+' : ''}{marketData.change24h}%
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Active Trades</span>
                    <span className="text-white">{marketData.activeTrades}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">Avg. Price</span>
                    <span className="text-white">{marketData.avgPrice} ETH</span>
                </div>
            </div>
        </div >
    )
}