import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Compass, 
    Clock, 
    TrendingUp, 
    BookOpen, 
    ArrowDown, 
    Feather, 
    Bookmark, 
    HeartHandshake, 
    ArrowRight 
} from 'lucide-react';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';
import { FeedSEO } from '../components/SEO';
import { getApiUrl } from '../config/api';

export default function Feed() {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('smart');
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);

    const fetchStories = useCallback(async (pageNum = 1, append = false) => {
        if (append) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const params = new URLSearchParams({
                page: pageNum.toString(),
                per_page: '15',
                sort_by: sortBy
            });

            if (selectedCategory !== 'all') {
                params.append('story_type', selectedCategory);
            }

            const response = await fetch(getApiUrl(`/api/posts?${params}`));
            const data = await response.json();

            if (response.ok && data.stories) {
                if (append) {
                    setStories(prev => [...prev, ...data.stories]);
                } else {
                    setStories(data.stories);
                }
                setHasNextPage(Boolean(data.has_next || (data.total_pages && pageNum < data.total_pages)));
            } else {
                if (!append) setStories([]);
                setHasNextPage(false);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            if (!append) setStories([]);
            setHasNextPage(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [selectedCategory, sortBy]);

    // Re-fetch from page 1 whenever category or sort changes
    useEffect(() => {
        setPage(1);
        fetchStories(1, false);
    }, [selectedCategory, sortBy, fetchStories]);

    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchStories(nextPage, true);
    };

    const sortOptions = [
        { value: 'smart', label: 'Recommended', icon: Compass },
        { value: 'latest', label: 'Recently Shared', icon: Clock },
        { value: 'trending', label: 'Many Are Reading', icon: TrendingUp },
        { value: 'most_viewed', label: 'Often Returned To', icon: BookOpen }
    ];

    return (
        <>
            <FeedSEO />

            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
                
                {/* Sanctuary Hero Banner */}
                <section className="border-b border-[#EADDCF]/80 dark:border-[#26221E] pt-8 sm:pt-14 pb-10 sm:pb-14 transition-colors">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            
                            <div className="max-w-2xl text-left">
                                {/* Eyebrow Capsule */}
                                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300 text-xs font-semibold tracking-wider uppercase mb-5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C85828] animate-pulse" />
                                    <span>Sanctuary Feed</span>
                                </div>

                                {/* Main Headline in Literary Serif */}
                                <h1 className="font-stories text-4xl sm:text-5xl lg:text-6xl text-stone-900 dark:text-stone-100 font-normal leading-[1.12] tracking-tight mb-4">
                                    Where quiet reflections <br className="hidden sm:inline" />
                                    <span className="italic text-[#C85828] dark:text-amber-400">find an honest home.</span>
                                </h1>

                                {/* Grounding Subline */}
                                <p className="font-body text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl">
                                    Unexpressed letters, private struggles, and hard-earned lessons shared anonymously or openly, free from social performance.
                                </p>
                            </div>

                            {/* Quick Navigation Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    to="/feed/create"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C85828] hover:bg-[#B54D20] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                                >
                                    <Feather className="w-4 h-4 stroke-[1.75]" />
                                    <span>Share a Reflection</span>
                                </Link>

                                <Link
                                    to="/feed/saved"
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50 text-xs sm:text-sm font-medium transition-all"
                                >
                                    <Bookmark className="w-4 h-4" />
                                    <span className="hidden sm:inline">Saved Stories</span>
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Discovery Controls Ribbon */}
                <section className="sticky top-0 z-30 py-3.5 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                        
                        {/* Sort Options Strip */}
                        <div className="flex items-center gap-2.5 overflow-x-auto overscroll-x-contain scrollbar-hide py-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 mr-1 font-body">
                                Ordering:
                            </span>

                            {sortOptions.map((option) => {
                                const IconComponent = option.icon;
                                const isActive = sortBy === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setSortBy(option.value)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${isActive
                                            ? 'bg-[#C85828] text-white shadow-sm'
                                            : 'bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50'
                                        }`}
                                    >
                                        <IconComponent className="w-3.5 h-3.5" />
                                        <span>{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Category Filter Chips */}
                        <div className="flex items-center gap-2 overflow-x-auto overscroll-x-contain scrollbar-hide pt-1 pb-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-stone-500 shrink-0 mr-1 font-body">
                                Topic:
                            </span>

                            <button
                                type="button"
                                onClick={() => setSelectedCategory('all')}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${selectedCategory === 'all'
                                    ? 'border-[#C85828] bg-amber-50/80 dark:bg-amber-950/30 text-[#C85828] dark:text-amber-400 border font-semibold'
                                    : 'bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                                }`}
                            >
                                <span>All Stories</span>
                            </button>

                            {storyTypes.map((type) => {
                                const TypeIcon = type.icon;
                                const isSelected = selectedCategory === type.value;

                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setSelectedCategory(type.value)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${isSelected
                                            ? 'border-[#C85828] bg-amber-50/80 dark:bg-amber-950/30 text-[#C85828] dark:text-amber-400 border font-semibold'
                                            : 'bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:border-amber-400/50'
                                        }`}
                                    >
                                        <TypeIcon className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                                        <span>{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                    </div>
                </section>

                {/* Main Feed Content Layout */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
                    <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-10">
                        
                        {/* Left Column: Stories Stream (68% width on desktop) */}
                        <main className="flex-1 w-full space-y-6">
                            
                            {/* Ethical Reading Reminder */}
                            <div className="flex items-center justify-between py-2 text-xs font-body text-stone-500 dark:text-stone-400 border-b border-[#EADDCF]/60 dark:border-[#2C2723]">
                                <span className="italic">
                                    Read with patience and care. These reflections are offered in trust.
                                </span>
                                <span>
                                    {stories.length} {stories.length === 1 ? 'reflection shown' : 'reflections shown'}
                                </span>
                            </div>

                            {/* Loading State Skeletons */}
                            {loading ? (
                                <div className="space-y-5">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 animate-pulse space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="h-4 w-28 bg-amber-600/10 rounded-full" />
                                                <div className="h-4 w-20 bg-amber-600/10 rounded-full" />
                                            </div>
                                            <div className="h-7 w-3/4 bg-amber-600/10 rounded-xl" />
                                            <div className="space-y-2">
                                                <div className="h-4 w-full bg-amber-600/10 rounded" />
                                                <div className="h-4 w-5/6 bg-amber-600/10 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : stories.length === 0 ? (
                                /* Empty State Card */
                                <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 sm:p-14 text-center shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] space-y-4">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/40">
                                        <Feather className="w-6 h-6 stroke-[1.75]" />
                                    </div>
                                    <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                                        No reflections in this category yet
                                    </h2>
                                    <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                                        You can be the first to speak. When you are ready, share your experience anonymously or openly with the sanctuary.
                                    </p>
                                    <div className="pt-2">
                                        <Link
                                            to="/feed/create"
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                                        >
                                            <Feather className="w-4 h-4 stroke-[1.75]" />
                                            <span>Share Your Story</span>
                                        </Link>
                                    </div>
                                </article>
                            ) : (
                                /* Stories Stream */
                                <div className="space-y-5">
                                    {stories.map((story, index) => (
                                        <div key={story.id || index}>
                                            <StoryCard story={story} index={index} />
                                        </div>
                                    ))}

                                    {/* Load More Trigger */}
                                    {hasNextPage && (
                                        <div className="pt-6 text-center">
                                            <button
                                                type="button"
                                                onClick={handleLoadMore}
                                                disabled={loadingMore}
                                                className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50 text-xs sm:text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
                                            >
                                                {loadingMore ? (
                                                    <>
                                                        <div className="w-4 h-4 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                                                        <span>Opening more reflections...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Load More Reflections</span>
                                                        <ArrowDown className="w-4 h-4" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                        </main>

                        {/* Right Column: Sanctuary Guides Sidebar (32% width on desktop) */}
                        <aside className="hidden lg:block w-80 shrink-0 space-y-6 text-left">
                            
                            {/* Card 1: Sanctuary Values */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                                <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                                    Guiding Principles
                                </span>
                                <h3 className="font-stories text-xl text-stone-900 dark:text-stone-100 font-normal mb-2">
                                    How We Read Here
                                </h3>
                                <ul className="space-y-3 text-xs font-body text-stone-600 dark:text-stone-400 leading-relaxed">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C85828] mt-1.5 shrink-0" />
                                        <span><strong>Presence over reaction:</strong> Stories here are read to understand, not to grade or debate.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C85828] mt-1.5 shrink-0" />
                                        <span><strong>Protected anonymity:</strong> When writers choose privacy, their identity is cryptographically held.</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C85828] mt-1.5 shrink-0" />
                                        <span><strong>No vanity metrics:</strong> No follower counts, no algorithmic clout, no performative hooks.</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Card 2: Writing Invitation */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                                <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                                    Unburden
                                </span>
                                <h3 className="font-stories text-xl text-stone-900 dark:text-stone-100 font-normal mb-2">
                                    What are you carrying?
                                </h3>
                                <p className="font-body text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                                    Whether it is an unsent letter, a silent regret, or a private victory nobody noticed: your words matter.
                                </p>
                                <Link
                                    to="/feed/create"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C85828] hover:text-[#B54D20] group"
                                >
                                    <span>Begin a reflection</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>

                            {/* Card 3: Compassionate Crisis Resources */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <HeartHandshake className="w-4 h-4 text-[#C85828] dark:text-amber-400" />
                                    <h3 className="font-stories text-lg text-stone-900 dark:text-stone-100 font-normal">
                                        Need Support?
                                    </h3>
                                </div>
                                <p className="font-body text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                                    If your story carries intense distress, verified confidential crisis counselors are available 24/7.
                                </p>
                                <Link
                                    to="/support"
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C85828] hover:text-[#B54D20] group"
                                >
                                    <span>View verified helplines</span>
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </div>

                        </aside>

                    </div>
                </div>
            </div>
        </>
    );
}
