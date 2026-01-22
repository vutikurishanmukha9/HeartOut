import React, { useState } from 'react';
import { Trophy, Lightbulb, Mail, Heart, Sparkles, BookOpen } from 'lucide-react';

/**
 * Premium Story Types Showcase - Circular Icon Design
 * 
 * Features:
 * - Circular icon containers with soft shadows
 * - Pulsing glow effect on hover
 * - Smooth scale and lift animations
 * - Glassmorphic card backgrounds
 * - Floating background orbs
 * - Description reveals on hover
 */

const storyCategories = [
    {
        id: 'achievement',
        label: 'Success Stories',
        subtitle: '"I survived. Here\'s how."',
        icon: Trophy,
        // Muted sage green - quiet accomplishment
        bgColor: 'bg-stone-500',
        lightBg: 'bg-stone-50 dark:bg-stone-900/20',
        shadowColor: 'shadow-stone-500/25',
        hoverShadow: 'hover:shadow-stone-500/40',
        glowColor: 'rgba(120, 113, 108, 0.5)',
        ringColor: 'ring-stone-500',
        description: 'Celebrate victories & milestones',
        featured: false
    },
    {
        id: 'regret',
        label: 'Life Lessons',
        subtitle: '"I learned this the hard way."',
        icon: Lightbulb,
        // Muted amber - wisdom, warmth
        bgColor: 'bg-amber-600',
        lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        shadowColor: 'shadow-amber-600/25',
        hoverShadow: 'hover:shadow-amber-600/40',
        glowColor: 'rgba(217, 119, 6, 0.5)',
        ringColor: 'ring-amber-600',
        description: 'Wisdom from experience',
        featured: false
    },
    {
        id: 'unsent_letter',
        label: 'Unsent Letters',
        subtitle: '"Things I never said."',
        icon: Mail,
        // Deep slate - unspoken weight
        bgColor: 'bg-slate-600',
        lightBg: 'bg-slate-100 dark:bg-slate-800/40',
        shadowColor: 'shadow-slate-600/30',
        hoverShadow: 'hover:shadow-slate-600/50',
        glowColor: 'rgba(71, 85, 105, 0.6)',
        ringColor: 'ring-slate-600',
        description: 'Words left unspoken',
        featured: true
    },
    {
        id: 'sacrifice',
        label: 'Sacrifices',
        subtitle: '"What it cost me."',
        icon: Heart,
        // Dusty rose - tender pain
        bgColor: 'bg-rose-700',
        lightBg: 'bg-rose-50 dark:bg-rose-900/25',
        shadowColor: 'shadow-rose-700/30',
        hoverShadow: 'hover:shadow-rose-700/50',
        glowColor: 'rgba(159, 77, 91, 0.6)',
        ringColor: 'ring-rose-700',
        description: 'Given from the heart',
        featured: true
    },
    {
        id: 'confession',
        label: 'Dreams',
        subtitle: '"What I still hope for."',
        icon: Sparkles,
        // Warm amber - hope, not celebration
        bgColor: 'bg-amber-700',
        lightBg: 'bg-amber-50 dark:bg-amber-900/20',
        shadowColor: 'shadow-amber-700/25',
        hoverShadow: 'hover:shadow-amber-700/40',
        glowColor: 'rgba(180, 83, 9, 0.5)',
        ringColor: 'ring-amber-700',
        description: 'Hopes & aspirations',
        featured: false
    },
    {
        id: 'other',
        label: 'Quiet Confessions',
        subtitle: '"In between the lines."',
        icon: BookOpen,
        // Neutral warm gray
        bgColor: 'bg-stone-600',
        lightBg: 'bg-stone-50 dark:bg-stone-800/40',
        shadowColor: 'shadow-stone-600/25',
        hoverShadow: 'hover:shadow-stone-600/40',
        glowColor: 'rgba(87, 83, 78, 0.4)',
        ringColor: 'ring-stone-600',
        description: 'Untitled narratives',
        featured: false
    },
];

