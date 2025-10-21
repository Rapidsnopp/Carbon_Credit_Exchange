import { Leaf, Globe, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Stats } from '../../types';
import { getImpactStats } from "../../services"

export default function ImpactStats() {
    const [stats, setStats] = useState<Stats>({
        totalCredits: 0,
        verifiedProjects: 0,
        treesPreserved: 0,
        co2Offset: 0
    });
    useEffect(() => {
        async function fetchStats() {
            const result = await getImpactStats();
            const data = {
                totalCredits: result?.data?.activeListings ?? 0,
                verifiedProjects: result?.data?.totalMinted ?? 0,
                treesPreserved: result?.data?.treesPreserved ?? 0,
                co2Offset: result?.data?.co2Offset ?? 0
            }
            if (data) setStats(data);
        }
        fetchStats();

        const targetValues: Stats = {
            totalCredits: stats.totalCredits,
            verifiedProjects: stats.verifiedProjects,
            treesPreserved: stats.treesPreserved,
            co2Offset: stats.co2Offset
        };

        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;

        const increment = {
            totalCredits: targetValues.totalCredits / steps,
            verifiedProjects: targetValues.verifiedProjects / steps,
            treesPreserved: targetValues.treesPreserved / steps,
            co2Offset: targetValues.co2Offset / steps
        };

        let currentStep = 0;
        const timer = setInterval(() => {
            setStats(prev => ({
                totalCredits: Math.min(Math.floor(prev.totalCredits + increment.totalCredits), targetValues.totalCredits),
                verifiedProjects: Math.min(Math.floor(prev.verifiedProjects + increment.verifiedProjects), targetValues.verifiedProjects),
                treesPreserved: Math.min(Math.floor(prev.treesPreserved + increment.treesPreserved), targetValues.treesPreserved),
                co2Offset: Math.min(Math.floor(prev.co2Offset + increment.co2Offset), targetValues.co2Offset)
            }));

            currentStep++;
            if (currentStep >= steps) {
                clearInterval(timer);
                setStats(targetValues);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);
    return (
        <section className="relative py-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-cyan-600/10 to-blue-600/10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-3">Real-Time Global Impact</h2>
                    <p className="text-gray-400 text-lg">Together, we're making a measurable difference</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-teal-500/20 rounded-2xl mb-4">
                            <TrendingUp className="w-7 h-7 text-teal-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            {stats.totalCredits.toLocaleString()}
                        </div>
                        <div className="text-gray-400 font-medium">Carbon Credits Traded</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-cyan-500/20 rounded-2xl mb-4">
                            <Award className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            {stats.verifiedProjects.toLocaleString()}
                        </div>
                        <div className="text-gray-400 font-medium">Verified Projects</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-emerald-500/20 rounded-2xl mb-4">
                            <Leaf className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            {stats.treesPreserved.toLocaleString()}
                        </div>
                        <div className="text-gray-400 font-medium">Trees Preserved</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-4">
                            <Globe className="w-7 h-7 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            {stats.co2Offset.toLocaleString()}
                        </div>
                        <div className="text-gray-400 font-medium">CO₂ Tons Offset</div>
                    </div>
                </div>
            </div>
        </section>
    )
}