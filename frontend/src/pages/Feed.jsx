import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Star, ArrowRight, BookOpen, Heart, Clock } from 'lucide-react';
import StoryCard from '../components/PostCard';
import StoryTypeSelector from '../components/StoryTypeSelector';
import StoryTypeShowcase from '../components/StoryTypeShowcase';
import { getApiUrl } from '../config/api';

export default function Feed() {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('smart');  // Default to smart ranking
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
        { value: 'smart', label: 'For You', icon: Sparkles },
        { value: 'latest', label: 'Latest', icon: Clock },
        { value: 'trending', label: 'Trending', icon: TrendingUp },
        { value: 'most_viewed', label: 'Most Viewed', icon: Star }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900">

            {/* Hero Section - quieter, more grounded */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/40 via-stone-100/20 to-transparent dark:from-amber-950/20 dark:via-zinc-900 dark:to-zinc-900 border-b border-stone-200/50 dark:border-zinc-800 -mt-16 pt-16">
                {/* Single subtle floating orb - morning fog feel */}
                <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 md:py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Content - Premium Hero */}
                        <div className="flex-1 text-center lg:text-left animate-slide-up relative">
                            {/* Decorative quote mark - hidden on small mobile */}
                            <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 lg:-top-8 lg:-left-8 text-6xl sm:text-8xl lg:text-9xl font-serif text-primary-200/30 dark:text-primary-800/20 select-none pointer-events-none hidden sm:block" aria-hidden="true">
                                "
                            </div>

                            {/* Badge with pulse */}
                            <div className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/30 mb-4 sm:mb-6 shadow-lg shadow-primary-500/10">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                                </span>
                                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-500 fill-primary-500/30" />
                                <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                                    Stories that touch hearts
                                </span>
                            </div>

                            {/* Main heading with unique styling */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
                                <span className="block text-gray-900 dark:text-white">
                                    Discover
                                </span>
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-stone-500 bg-clip-text text-transparent">
                                        Real Stories
                                    </span>
                                    {/* Underline decoration - single muted amber for sincerity */}
                                    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2 8C30 4 70 2 100 6C130 10 170 8 198 4" stroke="#d97706" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.7" />
                                    </svg>
                                </span>
                            </h1>

                            {/* Grounding subline - emotional anchor */}
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 italic mb-3 sm:mb-4">
                                Written by real people. Read by those who understand.
                            </p>

                            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-lg leading-relaxed px-2 sm:px-0">
                                From <span className="font-semibold text-amber-700 dark:text-amber-400">achievements</span> to
                                <span className="font-semibold text-stone-600 dark:text-stone-400"> life lessons</span>, explore
                                authentic narratives from storytellers worldwide.
                            </p>

                            {/* CTA Section */}
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 justify-center lg:justify-start w-full sm:w-auto">
                                <a href="/feed/create" className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-lg shadow-amber-600/20 hover:shadow-xl hover:shadow-amber-600/25 hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto text-sm sm:text-base">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span>Write Something You've Been Holding In</span>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 rounded-xl sm:rounded-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    </div>
                                </a>

                                {/* Simple authentic tagline */}
                                <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 fill-rose-500" />
                                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-400 fill-rose-400 -ml-1.5 mt-1.5" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                                        Community-powered
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Premium Story Types Showcase */}
                        <div className="flex-1 max-w-xl animate-slide-up stagger-2">
                            <StoryTypeShowcase
                                selectedCategory={selectedCategory}
                                onSelectCategory={setSelectedCategory}
                            />
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
                                        title={option.label}
                                        className={`
                                            group relative flex items-center justify-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300
                                            ${isActive
                                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon className={`w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? 'text-primary-500' : 'group-hover:scale-110 group-hover:text-primary-500'}`} />
                                        <span className="hidden sm:inline relative">
                                            {option.label}
                                            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Filters - Horizontal Scroll on Mobile, Justified on Desktop */}
                    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-2 md:gap-0 md:justify-between min-w-max md:min-w-0 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">Type:</span>
                            <button
                                onClick={() => setSelectedCategory('all')}
                                title="All Stories"
                                className={`
                                    group relative px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300
                                    ${selectedCategory === 'all'
                                        ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                <span className="relative">
                                    <span className="sm:hidden">All</span>
                                    <span className="hidden sm:inline">All Stories</span>
                                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gray-900 dark:bg-white transition-all duration-300 ${selectedCategory === 'all' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                                </span>
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
