import FloatingCard from './FloatingCard';
import { useState, useRef } from 'react';

type Card = {
    image: string;
    title: string;
    location: string;
    credits: string;
    year: string;
    size: 'sm' | 'md' | 'lg';
    delay: number;
};

const cards: Card[] = [
    {
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80',
        title: 'ForestForFuture',
        location: 'Afforestation, Brazil',
        credits: '76',
        year: '2022',
        size: 'lg',
        delay: 0
    },
    {
        image: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=400&q=80',
        title: 'ForestForFuture',
        location: 'Afforestation, Brazil',
        credits: '76',
        year: '2022',
        size: 'md',
        delay: 1
    },
    {
        image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400&q=80',
        title: 'ForestForFuture',
        location: 'Afforestation, Brazil',
        credits: '220',
        year: '2022',
        size: 'sm',
        delay: 2
    },
    {
        image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=400&q=80',
        title: 'OceanGuardian',
        location: 'Marine Conservation, Australia',
        credits: '150',
        year: '2023',
        size: 'md',
        delay: 0.5
    },
    {
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=80',
        title: 'MountainShield',
        location: 'Mountain Preservation, Nepal',
        credits: '95',
        year: '2023',
        size: 'lg',
        delay: 1.5
    }
];


// Part 2: Images with cards (shorter height, ensure background image displays)
export default function ImageCardSection() {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = scrollRef.current;
        if (!el) return;
        setIsDragging(true);
        const pageX = (e.nativeEvent as MouseEvent).pageX;
        setStartX(pageX - (el as HTMLElement).offsetLeft);
        setScrollLeft((el as HTMLElement).scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const el = scrollRef.current as HTMLElement;
        const pageX = (e.nativeEvent as MouseEvent).pageX;
        const x = pageX - el.offsetLeft;
        const walk = (x - startX) * 2;
        el.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <section className="relative min-h-[60vh] bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
            {/* Background Image Layer with rounded corners */}
            <div
                className="absolute inset-0 z-10 bg-cover bg-center opacity-50 rounded-b-[40px]"
                style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            ></div>

            {/* Dark Overlay with rounded corners */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80 rounded-b-[40px]"></div>

            {/* Floating Cards Container */}
            <div
                ref={scrollRef}
                className="absolute inset-0 z-30 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div className="relative min-w-max h-full px-20">
                    <div className="absolute top-[35%] left-20 z-10">
                        <FloatingCard {...cards[2]} />
                    </div>
                    <div className="absolute top-[40%] left-[40%] z-20">
                        <FloatingCard {...cards[0]} />
                    </div>
                    <div className="absolute top-[30%] right-[25%] z-10">
                        <FloatingCard {...cards[1]} />
                    </div>
                    <div className="absolute top-[45%] right-32 z-20">
                        <FloatingCard {...cards[4]} />
                    </div>
                </div>
            </div>
        </section>
    );
}