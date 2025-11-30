import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Star } from 'lucide-react';
import StoryCard from '../components/PostCard';
import StoryTypeSelector from '../components/StoryTypeSelector';

export default function Feed() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchStories();
    }, [selectedCategory, sortBy, page]);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: '20',
                sort_by: sortBy
            });

            if (selectedCategory !== 'all') {
                params.append('story_type', selectedCategory);
            }

            const response = await fetch(`/api/posts?${params}`);
            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Discover Stories
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Real stories from real people around the world
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 space-y-4">
                    {/* Sort Options */}
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSortBy('latest')}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${sortBy === 'latest'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                }
              `}
                        >
                            <Sparkles className="w-4 h-4" />
                            Latest
                        </button>

                        <button
                            onClick={() => setSortBy('trending')}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${sortBy === 'trending'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                }
              `}
                        >
                            <TrendingUp className="w-4 h-4" />
                            Trending
                        </button>

                        <button
                            onClick={() => setSortBy('most_viewed')}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
                ${sortBy === 'most_viewed'
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'
                                }
              `}
                        >
                            <Star className="w-4 h-4" />
                            Most Viewed
                        </button>
                    </div>

                    {/* Category Filters */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Filter by Category
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`
                  px-4 py-2 rounded-lg font-medium transition-all
                  ${selectedCategory === 'all'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-sm'
                                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                                    }
                `}
                            >
                                All Stories
                            </button>
                            <StoryTypeSelector
                                selected={selectedCategory === 'all' ? '' : selectedCategory}
                                onChange={setSelectedCategory}
                                variant="tabs"
                            />
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-80"></div>
                            </div>
                        ))}
                    </div>
                ) : stories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story) => (
                            <StoryCard key={story.id} story={story} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">
                            <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No stories found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Be the first to share your story in this category!
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {stories.length > 0 && (
                    <div className="mt-8 flex justify-center gap-2">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-400"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                            Page {page}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-400"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
