import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Globe } from "lucide-react"
import { getProjectCategoriesForHome } from "../../constant/mockData"

type TabKey = 'forest' | 'ocean' | 'renewable';
type ProjectCard = {
    id: number | string;
    title: string;
    location: string;
    image: string;
    credits: number;
    price: string | number;
    impact: string;
}

export default function CategoriesTabs() {
    const [activeTab, setActiveTab] = useState<TabKey>('forest');

    const projectCategories = getProjectCategoriesForHome();
    const navigate = useNavigate();

    const handleViewDetails = (projectId: string | number) => {
        navigate(`/nft/${projectId}`);
    };

    const tabs: { key: TabKey; label: string; emoji: string; activeClass: string }[] = [
        { key: 'forest', label: 'Forest Conservation', emoji: '🌲', activeClass: 'from-teal-500 to-emerald-500 shadow-teal-500/50' },
        { key: 'ocean', label: 'Ocean Protection', emoji: '🌊', activeClass: 'from-cyan-500 to-blue-500 shadow-cyan-500/50' },
        { key: 'renewable', label: 'Renewable Energy', emoji: '⚡', activeClass: 'from-amber-500 to-orange-500 shadow-amber-500/50' },
    ];

    return (
        <section className="py-20 bg-gray-800/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-3">Explore Impact Projects</h2>
                    <p className="text-gray-400 text-lg">Choose from verified projects across different categories</p>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12" role="tablist" aria-label="Project categories">
                    {tabs.map(t => (
                        <button
                            key={t.key}
                            onClick={() => setActiveTab(t.key)}
                            role="tab"
                            aria-selected={activeTab === t.key}
                            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${activeTab === t.key
                                ? `bg-gradient-to-r ${t.activeClass} text-white shadow-lg`
                                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
                                }`}
                        >
                            <span className="mr-2" aria-hidden>{t.emoji}</span>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Project Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {(projectCategories[activeTab] || []).map((project: ProjectCard) => (
                        <div
                            key={project.id}
                            className="group bg-gray-800/50 backdrop-blur-sm rounded-3xl border border-gray-700/50 overflow-hidden hover:border-teal-500/50 transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            <div className="relative overflow-hidden h-56">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                                <div className="absolute top-4 right-4 bg-teal-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <span className="text-white font-bold text-sm">{project.credits} Credits</span>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                                <p className="text-gray-400 mb-4 flex items-center">
                                    <Globe className="w-4 h-4 mr-2" />
                                    {project.location}
                                </p>

                                <div className="flex items-center justify-between mb-4 p-3 bg-gray-900/50 rounded-xl">
                                    <div>
                                        <div className="text-sm text-gray-500">Annual Impact</div>
                                        <div className="text-teal-400 font-semibold">{project.impact}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Price per Credit</div>
                                        <div className="text-white font-bold text-lg">{project.price}</div>
                                    </div>
                                </div>

                                <button onClick={() => handleViewDetails(project.id)} className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}