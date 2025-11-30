import React from 'react';
import { Trophy, Heart, Mail, HeartHandshake, BookOpen, Sparkles } from 'lucide-react';

const storyTypes = [
    {
        value: 'achievement',
        label: 'Achievement',
        icon: Trophy,
        description: 'Celebrate your victories',
        color: 'from-amber-500 to-yellow-600',
        bgColor: 'bg-amber-50 dark:bg-amber-900/20',
        borderColor: 'border-amber-200 dark:border-amber-800',
        textColor: 'text-amber-700 dark:text-amber-300'
    },
    {
        value: 'regret',
        label: 'Regret',
        icon: Heart,
        description: 'Lessons learned',
        color: 'from-indigo-500 to-purple-600',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        textColor: 'text-indigo-700 dark:text-indigo-300'
    },
    {
        value: 'unsent_letter',
        label: 'Unsent Letter',
        icon: Mail,
        description: 'Words never said',
        color: 'from-rose-500 to-pink-600',
        bgColor: 'bg-rose-50 dark:bg-rose-900/20',
        borderColor: 'border-rose-200 dark:border-rose-800',
        textColor: 'text-rose-700 dark:text-rose-300'
    },
    {
        value: 'sacrifice',
        label: 'Sacrifice',
        icon: HeartHandshake,
        description: 'What you gave up',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
        value: 'life_story',
        label: 'Life Story',
        icon: BookOpen,
        description: 'Your journey',
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-800',
        textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
        value: 'other',
        label: 'Other',
        icon: Sparkles,
        description: 'Uncategorized',
        color: 'from-gray-500 to-slate-600',
        bgColor: 'bg-gray-50 dark:bg-gray-900/20',
        borderColor: 'border-gray-200 dark:border-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300'
    }
];

export default function StoryTypeSelector({ selected, onChange, variant = 'cards' }) {
    if (variant === 'tabs') {
        return (
            <div className="flex flex-wrap gap-2">
                {storyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.value;

                    return (
                        <button
                            key={type.value}
                            onClick={() => onChange(type.value)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${isSelected
                                    ? `${type.bgColor} ${type.borderColor} ${type.textColor} border-2 shadow-sm`
                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                }
              `}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{type.label}</span>
                        </button>
                    );
                })}
            </div>
        );
    }

    // Cards variant for story creation
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {storyTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selected === type.value;

                return (
                    <button
                        key={type.value}
                        onClick={() => onChange(type.value)}
                        className={`
              relative p-6 rounded-xl border-2 transition-all text-left
              ${isSelected
                                ? `${type.borderColor} ${type.bgColor} shadow-md scale-105`
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                            }
            `}
                    >
                        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${type.color} mb-3`}>
                            <Icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className={`text-lg font-semibold mb-1 ${isSelected ? type.textColor : 'text-gray-900 dark:text-white'}`}>
                            {type.label}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                        </p>

                        {isSelected && (
                            <div className="absolute top-3 right-3">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${type.color} flex items-center justify-center`}>
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { storyTypes };
