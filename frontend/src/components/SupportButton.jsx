import React, { useState, useRef, useEffect } from 'react';
import { Flame, Sparkles, Droplet, Star, Heart } from 'lucide-react';

// NEW: Emotional Resonance Reaction System
// Unique to HeartOut - designed for emotional storytelling
const reactionTypes = [
  {
    value: 'felt_this',
    label: 'Felt This',
    ariaLabel: 'React with Felt This - I deeply relate',
    icon: Heart,
    color: 'text-rose-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    borderColor: 'border-rose-200 dark:border-rose-700',
    gradient: 'from-rose-400 to-pink-500',
    hoverBg: 'hover:bg-rose-100 dark:hover:bg-rose-900/30',
    fillClass: 'fill-rose-500',
    description: 'I deeply relate to this story'
  },
  {
    value: 'holding_space',
    label: 'Holding Space',
    ariaLabel: 'React with Holding Space - Silent support',
    icon: Sparkles, // Candle-like glow for holding space
    color: 'text-amber-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-200 dark:border-amber-700',
    gradient: 'from-amber-400 to-orange-500',
    hoverBg: 'hover:bg-amber-100 dark:hover:bg-amber-900/30',
    fillClass: 'fill-amber-500',
    description: 'I am here with you, silently supporting'
  },
  {
    value: 'moved',
    label: 'Moved',
    ariaLabel: 'React with Moved - Emotionally touched',
    icon: Droplet,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-700',
    gradient: 'from-blue-400 to-cyan-500',
    hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
    fillClass: 'fill-blue-500',
    description: 'This story touched me emotionally'
  },
  {
    value: 'brave',
    label: 'Brave',
    ariaLabel: 'React with Brave - Acknowledging courage',
    icon: Star,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-700',
    gradient: 'from-purple-400 to-violet-500',
    hoverBg: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
    fillClass: 'fill-purple-500',
    description: 'Thank you for being brave enough to share'
  },
  {
    value: 'grateful',
    label: 'Grateful',
    ariaLabel: 'React with Grateful - Thank you for sharing',
    icon: Flame,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    borderColor: 'border-emerald-200 dark:border-emerald-700',
    gradient: 'from-emerald-400 to-teal-500',
    hoverBg: 'hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
    fillClass: 'fill-emerald-500',
    description: 'I am grateful you shared this story'
  }
];

export default function ReactionButton({ storyId, currentReaction, onReact, supportCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [animatingReaction, setAnimatingReaction] = useState(null);
  const [floatingReaction, setFloatingReaction] = useState(null);
  const dropdownRef = useRef(null);
  const mainButtonRef = useRef(null);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        mainButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleReact = async (type) => {
    if (reacting) return;

    const reactionData = reactionTypes.find(r => r.value === type);

    setAnimatingReaction(type);
    setFloatingReaction(reactionData);
    setReacting(true);

    setTimeout(() => {
      setIsOpen(false);
      setAnimatingReaction(null);
    }, 200);

    setTimeout(() => {
      setFloatingReaction(null);
      setReacting(false);
    }, 500);

    onReact(type).catch(error => {
      console.error('Reaction failed:', error);
    });
  };

  const currentReactionType = reactionTypes.find(r => r.value === currentReaction);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button */}
      <button
        ref={mainButtonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={currentReaction
          ? `Your reaction: ${currentReactionType?.label}. ${supportCount} reactions. Click to change.`
          : `Add a reaction. ${supportCount} reactions total.`
        }
        className={`
          group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${currentReaction
            ? `${currentReactionType?.bgColor} ${currentReactionType?.borderColor} ${currentReactionType?.color} border-2 shadow-sm`
            : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-md'
          }
        `}
      >
        {currentReaction ? (
          <>
            {React.createElement(currentReactionType?.icon || Heart, {
              className: `w-5 h-5 ${currentReactionType?.color} ${currentReactionType?.fillClass} transition-transform duration-300 group-hover:scale-110`,
              'aria-hidden': 'true'
            })}
            <span className="font-semibold">{currentReactionType?.label}</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5 transition-all duration-300 group-hover:text-rose-500 group-hover:scale-110" aria-hidden="true" />
            <span>React</span>
          </>
        )}
        {supportCount > 0 && (
          <span
            className={`
              text-xs font-bold px-2 py-0.5 rounded-full
              ${currentReaction
                ? 'bg-white/50 dark:bg-gray-900/30'
                : 'bg-gray-100 dark:bg-gray-700'
              }
            `}
            aria-label={`${supportCount} reactions`}
          >
            {supportCount}
          </span>
        )}
      </button>

      {/* Floating Reaction Animation */}
      {floatingReaction && (() => {
        const FloatingIcon = floatingReaction.icon;
        return (
          <div className="absolute -top-12 sm:-top-14 left-6 pointer-events-none z-50">
            <div className="animate-float-up-fade">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${floatingReaction.gradient} flex items-center justify-center shadow-xl animate-pop-scale`}>
                <FloatingIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${floatingReaction.gradient} animate-burst-particle`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          </div>
        );
      })()}

      {/* Reaction Picker Dropdown */}
      {isOpen && (
        <div
          role="menu"
          aria-label="Choose a reaction"
          className="absolute bottom-full mb-3 z-50 left-0 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 flex gap-1"
        >
          {/* Arrow */}
          <div className="absolute -bottom-2 left-6 w-4 h-4 rotate-45 bg-white dark:bg-gray-800 border-r border-b border-gray-100 dark:border-gray-700" aria-hidden="true" />

          {reactionTypes.map((reaction, index) => {
            const Icon = reaction.icon;
            const isSelected = currentReaction === reaction.value;
            const isAnimating = animatingReaction === reaction.value;

            return (
              <button
                key={reaction.value}
                role="menuitem"
                onClick={() => handleReact(reaction.value)}
                disabled={reacting}
                aria-label={reaction.ariaLabel}
                aria-pressed={isSelected}
                tabIndex={index === 0 ? 0 : -1}
                className={`
                  relative group/item flex flex-col items-center p-2 rounded-lg transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
                  ${isSelected
                    ? `${reaction.bgColor} ${reaction.borderColor} border scale-105`
                    : `${reaction.hoverBg} hover:scale-105 border border-transparent`
                  }
                  ${isAnimating ? 'animate-bounce' : ''}
                  disabled:opacity-50
                `}
              >
                {/* Glow effect on hover */}
                <div
                  className={`
                    absolute inset-0 rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-200
                    bg-gradient-to-br ${reaction.gradient} blur-md -z-10
                  `}
                  style={{ opacity: isSelected ? 0.2 : 0 }}
                  aria-hidden="true"
                />

                <Icon
                  className={`
                    w-5 h-5 ${reaction.color} 
                    ${isSelected ? reaction.fillClass : ''} 
                    transition-all duration-200
                    ${isAnimating ? 'scale-110' : 'group-hover/item:scale-105'}
                  `}
                  aria-hidden="true"
                />

                {/* Label tooltip */}
                <span
                  className={`
                    absolute -top-8 left-1/2 -translate-x-1/2 
                    px-2 py-1 rounded-lg 
                    bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium
                    opacity-0 group-hover/item:opacity-100 
                    transition-opacity duration-200 whitespace-nowrap
                    pointer-events-none
                  `}
                  aria-hidden="true"
                >
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