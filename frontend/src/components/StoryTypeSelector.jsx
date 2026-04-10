import React from 'react';
import { Trophy, Lightbulb, Mail, Heart, Sparkles, BookOpen, Check } from 'lucide-react';

const storyTypes = [
    {
        value: 'achievement',
        label: 'Success Stories',
        icon: Trophy,
        description: 'Something you survived, earned, or finally became.',
        preview: 'I didn\'t think I\'d make it. Today, I proved myself wrong.',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-50 dark:bg-orange-950/20',
        borderColor: 'border-orange-200 dark:border-orange-700',
        hoverBorderColor: 'hover:border-orange-300 dark:hover:border-orange-500/50',
        textColor: 'text-orange-600 dark:text-orange-400',
        hoverTextColor: 'group-hover:text-orange-500',
        shadowColor: 'shadow-orange-500/15',
        chartColor: '#ea580c',
        canonicalBg: 'bg-orange-600'
    },
    {
        value: 'confession',
        label: 'Dreams',
        icon: Sparkles,
        description: 'What you\'re still reaching for.',
        preview: 'One day, they will know my name.',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-950/20',
        borderColor: 'border-amber-200 dark:border-amber-700',
        hoverBorderColor: 'hover:border-amber-300 dark:hover:border-amber-500/50',
        textColor: 'text-amber-600 dark:text-amber-400',
        hoverTextColor: 'group-hover:text-amber-500',
        shadowColor: 'shadow-amber-500/15',
        chartColor: '#d97706',
        canonicalBg: 'bg-amber-600'
    },
    {
        value: 'regret',
        label: 'Life Lessons',
        icon: Lightbulb,
        description: 'The hard ones. The ones that changed you.',
        preview: 'It broke my heart, but it opened my eyes.',
        color: 'from-[#c1714a]/80 to-[#c1714a]',
        bgColor: 'bg-[#c1714a]/10 dark:bg-[#c1714a]/20',
        borderColor: 'border-[#c1714a]/30 dark:border-[#c1714a]/40',
        hoverBorderColor: 'hover:border-[#c1714a]/50 dark:hover:border-[#c1714a]/60',
        textColor: 'text-[#c1714a] dark:text-[#de8a60]',
        hoverTextColor: 'group-hover:text-[#c1714a]',
        shadowColor: 'shadow-[#c1714a]/15',
        chartColor: '#c1714a',
        canonicalBg: 'bg-[#c1714a]'
    },
    {
        value: 'unsent_letter',
        label: 'Unsent Letters',
        icon: Mail,
        description: 'To the person you never got to tell.',
        preview: 'I still look for your car in every parking lot.',
        color: 'from-[#9e5a5a]/80 to-[#9e5a5a]',
        bgColor: 'bg-[#9e5a5a]/10 dark:bg-[#9e5a5a]/20',
        borderColor: 'border-[#9e5a5a]/30 dark:border-[#9e5a5a]/40',
        hoverBorderColor: 'hover:border-[#9e5a5a]/50 dark:hover:border-[#9e5a5a]/60',
        textColor: 'text-[#9e5a5a] dark:text-[#bd7272]',
        hoverTextColor: 'group-hover:text-[#9e5a5a]',
        shadowColor: 'shadow-[#9e5a5a]/15',
        chartColor: '#9e5a5a',
        canonicalBg: 'bg-[#9e5a5a]'
    },
    {
        value: 'sacrifice',
        label: 'Sacrifices',
        icon: Heart,
        description: 'What it cost you to get here.',
        preview: 'I let go of my dream so she could have hers.',
        color: 'from-red-700 to-red-800',
        bgColor: 'bg-red-50 dark:bg-red-950/20',
        borderColor: 'border-red-200 dark:border-red-700',
        hoverBorderColor: 'hover:border-red-300 dark:hover:border-red-500/50',
        textColor: 'text-red-800 dark:text-red-400',
        hoverTextColor: 'group-hover:text-red-700',
        shadowColor: 'shadow-red-800/15',
        chartColor: '#991b1b',
        canonicalBg: 'bg-red-800'
    },
    {
        value: 'other',
        label: 'Quiet Confessions',
        icon: BookOpen,
        description: 'The things you\'ve never said out loud.',
        preview: 'I\'m terrified they\'ll find out I\'m making it up as I go.',
        color: 'from-amber-800 to-amber-900',
        bgColor: 'bg-amber-100/40 dark:bg-amber-950/40',
        borderColor: 'border-amber-200 dark:border-amber-700',
        hoverBorderColor: 'hover:border-amber-300 dark:hover:border-amber-500/50',
        textColor: 'text-amber-900 dark:text-amber-400',
        hoverTextColor: 'group-hover:text-amber-800',
        shadowColor: 'shadow-amber-900/15',
        chartColor: '#78350f',
        canonicalBg: 'bg-amber-900'
    }
];

export default function StoryTypeSelector({ selected, onChange, variant = 'cards' }) {
    if (variant === 'tabs') {
        return (
            <div className="flex gap-2 p-1">
                {storyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.value;

                    return (
                        <button
                            key={type.value}
                            onClick={() => onChange(type.value)}
                            title={type.label}
                            className={`
                                group relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                ${isSelected
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 ring-1 ring-primary-500/20'
                                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800/50'
                                }
                            `}
                        >
                            <Icon strokeWidth={1.5} className={`w-4 h-4 shrink-0 transition-all duration-300 ${isSelected ? 'opacity-100 scale-110' : 'opacity-70 group-hover:scale-105'}`} />
                            <span className="hidden sm:inline relative">
                                {type.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    }

    // Premium Cards variant for story creation
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {storyTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selected === type.value;

                return (
                    <button
                        key={type.value}
                        onClick={() => onChange(type.value)}
                        className={`
                            group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left
                            animate-slide-up hover:-translate-y-1 flex flex-col h-full
                            ${isSelected
                                ? `${type.borderColor} ${type.bgColor} shadow-xl ${type.shadowColor}`
                                : `border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${type.hoverBorderColor} hover:shadow-xl hover:${type.shadowColor}`
                            }
                        `}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {/* Gradient Overlay on Hover */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                        {/* Icon */}
                        <div className={`
                            relative inline-flex p-4 rounded-xl bg-gradient-to-br ${type.color} mb-4
                            shadow-lg ${type.shadowColor}
                            group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]
                            transition-all duration-300
                        `}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className={`text-lg font-bold mb-1.5 ${isSelected ? type.textColor : 'text-gray-900 dark:text-white'}`}>
                            {type.label}
                        </h3>

                        <p className="text-sm text-stone-600 dark:text-stone-400 leading-snug mb-3">
                            {type.description}
                        </p>

                        <p className="text-[11px] sm:text-xs text-stone-400 dark:text-stone-500 italic mt-auto leading-relaxed border-l-2 pl-2 border-stone-200 dark:border-stone-700">
                            "{type.preview}"
                        </p>

                        {/* Selection Indicator */}
                        {isSelected && (
                            <div className="absolute top-4 right-4 animate-scale-in">
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center shadow-lg ${type.shadowColor}`}>
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        )}

                        {/* Hover Arrow */}
                        <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 ${isSelected ? 'hidden' : ''}`}>
                            <div className={`text-gray-400 dark:text-gray-500`}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export { storyTypes };
