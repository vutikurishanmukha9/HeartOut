import React from 'react';
import { Medal, CloudRain, Send, Gift, Compass, Shapes, Check } from 'lucide-react';

const storyTypes = [
    {
        value: 'achievement',
        label: 'Achievement',
        icon: Medal,
        description: 'Something you\'re proud you survived or achieved',
        color: 'from-stone-500 to-stone-600',
        bgColor: 'bg-stone-50 dark:bg-stone-900/20',
        borderColor: 'border-stone-200 dark:border-stone-700',
        textColor: 'text-stone-700 dark:text-stone-300',
        hoverTextColor: 'group-hover:text-stone-600 dark:group-hover:text-stone-400',
        shadowColor: 'shadow-stone-500/15',
        chartColor: '#78716c'
    },
    {
        value: 'regret',
        label: 'Regret',
        icon: CloudRain,
        description: 'Something you still think about',
        color: 'from-slate-500 to-slate-600',
        bgColor: 'bg-slate-50 dark:bg-slate-900/20',
        borderColor: 'border-slate-200 dark:border-slate-700',
        textColor: 'text-slate-700 dark:text-slate-300',
        hoverTextColor: 'group-hover:text-slate-600 dark:group-hover:text-slate-400',
        shadowColor: 'shadow-slate-500/15',
        chartColor: '#64748b'
    },
    {
        value: 'unsent_letter',
        label: 'Unsent Letter',
        icon: Send,
        description: 'Something you wish they could hear',
        color: 'from-zinc-500 to-zinc-600',
        bgColor: 'bg-zinc-50 dark:bg-zinc-900/20',
        borderColor: 'border-zinc-200 dark:border-zinc-700',
        textColor: 'text-zinc-700 dark:text-zinc-300',
        hoverTextColor: 'group-hover:text-zinc-600 dark:group-hover:text-zinc-400',
        shadowColor: 'shadow-zinc-500/15',
        chartColor: '#71717a'
    },
    {
        value: 'sacrifice',
        label: 'Sacrifice',
        icon: Gift,
        description: 'Something you gave up for someone',
        color: 'from-rose-400 to-rose-500',
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-200 dark:border-rose-700',
        textColor: 'text-rose-700 dark:text-rose-300',
        hoverTextColor: 'group-hover:text-rose-600 dark:group-hover:text-rose-400',
        shadowColor: 'shadow-rose-400/15',
        chartColor: '#fb7185'
    },
    {
        value: 'life_story',
        label: 'Life Story',
        icon: Compass,
        description: 'A moment that shaped who you are',
        color: 'from-amber-500 to-amber-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-700',
        textColor: 'text-amber-700 dark:text-amber-300',
        hoverTextColor: 'group-hover:text-amber-600 dark:group-hover:text-amber-400',
        shadowColor: 'shadow-amber-500/15',
        chartColor: '#f59e0b'
    },
    {
        value: 'other',
        label: 'Not Sure Yet',
        icon: Shapes,
        description: 'You can figure it out as you write',
        color: 'from-stone-300 to-stone-400',
        bgColor: 'bg-stone-50 dark:bg-stone-900/20',
        borderColor: 'border-stone-200 dark:border-stone-700',
        textColor: 'text-stone-600 dark:text-stone-400',
        hoverTextColor: 'group-hover:text-stone-600 dark:group-hover:text-stone-300',
        shadowColor: 'shadow-stone-300/15',
        chartColor: '#d6d3d1'
    }
];

export default function StoryTypeSelector({ selected, onChange, variant = 'cards' }) {
    if (variant === 'tabs') {
        return (
            <>
                {storyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.value;

                    return (
                        <button
                            key={type.value}
                            onClick={() => onChange(type.value)}
                            title={type.label}
                            className={`
                                group relative flex items-center justify-center gap-1.5 px-2.5 sm:px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300
                                ${isSelected
                                    ? `${type.textColor} ${type.bgColor}`
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 shrink-0 transition-all duration-300 ${isSelected ? '' : 'group-hover:scale-110'}`} />
                            <span className="hidden sm:inline relative">
                                {type.label}
                                <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isSelected
                                    ? `w-full bg-gradient-to-r ${type.color}`
                                    : 'w-0 group-hover:w-full bg-gray-400 dark:bg-gray-500'
                                    }`} />
                            </span>
                        </button>
                    );
                })}
            </>
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
                            animate-slide-up
                            ${isSelected
                                ? `${type.borderColor} ${type.bgColor} shadow-xl ${type.shadowColor} scale-[1.02]`
                                : 'border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg hover:scale-[1.01]'
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
                            group-hover:scale-110 group-hover:rotate-3
                            transition-all duration-300
                        `}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>

                        {/* Content */}
                        <h3 className={`text-lg font-bold mb-2 ${isSelected ? type.textColor : 'text-gray-900 dark:text-white'}`}>
                            {type.label}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {type.description}
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
