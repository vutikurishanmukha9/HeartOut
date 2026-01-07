import React, { useState, useEffect } from 'react';

/**
 * Innovative Loading Screen with animated storytelling elements
 * Features: Pulsing heart, floating story cards, rotating quotes, gradient animations
 */

const inspirationalQuotes = [
    "Every story matters...",
    "Your voice deserves to be heard...",
    "Connecting hearts worldwide...",
    "Where stories come alive...",
    "Share your truth...",
];

const FloatingCard = ({ delay, position }) => (
    <div
        className="absolute opacity-20"
        style={{
            left: position.left,
            top: position.top,
            animation: `float ${4 + delay}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
        }}
    >
        <div className="w-16 h-20 md:w-20 md:h-24 bg-gradient-to-br from-white/30 to-white/10 rounded-lg backdrop-blur-sm border border-white/20 shadow-lg transform rotate-3">
            <div className="p-2">
                <div className="w-full h-2 bg-white/30 rounded mb-1"></div>
                <div className="w-3/4 h-2 bg-white/20 rounded mb-2"></div>
                <div className="w-full h-1 bg-white/10 rounded mb-1"></div>
                <div className="w-full h-1 bg-white/10 rounded mb-1"></div>
                <div className="w-2/3 h-1 bg-white/10 rounded"></div>
            </div>
        </div>
    </div>
);

const PulsingHeart = () => (
    <div className="relative">
        {/* Outer glow rings */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-500/20 animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ animationDelay: '0.5s' }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-rose-500/30 to-orange-500/30 animate-pulse"></div>
        </div>

        {/* Main heart container */}
        <div className="relative z-10 w-20 h-20 flex items-center justify-center">
            <svg
                viewBox="0 0 24 24"
                className="w-16 h-16 animate-heartbeat"
                fill="url(#heartGradient)"
            >
                <defs>
                    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="50%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </div>
    </div>
);

const LoadingDots = () => (
    <div className="flex space-x-2 justify-center">
        {[0, 1, 2].map((i) => (
            <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500"
                style={{
                    animation: 'bounce 1.4s ease-in-out infinite',
                    animationDelay: `${i * 0.16}s`,
                }}
            />
        ))}
    </div>
);

import { ServerWarmupToast } from './ServerWarmup';

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
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const floatingCardPositions = [
        { left: '5%', top: '15%' },
        { left: '85%', top: '20%' },
        { left: '10%', top: '70%' },
        { left: '80%', top: '75%' },
        { left: '45%', top: '5%' },
        { left: '50%', top: '85%' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            {/* Animated gradient background */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(-45deg, #fdf2f8, #fef7ee, #fefce8, #fff7ed, #fce7f3)',
                    backgroundSize: '400% 400%',
                    animation: 'gradientShift 8s ease infinite',
                }}
            />

            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {floatingCardPositions.map((pos, i) => (
                    <FloatingCard key={i} delay={i * 0.5} position={pos} />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center space-y-8">
                {/* Logo with heartbeat */}
                <PulsingHeart />

                {/* Brand name with gradient */}
                <h1
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                    HeartOut
                </h1>

                {/* Rotating inspirational quote */}
                <div className="h-8 flex items-center">
                    <p
                        className={`text-gray-600 dark:text-gray-400 text-lg italic transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        {inspirationalQuotes[quoteIndex]}
                    </p>
                </div>

                {/* Animated loading dots */}
                <LoadingDots />

                {/* Progress hint */}
                <p className="text-sm text-gray-400 mt-4">
                    Preparing your storytelling experience
                </p>
            </div>

            {/* Server connection indicator shows on this loading screen */}
            <ServerWarmupToast />

            {/* CSS Animations */}
            <style>{`
                @keyframes heartbeat {
                    0%, 100% { transform: scale(1); }
                    10% { transform: scale(1.15); }
                    20% { transform: scale(1); }
                    30% { transform: scale(1.1); }
                    40% { transform: scale(1); }
                }

                @keyframes float {
                    0%, 100% { 
                        transform: translateY(0px) rotate(3deg); 
                    }
                    50% { 
                        transform: translateY(-20px) rotate(-3deg); 
                    }
                }

                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes bounce {
                    0%, 80%, 100% { 
                        transform: scale(0);
                        opacity: 0.5;
                    }
                    40% { 
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                .animate-heartbeat {
                    animation: heartbeat 1.5s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}

// Simplified version for route transitions
export function RouteLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center space-y-4">
                {/* Mini pulsing heart */}
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500/20 to-orange-500/20 animate-pulse absolute inset-0"></div>
                    <svg
                        viewBox="0 0 24 24"
                        className="w-8 h-8 relative z-10"
                        fill="url(#miniHeartGradient)"
                        style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }}
                    >
                        <defs>
                            <linearGradient id="miniHeartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f43f5e" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
                <style>{`
                    @keyframes heartbeat {
                        0%, 100% { transform: scale(1); }
                        10% { transform: scale(1.15); }
                        20% { transform: scale(1); }
                        30% { transform: scale(1.1); }
                        40% { transform: scale(1); }
                    }
                `}</style>
            </div>
        </div>
    );
}
