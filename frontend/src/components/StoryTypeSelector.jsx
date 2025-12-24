import React from 'react';
import { Medal, CloudRain, Send, Gift, Compass, Shapes, Check } from 'lucide-react';

const storyTypes = [
    {
        value: 'achievement',
        label: 'Achievement',
        icon: Medal,
        description: 'Celebrate your victories and milestones',
        color: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        textColor: 'text-emerald-700 dark:text-emerald-300',
        shadowColor: 'shadow-emerald-500/20',
        chartColor: '#10b981'
    },
    {
        value: 'regret',
        label: 'Regret',
        icon: CloudRain,
        description: 'Lessons learned from experiences',
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300',
        shadowColor: 'shadow-blue-500/20',
        chartColor: '#3b82f6'
    },
    {
        value: 'unsent_letter',
        label: 'Unsent Letter',
        icon: Send,
        description: 'Words you never got to say',
        color: 'from-gray-500 to-slate-600',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        borderColor: 'border-gray-200 dark:border-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300',
        shadowColor: 'shadow-gray-500/20',
        chartColor: '#6b7280'
    },
    {
        value: 'sacrifice',
        label: 'Sacrifice',
        icon: Gift,
        description: 'What you gave up for others',
        color: 'from-red-500 to-rose-600',
        bgColor: 'bg-red-50 dark:bg-red-900/20',
        borderColor: 'border-red-200 dark:border-red-800',
        textColor: 'text-red-700 dark:text-red-300',
        shadowColor: 'shadow-red-500/20',
        chartColor: '#ef4444'
    },
    {
        value: 'life_story',
        label: 'Life Story',
        icon: Compass,
        description: 'Your personal journey and growth',
        color: 'from-amber-500 to-yellow-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-700 dark:text-amber-300',
        shadowColor: 'shadow-amber-500/20',
        chartColor: '#f59e0b'
    },
    {
        value: 'other',
        label: 'Other',
        icon: Shapes,
        description: 'Stories that don\'t fit a category',
        color: 'from-gray-300 to-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        borderColor: 'border-gray-200 dark:border-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400',
        shadowColor: 'shadow-gray-400/20',
        chartColor: '#d1d5db'
    }
];

export default function StoryTypeSelector({ selected, onChange, variant = 'cards' }) {
    if (variant === 'tabs') {
        return (
            <div className="flex flex-wrap gap-0.5 sm:gap-1">
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
