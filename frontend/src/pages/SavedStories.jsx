import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Bookmark, 
    ArrowLeft, 
    Compass, 
    Search, 
    Clock, 
    Feather, 
    Trash2 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api';
import StoryCard from '../components/PostCard';

export default function SavedStories() {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [removingId, setRemovingId] = useState(null);

    const fetchSavedStories = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('/api/posts/bookmarks'), {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                // Support both paginated structure ({ items: [...] }) and flat array
                setStories(data.items || data.posts || (Array.isArray(data) ? data : []));
            } else {
                setStories([]);
            }
        } catch (error) {
            console.error('Failed to fetch saved stories:', error);
            toast.error('Unable to load saved reflections');
            setStories([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSavedStories();
    }, [fetchSavedStories]);

    const handleRemoveBookmark = async (e, storyId) => {
        e.preventDefault();
        e.stopPropagation();

        setRemovingId(storyId);
        try {
            const response = await fetch(getApiUrl(`/api/posts/${storyId}/bookmark`), {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setStories(prev => prev.filter(s => (s.id || s.public_id) !== storyId));
                toast.success('Removed from saved reflections');
            } else {
                toast.error('Unable to remove bookmark');
            }
        } catch (error) {
            console.error('Failed to remove bookmark:', error);
            toast.error('Network error. Bookmark not removed.');
        } finally {
            setRemovingId(null);
        }
    };

    // Filter stories by client search query
    const filteredStories = stories.filter(story => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const titleMatch = story.title && story.title.toLowerCase().includes(q);
        const contentMatch = story.content && story.content.toLowerCase().includes(q);
        const authorMatch = story.author?.display_name && story.author.display_name.toLowerCase().includes(q);
        return titleMatch || contentMatch || authorMatch;
    });

    if (loading) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">
                        Opening your saved reflections...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
            {/* Top Sanctuary Control Console */}
            <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Navigation */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => navigate('/feed')}
                            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
                            aria-label="Return to feed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Return to Sanctuary</span>
                            <span className="sm:hidden">Sanctuary</span>
                        </button>

                        <div className="hidden sm:block w-[1px] h-4 bg-[#EADDCF] dark:bg-[#2C2723]" />

                        <span className="hidden sm:inline text-xs text-stone-500 dark:text-stone-400 font-body">
                            {stories.length} {stories.length === 1 ? 'saved reflection' : 'saved reflections'}
                        </span>
                    </div>

                    {/* Right: Quick Explore Action */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/feed"
                            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50 rounded-xl text-xs font-medium transition-all"
                        >
                            <Compass className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                            <span className="hidden sm:inline">Explore Feed</span>
                            <span className="sm:hidden">Explore</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
                {/* Hero Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="text-left">
                        <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                            Personal Archive
                        </span>
                        <h1 className="font-stories text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                            Saved Reflections
                        </h1>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5 max-w-xl">
                            Stories you have kept close. Return to them whenever you need solace, courage, or quiet understanding.
                        </p>
                    </div>

                    {/* Filter Search Input (when stories exist) */}
                    {stories.length > 0 && (
                        <div className="relative max-w-xs w-full">
                            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search saved stories..."
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-[#FFFDF9] dark:bg-[#181614] text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 transition-colors"
                            />
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {stories.length === 0 ? (
                    <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 sm:p-14 text-center shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] max-w-2xl mx-auto space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/40">
                            <Bookmark className="w-6 h-6 stroke-[1.75]" />
                        </div>

                        <div>
                            <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mb-2 font-normal">
                                Your archive is quiet
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                                You have not saved any reflections yet. When you encounter words on HeartOut that resonate with you, bookmark them to revisit here.
                            </p>
                        </div>

                        <p className="font-body text-xs text-stone-400 dark:text-stone-500 italic">
                            Saved stories are strictly private and accessible only to your account.
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/feed"
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                            >
                                <Compass className="w-4 h-4" />
                                <span>Explore Stories</span>
                            </Link>
                        </div>
                    </article>
                ) : filteredStories.length === 0 ? (
                    /* Search empty state */
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 text-center max-w-md mx-auto">
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            No saved reflections match "{searchQuery}".
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-3 text-xs text-[#C85828] hover:underline font-medium"
                        >
                            Clear search
                        </button>
                    </div>
                ) : (
                    /* Stories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStories.map((story, index) => {
                            const storyId = story.id || story.public_id;
                            const isRemoving = removingId === storyId;

                            return (
                                <div key={storyId} className="relative group">
                                    <StoryCard story={story} index={index} />

                                    {/* Quick Remove Bookmark Overlay Button */}
                                    <button
                                        onClick={(e) => handleRemoveBookmark(e, storyId)}
                                        disabled={isRemoving}
                                        aria-label="Remove from saved stories"
                                        title="Remove from saved"
                                        className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#FFFDF9]/95 dark:bg-[#181614]/95 border border-[#EADDCF] dark:border-[#2C2723] text-stone-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-900/60 shadow-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
                                    >
                                        {isRemoving ? (
                                            <div className="w-3.5 h-3.5 border-2 border-stone-300 border-t-[#C85828] rounded-full animate-spin" />
                                        ) : (
                                            <Trash2 className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
