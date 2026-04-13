import React, { useMemo, useState } from 'react';
import { storyTypes } from './StoryTypeSelector';

// Seeded random for consistent dot placement across renders
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

// Category zone centers on the canvas (roughly scattered across the dark sky)
const ZONE_CENTERS = {
    achievement: { x: 0.2, y: 0.3 },
    confession: { x: 0.5, y: 0.18 },
    regret: { x: 0.8, y: 0.28 },
    unsent_letter: { x: 0.25, y: 0.72 },
    sacrifice: { x: 0.55, y: 0.75 },
    other: { x: 0.82, y: 0.7 },
};

export default function StoryConstellation({ stories = [], storiesByType = {}, onCategoryClick }) {
    const [hoveredDot, setHoveredDot] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const totalStories = stories.length;

    // Build dot data
    const { dots, lines } = useMemo(() => {
        const allDots = [];
        const allLines = [];
        const SPREAD = 28; // max pixel offset from center

        storyTypes.forEach((type, typeIndex) => {
            const categoryStories = stories.filter(s => s.story_type === type.value);
            const count = categoryStories.length;
            const zone = ZONE_CENTERS[type.value] || { x: 0.5, y: 0.5 };
            const rand = seededRandom(typeIndex * 1000 + 42);

            if (count === 0) {
                // Single faint dot for empty categories
                allDots.push({
                    id: `empty-${type.value}`,
                    cx: zone.x,
                    cy: zone.y,
                    color: type.chartColor,
                    opacity: 0.15,
                    glow: false,
                    title: null,
                    category: type.label,
                    isEmpty: true,
                });
            } else {
                const categoryDots = [];
                categoryStories.forEach((story, i) => {
                    const offsetX = (rand() - 0.5) * 2 * SPREAD;
                    const offsetY = (rand() - 0.5) * 2 * SPREAD;
                    const dot = {
                        id: story.id || `${type.value}-${i}`,
                        cx: zone.x,
                        cy: zone.y,
                        offsetX,
                        offsetY,
                        color: type.chartColor,
                        opacity: 1,
                        glow: true,
                        title: story.title || 'Untitled',
                        category: type.label,
                        isEmpty: false,
                    };
                    categoryDots.push(dot);
                    allDots.push(dot);
                });

                // Draw connecting lines within cluster
                if (categoryDots.length >= 2) {
                    for (let i = 0; i < categoryDots.length; i++) {
                        for (let j = i + 1; j < categoryDots.length; j++) {
                            allLines.push({
                                id: `line-${categoryDots[i].id}-${categoryDots[j].id}`,
                                x1: categoryDots[i],
                                x2: categoryDots[j],
                                color: type.chartColor,
                            });
                        }
                    }
                }
            }
        });

        return { dots: allDots, lines: allLines };
    }, [stories]);

    // Canvas dimensions
    const WIDTH = 400;
    const HEIGHT = 280;
    const PADDING = 30;

    const getX = (dot) => PADDING + dot.cx * (WIDTH - PADDING * 2) + (dot.offsetX || 0);
    const getY = (dot) => PADDING + dot.cy * (HEIGHT - PADDING * 2) + (dot.offsetY || 0);

    return (
        <div className="bg-amber-50/30 dark:bg-zinc-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-amber-100 dark:border-zinc-700/50 p-4 sm:p-6 lg:p-8 shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10">

                {/* Left Panel - Legend */}
                <div className="w-full lg:w-2/5 space-y-4 sm:space-y-5 flex flex-col justify-center">
                    <div className="text-center lg:text-left">
                        <p className="text-3xl sm:text-4xl font-editorial text-stone-700 dark:text-stone-300">
                            {totalStories}
                        </p>
                        <p className="text-sm sm:text-base text-stone-500 dark:text-stone-400 mt-1">
                            Moments Shared
                        </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {storyTypes.filter(type => (storiesByType[type.value] || 0) > 0).map((type) => {
                            const count = storiesByType[type.value] || 0;
                            return (
                                <button
                                    key={type.value}
                                    onClick={() => onCategoryClick?.(type.value)}
                                    className="w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all duration-200 hover:bg-amber-50 dark:hover:bg-zinc-800/50 border border-transparent"
                                >
                                    <div
                                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: type.chartColor }}
                                    />
                                    <span className="flex-1 text-left text-sm font-medium text-stone-600 dark:text-stone-400">
                                        {type.label}
                                    </span>
                                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-center lg:text-left text-xs sm:text-sm text-stone-400 dark:text-stone-500 italic pt-2">
                        Explore moments from different parts of your journey
                    </p>
                </div>

                {/* Right Panel - The Constellation Canvas */}
                <div className="w-full lg:w-3/5 flex items-center justify-center">
                    <div
                        className="w-full rounded-2xl overflow-hidden relative"
                        style={{ backgroundColor: '#1a1210', height: '320px', maxWidth: '460px' }}
                    >
                        <svg
                            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                            className="w-full h-full"
                            preserveAspectRatio="xMidYMid meet"
                        >
                            <defs>
                                {storyTypes.map(type => (
                                    <filter key={`glow-${type.value}`} id={`glow-${type.value}`} x="-50%" y="-50%" width="200%" height="200%">
                                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={type.chartColor} floodOpacity="0.4" />
                                    </filter>
                                ))}
                            </defs>

                            {/* Constellation lines */}
                            {lines.map(line => (
                                <line
                                    key={line.id}
                                    x1={getX(line.x1)}
                                    y1={getY(line.x1)}
                                    x2={getX(line.x2)}
                                    y2={getY(line.x2)}
                                    stroke={line.color}
                                    strokeWidth="1"
                                    strokeOpacity="0.15"
                                />
                            ))}

                            {/* Dots */}
                            {dots.map(dot => {
                                const cx = getX(dot);
                                const cy = getY(dot);
                                const isHovered = hoveredDot === dot.id;
                                const dotType = storyTypes.find(t => t.label === dot.category);
                                const filterId = dotType ? `glow-${dotType.value}` : '';

                                return (
                                    <g key={dot.id}>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={isHovered ? 5 : 3}
                                            fill={dot.color}
                                            opacity={dot.opacity}
                                            filter={dot.glow ? `url(#${filterId})` : undefined}
                                            style={{
                                                transition: 'r 150ms ease, opacity 150ms ease',
                                                cursor: dot.title ? 'pointer' : 'default',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (dot.title) {
                                                    setHoveredDot(dot.id);
                                                    const rect = e.target.closest('svg').getBoundingClientRect();
                                                    const svgX = (cx / WIDTH) * rect.width;
                                                    const svgY = (cy / HEIGHT) * rect.height;
                                                    setTooltipPos({ x: svgX, y: svgY });
                                                }
                                            }}
                                            onMouseLeave={() => setHoveredDot(null)}
                                        />
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Tooltip overlay */}
                        {hoveredDot && (() => {
                            const dot = dots.find(d => d.id === hoveredDot);
                            if (!dot || !dot.title) return null;
                            return (
                                <div
                                    className="absolute pointer-events-none z-10 px-3 py-1.5 bg-amber-900 text-white text-xs rounded-md shadow-lg max-w-[180px] truncate"
                                    style={{
                                        left: `${tooltipPos.x}px`,
                                        top: `${tooltipPos.y - 30}px`,
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    {dot.title}
                                </div>
                            );
                        })()}

                        {/* Empty state text */}
                        {totalStories === 0 && (
                            <div className="absolute inset-0 flex items-end justify-center pb-6">
                                <p className="text-sm italic text-white/20">
                                    Your constellation is waiting.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
