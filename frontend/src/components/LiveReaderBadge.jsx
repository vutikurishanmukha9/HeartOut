import React, { useEffect, useState } from 'react';
import { Users, Eye, Sparkles } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket.jsx';
import haptic from '../utils/haptics';

/**
 * Sanctuary Live Reader Presence Badge
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Raycast Pick #39 monospace tabular figures for live counts
 * - Quiet empathetic presence signaling shared human moments
 */
export default function LiveReaderBadge({
  storyId,
  count: overrideCount,
  variant = 'badge',
  className = '',
  forceShow = false,
}) {
  const ws = useWebSocket();
  const [showTooltip, setShowTooltip] = useState(false);

  // Join story room on mount, leave on unmount
  useEffect(() => {
    if (ws?.joinStory && storyId) {
      ws.joinStory(storyId);

      return () => {
        if (ws?.leaveStory) {
          ws.leaveStory(storyId);
        }
      };
    }
  }, [ws, storyId]);

  const rawCount =
    overrideCount !== undefined
      ? overrideCount
      : ws?.getReaderCount?.(storyId) || 0;

  // Don't render if only 1 reader (yourself) or no readers, unless forced
  if (rawCount <= 1 && !forceShow) {
    return null;
  }

  const readerCount = Math.max(1, rawCount);
  const readerLabel = readerCount === 1 ? 'soul' : 'souls';

  const handleBadgeClick = () => {
    haptic.selection();
    setShowTooltip((prev) => !prev);
  };

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] text-xs ${className}`}
        title={`${readerCount} ${readerLabel} reading in the sanctuary right now`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] dark:bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85828] dark:bg-amber-400" />
        </span>
        <span className="font-mono text-[11px] tabular-nums font-medium text-stone-700 dark:text-stone-300">
          {readerCount}
        </span>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 font-mono text-[11px] text-stone-600 dark:text-stone-400 ${className}`}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] dark:bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C85828] dark:bg-amber-400" />
        </span>
        <span className="tabular-nums font-semibold text-stone-800 dark:text-stone-200">
          {readerCount}
        </span>
        <span>reading with you</span>
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleBadgeClick}
        aria-label={`${readerCount} people reading with you`}
        className="
          inline-flex items-center gap-2 px-2.5 py-1 rounded-lg
          bg-[#FFFDF9] dark:bg-[#141210]
          border border-[#E8DDD0] dark:border-[#2D2621]
          hover:border-[#C85828]/50 dark:hover:border-amber-400/50
          shadow-[0_2px_8px_rgba(20,10,5,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
          transition-all duration-200 active:scale-95
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
        "
      >
        {/* Live Pulse Beacon */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C85828] dark:bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C85828] dark:bg-amber-400" />
        </span>

        {/* Presence Glyph */}
        <Users className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" strokeWidth={1.75} />

        {/* Tabular Count & Empathetic Message */}
        <span className="text-xs text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1">
          <span className="font-mono text-[11px] tabular-nums font-bold text-[#8C3A16] dark:text-[#E8A87C]">
            {readerCount}
          </span>
          <span>{readerLabel} reading</span>
        </span>
      </button>

      {/* Tactile Sanctuary Presence Tooltip */}
      {showTooltip && (
        <div
          role="tooltip"
          className="
            absolute bottom-full left-0 mb-2 z-50 w-60
            p-2.5 rounded-xl
            bg-[#FFFDF9] dark:bg-[#1C1815]
            border border-[#E8DDD0] dark:border-[#2D2621]
            shadow-[0_8px_24px_rgba(20,10,5,0.1)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]
            text-xs text-stone-600 dark:text-stone-300
            animate-fade-in
          "
        >
          <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200 mb-0.5">
            <Sparkles className="w-3 h-3 text-[#C85828] dark:text-amber-400" />
            <span>Shared Presence</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
            You are not alone in the sanctuary. {readerCount} {readerLabel} are currently reflecting on this piece.
          </p>
        </div>
      )}
    </div>
  );
}
