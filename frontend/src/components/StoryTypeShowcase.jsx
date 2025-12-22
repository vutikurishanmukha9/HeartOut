import React, { useState } from 'react';
import { Trophy, Lightbulb, Mail, Heart, Sparkles, BookOpen } from 'lucide-react';

/**
 * Premium Animated Story Types Component
 * 
 * Features:
 * - 3D perspective tilt on hover
 * - Glassmorphic cards with depth
 * - Animated gradient borders
 * - Glowing orb backgrounds
 * - Floating particles
 * - Smooth micro-interactions
 */

const storyCategories = [
    {
        id: 'achievement',
        label: 'Success Stories',
        icon: Trophy,
        gradient: 'from-emerald-400 via-green-500 to-teal-600',
        glowColor: 'rgba(16, 185, 129, 0.4)',
        orbColor: '#10b981',
        description: 'Celebrate victories'
    },
    {
        id: 'regret',
        label: 'Life Lessons',
        icon: Lightbulb,
        gradient: 'from-blue-400 via-indigo-500 to-purple-600',
        glowColor: 'rgba(99, 102, 241, 0.4)',
        orbColor: '#6366f1',
        description: 'Wisdom from experience'
    },
    {
        id: 'unsent_letter',
        label: 'Unsent Letters',
        icon: Mail,
        gradient: 'from-slate-400 via-gray-500 to-zinc-600',
        glowColor: 'rgba(100, 116, 139, 0.4)',
        orbColor: '#64748b',
        description: 'Words unspoken'
    },
    {
        id: 'sacrifice',
        label: 'Sacrifices',
        icon: Heart,
        gradient: 'from-rose-400 via-red-500 to-pink-600',
        glowColor: 'rgba(244, 63, 94, 0.4)',
        orbColor: '#f43f5e',
        description: 'Given from the heart'
    },
    {
        id: 'confession',
        label: 'Dreams',
        icon: Sparkles,
        gradient: 'from-violet-400 via-purple-500 to-fuchsia-600',
        glowColor: 'rgba(139, 92, 246, 0.4)',
        orbColor: '#8b5cf6',
        description: 'Hopes & aspirations'
    },
    {
        id: 'other',
        label: 'Other Tales',
        icon: BookOpen,
        gradient: 'from-amber-400 via-orange-500 to-red-600',
        glowColor: 'rgba(245, 158, 11, 0.4)',
        orbColor: '#f59e0b',
        description: 'Unique stories'
    },
];

