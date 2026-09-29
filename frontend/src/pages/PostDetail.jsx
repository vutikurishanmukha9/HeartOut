import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Clock, 
    Share2, 
    Bookmark, 
    MessageSquare, 
    Trash2, 
    Check, 
    Copy, 
    Feather, 
    AlertTriangle, 
    Eye, 
    MoreHorizontal 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { storyTypes } from '../components/StoryTypeSelector';
import ReactionButton from '../components/SupportButton';
import { AuthContext } from '../context/AuthContext';
import { sanitizeText } from '../utils/sanitize';
import { getApiUrl, apiFetch } from '../config/api';
import { formatFullDate, formatCommentDate } from '../utils/dateFormat';
import { StorySEO } from '../components/SEO';
import haptic from '../utils/haptics';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Core data states
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Interaction states
    const [commentText, setCommentText] = useState('');
    const [isAnonymousComment, setIsAnonymousComment] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [userReaction, setUserReaction] = useState(null);
    const [supportCount, setSupportCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Author management states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAuthorMenu, setShowAuthorMenu] = useState(false);

    // Read progress tracking
    const startTimeRef = useRef(Date.now());
    const maxScrollDepthRef = useRef(0);
    const authorMenuRef = useRef(null);

    // Send read progress telemetry to backend
    const sendReadProgress = useCallback(async () => {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent < 3) return;

        try {
            await apiFetch(`/api/posts/${id}/read-progress`, {
                method: 'POST',
                body: JSON.stringify({
                    scroll_depth: maxScrollDepthRef.current,
                    time_spent: timeSpent
                })
            });
        } catch (error) {
            // Telemetry failure is intentionally non-blocking
        }
    }, [id]);

    useEffect(() => {
        fetchStory();
        fetchComments();
        if (user) {
            fetchUserReaction();
            fetchBookmarkStatus();
        }

        startTimeRef.current = Date.now();

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                const scrolled = window.scrollY / scrollHeight;
                maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, Math.min(1, scrolled));
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            sendReadProgress();
        };
    }, [id, user, sendReadProgress]);

    // Handle tab visibility switch
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                sendReadProgress();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [sendReadProgress]);

    // Click outside author dropdown menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (authorMenuRef.current && !authorMenuRef.current.contains(event.target)) {
                setShowAuthorMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchStory = async () => {
        try {
            const response = await apiFetch(`/api/posts/${id}`);
            const data = await response.json();
            if (response.ok && data.story) {
                setStory(data.story);
                setSupportCount(data.story.support_count || 0);
            } else {
                setStory(null);
            }
        } catch (error) {
            console.error('Failed to fetch story:', error);
            setStory(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await apiFetch(`/api/posts/${id}/comments`);
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const fetchUserReaction = async () => {
        try {
            const response = await apiFetch(`/api/posts/${id}/my-reaction`);
            if (response.ok) {
                const data = await response.json();
                setUserReaction(data.reaction_type);
            }
        } catch (error) {
            console.error('Failed to fetch user reaction:', error);
        }
    };

    const fetchBookmarkStatus = async () => {
        try {
            const response = await apiFetch(`/api/posts/${id}/bookmark`);
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.is_bookmarked);
            }
        } catch (error) {
            console.error('Failed to fetch bookmark status:', error);
        }
    };

    const handleToggleBookmark = async () => {
        if (!user) {
            haptic.warning();
            toast.error('Please sign in to save stories');
            navigate('/auth/login');
            return;
        }

        haptic.medium();
        const prevBookmarked = isBookmarked;
        setIsBookmarked(!prevBookmarked);
        setBookmarkLoading(true);

        try {
            const response = await apiFetch(`/api/posts/${id}/bookmark`, {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.is_bookmarked);
                if (data.is_bookmarked) {
                    haptic.success();
                }
                toast.success(data.is_bookmarked ? 'Saved to your sanctuary' : 'Removed from saved stories');
            } else {
                setIsBookmarked(prevBookmarked);
                toast.error('Unable to update bookmark');
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
            setIsBookmarked(prevBookmarked);
            toast.error('Network error. Bookmark not updated.');
        } finally {
            setBookmarkLoading(false);
        }
    };

    const handleReact = async (type) => {
        if (!user) {
            toast.error('Please sign in to leave a reaction');
            navigate('/auth/login');
            return;
        }

        // Optimistic UI state update
        const prevReaction = userReaction;
        const prevCount = supportCount;

        let newReaction = type;
        let countDiff = 1;

        if (prevReaction === type) {
            newReaction = null;
            countDiff = -1;
        } else if (prevReaction) {
            countDiff = 0;
        }

        setUserReaction(newReaction);
        setSupportCount(Math.max(0, prevCount + countDiff));

        try {
            const response = await apiFetch(`/api/posts/${id}/toggle-react`, {
                method: 'POST',
                body: JSON.stringify({ support_type: type })
            });

            if (response.ok) {
                const data = await response.json();
                setUserReaction(data.user_reaction);
                setSupportCount(data.support_count);
            } else {
                throw new Error('Reaction failed on server');
            }
        } catch (error) {
            console.error('Failed to react:', error);
            setUserReaction(prevReaction);
            setSupportCount(prevCount);
            toast.error('Unable to record reaction');
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;

        if (!user) {
            toast.error('Please sign in to leave a response');
            navigate('/auth/login');
            return;
        }

        setSubmittingComment(true);
        try {
            const response = await apiFetch(`/api/posts/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify({
                    content: commentText.trim(),
                    is_anonymous: isAnonymousComment
                })
            });

            if (response.ok) {
                haptic.success();
                setCommentText('');
                toast.success('Your response has been shared');
                fetchComments();
                fetchStory();
            } else {
                haptic.warning();
                const data = await response.json();
                toast.error(data.error || 'Failed to submit response');
            }
        } catch (error) {
            haptic.error();
            console.error('Failed to comment:', error);
            toast.error('Network error. Could not post response.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleShare = async () => {
        haptic.selection();
        const shareData = {
            title: story?.title || 'HeartOut Story',
            text: `Read this reflection on HeartOut: ${story?.title || ''}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // If user cancels share sheet, ignore error
                if (err.name !== 'AbortError') {
                    fallbackCopy();
                }
            }
        } else {
            fallbackCopy();
        }
    };

    const fallbackCopy = () => {
        haptic.success();
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success('Story link copied to clipboard');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleDelete = async () => {
        haptic.heavy();
        setIsDeleting(true);
        try {
            const response = await apiFetch(`/api/posts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Story deleted from sanctuary');
                navigate('/feed');
            } else {
                const data = await response.json();
                toast.error(data.error || 'Failed to delete story');
                setShowDeleteModal(false);
                setIsDeleting(false);
            }
        } catch (error) {
            console.error('Failed to delete story:', error);
            toast.error('Network error. Story could not be deleted.');
            setShowDeleteModal(false);
            setIsDeleting(false);
        }
    };

    const isAuthor = user && story?.author?.id === user.id;

    if (loading) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">Opening reflection...</p>
                </div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-900/40">
                        <Feather className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h2 className="font-stories text-2xl text-stone-900 dark:text-stone-100 mb-2">
                        Reflection not found
                    </h2>
                    <p className="font-body text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                        This story may have been removed by its author, or the link may be incomplete.
                    </p>
                    <Link
                        to="/feed"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Sanctuary</span>
                    </Link>
                </div>
            </div>
        );
    }

    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const StoryTypeIcon = storyType.icon;
    const authorDisplayName = story.is_anonymous 
        ? 'Anonymous Soul' 
        : (story.author?.display_name || story.author?.username || 'Anonymous Soul');

    return (
        <>
            <StorySEO story={story} />

            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
                {/* Top Sanctuary Control Bar */}
                <header className="sticky top-0 z-40 py-3 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                    <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                        {/* Left: Back to Feed */}
                        <button
                            onClick={() => navigate('/feed')}
                            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
                            aria-label="Return to feed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Return to Feed</span>
                            <span className="sm:hidden">Feed</span>
                        </button>

                        {/* Center / Right: Telemetry & Actions */}
                        <div className="flex items-center gap-2.5 sm:gap-4">
                            {/* Reading duration */}
                            <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 font-body">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{story.reading_time || 1} min read</span>
                            </div>

                            <div className="hidden sm:block w-[1px] h-3.5 bg-[#EADDCF] dark:bg-[#2C2723]" />

                            {/* Bookmark Action */}
                            <button
                                onClick={handleToggleBookmark}
                                disabled={bookmarkLoading}
                                aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark reflection'}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${isBookmarked
                                    ? 'bg-amber-100/80 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-300 border border-amber-300/80 dark:border-amber-800/60'
                                    : 'bg-[#FFFDF9] dark:bg-[#181614] text-stone-600 dark:text-stone-400 border border-[#EADDCF] dark:border-[#2C2723] hover:border-amber-400/60 hover:text-stone-900 dark:hover:text-stone-100'
                                }`}
                            >
                                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                                <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                            </button>

                            {/* Share Action */}
                            <button
                                onClick={handleShare}
                                aria-label="Share story"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/60 rounded-xl text-xs font-medium transition-all"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                                <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
                            </button>

                            {/* Author dropdown if owner */}
                            {isAuthor && (
                                <div className="relative" ref={authorMenuRef}>
                                    <button
                                        onClick={() => setShowAuthorMenu(!showAuthorMenu)}
                                        aria-label="Story author actions"
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                                    >
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>

                                    {showAuthorMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF9] dark:bg-[#181614] rounded-2xl shadow-xl border border-[#EADDCF] dark:border-[#2C2723] py-1.5 z-50">
                                            <button
                                                onClick={() => {
                                                    setShowAuthorMenu(false);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:bg-red-50/70 dark:hover:bg-red-950/20 font-medium transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete Reflection</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Reading Container */}
                <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                    
                    {/* Story Header & Byline */}
                    <div className="mb-6 sm:mb-8 text-left">
                        
                        {/* Category Capsule */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-semibold tracking-wide uppercase mb-4 bg-[#FFFDF9] dark:bg-[#181614] border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300">
                            <StoryTypeIcon className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" strokeWidth={1.75} />
                            <span>{storyType.label}</span>
                        </div>

                        {/* Title in Literary Serif */}
                        <h1 className="font-stories text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-100 font-normal leading-[1.18] tracking-tight mb-5">
                            {story.title}
                        </h1>

                        {/* Byline & Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-body text-stone-500 dark:text-stone-400 pb-4 border-b border-[#EADDCF]/80 dark:border-[#2C2723]">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center font-medium text-xs">
                                    {story.is_anonymous ? (
                                        <Feather className="w-3.5 h-3.5 stroke-[1.75]" />
                                    ) : (
                                        authorDisplayName.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <span className="font-semibold text-stone-800 dark:text-stone-200">
                                    {authorDisplayName}
                                </span>
                            </div>

                            <span className="text-stone-300 dark:text-stone-700">·</span>

                            <time dateTime={story.created_at} className="text-stone-500 dark:text-stone-400">
                                {formatFullDate(story.created_at)}
                            </time>

                            <span className="text-stone-300 dark:text-stone-700">·</span>

                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{story.reading_time || 1} min read</span>
                            </div>

                            {story.views_count !== undefined && story.views_count > 0 && (
                                <>
                                    <span className="text-stone-300 dark:text-stone-700">·</span>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-3.5 h-3.5" />
                                        <span>{story.views_count} {story.views_count === 1 ? 'read' : 'reads'}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Tags */}
                        {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {story.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-[#FFFDF9] dark:bg-[#181614] text-stone-600 dark:text-stone-400 border border-[#EADDCF] dark:border-[#2C2723]"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Story Parchment Card */}
                    <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] mb-10 transition-colors">
                        
                        {/* Main Body Prose */}
                        <div className="prose-sanctuary">
                            <p className="font-body text-base sm:text-lg lg:text-[19px] text-stone-800 dark:text-stone-200 leading-[1.85] whitespace-pre-wrap font-normal selection:bg-amber-200/60 dark:selection:bg-amber-900/50">
                                {sanitizeText(story.content)}
                            </p>
                        </div>

                        {/* Visual Breath / Literary Ending Mark */}
                        <div className="my-10 flex items-center justify-center gap-3">
                            <div className="h-[1px] w-16 bg-[#EADDCF] dark:bg-[#2C2723]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C85828] opacity-75" />
                            <div className="h-[1px] w-16 bg-[#EADDCF] dark:bg-[#2C2723]" />
                        </div>

                        <p className="text-center font-body text-xs text-stone-400 dark:text-stone-500 italic">
                            Thank you for reading with patience and care.
                        </p>

                        {/* Interactive Sanctuary Action Row */}
                        <div className="mt-8 pt-6 border-t border-[#EADDCF]/80 dark:border-[#2C2723] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                            
                            {/* Left: Reaction gesture with quiet microcopy */}
                            <div className="flex flex-col gap-1.5">
                                <ReactionButton
                                    storyId={story.id}
                                    currentReaction={userReaction}
                                    onReact={handleReact}
                                    supportCount={supportCount}
                                />
                                <span className="text-[11px] text-stone-400 dark:text-stone-500 italic pl-1">
                                    A quiet gesture: "I hear you."
                                </span>
                            </div>

                            {/* Right: Response count and share button */}
                            <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EADDCF]/40 dark:border-[#2C2723]/40">
                                <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{comments.length} {comments.length === 1 ? 'response' : 'responses'}</span>
                                </div>

                                <button
                                    onClick={handleShare}
                                    aria-label="Share this story"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] hover:border-[#C85828]/60 dark:hover:border-amber-400/50 hover:text-[#C85828] dark:hover:text-amber-400 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />}
                                    <span>{copied ? 'Link Copied' : 'Share Story'}</span>
                                </button>
                            </div>

                        </div>
                    </article>

                    {/* Community Responses Section */}
                    <section className="space-y-6">
                        
                        {/* Section Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                                    Community Responses
                                </h2>
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                                    This is a quiet space for support and presence, not debate or judgment.
                                </p>
                            </div>

                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300">
                                {comments.length}
                            </span>
                        </div>

                        {/* Response Composer Card */}
                        <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-5 sm:p-6 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Leave a gentle reflection or supportive thought..."
                                rows={3}
                                className="w-full bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-3.5 sm:p-4 text-stone-800 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm sm:text-base focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 resize-none transition-all"
                            />

                            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-[#EADDCF]/60 dark:border-[#2C2723]">
                                <label className="flex items-center gap-2 text-xs sm:text-sm text-stone-600 dark:text-stone-400 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymousComment}
                                        onChange={(e) => setIsAnonymousComment(e.target.checked)}
                                        className="rounded border-[#EADDCF] dark:border-[#2C2723] text-[#C85828] focus:ring-[#C85828] bg-white dark:bg-[#181614]"
                                    />
                                    <span>Share anonymously</span>
                                </label>

                                <button
                                    onClick={handleComment}
                                    disabled={!commentText.trim() || submittingComment}
                                    className="inline-flex items-center justify-center px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#C85828] hover:bg-[#B54D20] active:scale-[0.98] rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                                >
                                    {submittingComment ? 'Sending...' : 'Respond'}
                                </button>
                            </div>
                        </div>

                        {/* Responses List */}
                        {comments.length === 0 ? (
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-8 text-center">
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 italic">
                                    No responses yet. Your gentle words can be the first comfort here.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {comments.map((comment) => {
                                    const commentAuthor = comment.is_anonymous
                                        ? 'Anonymous Voice'
                                        : (comment.author?.display_name || comment.author?.username || 'Anonymous Voice');

                                    return (
                                        <div
                                            key={comment.id}
                                            className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-4 sm:p-5 shadow-sm transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-zinc-700/60 flex items-center justify-center font-medium text-xs flex-shrink-0 mt-0.5">
                                                    {comment.is_anonymous ? (
                                                        <Feather className="w-3.5 h-3.5 stroke-[1.75]" />
                                                    ) : (
                                                        commentAuthor.charAt(0).toUpperCase()
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2 mb-1.5">
                                                        <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                                                            {commentAuthor}
                                                        </span>
                                                        <span className="text-[11px] text-stone-400 dark:text-stone-500 flex-shrink-0">
                                                            {formatCommentDate(comment.created_at)}
                                                        </span>
                                                    </div>

                                                    <p className="font-body text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-wrap">
                                                        {comment.content}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </section>
                </main>
            </div>

            {/* Author Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="fixed inset-0 bg-stone-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity" 
                        onClick={() => !isDeleting && setShowDeleteModal(false)}
                    />

                    <div className="relative bg-[#FFFDF9] dark:bg-[#181614] rounded-3xl border border-[#EADDCF] dark:border-[#2C2723] p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 animate-scale-in">
                        <div className="w-12 h-12 rounded-2xl bg-red-100/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-200/70 dark:border-red-900/50">
                            <Trash2 className="w-6 h-6 stroke-[1.75]" />
                        </div>

                        <h3 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mb-2 font-normal">
                            Delete this reflection?
                        </h3>

                        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-6">
                            Are you sure you want to remove <span className="font-medium text-stone-800 dark:text-stone-200">"{story.title}"</span>? This action is permanent and will remove all reactions and community responses.
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="px-5 py-2.5 text-xs sm:text-sm font-medium rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                Keep Story
                            </button>

                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 min-w-[120px]"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    'Delete Story'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
