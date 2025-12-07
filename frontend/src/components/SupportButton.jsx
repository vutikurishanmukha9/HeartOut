import React, { useState, useRef, useEffect } from 'react';
import { Heart, Award, Bookmark, Sparkles, HeartHandshake } from 'lucide-react';

const reactionTypes = [
  {
    value: 'heart',
    label: 'Love it',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-200 dark:border-rose-700',
    gradient: 'from-rose-400 to-pink-500',
    hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900/30',
    fillClass: 'fill-rose-500'
  },
  {
    value: 'applause',
    label: 'Inspiring',
    icon: Award,
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-700',
    gradient: 'from-amber-400 to-orange-500',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
    fillClass: 'fill-amber-500'
  },
  {
    value: 'bookmark',
    label: 'Save',
    icon: Bookmark,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    gradient: 'from-blue-400 to-cyan-500',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    fillClass: 'fill-blue-500'
  },
  {
    value: 'hug',
    label: 'Hug',
    icon: HeartHandshake,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    gradient: 'from-purple-400 to-violet-500',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    fillClass: 'fill-purple-500'
  },
  {
    value: 'inspiring',
    label: 'Mind-blown',
    icon: Sparkles,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-700',
    gradient: 'from-emerald-400 to-teal-500',
    hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
    fillClass: 'fill-emerald-500'
  }
];

export default function ReactionButton({ storyId, currentReaction, onReact, supportCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReact = async (type) => {
    if (reacting) return;

    setAnimatingReaction(type);
    setReacting(true);

    try {
      await onReact(type);
      setTimeout(() => {
        setIsOpen(false);
        setAnimatingReaction(null);
      }, 300);
    } catch (error) {
      console.error('Reaction failed:', error);
      setAnimatingReaction(null);
    } finally {
      setReacting(false);
    }
  };

  const currentReactionType = reactionTypes.find(r => r.value === currentReaction);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
          ${currentReaction
            ? `${currentReactionType?.bgColor} ${currentReactionType?.borderColor} ${currentReactionType?.color} border-2 shadow-sm`
            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
          }
        `}
      >
        {currentReaction ? (
          <>
            {React.createElement(currentReactionType?.icon || Heart, {
              className: `w-5 h-5 ${currentReactionType?.color} ${currentReactionType?.fillClass} transition-transform duration-300 group-hover:scale-110`
            })}
            <span className="font-semibold">{currentReactionType?.label}</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5 transition-all duration-300 group-hover:text-rose-500 group-hover:scale-110" />
            <span>React</span>
          </>
        )}
        {supportCount > 0 && (
          <span className={`
            text-xs font-bold px-2 py-0.5 rounded-full
            ${currentReaction
              ? 'bg-white/50 dark:bg-gray-900/30'
              : 'bg-gray-100 dark:bg-gray-700'
            }
          `}>
            {supportCount}
          </span>
        )}
      </button>

      {/* Reaction Picker Dropdown */}
      {isOpen && (
        <div
          className={`
            absolute bottom-full left-1/2 -translate-x-1/2 mb-3 
            bg-white dark:bg-gray-800 
            rounded-2xl shadow-xl 
            border border-gray-100 dark:border-gray-700 
            p-2 flex gap-1 z-50
            animate-slide-up
          `}
        >
          {/* Arrow */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700" />

          {reactionTypes.map((reaction) => {
            const Icon = reaction.icon;
            const isSelected = currentReaction === reaction.value;
            const isAnimating = animatingReaction === reaction.value;

            return (
              <button
                key={reaction.value}
                onClick={() => handleReact(reaction.value)}
                disabled={reacting}
                className={`
                  relative group/item flex flex-col items-center p-3 rounded-xl transition-all duration-300
                  ${isSelected
                    ? `${reaction.bgColor} ${reaction.borderColor} border-2 scale-110`
                    : `${reaction.hoverBg} hover:scale-110 border-2 border-transparent`
                  }
                  ${isAnimating ? 'animate-bounce' : ''}
                  disabled:opacity-50
                `}
                title={reaction.label}
              >
                {/* Glow effect on hover */}
                <div className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300
                  bg-gradient-to-br ${reaction.gradient} blur-lg -z-10
                `} style={{ opacity: isSelected ? 0.3 : 0 }} />

                <Icon
                  className={`
                    w-7 h-7 ${reaction.color} 
                    ${isSelected ? reaction.fillClass : ''} 
                    transition-all duration-300
                    ${isAnimating ? 'scale-125' : 'group-hover/item:scale-110'}
                  `}
                />

                {/* Label tooltip */}
                <span className={`
                  absolute -top-8 left-1/2 -translate-x-1/2 
                  px-2 py-1 rounded-lg 
                  bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium
                  opacity-0 group-hover/item:opacity-100 
                  transition-opacity duration-200 whitespace-nowrap
                  pointer-events-none
                `}>
                  {reaction.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { reactionTypes };