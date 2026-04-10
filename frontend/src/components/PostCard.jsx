import React from 'react';
import { Heart, MessageCircle, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storyTypes } from './StoryTypeSelector';
import { sanitizeText } from '../utils/sanitize';
import { formatRelativeDate } from '../utils/dateFormat';

export default function StoryCard({ story, index = 0 }) {
    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    // Get excerpt - one emotionally charged sentence, not a paragraph
    const safeContent = sanitizeText(story.content);
    // Find first sentence or limit to ~100 chars
    const firstSentence = safeContent.split(/[.!?]/)[0];
    const excerpt = firstSentence.length > 100
        ? firstSentence.substring(0, 100) + '...'
        : firstSentence + (firstSentence.length < safeContent.length ? '...' : '');

    return (
        <Link
            to={`/feed/story/${story.id}`}
            className="block group touch-manipulation h-full"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <article className="relative bg-amber-50/40 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-amber-100 dark:border-zinc-700/60 hover:border-amber-200 dark:hover:border-zinc-500 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] flex flex-col h-full overflow-hidden max-h-72 group-hover:shadow-md animate-slide-up">

                {/* Content Section - Title & Excerpt Primary */}
                <div className="px-4 pt-4 pb-1.5 flex-1 overflow-hidden relative">
                    {/* Title - Primary Focus */}
                    <h2 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-100 mb-1.5 line-clamp-2 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200">
                        {story.title}
                    </h2>

                    {/* Excerpt - One emotional sentence allowed to wrap slightly */}
                    <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed italic pr-2">
                        "{excerpt}"
                    </p>

                    {/* Gradient Fade for text overflow handling matching masonry constraint */}
                    <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#fefbf6] dark:from-zinc-800/90 to-transparent pointer-events-none opacity-80" />
                </div>

                <div className="px-4 pb-3 pt-2 shrink-0">
                    {/* Secondary info row - Category pill + Read time */}
                    <div className="flex items-center justify-between">
                        {/* Category - Dynamic color pill */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-opacity-20 dark:bg-opacity-20 ${storyType.borderColor} ${storyType.canonicalBg} bg-opacity-5`}>
                            <Icon className={`w-3 h-3 ${storyType.textColor}`} strokeWidth={1.5} />
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${storyType.textColor}`}>
                                {storyType.label}
                            </span>
                        </div>

                        {/* Read time */}
                        <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 pr-1">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span className="text-[10px] font-semibold">{story.reading_time || 1} min read</span>
                        </div>
                    </div>
                </div>

                {/* Footer - Author always visible, stats on hover */}
                <div className="px-4 py-2.5 border-t border-amber-100/60 dark:border-zinc-700/50 bg-white/40 dark:bg-zinc-800/40 shrink-0">
                    <div className="flex items-center justify-between">
                        {/* Author - subtle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                                {story.author?.display_name || story.author?.username || 'Anonymous'}
                            </span>
                            <span className="text-stone-300 dark:text-zinc-600">·</span>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                                {formatRelativeDate(story.created_at)}
                            </span>
                        </div>

                        {/* Stats - appear on hover */}
                        <div className="flex items-center gap-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-1 text-stone-500" title="Views">
                                <Eye className="w-3 h-3" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{story.view_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-500" title="Reactions">
                                <Heart className="w-3 h-3" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{story.support_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-500" title="Comments">
                                <MessageCircle className="w-3 h-3" strokeWidth={1.5} />
                                <span className="text-[10px] font-medium">{story.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

