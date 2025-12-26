import React from 'react';
import { Heart, MessageCircle, Clock, Eye, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storyTypes } from './StoryTypeSelector';
import { sanitizeText } from '../utils/sanitize';
import { formatRelativeDate } from '../utils/dateFormat';
import { getAvatarColor, getAvatarTextColor } from '../utils/avatarColors';

export default function StoryCard({ story, index = 0 }) {
    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    // Get excerpt - shorter on mobile
    const safeContent = sanitizeText(story.content);
    const excerpt = safeContent.length > 120
        ? safeContent.substring(0, 120) + '...'
        : safeContent;

    return (
        <Link
            to={`/feed/story/${story.id}`}
            className="block group touch-manipulation"
            style={{ animationDelay: `${index * 0.06}s` }}
        >
            <article className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] animate-slide-up">

                {/* Header Section */}
                <div className="px-3 sm:px-5 pt-3 sm:pt-4 pb-2 sm:pb-3">
                    <div className="flex items-center justify-between">
                        {/* Story Type & Date */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${storyType.color} shadow-md`}>
                                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                            </div>
                            <div>
                                <span className={`text-[10px] sm:text-xs font-semibold ${storyType.textColor}`}>
                                    {storyType.label}
                                </span>
                                <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500">
                                    {formatRelativeDate(story.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Reading Time */}
                        <div className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            <span className="text-[9px] sm:text-[10px] font-medium">{story.reading_time || 1} min</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-3 sm:px-5 pb-3 sm:pb-4">
                    {/* Title */}
                    <h2 className={`text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5 sm:mb-2 line-clamp-2 ${storyType.hoverTextColor} transition-colors duration-200`}>
                        {story.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {excerpt}
                    </p>
                </div>

                {/* Footer Section */}
                <div className="px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex items-center justify-between">
                        {/* Author */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${getAvatarColor(story.author?.username?.[0])} flex items-center justify-center ${getAvatarTextColor(story.author?.username?.[0])} text-[10px] sm:text-xs font-bold shadow-md`}>
                                {story.author?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className="text-[10px] sm:text-xs font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[100px] sm:max-w-[140px]">
                                    {story.author?.display_name || story.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                                    Storyteller
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-0.5 sm:gap-1 text-gray-400" title="Views">
                                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="text-[9px] sm:text-[10px] font-medium">{story.view_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 text-gray-400" title="Reactions">
                                <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="text-[9px] sm:text-[10px] font-medium">{story.support_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-0.5 sm:gap-1 text-gray-400" title="Comments">
                                <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="text-[9px] sm:text-[10px] font-medium">{story.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Badge */}
                {story.is_featured && (
                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                        <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-lg shadow-amber-500/30">
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                            <span className="text-[8px] sm:text-[10px] font-bold text-white">Featured</span>
                        </div>
                    </div>
                )}

                {/* Hover Arrow Indicator - Hidden on mobile */}
                <div className="hidden sm:block absolute bottom-3 right-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
            </article>
        </Link>
    );
}
