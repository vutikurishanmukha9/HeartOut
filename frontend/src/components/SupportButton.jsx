import React from 'react';
import { Heart, Award, Bookmark } from 'lucide-react';

const reactionTypes = [
  { value: 'heart', label: 'Heart', icon: Heart, color: 'text-rose-500' },
  { value: 'applause', label: 'Applause', icon: Award, color: 'text-amber-500' },
  { value: 'bookmark', label: 'Bookmark', icon: Bookmark, color: 'text-blue-500' }
];

export default function ReactionButton({ storyId, currentReaction, onReact }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [reacting, setReacting] = React.useState(false);

  const handleReact = async (type) => {
    if (reacting) return;

    setReacting(true);
    try {
      await onReact(type);
      setIsOpen(false);
    } catch (error) {
      console.error('Reaction failed:', error);
    } finally {
      setReacting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          ${currentReaction
            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-2 border-primary-300 dark:border-primary-700'
            : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 dark:hover:border-primary-600'
          }
        `}
      >
        {currentReaction ? (
          <>
            {React.createElement(reactionTypes.find(r => r.value === currentReaction)?.icon || Heart, {
              className: `w-5 h-5 ${reactionTypes.find(r => r.value === currentReaction)?.color}`
            })}
            <span>Reacted</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span>React</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex gap-2 z-10">
          {reactionTypes.map((reaction) => {
            const Icon = reaction.icon;
            return (
              <button
                key={reaction.value}
                onClick={() => handleReact(reaction.value)}
                disabled={reacting}
                className={`
                  p-3 rounded-lg transition-all hover:scale-110
                  ${currentReaction === reaction.value
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
                title={reaction.label}
              >
                <Icon className={`w-6 h-6 ${reaction.color}`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}