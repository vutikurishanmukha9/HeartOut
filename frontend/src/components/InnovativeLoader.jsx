import React, { useState, useEffect } from 'react';

/**
 * InnovativeLoader
 * Bespoke sanctuary loading experience for HeartOut.
 * Replaces the generic heart clip-art with the authentic HeartOut brand flame emblem,
 * ethereal ambient aura, floating story cards, rotating literary reflections, and warm glowing progress.
 */

const inspirationalQuotes = [
    "Every story matters…",
    "Your voice deserves to be heard…",
    "Connecting hearts in a safe space…",
    "Where reflections become healing…",
    "Share what you could never say out loud…",
];

const FloatingCard = ({ delay, position }) => (
    <div
        className="absolute opacity-25 pointer-events-none select-none"
        style={{
            left: position.left,
            top: position.top,
            animation: `floatStory ${4.5 + delay}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
        }}
    >
        <div className="w-16 h-20 sm:w-20 sm:h-24 bg-white/70 dark:bg-stone-900/60 rounded-xl backdrop-blur-md border border-[#EADDCF]/80 dark:border-stone-800 shadow-[0_8px_20px_-4px_rgba(200,88,40,0.12)] p-2 transform rotate-3">
            <div className="w-full h-1.5 bg-[#C85828]/25 rounded-full mb-1.5" />
            <div className="w-3/4 h-1.5 bg-stone-300/60 dark:bg-stone-700/60 rounded-full mb-2" />
            <div className="w-full h-1 bg-stone-200/70 dark:bg-stone-800/70 rounded-full mb-1" />
            <div className="w-5/6 h-1 bg-stone-200/70 dark:bg-stone-800/70 rounded-full mb-1" />
            <div className="w-2/3 h-1 bg-stone-200/70 dark:bg-stone-800/70 rounded-full" />
        </div>
    </div>
);

const BrandEmblemLoader = ({ size = 'lg' }) => {
    const isLg = size === 'lg';
    return (
        <div className="relative flex items-center justify-center">
            {/* Ethereal expanding ambient glow rings */}
            <div
                className={`absolute rounded-full bg-gradient-to-tr from-[#C85828]/25 via-[#EA580C]/20 to-[#F59E0B]/20 blur-xl ${
                    isLg ? 'w-36 h-36' : 'w-20 h-20'
                }`}
                style={{ animation: 'auraPulse 3s ease-in-out infinite' }}
            />
            <div
                className={`absolute rounded-full bg-[#FFD8B0]/50 dark:bg-orange-950/40 blur-md ${
                    isLg ? 'w-24 h-24' : 'w-14 h-14'
                }`}
                style={{ animation: 'auraPulse 2.4s ease-in-out infinite 0.4s' }}
            />

            {/* Official HeartOut Sculpted Flame Emblem */}
            <div className="relative z-10 flex items-center justify-center">
                <img
                    src="/logo.png"
                    alt="HeartOut Emblem"
                    className={`object-contain select-none drop-shadow-[0_10px_28px_rgba(200,88,40,0.32)] ${
                        isLg
                            ? 'w-16 h-16 sm:w-20 sm:h-20 animate-gentle-breathe'
                            : 'w-10 h-10 animate-gentle-breathe'
                    }`}
                />
            </div>
        </div>
    );
};

export default function InnovativeLoader() {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const [fadeIn, setFadeIn] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFadeIn(false);
            setTimeout(() => {
                setQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
                setFadeIn(true);
            }, 300);
        }, 3200);

        return () => clearInterval(interval);
    }, []);

    const floatingCardPositions = [
        { left: '8%', top: '16%' },
        { left: '84%', top: '18%' },
        { left: '10%', top: '72%' },
        { left: '82%', top: '74%' },
        { left: '46%', top: '6%' },
        { left: '48%', top: '86%' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden select-none">
            {/* Warm Sanctuary Ambient Canvas */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        'radial-gradient(circle at 100% 0%, rgba(254, 211, 162, 0.85) 0%, transparent 35%), radial-gradient(circle at 0% 100%, rgba(255, 216, 176, 0.85) 0%, transparent 35%), #FBEFE5',
                }}
            />

            {/* Floating Story Card Silhouettes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingCardPositions.map((pos, i) => (
                    <FloatingCard key={i} delay={i * 0.5} position={pos} />
                ))}
            </div>

            {/* Main Stage Content */}
            <div className="relative z-10 flex flex-col items-center space-y-6 sm:space-y-7 px-4 max-w-md text-center">
                {/* Official Brand Emblem with Organic Pulse */}
                <BrandEmblemLoader size="lg" />

                {/* Brand Typography */}
                <div className="flex flex-col items-center">
                    <img
                        src="/text-logo.png"
                        alt="HeartOut"
                        className="h-9 sm:h-11 w-auto object-contain select-none drop-shadow-[0_2px_8px_rgba(200,88,40,0.18)]"
                    />
                    <p className="text-[10px] tracking-[0.24em] font-semibold text-stone-500 uppercase mt-1 select-none">
                        A safer space within
                    </p>
                </div>

                {/* Rotating Inspirational Reflection Quote */}
                <div className="h-9 flex items-center justify-center px-4">
                    <p
                        className={`font-stories text-lg sm:text-xl font-normal text-stone-800 transition-opacity duration-300 leading-snug select-none ${
                            fadeIn ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {inspirationalQuotes[quoteIndex]}
                    </p>
                </div>

                {/* Shimmering Warm Progress Bar */}
                <div className="w-36 h-1.5 rounded-full bg-[#EADDCF] overflow-hidden relative shadow-inner">
                    <div
                        className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-[#9B2F0B] via-[#C85828] to-[#EA580C]"
                        style={{
                            animation: 'shimmerSweep 1.8s ease-in-out infinite',
                        }}
                    />
                </div>

                {/* Subtitle Telemetry */}
                <p className="text-xs text-stone-400 font-medium tracking-wide">
                    Preparing your storytelling experience…
                </p>
            </div>

            {/* Fluid Keyframe Animations */}
            <style>{`
                @keyframes gentleBreathe {
                    0%, 100% {
                        transform: scale(1) translateY(0);
                    }
                    50% {
                        transform: scale(1.07) translateY(-2px);
                    }
                }

                @keyframes auraPulse {
                    0%, 100% {
                        transform: scale(0.92);
                        opacity: 0.35;
                    }
                    50% {
                        transform: scale(1.14);
                        opacity: 0.75;
                    }
                }

                @keyframes floatStory {
                    0%, 100% { 
                        transform: translateY(0px) rotate(3deg); 
                    }
                    50% { 
                        transform: translateY(-18px) rotate(-2deg); 
                    }
                }

                @keyframes shimmerSweep {
                    0% {
                        left: -35%;
                        width: 35%;
                    }
                    50% {
                        left: 28%;
                        width: 48%;
                    }
                    100% {
                        left: 100%;
                        width: 35%;
                    }
                }

                .animate-gentle-breathe {
                    animation: gentleBreathe 2.4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

/**
 * RouteLoader
 * Lightweight transition loader for lazy-loaded route boundaries.
 */
export function RouteLoader() {
    return (
        <div
            className="min-h-screen flex items-center justify-center select-none"
            style={{
                background:
                    'radial-gradient(circle at 100% 0%, rgba(254, 211, 162, 0.6) 0%, transparent 35%), radial-gradient(circle at 0% 100%, rgba(255, 216, 176, 0.6) 0%, transparent 35%), #FBEFE5',
            }}
        >
            <div className="flex flex-col items-center space-y-3.5">
                <BrandEmblemLoader size="sm" />
                <p className="text-stone-600 dark:text-stone-300 text-xs font-medium tracking-wide">
                    Loading sanctuary…
                </p>
            </div>
            <style>{`
                @keyframes gentleBreathe {
                    0%, 100% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.08);
                    }
                }

                @keyframes auraPulse {
                    0%, 100% {
                        transform: scale(0.92);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.15);
                        opacity: 0.7;
                    }
                }

                .animate-gentle-breathe {
                    animation: gentleBreathe 2.2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
