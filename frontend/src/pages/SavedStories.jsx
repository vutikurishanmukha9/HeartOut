import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookMarked, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api';
import StoryCard from '../components/PostCard';

export default function SavedStories() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedStories();
    }, []);

    const fetchSavedStories = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(getApiUrl('/api/posts/bookmarks'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Check if data.items exists (pagination) or just data (list)
                // My backend returns { items: [], total: ... }
                setStories(data.items || []);
            }
        } catch (error) {
            console.error('Failed to fetch saved stories:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading saved stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-24 md:pb-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25">
                            <BookMarked className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Saved Stories
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-12">
                        Stories you've bookmarked for later reading
                    </p>
                </div>

                {stories.length === 0 ? (
                    /* Empty State - Premium Design */
                    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 sm:p-12 text-center max-w-4xl mx-auto">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-3xl opacity-10" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-3xl opacity-10" />

                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                <BookMarked className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No saved stories yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                Bookmark stories you want to read later and they will appear here
                            </p>
                            <Link
                                to="/feed"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                <Sparkles className="w-4 h-4" />
                                Explore Stories
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Stories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story, index) => (
                            <div
                                key={story.id}
                                className="animate-slide-up"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <StoryCard story={story} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
