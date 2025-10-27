import { Leaf, Globe, TrendingUp, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Stats } from '../../types';
import api from '../../lib/axios'; 

// Hàm helper cho hiệu ứng đếm số
const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
  if (start === end) {
    setter(end);
    return;
  }
  const range = end - start;
  const steps = 60;
  const intervalTime = duration / steps;
  const increment = range / steps;
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
      clearInterval(timer);
      setter(end);
    } else {
      setter(Math.floor(current));
    }
  }, intervalTime);
  return timer;
};

export default function ImpactStats() {
    const [stats, setStats] = useState<Stats>({
        totalCredits: 0,
        verifiedProjects: 0,
        treesPreserved: 0,
        co2Offset: 0
    });

    // BƯỚC 2: Viết lại useEffect để gọi API
    useEffect(() => {
        const fetchStats = async () => {
          try {
            // Gọi API backend
            const response = await api.get('/carbon-credits/stats');

            if (response.data.success) {
              const data = response.data.data;
              
              // Lấy data thật từ API
              const targetValues = {
                  totalCredits: parseInt(data.totalMinted) || 0,
                  verifiedProjects: parseInt(data.activeListings) || 0, // Tạm dùng activeListings
                  treesPreserved: (parseInt(data.totalMinted) || 0) * 150, // Giả lập data
                  co2Offset: (parseInt(data.totalMinted) || 0) * 10 // Giả lập data
              };
              
              // Chạy hiệu ứng đếm
              const timers = [
                animateValue(0, targetValues.totalCredits, 2000, (val) => setStats(s => ({ ...s, totalCredits: val }))),
                animateValue(0, targetValues.verifiedProjects, 2000, (val) => setStats(s => ({ ...s, verifiedProjects: val }))),
                animateValue(0, targetValues.treesPreserved, 2000, (val) => setStats(s => ({ ...s, treesPreserved: val }))),
                animateValue(0, targetValues.co2Offset, 2000, (val) => setStats(s => ({ ...s, co2Offset: val })))
              ];

              return () => timers.forEach(timer => timer && clearInterval(timer));
            }
          } catch (error) {
            console.error("Failed to fetch stats:", error);
            // Có thể set giá trị mặc định nếu lỗi
          }
        };

        const cleanup = fetchStats();

        return () => {
          cleanup.then(cleanupFn => cleanupFn && cleanupFn());
        };
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
                            {stats.totalCredits.toLocaleString()}+
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
                            {stats.treesPreserved.toLocaleString()}+
                        </div>
                        <div className="text-gray-400 font-medium">Trees Preserved</div>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="flex items-center justify-center w-14 h-14 bg-blue-500/20 rounded-2xl mb-4">
                            <Globe className="w-7 h-7 text-blue-400" />
                        </div>
                        <div className="text-4xl font-bold text-white mb-2">
                            {stats.co2Offset.toLocaleString()}+
                        </div>
                        <div className="text-gray-400 font-medium">CO₂ Tons Offset</div>
                    </div>
                </div>
            </div>
        </section>
    )
}