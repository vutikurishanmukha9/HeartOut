import React, { useMemo, useState, useRef } from 'react';
import { Trophy, Lightbulb, Mail, Heart, Sparkles, BookOpen, Compass, ChevronRight, X } from 'lucide-react';
import { storyTypes } from './StoryTypeSelector';
import haptic from '../utils/haptics';

// Predictable pseudo-random generator for consistent astronomical star coordinates
function createSeededRandom(initialSeed) {
  let seed = initialSeed;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

// Astronomical category zone centers across the celestial sanctuary dome
const ZONE_CENTERS = {
  achievement: { x: 0.22, y: 0.28 },
  confession: { x: 0.50, y: 0.20 },
  regret: { x: 0.78, y: 0.28 },
  unsent_letter: { x: 0.26, y: 0.74 },
  sacrifice: { x: 0.52, y: 0.78 },
  other: { x: 0.80, y: 0.72 },
};

// Static micro-starfield for celestial depth (40 stars)
const AMBIENT_STARFIELD = Array.from({ length: 42 }, (_, i) => {
  const rand = createSeededRandom(i * 313 + 77);
  return {
    id: `ambient-${i}`,
    x: 20 + rand() * 520,
    y: 20 + rand() * 340,
    r: 0.6 + rand() * 0.9,
    opacity: 0.12 + rand() * 0.35,
  };
});

/**
 * Sanctuary Celestial Constellation
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian nocturne palette
 * - Apple Pick #3 literary typography with tight tracking
 * - Raycast Pick #39 monospace tabular figures for category metrics
 * - Museum-grade celestial cartography with starlight bloom and tactile haptics
 */
export default function StoryConstellation({
  stories = [],
  storiesByType = {},
  selectedCategory = null,
  onCategoryClick,
  className = '',
}) {
  const [internalSelectedCategory, setInternalSelectedCategory] = useState(null);
  const [hoveredDotId, setHoveredDotId] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [tooltipData, setTooltipData] = useState(null);
  const svgRef = useRef(null);

  const activeCategory = selectedCategory !== undefined && selectedCategory !== null
    ? selectedCategory
    : internalSelectedCategory;

  const totalStories = stories.length;

  // ViewBox dimensions for the celestial observatory
  const WIDTH = 560;
  const HEIGHT = 380;
  const PADDING = 42;

  // Calculate coordinates, clusters, and constellation filaments
  const { dots, lines, categoryStats } = useMemo(() => {
    const allDots = [];
    const allLines = [];
    const stats = {};

    storyTypes.forEach((type, typeIndex) => {
      const categoryStories = stories.filter((s) => s.story_type === type.value);
      const count = categoryStories.length;
      stats[type.value] = count;

      const zone = ZONE_CENTERS[type.value] || { x: 0.5, y: 0.5 };
      const rand = createSeededRandom(typeIndex * 1234 + 99);

      if (count === 0) {
        // Quiet origin beacon for empty category
        allDots.push({
          id: `empty-${type.value}`,
          storyId: null,
          categoryValue: type.value,
          categoryLabel: type.label,
          color: type.chartColor || '#C85828',
          x: PADDING + zone.x * (WIDTH - PADDING * 2),
          y: PADDING + zone.y * (HEIGHT - PADDING * 2),
          title: null,
          content: null,
          isEmpty: true,
          opacity: 0.22,
        });
      } else {
        const clusterDots = [];
        const SPREAD = Math.min(36, 18 + count * 2.5);

        categoryStories.forEach((story, i) => {
          // Celestial orbital distribution avoiding overlap
          const angle = (i * 2.399963) + rand() * 0.4;
          const radius = Math.sqrt((i + 1) / count) * SPREAD;
          const offsetX = Math.cos(angle) * radius;
          const offsetY = Math.sin(angle) * radius;

          const dot = {
            id: story.id ? `story-${story.id}` : `${type.value}-${i}`,
            storyId: story.id || null,
            categoryValue: type.value,
            categoryLabel: type.label,
            color: type.chartColor || '#C85828',
            x: PADDING + zone.x * (WIDTH - PADDING * 2) + offsetX,
            y: PADDING + zone.y * (HEIGHT - PADDING * 2) + offsetY,
            title: story.title || 'Untitled Reflection',
            content: story.content || '',
            readingTime: story.reading_time || 1,
            reactionsCount: story.reactions_count || story.support_count || 0,
            createdAt: story.created_at || story.published_at || '',
            isEmpty: false,
            opacity: 1,
          };
          clusterDots.push(dot);
          allDots.push(dot);
        });

        // Generate organic constellation filament lines
        if (clusterDots.length >= 2) {
          // Connect neighboring stars in the asterism
          for (let i = 0; i < clusterDots.length; i++) {
            // Find 1 or 2 closest neighboring stars in cluster
            const neighbors = clusterDots
              .map((other, idx) => ({
                idx,
                dot: other,
                dist: Math.hypot(clusterDots[i].x - other.x, clusterDots[i].y - other.y),
              }))
              .filter((n) => n.idx !== i)
              .sort((a, b) => a.dist - b.dist)
              .slice(0, clusterDots.length <= 4 ? 2 : 1);

            neighbors.forEach(({ dot: neighbor }) => {
              const lineKey = [clusterDots[i].id, neighbor.id].sort().join('-');
              if (!allLines.some((l) => l.key === lineKey)) {
                allLines.push({
                  key: lineKey,
                  id: `line-${lineKey}`,
                  categoryValue: type.value,
                  x1: clusterDots[i].x,
                  y1: clusterDots[i].y,
                  x2: neighbor.x,
                  y2: neighbor.y,
                  color: type.chartColor || '#C85828',
                });
              }
            });
          }
        }
      }
    });

    return { dots: allDots, lines: allLines, categoryStats: stats };
  }, [stories]);

  const handleCategorySelect = (categoryValue) => {
    haptic.selection();
    const nextCategory = activeCategory === categoryValue ? null : categoryValue;
    setInternalSelectedCategory(nextCategory);
    if (onCategoryClick) {
      onCategoryClick(nextCategory);
    }
  };

  const handleDotMouseEnter = (dot, e) => {
    if (dot.isEmpty) return;
    haptic.selection();
    setHoveredDotId(dot.id);

    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = (dot.x / WIDTH) * rect.width;
      const clientY = (dot.y / HEIGHT) * rect.height;
      setTooltipData({
        dot,
        x: clientX,
        y: clientY,
      });
    }
  };

  const handleDotMouseLeave = () => {
    setHoveredDotId(null);
    setTooltipData(null);
  };

  const handleDotClick = (dot) => {
    if (dot.isEmpty) return;
    haptic.medium();
    setSelectedStory(dot);
  };

  return (
    <div
      data-testid="story-constellation-container"
      className={`
        bg-[#FFFDF9] dark:bg-[#141210]
        border border-[#E8DDD0] dark:border-[#2D2621]
        rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8
        shadow-[0_8px_30px_rgba(20,10,5,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        overflow-hidden transition-all duration-200
        ${className}
      `}
    >
      <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-10">

        {/* Left Observatory Command Bar */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
          <div>
            {/* Header: Metric Display & Literary Inscription */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span
                    data-testid="constellation-total-count"
                    className="font-stories text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight"
                  >
                    {totalStories}
                  </span>
                  <span className="font-heading text-xs uppercase tracking-wider font-semibold text-[#8C3A16] dark:text-[#E8A87C]">
                    Stars Lit
                  </span>
                </div>
                <h3 className="font-stories text-lg sm:text-xl text-stone-800 dark:text-stone-200 mt-1">
                  Constellation of Reflections
                </h3>
                <p className="font-body text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                  Every shared moment forms an enduring cluster in your personal sanctuary sky.
                </p>
              </div>

              {activeCategory && (
                <button
                  type="button"
                  onClick={() => handleCategorySelect(activeCategory)}
                  data-testid="clear-category-filter"
                  className="
                    inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                    bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621]
                    text-[11px] font-mono text-stone-600 dark:text-stone-400
                    hover:border-[#C85828]/60 transition-colors
                  "
                >
                  <X className="w-3 h-3 text-[#C85828]" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>

            {/* Category Asterisms Legend */}
            <div className="space-y-1.5" data-testid="constellation-legend">
              {storyTypes.map((type) => {
                const count = categoryStats[type.value] || storiesByType[type.value] || 0;
                const isSelected = activeCategory === type.value;
                const Icon = type.icon || Sparkles;

                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleCategorySelect(type.value)}
                    data-testid={`constellation-category-${type.value}`}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs
                      border transition-all duration-200 active:scale-[0.98]
                      ${
                        isSelected
                          ? 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#C85828] dark:border-amber-400/80 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-[#FAF5EF]/60 dark:hover:bg-[#1C1815]/50 hover:border-[#E8DDD0] dark:hover:border-[#2D2621]'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Luminous Star Indicator */}
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform duration-200"
                        style={{
                          backgroundColor: type.chartColor || '#C85828',
                          boxShadow: isSelected ? `0 0 8px ${type.chartColor}` : 'none',
                        }}
                      />
                      <Icon className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 shrink-0" strokeWidth={1.75} />
                      <span className="font-heading font-medium text-stone-700 dark:text-stone-300 truncate">
                        {type.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tabular-nums font-semibold text-stone-500 dark:text-stone-400">
                        {count} {count === 1 ? 'star' : 'stars'}
                      </span>
                      <ChevronRight className={`w-3 h-3 text-stone-400 transition-transform ${isSelected ? 'rotate-90 text-[#C85828]' : ''}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Epigraph Quote */}
          <div className="pt-3 border-t border-[#E8DDD0]/60 dark:border-[#2D2621]/60">
            <p className="font-stories italic text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
              "No star exists in isolation; each memory is illuminated by the ones beside it."
            </p>
          </div>
        </div>

        {/* Right Celestial Nocturne Observatory Canvas */}
        <div className="w-full lg:w-7/12 flex flex-col items-center justify-center">
          <div
            className="
              relative w-full aspect-[4/3] max-w-xl
              bg-[#0D0B0A] dark:bg-[#080706]
              border border-[#26211D] dark:border-[#1F1A16]
              rounded-2xl sm:rounded-3xl overflow-hidden
              shadow-[inset_0_2px_12px_rgba(0,0,0,0.8),0_12px_36px_rgba(0,0,0,0.4)]
            "
          >
            {/* Ambient Radial Deep Sky Gradient */}
            <div
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-transparent to-black/80 pointer-events-none"
              aria-hidden="true"
            />

            <svg
              ref={svgRef}
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="w-full h-full select-none"
              preserveAspectRatio="xMidYMid meet"
              data-testid="constellation-svg"
            >
              <defs>
                {/* Radial Glow Filters for Each Category */}
                {storyTypes.map((type) => (
                  <radialGradient
                    key={`grad-${type.value}`}
                    id={`glow-grad-${type.value}`}
                    cx="50%"
                    cy="50%"
                    r="50%"
                  >
                    <stop offset="0%" stopColor={type.chartColor || '#C85828'} stopOpacity="0.9" />
                    <stop offset="40%" stopColor={type.chartColor || '#C85828'} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={type.chartColor || '#C85828'} stopOpacity="0" />
                  </radialGradient>
                ))}

                {/* Starlight Drop Shadow Filter */}
                <filter id="star-bloom" x="-100%" y="-100%" width="300%" height="300%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Faint Astronomical Reticle Lines */}
              <g className="opacity-15 stroke-stone-600 pointer-events-none" strokeWidth="0.5" strokeDasharray="3 4">
                <circle cx={WIDTH / 2} cy={HEIGHT / 2} r="140" fill="none" />
                <circle cx={WIDTH / 2} cy={HEIGHT / 2} r="80" fill="none" />
                <line x1={WIDTH / 2} y1="20" x2={WIDTH / 2} y2={HEIGHT - 20} />
                <line x1="20" y1={HEIGHT / 2} x2={WIDTH - 20} y2={HEIGHT / 2} />
              </g>

              {/* Ambient Static Background Stars */}
              <g className="pointer-events-none" aria-hidden="true">
                {AMBIENT_STARFIELD.map((star) => (
                  <circle
                    key={star.id}
                    cx={star.x}
                    cy={star.y}
                    r={star.r}
                    fill="#FFFDF9"
                    opacity={star.opacity}
                  />
                ))}
              </g>

              {/* Constellation Connective Filament Lines */}
              <g data-testid="constellation-lines">
                {lines.map((line) => {
                  const isCategoryActive = !activeCategory || activeCategory === line.categoryValue;
                  const isLineHovered =
                    hoveredDotId &&
                    (line.key.includes(hoveredDotId.replace('story-', '')) || line.categoryValue === activeCategory);

                  return (
                    <line
                      key={line.id}
                      x1={line.x1}
                      y1={line.y1}
                      x2={line.x2}
                      y2={line.y2}
                      stroke={line.color}
                      strokeWidth={isLineHovered ? '1.75' : '1'}
                      strokeOpacity={isCategoryActive ? (isLineHovered ? 0.75 : 0.28) : 0.08}
                      strokeDasharray={isLineHovered ? 'none' : '2 2'}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </g>

              {/* Active Category Zone Nebula Halo */}
              {activeCategory && ZONE_CENTERS[activeCategory] && (
                <circle
                  cx={PADDING + ZONE_CENTERS[activeCategory].x * (WIDTH - PADDING * 2)}
                  cy={PADDING + ZONE_CENTERS[activeCategory].y * (HEIGHT - PADDING * 2)}
                  r="64"
                  fill={`url(#glow-grad-${activeCategory})`}
                  className="animate-pulse pointer-events-none opacity-40"
                />
              )}

              {/* Celestial Story Stars */}
              <g data-testid="constellation-dots">
                {dots.map((dot) => {
                  const isHovered = hoveredDotId === dot.id;
                  const isSelected = selectedStory?.id === dot.id;
                  const isCategoryActive = !activeCategory || activeCategory === dot.categoryValue;

                  if (dot.isEmpty) {
                    return (
                      <circle
                        key={dot.id}
                        cx={dot.x}
                        cy={dot.y}
                        r="2.5"
                        fill={dot.color}
                        opacity={isCategoryActive ? 0.3 : 0.08}
                        className="transition-opacity duration-200"
                      />
                    );
                  }

                  const radius = isHovered ? 8 : (isSelected ? 7 : (totalStories <= 3 ? 5.5 : 4));

                  return (
                    <g
                      key={dot.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${dot.categoryLabel}: ${dot.title}`}
                      className="cursor-pointer focus:outline-none"
                      onMouseEnter={(e) => handleDotMouseEnter(dot, e)}
                      onMouseLeave={handleDotMouseLeave}
                      onClick={() => handleDotClick(dot)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleDotClick(dot);
                        }
                      }}
                    >
                      {/* Outer Starlight Aura when Hovered or Active */}
                      {(isHovered || isSelected || (activeCategory === dot.categoryValue)) && (
                        <circle
                          cx={dot.x}
                          cy={dot.y}
                          r={radius * 2.2}
                          fill={dot.color}
                          opacity={isHovered ? 0.35 : 0.18}
                          className="transition-all duration-200"
                        />
                      )}

                      {/* Main Celestial Star */}
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={radius}
                        fill={dot.color}
                        opacity={isCategoryActive ? 1 : 0.25}
                        filter={isHovered || isSelected ? 'url(#star-bloom)' : undefined}
                        className="transition-all duration-200"
                      />

                      {/* White-Hot Star Core */}
                      <circle
                        cx={dot.x}
                        cy={dot.y}
                        r={radius * 0.45}
                        fill="#FFFDF9"
                        opacity={isCategoryActive ? 0.95 : 0.3}
                        className="pointer-events-none"
                      />

                      {/* Diamond Diffraction Flare for Highlighted Star */}
                      {(isHovered || isSelected) && (
                        <g className="stroke-[#FFFDF9] opacity-80 pointer-events-none" strokeWidth="1">
                          <line x1={dot.x - 12} y1={dot.y} x2={dot.x + 12} y2={dot.y} />
                          <line x1={dot.x} y1={dot.y - 12} x2={dot.x} y2={dot.y + 12} />
                        </g>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>

            {/* Floating Tactile Star Tooltip */}
            {tooltipData && tooltipData.dot && (
              <div
                role="tooltip"
                data-testid="constellation-tooltip"
                className="
                  absolute z-20 pointer-events-none
                  px-3 py-2 rounded-xl
                  bg-[#FFFDF9]/95 dark:bg-[#1C1815]/95
                  border border-[#E8DDD0] dark:border-[#2D2621]
                  shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-md
                  max-w-[220px] animate-fade-in
                "
                style={{
                  left: `${Math.min(Math.max(tooltipData.x, 110), WIDTH - 110)}px`,
                  top: `${Math.max(tooltipData.y - 42, 16)}px`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tooltipData.dot.color }}
                  />
                  <span className="font-mono text-[9px] uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                    {tooltipData.dot.categoryLabel}
                  </span>
                </div>
                <h4 className="font-stories text-xs font-normal text-stone-900 dark:text-stone-100 line-clamp-2">
                  {tooltipData.dot.title}
                </h4>
                <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                  Click to inspect reflection
                </p>
              </div>
            )}

            {/* Empty Sky State */}
            {totalStories === 0 && (
              <div
                data-testid="constellation-empty-state"
                className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
              >
                <Compass className="w-8 h-8 text-stone-600 mb-2 animate-pulse" strokeWidth={1.5} />
                <p className="font-stories text-base text-stone-300">
                  Your constellation is awaiting its first star.
                </p>
                <p className="font-body text-xs text-stone-500 max-w-xs mt-1">
                  Share a reflection to ignite a star in your personal sanctuary sky.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Star Inspection Modal / Drawer */}
      {selectedStory && (
        <div
          data-testid="constellation-story-inspection"
          className="
            mt-6 pt-5 border-t border-[#E8DDD0] dark:border-[#2D2621]
            animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
            bg-[#FAF5EF]/70 dark:bg-[#181412]/70 rounded-2xl p-4 sm:p-5
          "
        >
          <div className="flex items-start gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full mt-1 shrink-0 shadow-sm"
              style={{ backgroundColor: selectedStory.color }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#8C3A16] dark:text-[#E8A87C]">
                  {selectedStory.categoryLabel}
                </span>
                <span className="text-stone-300 dark:text-stone-600">·</span>
                <span className="font-mono text-[10px] text-stone-500">
                  {selectedStory.readingTime} min read
                </span>
              </div>
              <h4 className="font-stories text-base sm:text-lg text-stone-900 dark:text-stone-100 font-normal">
                {selectedStory.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {selectedStory.storyId && (
              <a
                href={`/feed/story/${selectedStory.storyId}`}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                  bg-[#C85828] hover:bg-[#B34B1E] text-white text-xs font-medium
                  shadow-sm transition-colors
                "
              >
                <span>Read Reflection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                haptic.light();
                setSelectedStory(null);
              }}
              aria-label="Close star details"
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
