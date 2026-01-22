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
            className="block group touch-manipulation"
            style={{ animationDelay: `${index * 0.08}s` }}
        >
            <article className="relative overflow-hidden bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-stone-200/60 dark:border-zinc-700/60 hover:border-stone-300 dark:hover:border-zinc-600 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] animate-slide-up">

                {/* Content Section - Title & Excerpt Primary */}
                <div className="px-5 pt-5 pb-4">
                    {/* Title - Primary Focus */}
                    <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2 line-clamp-2 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-200">
                        {story.title}
                    </h2>

                    {/* Excerpt - One emotional sentence */}
                    <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 line-clamp-2 leading-relaxed italic">
                        "{excerpt}"
                    </p>

                    {/* Secondary info row - Category pill + Read time */}
                    <div className="flex items-center justify-between">
                        {/* Category - Muted pill with border, no solid fill */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-stone-200 dark:border-zinc-600 bg-stone-50/50 dark:bg-zinc-700/30">
                            <Icon className="w-3 h-3 text-stone-500 dark:text-stone-400" />
                            <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                                {storyType.label}
                            </span>
                        </div>

                        {/* Read time */}
                        <div className="flex items-center gap-1 text-stone-400 dark:text-stone-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-medium">{story.reading_time || 1} min</span>
                        </div>
                    </div>
                </div>

                {/* Footer - Author always visible, stats on hover */}
                <div className="px-5 py-3 border-t border-stone-100 dark:border-zinc-700/50 bg-stone-50/30 dark:bg-zinc-800/30">
                    <div className="flex items-center justify-between">
                        {/* Author - subtle */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-stone-500 dark:text-stone-400">
                                {story.author?.display_name || story.author?.username || 'Anonymous'}
                            </span>
                            <span className="text-stone-300 dark:text-zinc-600">·</span>
                            <span className="text-[10px] text-stone-400 dark:text-stone-500">
                                {formatRelativeDate(story.created_at)}
                            </span>
                        </div>

                        {/* Stats - appear on hover */}
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-1 text-stone-400" title="Views">
                                <Eye className="w-3 h-3" />
                                <span className="text-[10px]">{story.view_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-400" title="Reactions">
                                <Heart className="w-3 h-3" />
                                <span className="text-[10px]">{story.support_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-400" title="Comments">
                                <MessageCircle className="w-3 h-3" />
                                <span className="text-[10px]">{story.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

