import React from 'react';
import {
  Trophy,
  Lightbulb,
  Mail,
  Heart,
  Sparkles,
  BookOpen,
  Compass,
  ArrowUpRight,
  Check,
} from 'lucide-react';
import haptic from '../utils/haptics';

/**
 * Sanctuary Story Types Showcase
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Apple Pick #3 literary typography with tight tracking
 * - Raycast Pick #39 monospace indices and tabular figures
 * - Sensory haptic feedback on interactive card selection
 */

export const STORY_CATEGORIES = [
  {
    id: 'achievement',
    index: '01',
    label: 'Success Stories',
    subtitle: 'Moments of quiet triumph',
    quote: 'I survived. Here is how I found my way back.',
    icon: Trophy,
    chartColor: '#D97706',
    accentColor: '#C85828',
    darkAccentColor: '#E8A87C',
  },
  {
    id: 'confession',
    index: '02',
    label: 'Dreams & Hopes',
    subtitle: 'What you are still reaching for',
    quote: 'One day, they will know my true name.',
    icon: Sparkles,
    chartColor: '#EA580C',
    accentColor: '#EA580C',
    darkAccentColor: '#FB923C',
  },
  {
    id: 'regret',
    index: '03',
    label: 'Life Lessons',
    subtitle: 'The hard ones that reshaped you',
    quote: 'It broke my heart, but it opened my eyes.',
    icon: Lightbulb,
    chartColor: '#C1714A',
    accentColor: '#C1714A',
    darkAccentColor: '#E49876',
  },
  {
    id: 'unsent_letter',
    index: '04',
    label: 'Unsent Letters',
    subtitle: 'Words to those who never heard them',
    quote: 'I still look for your presence in quiet rooms.',
    icon: Mail,
    chartColor: '#9E5A5A',
    accentColor: '#9E5A5A',
    darkAccentColor: '#DF9F9F',
  },
  {
    id: 'sacrifice',
    index: '05',
    label: 'Sacrifices',
    subtitle: 'The weight of what you surrendered',
    quote: 'I let go of my horizon so they could have theirs.',
    icon: Heart,
    chartColor: '#991B1B',
    accentColor: '#991B1B',
    darkAccentColor: '#F87171',
  },
  {
    id: 'other',
    index: '06',
    label: 'Quiet Reflections',
    subtitle: 'Truths unspoken in regular daylight',
    quote: 'In between the lines where thoughts take shelter.',
    icon: BookOpen,
    chartColor: '#57534E',
    accentColor: '#8C3A16',
    darkAccentColor: '#E8A87C',
  },
];

export default function StoryTypeShowcase({
  selectedCategory = 'all',
  onSelectCategory,
  counts = {},
  showAllOption = false,
  className = '',
}) {
  const handleCategoryClick = (categoryId) => {
    haptic.selection();
    if (onSelectCategory) {
      // Toggle back to 'all' if clicking the active category, otherwise select it
      const nextCategory = selectedCategory === categoryId ? 'all' : categoryId;
      onSelectCategory(nextCategory);
    }
  };

  return (
    <div
      data-testid="story-type-showcase"
      className={`relative w-full ${className}`}
    >
      {/* Optional All Reflections Header Capsule */}
      {showAllOption && (
        <div className="flex justify-end mb-3">
          <button
            type="button"
            onClick={() => handleCategoryClick('all')}
            data-testid="category-all-toggle"
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono
              transition-all duration-200 active:scale-95 border
              ${
                selectedCategory === 'all'
                  ? 'bg-[#C85828] text-white border-[#C85828] shadow-sm font-semibold'
                  : 'bg-[#FFFDF9] dark:bg-[#141210] border-[#E8DDD0] dark:border-[#2D2621] text-stone-600 dark:text-stone-400 hover:border-[#C85828]/50'
              }
            `}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>All Sanctuary Stories</span>
          </button>
        </div>
      )}

      {/* 2x3 Architectural Sanctuary Bento Grid */}
      <div
        role="group"
        aria-label="Story categories showcase"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4"
      >
        {STORY_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          const count = counts[category.id];

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryClick(category.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategoryClick(category.id);
                }
              }}
              aria-pressed={isSelected}
              data-testid={`story-type-card-${category.id}`}
              className={`
                group relative text-left p-4 sm:p-5 rounded-2xl border
                transition-all duration-200 active:scale-[0.98]
                flex flex-col justify-between h-full
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
                ${
                  isSelected
                    ? 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#C85828] dark:border-amber-400/80 shadow-[0_4px_20px_rgba(200,88,40,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.45)]'
                    : 'bg-[#FFFDF9] dark:bg-[#141210] border-[#E8DDD0] dark:border-[#2D2621] hover:border-[#C85828]/50 hover:bg-[#FAF5EF]/40 dark:hover:bg-[#1C1815]/40 shadow-[0_2px_8px_rgba(20,10,5,0.02)]'
                }
              `}
            >
              <div>
                {/* Header: Icon Container, Monospace Index & Active Beacon */}
                <div className="flex items-center justify-between w-full mb-3.5">
                  <div
                    className={`
                      w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border
                      ${
                        isSelected
                          ? 'bg-[#FFFDF9] dark:bg-[#141210] border-[#C85828] text-[#C85828] dark:text-amber-400 shadow-sm'
                          : 'bg-[#FAF5EF] dark:bg-[#181412] border-[#E8DDD0] dark:border-[#2D2621] text-stone-700 dark:text-stone-300 group-hover:text-[#C85828] dark:group-hover:text-amber-400'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" strokeWidth={1.75} />
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Optional Story Count Tabular Figure */}
                    {typeof count === 'number' && (
                      <span className="font-mono text-[10px] tabular-nums font-semibold px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                        {count}
                      </span>
                    )}

                    {/* Monospace Architectural Index */}
                    <span className="font-mono text-[11px] tabular-nums font-bold text-stone-400 dark:text-stone-500">
                      {category.index}
                    </span>

                    {/* Active Selected Pulse Beacon */}
                    {isSelected && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] dark:bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85828] dark:bg-amber-400" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3
                  className={`
                    font-stories text-base sm:text-[17px] font-normal tracking-tight mb-1 transition-colors
                    ${isSelected ? 'text-[#8C3A16] dark:text-[#E8A87C]' : 'text-stone-900 dark:text-stone-100 group-hover:text-[#C85828]'}
                  `}
                >
                  {category.label}
                </h3>
                <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed line-clamp-1 mb-3">
                  {category.subtitle}
                </p>
              </div>

              {/* Literary Quote Preview */}
              <div
                className={`
                  pt-2.5 border-t border-dashed transition-colors w-full
                  ${isSelected ? 'border-[#C85828]/40 dark:border-amber-400/30' : 'border-[#E8DDD0]/80 dark:border-[#2D2621]/80'}
                `}
              >
                <p className="font-stories italic text-[11px] text-stone-600 dark:text-stone-400/90 line-clamp-1">
                  "{category.quote}"
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
