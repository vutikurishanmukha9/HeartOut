import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Star, ArrowRight, BookOpen, Heart } from 'lucide-react';
import StoryCard from '../components/PostCard';
import StoryTypeSelector from '../components/StoryTypeSelector';
import { getApiUrl } from '../config/api';

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

            const response = await fetch(getApiUrl(`/api/posts?${params}`));
            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        } finally {
            setLoading(false);
        }
    };

    const sortOptions = [
        { value: 'latest', label: 'Latest', icon: Sparkles },
        { value: 'trending', label: 'Trending', icon: TrendingUp },
        { value: 'most_viewed', label: 'Most Viewed', icon: Star }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-accent-500/10 dark:from-primary-900/20 dark:via-secondary-900/20 dark:to-accent-900/20 border-b border-white/20 dark:border-gray-800">
                {/* Floating Decorative Elements */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl animate-float-slow" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-secondary-400/10 rounded-full blur-2xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left animate-slide-up">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-700/30 mb-6">
                                <Heart className="w-4 h-4 text-primary-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stories that touch hearts</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                                <span className="text-gray-900 dark:text-white">Discover </span>
                                <span className="text-gradient">Real Stories</span>
                            </h1>

                            <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-xl">
                                From achievements to life lessons, explore authentic narratives from people around the world.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                <a href="/feed/create" className="btn-premium inline-flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" />
                                    Share Your Story
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                    <div className="flex -space-x-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 border-2 border-white dark:border-gray-800" />
                                        ))}
                                    </div>
                                    <span className="text-sm">Join 1,000+ storytellers</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Stats Cards */}
                        <div className="flex-1 grid grid-cols-2 gap-4 max-w-md animate-slide-up stagger-2">
                            {[
                                { label: 'Stories Shared', value: '2.5K+', color: 'from-primary-500 to-rose-500' },
                                { label: 'Active Readers', value: '10K+', color: 'from-secondary-500 to-amber-500' },
                                { label: 'Hearts Given', value: '50K+', color: 'from-accent-500 to-purple-500' },
                                { label: 'Countries', value: '45+', color: 'from-blue-500 to-cyan-500' }
                            ].map((stat, i) => (
                                <div key={i} className="glass-card rounded-2xl p-5 text-center hover:shadow-glow transition-all duration-300 group">
                                    <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`}>
                                        {stat.value}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters Section */}
                <div className="mb-10 space-y-4">
                    {/* Sort Options - Horizontal Scroll on Mobile */}
                    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 md:gap-3 min-w-max pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">Sort:</span>
                            {sortOptions.map((option) => {
                                const Icon = option.icon;
                                const isActive = sortBy === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => setSortBy(option.value)}
                                        className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                                        ${isActive
                                                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg shadow-primary-500/30 scale-105'
                                                : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:shadow-md'
                                            }
                                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Filters - Horizontal Scroll on Mobile */}
                    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 md:gap-3 min-w-max pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">Type:</span>
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`
                                px-5 py-2.5 rounded-xl font-medium transition-all duration-300
                                ${selectedCategory === 'all'
                                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                        : 'bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400'
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

                {/* Stories Grid - Full width on mobile */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="glass-card rounded-2xl overflow-hidden">
                                <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-3">
                                        <div className="skeleton w-10 h-10 rounded-xl" />
                                        <div className="space-y-2 flex-1">
                                            <div className="skeleton h-4 w-24 rounded" />
                                            <div className="skeleton h-3 w-16 rounded" />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="skeleton h-6 w-3/4 rounded" />
                                    <div className="skeleton h-4 w-full rounded" />
                                    <div className="skeleton h-4 w-2/3 rounded" />
                                    <div className="flex gap-2 pt-4">
                                        <div className="skeleton h-6 w-16 rounded-full" />
                                        <div className="skeleton h-6 w-16 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : stories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stories.map((story, index) => (
                            <StoryCard key={story.id} story={story} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 mb-6">
                            <BookOpen className="w-10 h-10 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            No stories found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Be the first to share your story and inspire others with your experiences.
                        </p>
                        <a href="/feed/create" className="btn-premium inline-flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            Write the First Story
                        </a>
                    </div>
                )}

                {/* Pagination - Premium */}
                {stories.length > 0 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-400 hover:shadow-md transition-all duration-300"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-bold">
                                {page}
                            </span>
                        </div>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-6 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-primary-400 hover:shadow-md transition-all duration-300"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