export default function StoryTypeShowcase({ selectedCategory, onSelectCategory }) {
    const [hoveredCard, setHoveredCard] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e, cardId) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
    };

    return (
        <div className="story-showcase-container">
            {/* Floating background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
                <div className="floating-orb orb-3" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                {storyCategories.map((category, index) => {
                    const Icon = category.icon;
                    const isHovered = hoveredCard === category.id;
                    const isSelected = selectedCategory === category.id;

                    // 3D tilt calculation
                    const tiltX = isHovered ? (mousePosition.y - 0.5) * 20 : 0;
                    const tiltY = isHovered ? (mousePosition.x - 0.5) * -20 : 0;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            onMouseEnter={() => setHoveredCard(category.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onMouseMove={(e) => handleMouseMove(e, category.id)}
                            className="story-card-3d group"
                            style={{
                                '--index': index,
                                '--glow-color': category.glowColor,
                                '--orb-color': category.orbColor,
                                transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) ${isHovered ? 'translateZ(20px)' : 'translateZ(0)'}`,
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            {/* Animated gradient border */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm`} />

                            {/* Glass card */}
                            <div className={`
                                relative overflow-hidden
                                bg-white/70 dark:bg-gray-900/70
                                backdrop-blur-xl
                                rounded-2xl
                                border border-white/50 dark:border-gray-700/50
                                p-5
                                transition-all duration-500
                                ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
                                ${isHovered ? 'bg-white/90 dark:bg-gray-800/90 shadow-2xl' : 'shadow-lg'}
                            `}>
                                {/* Glowing orb background */}
                                <div
                                    className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700"
                                    style={{ background: category.glowColor }}
                                />

                                {/* Floating particles on hover */}
                                {isHovered && (
                                    <div className="particles-container">
                                        {[...Array(6)].map((_, i) => (
                                            <span
                                                key={i}
                                                className="floating-particle"
                                                style={{
                                                    '--delay': `${i * 0.2}s`,
                                                    '--x': `${Math.random() * 100}%`,
                                                    background: category.orbColor,
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Icon container with gradient background */}
                                <div className={`
                                    relative z-10
                                    w-14 h-14 mx-auto mb-3
                                    rounded-xl
                                    bg-gradient-to-br ${category.gradient}
                                    flex items-center justify-center
                                    shadow-lg
                                    transform transition-all duration-500
                                    ${isHovered ? 'scale-110 rotate-3 shadow-2xl' : ''}
                                `}
                                    style={{
                                        boxShadow: isHovered ? `0 20px 40px ${category.glowColor}` : undefined
                                    }}
                                >
                                    <Icon className="w-7 h-7 text-white" strokeWidth={2} />

                                    {/* Shine effect */}
                                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent" />
                                        <div className={`
                                            absolute -inset-full
                                            bg-gradient-to-r from-transparent via-white/30 to-transparent
                                            transform -skew-x-12
                                            ${isHovered ? 'animate-shine' : 'opacity-0'}
                                        `} />
                                    </div>
                                </div>

                                {/* Label */}
                                <h3 className={`
                                    relative z-10
                                    text-sm font-bold text-center
                                    text-gray-800 dark:text-white
                                    mb-1
                                    transition-all duration-300
                                    ${isHovered ? 'transform scale-105' : ''}
                                `}>
                                    {category.label}
                                </h3>

                                {/* Description - appears on hover */}
                                <p className={`
                                    relative z-10
                                    text-xs text-center
                                    text-gray-500 dark:text-gray-400
                                    transition-all duration-300
                                    ${isHovered ? 'opacity-100 max-h-10' : 'opacity-0 max-h-0'}
                                    overflow-hidden
                                `}>
                                    {category.description}
                                </p>

                                {/* Selected indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 w-3 h-3">
                                        <span className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-75" />
                                        <span className="relative block w-3 h-3 rounded-full bg-primary-500" />
                                    </div>
                                )}

                                {/* Bottom highlight line */}
                                <div className={`
                                    absolute bottom-0 left-0 right-0 h-1
                                    bg-gradient-to-r ${category.gradient}
                                    transform origin-left transition-transform duration-500
                                    ${isHovered || isSelected ? 'scale-x-100' : 'scale-x-0'}
                                `} />
                            </div>
                        </button>
                    );
                })}
            </div>

            <style>{`
                .story-showcase-container {
                    position: relative;
                    padding: 1rem;
                }

                .story-card-3d {
                    animation: cardEntrance 0.6s ease-out both;
                    transition: transform 0.15s ease-out;
                    transform-style: preserve-3d;
                }

                @keyframes cardEntrance {
                    from {
                        opacity: 0;
                        transform: perspective(1000px) translateY(30px) rotateX(-10deg);
                    }
                    to {
                        opacity: 1;
                        transform: perspective(1000px) translateY(0) rotateX(0);
                    }
                }

                .floating-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    animation: floatOrb 20s ease-in-out infinite;
                }

                .orb-1 {
                    width: 200px;
                    height: 200px;
                    background: rgba(251, 146, 60, 0.3);
                    top: -50px;
                    right: -50px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 150px;
                    height: 150px;
                    background: rgba(168, 85, 247, 0.3);
                    bottom: -30px;
                    left: -30px;
                    animation-delay: -7s;
                }

                .orb-3 {
                    width: 100px;
                    height: 100px;
                    background: rgba(59, 130, 246, 0.3);
                    top: 50%;
                    left: 50%;
                    animation-delay: -14s;
                }

                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -20px) scale(1.1); }
                    50% { transform: translate(-10px, 10px) scale(0.9); }
                    75% { transform: translate(-20px, -10px) scale(1.05); }
                }

                .particles-container {
                    position: absolute;
                    inset: 0;
                    overflow: hidden;
                    border-radius: 1rem;
                    pointer-events: none;
                }

                .floating-particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    left: var(--x);
                    bottom: -10px;
                    animation: floatUp 2s ease-out infinite;
                    animation-delay: var(--delay);
                }

                @keyframes floatUp {
                    0% {
                        transform: translateY(0) scale(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        transform: translateY(-100px) scale(0.5);
                        opacity: 0;
                    }
                }

                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-12deg); }
                    100% { transform: translateX(200%) skewX(-12deg); }
                }

                .animate-shine {
                    animation: shine 1.5s ease-in-out infinite;
                }

                /* Dark mode adjustments */
                .dark .floating-orb {
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
}
