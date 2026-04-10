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
        bgColor: 'bg-orange-600',
        lightBg: 'bg-orange-50/40 dark:bg-orange-950/20',
        shadowColor: 'shadow-orange-600/25',
        hoverShadow: 'hover:shadow-orange-600/40',
        glowColor: 'rgba(234, 88, 12, 0.5)',
        ringColor: 'ring-orange-600',
        description: 'Celebrate victories & milestones',
        featured: false
    },
    {
        id: 'regret',
        label: 'Life Lessons',
        subtitle: '"I learned this the hard way."',
        icon: Lightbulb,
        bgColor: 'bg-[#c1714a]',
        lightBg: 'bg-[#c1714a]/10 dark:bg-[#c1714a]/20',
        shadowColor: 'shadow-[#c1714a]/25',
        hoverShadow: 'hover:shadow-[#c1714a]/40',
        glowColor: 'rgba(193, 113, 74, 0.5)',
        ringColor: 'ring-[#c1714a]',
        description: 'Wisdom from experience',
        featured: false
    },
    {
        id: 'unsent_letter',
        label: 'Unsent Letters',
        subtitle: '"Things I never said."',
        icon: Mail,
        bgColor: 'bg-[#9e5a5a]',
        lightBg: 'bg-[#9e5a5a]/10 dark:bg-[#9e5a5a]/20',
        shadowColor: 'shadow-[#9e5a5a]/30',
        hoverShadow: 'hover:shadow-[#9e5a5a]/50',
        glowColor: 'rgba(158, 90, 90, 0.6)',
        ringColor: 'ring-[#9e5a5a]',
        description: 'Words left unspoken',
        featured: true
    },
    {
        id: 'sacrifice',
        label: 'Sacrifices',
        subtitle: '"What it cost me."',
        icon: Heart,
        bgColor: 'bg-red-800',
        lightBg: 'bg-red-50/40 dark:bg-red-950/20',
        shadowColor: 'shadow-red-800/30',
        hoverShadow: 'hover:shadow-red-800/50',
        glowColor: 'rgba(153, 27, 27, 0.6)',
        ringColor: 'ring-red-800',
        description: 'Given from the heart',
        featured: true
    },
    {
        id: 'confession',
        label: 'Dreams',
        subtitle: '"What I still hope for."',
        icon: Sparkles,
        bgColor: 'bg-amber-600',
        lightBg: 'bg-amber-50/40 dark:bg-amber-950/20',
        shadowColor: 'shadow-amber-600/25',
        hoverShadow: 'hover:shadow-amber-600/40',
        glowColor: 'rgba(217, 119, 6, 0.5)',
        ringColor: 'ring-amber-600',
        description: 'Hopes & aspirations',
        featured: false
    },
    {
        id: 'other',
        label: 'Quiet Confessions',
        subtitle: '"In between the lines."',
        icon: BookOpen,
        bgColor: 'bg-amber-900',
        lightBg: 'bg-amber-100/40 dark:bg-amber-950/40',
        shadowColor: 'shadow-amber-900/25',
        hoverShadow: 'hover:shadow-amber-900/40',
        glowColor: 'rgba(120, 53, 15, 0.4)',
        ringColor: 'ring-amber-900',
        description: 'Untitled narratives',
        featured: false
    },
];

export default function StoryTypeShowcase({ selectedCategory, onSelectCategory }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div className="story-showcase-container relative">
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
                                h-full w-full flex flex-col justify-start items-center
                                p-4 sm:p-5
                                rounded-2xl sm:rounded-3xl
                                ${category.lightBg}
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
            <div className="flex justify-center mt-8 mb-6 sm:mb-8 w-full relative z-20">
                <button
                    onClick={() => onSelectCategory('all')}
                    className="btn-premium flex items-center justify-center gap-2 px-8 py-3.5"
                    aria-pressed={selectedCategory === 'all'}
                >
                    <Sparkles className="w-5 h-5" />
                    <span>View All Stories</span>
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
                .dark .story-card-modern {
                    background: rgba(31, 41, 55, 0.85);
                }
            `}</style>
        </div>
    );
}

