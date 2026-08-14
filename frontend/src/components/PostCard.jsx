import React from 'react';
import { Heart, MessageCircle, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storyTypes } from './StoryTypeSelector';
import { sanitizeText } from '../utils/sanitize';
import { formatRelativeDate } from '../utils/dateFormat';

export default function StoryCard({ story, index = 0 }) {
    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    // Get excerpt - one emotionally charged sentence
    const safeContent = sanitizeText(story.content);
    const firstSentence = safeContent.split(/[.!?]/)[0];
    const excerpt = firstSentence.length > 110
        ? firstSentence.substring(0, 110) + '…'
        : firstSentence + (firstSentence.length < safeContent.length ? '…' : '');

    return (
        <Link
            to={`/feed/story/${story.id}`}
            className="block group touch-manipulation h-full"
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            {/* Double-Bezel Outer Shell */}
            <div className="double-bezel-shell h-full group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.05] group-hover:scale-[1.01] transition-all duration-500">
                {/* Concentric Inner Core */}
                <article className="double-bezel-core h-full flex flex-col justify-between overflow-hidden p-5 sm:p-6 border border-black/[0.04] dark:border-white/[0.06] group-hover:border-amber-500/30 dark:group-hover:border-amber-400/30">
                    
                    {/* Top Row: Category Eyebrow Badge & Reading Time */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-semibold uppercase tracking-[0.16em] ${storyType.borderColor} ${storyType.canonicalBg} ${storyType.textColor}`}>
                            <Icon className="w-3 h-3" strokeWidth={1.5} />
                            <span>{storyType.label}</span>
                        </div>

                        {/* Nested Read Time Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100/80 dark:bg-zinc-800/80 text-stone-500 dark:text-stone-400 text-[11px] font-medium">
                            <Clock className="w-3 h-3" strokeWidth={1.5} />
                            <span>{story.reading_time || 1} min read</span>
                        </div>
                    </div>

                    {/* Main Narrative Area */}
                    <div className="flex-1 mb-5">
                        <h2 className="font-editorial text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mb-2 line-clamp-2 leading-snug tracking-tight group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                            {story.title}
                        </h2>

                        <p className="text-sm sm:text-[15px] text-stone-600 dark:text-stone-300/80 line-clamp-3 leading-relaxed font-body">
                            “{excerpt}”
                        </p>
                    </div>

                    {/* Bottom Metadata & Hover Gestures */}
                    <div className="pt-3.5 border-t border-stone-200/60 dark:border-zinc-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                        <div className="flex items-center gap-2 font-medium">
                            <span className="text-stone-700 dark:text-stone-300">
                                {story.author?.display_name || story.author?.username || 'Anonymous'}
                            </span>
                            <span className="text-stone-300 dark:text-zinc-600">·</span>
                            <span className="text-stone-400 dark:text-stone-500 text-[11px]">
                                {formatRelativeDate(story.created_at)}
                            </span>
                        </div>

                        {/* Quiet Interaction Counts */}
                        <div className="flex items-center gap-3 text-stone-400 dark:text-stone-500">
                            {story.support_count > 0 && (
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3.5 h-3.5 text-rose-500/80" strokeWidth={1.5} fill="currentColor" />
                                    <span className="text-[11px]">{story.support_count}</span>
                                </div>
                            )}
                            {story.comment_count > 0 && (
                                <div className="flex items-center gap-1">
                                    <MessageCircle className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    <span className="text-[11px]">{story.comment_count}</span>
                                </div>
                            )}
                        </div>
                    </div>

                </article>
            </div>
        </Link>
    );
}

