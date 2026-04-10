import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Star, BookOpen, Heart, Clock, ArrowDown } from 'lucide-react';
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
        { value: 'smart', label: 'Recommended for You', icon: Sparkles },
        { value: 'latest', label: 'Recently Shared', icon: Clock },
        { value: 'trending', label: 'Many Are Reading', icon: TrendingUp },
        { value: 'most_viewed', label: 'Often Returned To', icon: Star }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900">

            {/* Hero Section - quieter, more grounded */}
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/40 via-stone-100/20 to-transparent dark:from-amber-950/20 dark:via-zinc-900 dark:to-zinc-900 border-b border-stone-200/50 dark:border-zinc-800 -mt-16 pt-16">
                {/* Subtle intentional background wash */}
                <div className="absolute top-20 right-20 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-16 md:pt-2 md:pb-24 lg:pt-4 lg:pb-32">
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
                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 italic mb-3 sm:mb-4">
                                Written by real people. Read by those who understand.
                            </p>

                            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-lg leading-relaxed px-2 sm:px-0">
                                From <span className="font-semibold text-amber-700 dark:text-amber-400">achievements</span> to
                                <span className="font-semibold text-stone-600 dark:text-stone-400"> life lessons</span>, explore
                                authentic narratives from storytellers worldwide.
                            </p>

                            {/* CTA Section */}
                            <div className="flex flex-col items-center lg:items-start gap-3 mt-8 w-full sm:w-auto">
                                {/* Simple authentic tagline */}
                                <div className="auth-pill mb-1">
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                        <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400 -ml-1.5 mt-1.5" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Community-powered</span>
                                </div>

                                <Link to="/feed/create" className="btn-premium flex items-center justify-center gap-2 px-8 py-3.5 w-full sm:w-auto text-sm sm:text-base">
                                    <BookOpen className="w-5 h-5" />
                                    <span>Write Something You've Been Holding In</span>
                                </Link>
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
                {/* Filters Section */}
                <div className="mb-10 space-y-6">
                    {/* Sort Options - Horizontal Scroll on Mobile */}
                    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-3 md:gap-4 min-w-max pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 uppercase tracking-widest pl-1">Show me</span>
                            <div className="flex gap-2 p-1">
                                {sortOptions.map((option) => {
                                    const Icon = option.icon;
                                    const isActive = sortBy === option.value;
                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => setSortBy(option.value)}
                                            title={option.label}
                                            className={`
                                                group relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                                ${isActive
                                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 ring-1 ring-primary-500/20'
                                                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800/50'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? 'opacity-100 scale-110' : 'opacity-70 group-hover:scale-105'}`} strokeWidth={1.5} />
                                            <span className="hidden sm:inline relative">
                                                {option.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Subtle divider */}
                    <div className="border-t border-stone-200/50 dark:border-zinc-700/50" />

                    {/* Category Filters - Horizontal Scroll on Mobile, Justified on Desktop */}
                    <div className="-mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide">
                        <div className="flex items-center gap-3 md:gap-4 min-w-max md:min-w-0 pb-2">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0 uppercase tracking-widest pl-1">Kind of story</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    title="All Stories"
                                    className={`
                                        group relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                                        ${selectedCategory === 'all'
                                            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 ring-1 ring-primary-500/20'
                                            : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-zinc-800/50'
                                        }
                                    `}
                                >
                                    <Sparkles strokeWidth={1.5} className={`w-4 h-4 shrink-0 transition-all duration-300 ${selectedCategory === 'all' ? 'opacity-100 scale-110' : 'opacity-70 group-hover:scale-105'}`} />
                                    <span className="hidden sm:inline relative">
                                        All Stories
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
                </div>

                {/* Main Content Layout: 65/35 Split */}
                <div className="flex flex-col xl:flex-row gap-8 lg:gap-12 mt-8">
                    
                    {/* Left Column: Main Feed */}
                    <div className="flex-1 w-full relative">
                        {/* Loading State Skeleton */}
                        {loading && stories.length === 0 ? (
                            <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="break-inside-avoid bg-white/80 dark:bg-zinc-800/80 rounded-xl border border-stone-200/60 dark:border-zinc-700/60 overflow-hidden mb-6">
                                        <div className="p-5 space-y-4">
                                            <div className="skeleton h-6 w-3/4 rounded bg-amber-500/10 animate-pulse" />
                                            <div className="skeleton h-4 w-full rounded bg-amber-500/10 animate-pulse" />
                                            <div className="flex justify-between items-center pt-2">
                                                <div className="skeleton h-6 w-24 rounded-full bg-amber-500/10" />
                                                <div className="skeleton h-4 w-16 rounded bg-amber-500/10" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : stories.length > 0 ? (
                            <div className="w-full">
                                {/* Editorial context intro */}
                                <div className="py-8 text-center relative max-w-2xl mx-auto mb-6">
                                    <div className="absolute top-0 left-1/4 right-1/4 border-t border-amber-200/60 dark:border-amber-900/40" />
                                    <p className="text-lg text-stone-600 dark:text-stone-400 italic font-serif">
                                        "These are voices from people who chose to share something real."
                                    </p>
                                </div>
                                <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                                    {stories.map((story, index) => (
                                        <div key={story.id} className="break-inside-avoid mb-6 transform transition-all hover:z-10">
                                            <StoryCard story={story} index={index} />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Replace Pagination */}
                                <div className="mt-16 flex flex-col items-center justify-center">
                                    {loading ? (
                                        // Load More skeletons (append state)
                                        <div className="columns-1 sm:columns-2 gap-6 space-y-6 w-full opacity-60">
                                            {[...Array(2)].map((_, i) => (
                                                <div key={i} className="break-inside-avoid bg-amber-50/40 dark:bg-zinc-800/80 rounded-xl border border-amber-100 dark:border-zinc-700 overflow-hidden mb-6 shadow-sm">
                                                    <div className="p-5 space-y-4">
                                                        <div className="skeleton h-6 w-3/4 rounded bg-amber-500/20 animate-pulse" />
                                                        <div className="skeleton h-4 w-full rounded bg-amber-500/20 animate-pulse delay-75" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => { setPage(p => p + 1); fetchStories(); }}
                                            className="btn-premium flex items-center justify-center gap-2 px-10 py-3.5 w-full sm:w-auto text-sm sm:text-base font-semibold transition-all hover:scale-105 active:scale-95"
                                        >
                                            Load more stories
                                            <ArrowDown className="w-4 h-4 ml-1" strokeWidth={2} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 mb-6 shadow-inner">
                                    <BookOpen className="w-10 h-10 text-primary-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    No stories yet
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                    Be the first to share your story and inspire others with your experiences in this space.
                                </p>
                                <Link to="/feed/create" className="btn-premium inline-flex items-center gap-2">
                                    <BookOpen className="w-5 h-5" strokeWidth={1.5} />
                                    Write the First Story
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sidebar (Hidden on mobile) */}
                    <div className="hidden xl:block w-80 shrink-0 space-y-12 pl-8 border-l border-stone-200/50 dark:border-zinc-800">
                        {/* Trending Stories */}
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase mb-5 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-amber-500" strokeWidth={2} />
                                Trending Today
                            </h3>
                            <ul className="space-y-5">
                                {[
                                    { title: "I finally quit my job without a backup plan.", views: "2.4k", cat: "bg-orange-500" },
                                    { title: "To the person who returned my wallet.", views: "1.8k", cat: "bg-[#c1714a]" },
                                    { title: "I'm not exactly sure what I'm doing.", views: "1.2k", cat: "bg-amber-800" },
                                    { title: "Ten years later, I finally sent it.", views: "856", cat: "bg-[#9e5a5a]" }
                                ].map((item, i) => (
                                    <li key={i} className="group cursor-pointer">
                                        <div className="flex gap-3 items-start">
                                            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 shadow-sm ${item.cat}`} />
                                            <div>
                                                <h4 className="text-sm font-medium text-stone-800 dark:text-stone-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                                                    {item.title}
                                                </h4>
                                                <span className="text-xs text-stone-500 dark:text-stone-500 mt-1.5 block">
                                                    {item.views} readers
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <button className="text-xs font-bold text-amber-600 hover:text-amber-700 dark:hover:text-amber-500 mt-6 uppercase tracking-wide transition-colors">
                                See all trending →
                            </button>
                        </div>

                        {/* Featured Voices */}
                        <div>
                            <h3 className="text-xs font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase mb-6 flex items-center gap-2">
                                <Star className="w-4 h-4 text-amber-500" strokeWidth={2} />
                                Featured Voices
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { name: "QuietStorm", initial: "Q", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", quote: "Sometimes the heaviest burdens are the ones we never speak of." },
                                    { name: "WanderingSoul", initial: "W", color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400", quote: "I wanted to find closure, but I only found more questions." },
                                    { name: "MidnightWriter", initial: "M", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", quote: "The best apologies are the ones we give to ourselves." }
                                ].map((voice, i) => (
                                    <div key={i} className="flex gap-3.5 items-start group cursor-pointer">
                                        <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-sm ${voice.color}`}>
                                            {voice.initial}
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {voice.name}
                                            </div>
                                            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 italic leading-relaxed line-clamp-2">
                                                "{voice.quote}"
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
