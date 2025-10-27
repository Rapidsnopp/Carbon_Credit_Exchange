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
            const response = await api.get('/api/carbon-credits/stats');

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
          {/* ... (UI) ... */}
        </section>
    )
}