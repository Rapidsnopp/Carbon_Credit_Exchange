import { Link } from 'react-router-dom';

export default function MyNftCard(nft: any) {
    return (
        <>
            <div className="relative overflow-hidden h-56">
                <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-teal-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-bold text-sm">{nft.credits} Credits</span>
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white truncate">{nft.name}</h3>
                    <span className="bg-gray-700 text-teal-400 text-xs px-2 py-1 rounded-full">
                        {nft.category}
                    </span>
                </div>

                <p className="text-gray-400 text-sm mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {nft.location}
                </p>

                <div className="flex items-center justify-between mb-4 p-3 bg-gray-900/50 rounded-xl">
                    <div>
                        <div className="text-xs text-gray-500">Annual Impact</div>
                        <div className="text-teal-400 font-semibold">{nft.impact}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-500">Price</div>
                        <div className="text-white font-bold">{nft.price} ETH</div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        to={`/nft/${nft.id}`}
                        className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-lg transition-all duration-300 text-center"
                    >
                        View Details
                    </Link>
                    <button
                        className="p-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        title="More options"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div >
        </>
    );
}