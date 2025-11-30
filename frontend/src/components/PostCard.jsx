import React from 'react';
import { Heart, MessageCircle, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { storyTypes } from './StoryTypeSelector';

export default function StoryCard({ story }) {
    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    // Get excerpt (first 150 characters)
    const excerpt = story.content.length > 150
        ? story.content.substring(0, 150) + '...'
        : story.content;

    return (
        <Link to={`/feed/story/${story.id}`}>
            <article className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden group">
                {/* Story Type Badge */}
                <div className={`px-4 py-3 ${storyType.bgColor} border-b ${storyType.borderColor}`}>
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${storyType.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`text-sm font-medium ${storyType.textColor}`}>
                            {storyType.label}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                        {story.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {excerpt}
                    </p>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {story.tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Meta Information */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        {/* Author */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold">
                                {story.author?.username?.[0]?.toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {story.author?.display_name || story.author?.username || 'Anonymous'}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(story.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1" title="Reading time">
                                <Clock className="w-4 h-4" />
                                <span className="text-xs">{story.reading_time || 1} min</span>
                            </div>

                            <div className="flex items-center gap-1" title="Views">
                                <Eye className="w-4 h-4" />
                                <span className="text-xs">{story.view_count || 0}</span>
                            </div>

                            <div className="flex items-center gap-1" title="Reactions">
                                <Heart className="w-4 h-4" />
                                <span className="text-xs">{story.support_count || 0}</span>
                            </div>

                            <div className="flex items-center gap-1" title="Comments">
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-xs">{story.comment_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Badge */}
                {story.is_featured && (
                    <div className="absolute top-2 right-2">
                        <div className="px-2 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center gap-1 shadow-md">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-semibold text-white">Featured</span>
                        </div>
                    </div>
                )}
            </article>
        </Link>
    );
}
