import React from 'react';
import { Heart, MessageCircle, Clock, Feather, Bookmark, Sparkles, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { storyTypes } from './StoryTypeSelector';
import { sanitizeText } from '../utils/sanitize';
import { formatRelativeDate } from '../utils/dateFormat';
import haptic from '../utils/haptics';

/**
 * Sanctuary Story & Reflection Card
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Apple Pick #3 literary typography with tight display tracking
 * - Raycast Pick #39 monospace metadata and tabular numerals
 * - Tactile haptic touch feedback on interaction gestures
 */
export function StoryCard({
  story,
  post,
  index = 0,
  onBookmark,
  onReact,
  isBookmarked = false,
  showAuthor = true,
  className = '',
}) {
  const currentStory = story || post || {};

  const storyType =
    storyTypes.find((t) => t.value === currentStory.story_type) ||
    storyTypes[storyTypes.length - 1] || {
      value: 'reflection',
      label: 'Reflection',
      icon: Feather,
      borderColor: 'border-[#E8DDD0] dark:border-[#2D2621]',
      textColor: 'text-stone-800 dark:text-stone-200',
    };

  const Icon = storyType.icon || Feather;

  // Extract clean excerpt from sanitized content
  const rawContent = currentStory.content || '';
  const safeContent = sanitizeText(rawContent).replace(/<[^>]*>?/gm, '').trim();
  const firstSentence = safeContent.split(/[.!?]/)[0] || '';
  const excerpt =
    firstSentence.length > 130
      ? firstSentence.substring(0, 130).trim() + '...'
      : (firstSentence || safeContent.substring(0, 130)) +
        (safeContent.length > (firstSentence.length || 130) ? '...' : '');

  const isAnonymous =
    currentStory.is_anonymous !== false &&
    (currentStory.is_anonymous || !currentStory.author);

  const authorName = isAnonymous
    ? 'Anonymous'
    : currentStory.author?.display_name ||
      currentStory.author?.username ||
      'Anonymous';

  const storyId = currentStory.id || '';
  const readingTime = currentStory.reading_time || 1;
  const supportCount = currentStory.support_count || currentStory.reactions_count || 0;
  const commentCount = currentStory.comment_count || currentStory.comments_count || 0;
  const creationDate = currentStory.created_at || currentStory.published_at || new Date().toISOString();

  const handleCardClick = () => {
    haptic.selection();
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.selection();
    if (onBookmark) {
      onBookmark(storyId);
    }
  };

  const handleReactClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.medium();
    if (onReact) {
      onReact(storyId);
    }
  };

  const handleShareClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    haptic.selection();

    const storyUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/feed/story/${storyId}`
      : `/feed/story/${storyId}`;
    const shareData = {
      title: currentStory.title || 'HeartOut Story',
      text: `Read this reflection on HeartOut: ${currentStory.title || ''}`,
      url: storyUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(storyUrl);
        toast.success('Story link copied to clipboard');
      }
    } catch {
      toast.error('Unable to copy link');
    }
  };

  return (
    <Link
      to={`/feed/story/${storyId}`}
      onClick={handleCardClick}
      className={`block group touch-manipulation h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828] rounded-2xl ${className}`}
      style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}
      data-testid="post-card"
    >
      <article className="
        h-full flex flex-col justify-between
        bg-[#FFFDF9] dark:bg-[#141210]
        border border-[#E8DDD0] dark:border-[#2A241F]
        rounded-2xl p-5 sm:p-6
        shadow-[0_4px_20px_rgba(20,10,5,0.03)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        hover:border-[#C85828]/50 dark:hover:border-amber-400/50
        hover:shadow-[0_10px_30px_rgba(200,88,40,0.07)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.55)]
        hover:-translate-y-0.5
        transition-all duration-200
      ">
        {/* Top Header Row: Category Badge & Reading Time */}
        <div className="flex items-center justify-between gap-3 mb-3.5">
          {/* Category Chip */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider font-semibold bg-[#FAF5EF] dark:bg-[#1C1815] border-[#E8DDD0] dark:border-[#2D2621] text-[#8C3A16] dark:text-[#E8A87C]">
            <Icon className="w-3 h-3 text-[#C85828] dark:text-amber-400 shrink-0" strokeWidth={1.75} />
            <span data-testid="story-type">{storyType.label}</span>
          </div>

          {/* Reading Time */}
          <div className="inline-flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono text-[11px] tabular-nums">
            <Clock className="w-3 h-3 text-stone-400 dark:text-stone-500 shrink-0" />
            <span data-testid="reading-time">{readingTime} min read</span>
          </div>
        </div>

        {/* Narrative Core: Title & Emotional Excerpt */}
        <div className="flex-1 mb-4">
          <h2
            data-testid="story-title"
            className="font-stories text-xl sm:text-2xl font-normal leading-[1.24] tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-[#C85828] dark:group-hover:text-amber-400 transition-colors duration-200 mb-2 line-clamp-2"
          >
            {currentStory.title || 'Untitled Reflection'}
          </h2>

          <p
            data-testid="story-preview"
            className="font-body text-xs sm:text-[14.5px] text-stone-600 dark:text-stone-300/85 leading-relaxed line-clamp-3"
          >
            {excerpt ? `"${excerpt}"` : 'A quiet personal reflection shared in the sanctuary...'}
          </p>
        </div>

        {/* Card Footer: Byline, Creation Date, and Subtle Interaction Counts */}
        <div className="pt-3 border-t border-[#E8DDD0] dark:border-[#26211C] flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400">
          {/* Author Byline */}
          <div className="flex items-center gap-2">
            {showAuthor && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] flex items-center justify-center text-[#C85828] dark:text-amber-400 shrink-0 text-[10px]">
                  {isAnonymous ? (
                    <Feather className="w-3 h-3" />
                  ) : (
                    <span className="font-semibold">{authorName.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span
                  data-testid="author-name"
                  className="font-semibold text-stone-700 dark:text-stone-300 text-xs truncate max-w-[120px] sm:max-w-[160px]"
                >
                  {authorName}
                </span>
              </div>
            )}

            <span className="text-stone-300 dark:text-stone-700 select-none">•</span>

            <time
              data-testid="publish-date"
              dateTime={creationDate}
              className="font-mono text-[11px] text-stone-400 dark:text-stone-500"
            >
              {formatRelativeDate(creationDate)}
            </time>
          </div>

          {/* Social Proof & Interactive Actions */}
          <div className="flex items-center gap-3">
            {supportCount > 0 && (
              <div
                data-testid="support-count"
                className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-stone-500 dark:text-stone-400"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500/80 fill-rose-500/80" strokeWidth={1.5} />
                <span>{supportCount}</span>
              </div>
            )}

            {commentCount > 0 && (
              <div
                data-testid="comment-count"
                className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums text-stone-500 dark:text-stone-400"
              >
                <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span>{commentCount}</span>
              </div>
            )}

            {onBookmark && (
              <button
                type="button"
                data-testid="bookmark-button"
                onClick={handleBookmarkClick}
                aria-pressed={isBookmarked}
                className="p-2 -m-1 rounded-lg text-stone-400 hover:text-[#C85828] dark:hover:text-amber-400 active:scale-95 transition-all focus:outline-none flex items-center justify-center min-w-[34px] min-h-[34px]"
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark reflection'}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    isBookmarked ? 'fill-[#C85828] text-[#C85828] dark:fill-amber-400 dark:text-amber-400' : ''
                  }`}
                />
              </button>
            )}

            {onReact && (
              <button
                type="button"
                data-testid="react-button"
                onClick={handleReactClick}
                className="p-2 -m-1 rounded-lg text-stone-400 hover:text-rose-500 active:scale-95 transition-all focus:outline-none flex items-center justify-center min-w-[34px] min-h-[34px]"
                title="Support reflection"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="button"
              data-testid="card-share-button"
              onClick={handleShareClick}
              className="p-2 -m-1 rounded-lg text-stone-400 hover:text-[#C85828] dark:hover:text-amber-400 active:scale-95 transition-all focus:outline-none flex items-center justify-center min-w-[34px] min-h-[34px]"
              title="Share reflection"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}

export const PostCard = StoryCard;
export default StoryCard;
