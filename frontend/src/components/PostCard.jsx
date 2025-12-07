import React from 'react';
import { Heart, MessageCircle, Clock, Eye, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storyTypes } from './StoryTypeSelector';

export default function StoryCard({ story, index = 0 }) {
    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    // Get excerpt (first 150 characters)
    const excerpt = story.content.length > 150
        ? story.content.substring(0, 150) + '...'
        : story.content;

    // Format date nicely
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Link
            to={`/feed/story/${story.id}`}
            className="block group"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <article className={`
                relative overflow-hidden
                bg-white/80 dark:bg-gray-800/80 
                backdrop-blur-sm
                rounded-2xl 
                border border-white/50 dark:border-gray-700/50
                shadow-card
                transition-all duration-500 ease-out
                hover:shadow-glow-lg
                animate-slide-up
            `}>
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-transparent to-accent-500/0 group-hover:from-primary-500/5 group-hover:to-accent-500/5 transition-all duration-500 pointer-events-none" />

                {/* Story Type Badge - Premium */}
                <div className={`relative px-5 py-4 border-b border-gray-100 dark:border-gray-700/50`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`
                                p-2.5 rounded-xl 
                                bg-gradient-to-br ${storyType.color}
                                shadow-lg shadow-primary-500/20
                                group-hover:scale-110 group-hover:rotate-3
                                transition-all duration-300
                            `}>
                                <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <span className={`text-sm font-semibold ${storyType.textColor}`}>
                                    {storyType.label}
                                </span>
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    {formatDate(story.created_at)}
                                </p>
                            </div>
                        </div>

                        {/* Reading Time Badge */}
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700/50">
                            <Clock className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                {story.reading_time || 1} min
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title with Hover Effect */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-gradient transition-all duration-300">
                        {story.title}
                    </h2>

                    {/* Excerpt with Better Typography */}
                    <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-3 leading-relaxed">
                        {excerpt}
                    </p>

                    {/* Tags - Premium Pills */}
                    {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                            {story.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-xs font-medium 
                                        bg-gradient-to-r from-primary-50 to-secondary-50 
                                        dark:from-primary-900/30 dark:to-secondary-900/30
                                        text-primary-700 dark:text-primary-300 
                                        rounded-full border border-primary-100 dark:border-primary-800/50
                                        hover:scale-105 transition-transform cursor-default"
                                >
                                    #{tag}
                                </span>
                            ))}
                            {story.tags.length > 3 && (
                                <span className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    +{story.tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Bottom Section - Author & Stats */}
                    <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-700/50">
                        {/* Author */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 p-0.5 group-hover:animate-spin-slow">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                        <span className="text-sm font-bold text-gradient">
                                            {story.author?.username?.[0]?.toUpperCase() || 'A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {story.author?.display_name || story.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Storyteller
                                </p>
                            </div>
                        </div>

                        {/* Stats - Premium Style */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-gray-400 hover:text-primary-500 transition-colors" title="Views">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs font-medium">{story.view_count || 0}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 transition-colors" title="Reactions">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs font-medium">{story.support_count || 0}</span>
                            </div>

                            <div className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-colors" title="Comments">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-xs font-medium">{story.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Badge - Premium Glow */}
                {story.is_featured && (
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 
                            bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 
                            rounded-full shadow-lg shadow-amber-500/30
                            animate-pulse-ring">
                            <Sparkles className="w-3.5 h-3.5 text-white" />
                            <span className="text-xs font-bold text-white">Featured</span>
                        </div>
                    </div>
                )}

                {/* Hover Indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </article>
        </Link>
    );
}