export default function StoryTypeShowcase({ selectedCategory, onSelectCategory }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div className="story-showcase-container relative">
            {/* Floating background orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                <div className="floating-orb orb-1" />
                <div className="floating-orb orb-2" />
                <div className="floating-orb orb-3" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10 p-2 sm:p-4">
                {storyCategories.map((category, index) => {
                    const Icon = category.icon;
                    const isHovered = hoveredCard === category.id;
                    const isSelected = selectedCategory === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category.id)}
                            onMouseEnter={() => setHoveredCard(category.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`
                                story-card-modern group relative
                                flex flex-col items-center
                                p-4 sm:p-5
                                rounded-2xl sm:rounded-3xl
                                bg-white/80 dark:bg-gray-800/80
                                backdrop-blur-sm
                                border border-white/60 dark:border-gray-700/60
                                transition-all duration-300 ease-out
                                ${isSelected
                                    ? `ring-2 ${category.ringColor} ring-offset-2 dark:ring-offset-gray-900 shadow-xl ${category.shadowColor}`
                                    : 'shadow-lg hover:shadow-xl'
                                }
                                ${isHovered && !isSelected ? 'scale-[1.03] -translate-y-1' : ''}
                                focus:outline-none focus:ring-2 focus:${category.ringColor} focus:ring-offset-2
                            `}
                            style={{
                                animationDelay: `${index * 0.08}s`,
                            }}
                            aria-label={`View ${category.label}`}
                            aria-pressed={isSelected}
                        >
                            {/* Glow effect behind icon on hover */}
                            <div
                                className={`
                                    absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-20 h-20 rounded-full blur-2xl
                                    transition-opacity duration-500
                                    ${isHovered || isSelected ? 'opacity-60' : 'opacity-0'}
                                `}
                                style={{ background: category.glowColor }}
                            />

                            {/* Circular Icon Container - larger for featured */}
                            <div className={`
                                relative z-10
                                ${category.featured ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-14 h-14 sm:w-16 sm:h-16'}
                                rounded-full
                                ${category.bgColor}
                                flex items-center justify-center
                                shadow-lg ${category.shadowColor}
                                transform transition-all duration-300 ease-out
                                ${isHovered ? 'scale-110 shadow-xl' : ''}
                                ${isSelected ? 'scale-110' : ''}
                            `}>
                                <Icon className={`${category.featured ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-6 h-6 sm:w-7 sm:h-7'} text-white`} strokeWidth={2} />

                                {/* Shine overlay */}
                                <div className="absolute inset-0 rounded-full overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                                </div>

                                {/* Pulsing ring on hover */}
                                {(isHovered || isSelected) && (
                                    <div className={`absolute inset-0 rounded-full ${category.bgColor} animate-ping-slow opacity-30`} />
                                )}
                            </div>

                            {/* Label */}
                            <h3 className={`
                                relative z-10
                                mt-3 sm:mt-4
                                text-xs sm:text-sm font-semibold text-center
                                text-gray-800 dark:text-white
                                transition-all duration-300
                                ${isHovered ? 'scale-105' : ''}
                            `}>
                                {category.label}
                            </h3>

                            {/* Emotional subtitle - always visible for emotional cue */}
                            <p className={`
                                relative z-10
                                text-[10px] sm:text-xs text-center
                                ${category.featured ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}
                                mt-1 leading-tight italic
                                transition-all duration-300
                            `}>
                                {category.subtitle}
                            </p>

                            {/* Selected checkmark */}
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <div className="relative">
                                        <span className={`absolute inset-0 rounded-full ${category.bgColor} animate-ping opacity-50`} style={{ width: '12px', height: '12px' }} />
                                        <span className={`block w-3 h-3 rounded-full ${category.bgColor}`} />
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* "All Stories" link */}
            <div className="text-center mt-4 sm:mt-6">
                <button
                    onClick={() => onSelectCategory('all')}
                    className={`
                        inline-flex items-center gap-2
                        px-4 py-2 rounded-full
                        text-sm font-medium
                        transition-all duration-300
                        ${selectedCategory === 'all'
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                            : 'bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'
                        }
                    `}
                    aria-pressed={selectedCategory === 'all'}
                >
                    <Sparkles className="w-4 h-4" />
                    View All Stories
                </button>
            </div>

            <style>{`
                .story-showcase-container {
                    position: relative;
                }

                .story-card-modern {
                    animation: cardFadeIn 0.5s ease-out both;
                }

                @keyframes cardFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .floating-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(50px);
                    animation: floatOrb 15s ease-in-out infinite;
                }

                .orb-1 {
                    width: 180px;
                    height: 180px;
                    background: linear-gradient(135deg, rgba(251, 146, 60, 0.4), rgba(244, 63, 94, 0.3));
                    top: -40px;
                    right: -30px;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 140px;
                    height: 140px;
                    background: linear-gradient(135deg, rgba(139, 92, 246, 0.4), rgba(59, 130, 246, 0.3));
                    bottom: -20px;
                    left: -20px;
                    animation-delay: -5s;
                }

                .orb-3 {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3));
                    top: 40%;
                    right: 20%;
                    animation-delay: -10s;
                }

                @keyframes floatOrb {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(15px, -15px) scale(1.05); }
                    66% { transform: translate(-10px, 10px) scale(0.95); }
                }

                @keyframes ping-slow {
                    0% {
                        transform: scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                }

                .animate-ping-slow {
                    animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }

                /* Dark mode adjustments */
                .dark .floating-orb {
                    opacity: 0.4;
                }

                .dark .story-card-modern {
                    background: rgba(31, 41, 55, 0.85);
                }
            `}</style>
        </div>
    );
}

