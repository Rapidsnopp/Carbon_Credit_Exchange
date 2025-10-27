import React, { useEffect, useState } from 'react';
import { CreditCard, Trees, CheckCircle, Cloud } from 'lucide-react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { HomeStats, fetchHomeStats } from '../../services/homeData';
import { AnchorProvider } from '@coral-xyz/anchor';
import { useToast } from '../../contexts/ToastContext';

const defaultStats: HomeStats = {
    totalCredits: 0,
    verifiedProjects: 0,
    treesPreserved: 0,
    co2Offset: 0
};

const ImpactStats = () => {
    const [stats, setStats] = useState<HomeStats>(defaultStats);
    const { connection } = useConnection();
    const wallet = useWallet();
    const { showError }: any = useToast();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (!connection) {
                    throw new Error('Connection not available');
                }

                // Create provider if wallet is connected
                const provider = wallet.connected
                    ? new AnchorProvider(connection, wallet as any, { commitment: 'confirmed' })
                    : null;

                const newStats = await fetchHomeStats(connection, provider);
                setStats(newStats);
            } catch (error) {
                console.error('Error fetching stats:', error);
                showError('Failed to fetch impact statistics');
            }
        };

        fetchStats();
        // Update stats every 30 seconds
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, [connection, wallet, showError]);

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    Our Global Impact
                </h2>
                <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                    Real-time statistics showing our contribution to environmental sustainability
                </p>
            </div>
            <dl className="mt-10 text-center sm:mx-auto sm:grid sm:grid-cols-4 sm:gap-8 border border-cyan-500 py-10 rounded-3xl">
                <div className="flex flex-col">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Total Credits
                    </dt>
                    <dd className="order-1 text-4xl font-extrabold text-emerald-600">
                        <div className="flex justify-center items-center gap-2">
                            <CreditCard className="w-8 h-8" />
                            {stats.totalCredits.toLocaleString()}
                        </div>
                    </dd>
                </div>
                <div className="flex flex-col mt-10 sm:mt-0">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Verified Projects
                    </dt>
                    <dd className="order-1 text-4xl font-extrabold text-emerald-600">
                        <div className="flex justify-center items-center gap-2">
                            <CheckCircle className="w-8 h-8" />
                            {stats.verifiedProjects.toLocaleString()}
                        </div>
                    </dd>
                </div>
                <div className="flex flex-col mt-10 sm:mt-0">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        Trees Preserved
                    </dt>
                    <dd className="order-1 text-4xl font-extrabold text-emerald-600">
                        <div className="flex justify-center items-center gap-2">
                            <Trees className="w-8 h-8" />
                            {stats.treesPreserved.toLocaleString()}
                        </div>
                    </dd>
                </div>
                <div className="flex flex-col mt-10 sm:mt-0">
                    <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">
                        CO₂ Offset (tons)
                    </dt>
                    <dd className="order-1 text-4xl font-extrabold text-emerald-600">
                        <div className="flex justify-center items-center gap-2">
                            <Cloud className="w-8 h-8" />
                            {stats.co2Offset.toLocaleString()}
                        </div>
                    </dd>
                </div>
            </dl>
        </div>
    );
};

export default ImpactStats;