import { Leaf, Globe, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Stats } from '../../types';
import { getImpactStats } from '../../services';

export default function ImpactStats() {
    const [stats, setStats] = useState<Stats>({
        totalCredits: 0,
        verifiedProjects: 0,
        treesPreserved: 0,
        co2Offset: 0,
    });

    useEffect(() => {
        let timers: Array<number | ReturnType<typeof setInterval>> = [];

        const animateValue = (
            start: number,
            end: number,
            duration: number,
            onUpdate: (val: number) => void
        ) => {
            const range = end - start;
            if (range === 0) {
                onUpdate(end);
                return null;
            }
            const stepTime = Math.max(Math.floor(duration / Math.abs(range)), 16);
            let current = start;
            const increment = range > 0 ? 1 : -1;

            const timer = setInterval(() => {
                current += increment;
                onUpdate(current);
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    clearInterval(timer);
                }
            }, stepTime);

            return timer;
        };

        const fetchAndAnimate = async () => {
            try {
                const response = await getImpactStats();
                const data = response?.data ?? {};

                // Map backend fields to UI counters with sensible fallbacks
                const totalCredits = Number(data.activeListings ?? data.totalMinted ?? 0);
                const verifiedProjects = Number(data.totalMinted ?? data.activeListings ?? 0);
                const treesPreserved = Number(data.treesPreserved ?? totalCredits * 150);
                const co2Offset = Number(data.co2Offset ?? totalCredits * 10);

                // Animate each counter
                timers.push(
                    animateValue(0, totalCredits, 1800, (val) => setStats((s: Stats) => ({ ...s, totalCredits: val }))) as any
                );
                timers.push(
                    animateValue(0, verifiedProjects, 1800, (val) => setStats((s: Stats) => ({ ...s, verifiedProjects: val }))) as any
                );
                timers.push(
                    animateValue(0, treesPreserved, 1800, (val) => setStats((s: Stats) => ({ ...s, treesPreserved: val }))) as any
                );
                timers.push(
                    animateValue(0, co2Offset, 1800, (val) => setStats((s: Stats) => ({ ...s, co2Offset: val }))) as any
                );
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                // Leave defaults as-is on error
            }
        };

        fetchAndAnimate();

        return () => timers.forEach((t) => t && clearInterval(t as any));
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
                        <div className="text-4xl font-bold text-white mb-2">{stats.totalCredits.toLocaleString()}</div>
                        <div className="text-gray-400 font-medium">Carbon Credits Traded</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-cyan-500/20 rounded-2xl mb-4">
                            <Award className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">{stats.verifiedProjects.toLocaleString()}</div>
                        <div className="text-gray-400 font-medium">Verified Projects</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-emerald-500/20 rounded-2xl mb-4">
                            <Leaf className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">{stats.treesPreserved.toLocaleString()}</div>
                        <div className="text-gray-400 font-medium">Trees Preserved</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-4">
                            <Globe className="w-7 h-7 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">{stats.co2Offset.toLocaleString()}</div>
                        <div className="text-gray-400 font-medium">CO₂ Tons Offset</div>
                    </div>
                </div>
            </div>
        </section>
    );
}