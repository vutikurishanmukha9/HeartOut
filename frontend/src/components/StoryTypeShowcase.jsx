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
        subtitle: '“I survived. Here’s how.”',
        icon: Trophy,
        chartColor: '#d97706',
        tagColor: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    {
        id: 'regret',
        label: 'Life Lessons',
        subtitle: '“I learned this the hard way.”',
        icon: Lightbulb,
        chartColor: '#847569',
        tagColor: 'text-stone-700 dark:text-stone-300 bg-stone-500/10 border-stone-500/20'
    },
    {
        id: 'unsent_letter',
        label: 'Unsent Letters',
        subtitle: '“Things I never said.”',
        icon: Mail,
        chartColor: '#9e5a5a',
        tagColor: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
    },
    {
        id: 'sacrifice',
        label: 'Sacrifices',
        subtitle: '“What it cost me.”',
        icon: Heart,
        chartColor: '#b91c1c',
        tagColor: 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20'
    },
    {
        id: 'confession',
        label: 'Dreams & Hopes',
        subtitle: '“What I still hope for.”',
        icon: Sparkles,
        chartColor: '#e11d48',
        tagColor: 'text-pink-700 dark:text-pink-400 bg-pink-500/10 border-pink-500/20'
    },
    {
        id: 'other',
        label: 'Quiet Reflections',
        subtitle: '“In between the lines.”',
        icon: BookOpen,
        chartColor: '#78350f',
        tagColor: 'text-amber-800 dark:text-amber-300 bg-amber-600/10 border-amber-600/20'
    },
];

export default function StoryTypeShowcase({ selectedCategory, onSelectCategory }) {
    return (
        <div className="relative">
            {/* 2x3 Editorial Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
                {storyCategories.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.id;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => onSelectCategory(isSelected ? 'all' : category.id)}
                            className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 active:scale-[0.98] flex flex-col justify-between ${
                                isSelected
                                    ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-stone-900 dark:border-stone-100 shadow-md'
                                    : 'bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-800 border-stone-200/80 dark:border-zinc-700/80 hover:border-stone-400 dark:hover:border-zinc-500 shadow-sm'
                            }`}
                            aria-pressed={isSelected}
                        >
                            {/* Icon Header */}
                            <div className="flex items-center justify-between w-full mb-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    isSelected 
                                        ? 'bg-white/20 dark:bg-black/10 text-white dark:text-stone-900' 
                                        : 'bg-stone-100 dark:bg-zinc-700 text-stone-700 dark:text-stone-300 group-hover:text-amber-600 dark:group-hover:text-amber-400'
                                }`}>
                                    <Icon className="w-4 h-4" strokeWidth={1.5} />
                                </div>

                                {isSelected && (
                                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                                )}
                            </div>

                            {/* Title & Subtitle */}
                            <div>
                                <h3 className={`text-xs sm:text-sm font-semibold tracking-tight leading-snug ${
                                    isSelected ? 'text-white dark:text-stone-900' : 'text-stone-900 dark:text-stone-100'
                                }`}>
                                    {category.label}
                                </h3>
                                <p className={`text-[11px] mt-1 italic font-body line-clamp-1 ${
                                    isSelected ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500 dark:text-stone-400'
                                }`}>
                                    {category.subtitle}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

