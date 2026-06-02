import React, { useState, useEffect, useRef } from "react";

export const reactions = [
  {
    key: "felt_this",
    label: "Felt This",
    textColor: "text-red-600 dark:text-red-400",
    borderColor: "border-red-200 dark:border-red-800/50",
    activeBorderColor: "border-red-400 dark:border-red-600",
    bgClass: "bg-red-50/50 dark:bg-red-950/20",
    activeBgClass: "bg-red-100 dark:bg-red-900/30",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Cracked heart — a heart that has actually felt something */}
        <path
          d="M17 28 C17 28 6 20 6 12.5 A6.5 6.5 0 0 1 17 8 A6.5 6.5 0 0 1 28 12.5 C28 20 17 28 17 28Z"
          fill="#fca5a5"
          stroke="#ef4444"
          strokeWidth="1.5"
        />
        {/* Crack lines radiating from heart center */}
        <path d="M15 14 L17 17 L19 15" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M17 17 L16 20" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Small radiating lines at top */}
        <path d="M10 9 Q8 6 10 4" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M24 9 Q26 6 24 4" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        <path d="M17 8 L17 5" stroke="#f87171" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: "holding_space",
    label: "Holding Space",
    textColor: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-200 dark:border-orange-800/50",
    activeBorderColor: "border-orange-400 dark:border-orange-600",
    bgClass: "bg-orange-50/50 dark:bg-orange-950/20",
    activeBgClass: "bg-orange-100 dark:bg-orange-900/30",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Two open upward palms — an offering */}
        <ellipse cx="17" cy="26.5" rx="10" ry="3.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2"/>
        {/* Left arm */}
        <path d="M10 26.5 Q8 19 11 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Right arm */}
        <path d="M24 26.5 Q26 19 23 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Cupped top */}
        <path d="M11 13 Q14 8 17 10 Q20 8 23 13" stroke="#ea580c" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
        {/* Palm line */}
        <path d="M13 18 Q17 20 21 18" stroke="#ea580c" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    key: "moved",
    label: "Moved",
    textColor: "text-blue-600 dark:text-blue-400",
    borderColor: "border-blue-200 dark:border-blue-800/50",
    activeBorderColor: "border-blue-400 dark:border-blue-600",
    bgClass: "bg-blue-50/50 dark:bg-blue-950/20",
    activeBgClass: "bg-blue-100 dark:bg-blue-900/30",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Face with one perfect teardrop falling as ripple */}
        <circle cx="17" cy="13" r="6" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="1.5"/>
        <circle cx="14.5" cy="12" r="1" fill="#3b82f6"/>
        <circle cx="19.5" cy="12" r="1" fill="#3b82f6"/>
        {/* Gentle smile — moved but okay */}
        <path d="M14 15.5 Q17 18 20 15.5" stroke="#3b82f6" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        {/* Single teardrop falling */}
        <path d="M17 19 L15.5 26" stroke="#93c5fd" strokeWidth="1.4" strokeLinecap="round"/>
        {/* Ripple where tear lands */}
        <ellipse cx="15" cy="27.5" rx="2.5" ry="1" fill="none" stroke="#bfdbfe" strokeWidth="1"/>
        <ellipse cx="15" cy="27.5" rx="1.2" ry="0.5" fill="#bfdbfe"/>
      </svg>
    ),
  },
  {
    key: "brave",
    label: "Brave",
    textColor: "text-purple-600 dark:text-purple-400",
    borderColor: "border-purple-200 dark:border-purple-800/50",
    activeBorderColor: "border-purple-400 dark:border-purple-600",
    bgClass: "bg-purple-50/50 dark:bg-purple-950/20",
    activeBgClass: "bg-purple-100 dark:bg-purple-900/30",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Star with a glowing inner star — a lighthouse, not a reward */}
        <path
          d="M17 5 L20 14 L29 14 L22 20 L25 29 L17 23 L9 29 L12 20 L5 14 L14 14 Z"
          fill="#c4b5fd"
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Inner glowing core */}
        <path
          d="M17 10 L18.5 15 L23 15 L19.5 18 L21 23 L17 20 L13 23 L14.5 18 L11 15 L15.5 15 Z"
          fill="#7c3aed"
        />
      </svg>
    ),
  },
  {
    key: "grateful",
    label: "Grateful",
    textColor: "text-green-600 dark:text-green-400",
    borderColor: "border-green-200 dark:border-green-800/50",
    activeBorderColor: "border-green-400 dark:border-green-600",
    bgClass: "bg-green-50/50 dark:bg-green-950/20",
    activeBgClass: "bg-green-100 dark:bg-green-900/30",
    icon: (
      <svg width="26" height="26" viewBox="0 0 34 34" fill="none">
        {/* Seed cracking open with light bursting out — gratitude grows from inside */}
        <circle cx="17" cy="18" r="9" fill="#bbf7d0" stroke="#16a34a" strokeWidth="1.5"/>
        {/* Seed/leaf shape inside */}
        <path d="M11 18 Q17 11 23 18 Q17 25 11 18Z" fill="#16a34a"/>
        {/* Light rays bursting outward */}
        <path d="M8 11 Q6 8 8 6" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M26 11 Q28 8 26 6" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M11 8 Q10 5 12 4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M23 8 Q24 5 22 4" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
        <path d="M17 9 L17 5" stroke="#4ade80" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// Alias for components expecting `reactionTypes` syntax using `value` instead of `key`
export const reactionTypes = reactions.map(r => ({ ...r, value: r.key }));

export default function ReactionButton({ storyId, currentReaction, onReact, supportCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle reaction submission seamlessly with PostDetail.jsx
  const handleReact = (key) => {
    setAnimating(key);
    setTimeout(() => setAnimating(null), 400);
    setOpen(false);
    if (onReact) onReact(key);
  };

  const current = reactions.find((r) => r.key === currentReaction);

  return (
    <div 
      ref={dropdownRef} 
      className="relative inline-flex select-none z-10"
      onMouseLeave={() => setOpen(false)}
    >
 
      {/* Popup reaction picker wrapper to bridge the hover gap */}
      {open && (
        <div className="absolute bottom-full pb-2.5 left-0 z-50">
          {/* Actual popup box */}
          <div className="bg-stone-50 dark:bg-zinc-800 border border-stone-200/60 dark:border-zinc-700 rounded-[20px] px-3.5 py-2.5 flex gap-1.5 items-center shadow-lg shadow-stone-200/50 dark:shadow-none whitespace-nowrap">
            {reactions.map((r) => (
              <div key={r.key} className="relative group flex justify-center">
                <button
                  aria-label={r.label}
                  onClick={() => handleReact(r.key)}
                  className={`
                    w-11 h-11 rounded-full flex items-center justify-center p-0 border-2 cursor-pointer
                    transition-transform duration-200 hover:scale-110 hover:-translate-y-0.5
                    ${currentReaction === r.key 
                      ? `${r.activeBgClass} ${r.activeBorderColor}` 
                      : `${r.bgClass} border-transparent hover:${r.borderColor}`
                    }
                  `}
                  style={{
                    transform: animating === r.key ? "scale(1.35)" : "scale(1)",
                  }}
                >
                  {r.icon}
                </button>
                
                {/* Individual floating tooltip - visible only on hover of this specific icon */}
                <span className={`absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[10px] font-semibold tracking-wider whitespace-nowrap ${r.textColor}`}>
                  {r.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
 
      {/* Main React button */}
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className={`group flex items-center h-[42px] px-5 gap-2 rounded-xl font-semibold text-[15px] transition-colors duration-200
          ${currentReaction 
            ? `${current?.textColor} ${current?.activeBgClass} border ${current?.borderColor}` 
            : 'border border-amber-200 bg-white dark:border-zinc-700 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 hover:border-amber-400 hover:shadow-sm'
          }
        `}
      >
        {currentReaction ? (
          <>
            <div className="flex items-center scale-[0.85] origin-center mr-[-4px]">
              {current?.icon}
            </div>
            {current?.label}
          </>
        ) : (
          <>
            <div className="flex items-center">
              <svg className="w-5 h-5 transition-colors duration-200 fill-transparent stroke-stone-400 dark:stroke-stone-500 group-hover:stroke-amber-500 group-hover:fill-amber-100" viewBox="0 0 24 24">
                <path
                  d="M12 21s-9-5.5-9-11A6 6 0 0 1 12 6a6 6 0 0 1 9 4c0 5.5-9 11-9 11z"
                  strokeWidth="1.8"
                />
              </svg>
            </div>
            React
          </>
        )}
        
        {/* Support Count Integration */}
        {supportCount > 0 && (
          <span className={`inline-flex items-center justify-center text-xs font-bold h-6 min-w-[24px] px-1.5 rounded-full ml-1
            ${currentReaction 
              ? 'bg-white/80 dark:bg-black/30' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }
          `}>
            {supportCount}
          </span>
        )}
      </button>
    </div>
  );
}