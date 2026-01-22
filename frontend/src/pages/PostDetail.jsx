import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Eye, Calendar, Share2, Bookmark, MessageCircle, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { storyTypes } from '../components/StoryTypeSelector';
import ReactionButton from '../components/SupportButton';
import { AuthContext } from '../context/AuthContext';
import { sanitizeText } from '../utils/sanitize';
import { getApiUrl } from '../config/api';
import { formatFullDate, formatCommentDate } from '../utils/dateFormat';
import { StorySEO } from '../components/SEO';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [story, setStory] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [isAnonymousComment, setIsAnonymousComment] = useState(true);
    const [userReaction, setUserReaction] = useState(null);
    const [supportCount, setSupportCount] = useState(0);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Read progress tracking
    const startTimeRef = useRef(Date.now());
    const maxScrollDepthRef = useRef(0);
    const trackingIntervalRef = useRef(null);

    useEffect(() => {
        fetchStory();
        fetchComments();
        if (user) {
            fetchUserReaction();
            fetchBookmarkStatus();
        }

        // Start tracking time and scroll
        startTimeRef.current = Date.now();

        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY / scrollHeight;
            maxScrollDepthRef.current = Math.max(maxScrollDepthRef.current, Math.min(1, scrolled));
        };

        window.addEventListener('scroll', handleScroll);

        // Send progress on unmount or visibility change
        return () => {
            window.removeEventListener('scroll', handleScroll);
            sendReadProgress();
        };
    }, [id, user]);

    // Send read progress to backend
    const sendReadProgress = useCallback(async () => {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent < 3) return; // Don't track very short visits

        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('access_token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            await fetch(getApiUrl(`/api/posts/${id}/read-progress`), {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    scroll_depth: maxScrollDepthRef.current,
                    time_spent: timeSpent
                })
            });
        } catch (error) {
            // Silent fail for tracking
        }
    }, [id]);

    // Track on visibility change (user switches tab or closes)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                sendReadProgress();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [sendReadProgress]);

    const fetchBookmarkStatus = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/bookmark`), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.is_bookmarked);
            }
        } catch (error) {
            // Silent fail
        }
    };

    const handleToggleBookmark = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/bookmark`), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setIsBookmarked(data.is_bookmarked);
            }
        } catch (error) {
            console.error('Failed to toggle bookmark:', error);
        }
    };

    const fetchStory = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}`));
            const data = await response.json();
            setStory(data.story);
            setSupportCount(data.story?.support_count || 0);
        } catch (error) {
            console.error('Failed to fetch story:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReaction = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/my-reaction`), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserReaction(data.reaction_type);
            }
        } catch (error) {
            console.error('Failed to fetch user reaction:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/comments`));
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleReact = async (type) => {
        if (!user) {
            navigate('/auth/login');
            return;
        }

        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/toggle-react`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({ support_type: type })
            });

            if (response.ok) {
                const data = await response.json();
                setUserReaction(data.user_reaction);
                setSupportCount(data.support_count);
            }
        } catch (error) {
            console.error('Failed to react:', error);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;

        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}/comments`), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    content: commentText,
                    is_anonymous: isAnonymousComment
                })
            });

            if (response.ok) {
                setCommentText('');
                fetchComments();
                fetchStory();
            }
        } catch (error) {
            console.error('Failed to comment:', error);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: story.title,
                text: `Read this story on HeartOut: ${story.title}`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(getApiUrl(`/api/posts/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                alert('Story deleted successfully');
                navigate('/feed');
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to delete story');
            }
        } catch (error) {
            console.error('Failed to delete story:', error);
            alert('Failed to delete story');
        }
    };

    const isAuthor = user && story?.author?.id === user.public_id;

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-zinc-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!story) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Story not found</h2>
                    <button
                        onClick={() => navigate('/feed')}
                        className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                        ← Back to Feed
                    </button>
                </div>
            </div>
        );
    }

    const storyType = storyTypes.find(t => t.value === story.story_type) || storyTypes[storyTypes.length - 1];
    const Icon = storyType.icon;

    return (
        <>
            {/* Dynamic SEO for social sharing */}
            <StorySEO story={story} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 md:pb-0">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <button
                            onClick={() => navigate('/feed')}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Stories
                        </button>
                    </div>
                </div>

                {/* Story Content */}
                <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 md:pb-12">
                    {/* Category - Subtle, above title */}
                    <div className="mb-6">
                        <span className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-widest">
                            {storyType.label}
                        </span>
                    </div>

                    {/* Title - With breathing room */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium text-stone-800 dark:text-stone-100 mb-8 leading-relaxed">
                        {story.title}
                    </h1>

                    {/* Meta Info - Very light, minimal visual weight */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-stone-400 dark:text-stone-500 mb-12">
                        <span>{story.author?.display_name || story.author?.username || 'Anonymous'}</span>
                        <span>·</span>
                        <span>{formatFullDate(story.created_at)}</span>
                        <span>·</span>
                        <span>{story.reading_time} min</span>
                    </div>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {story.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 text-xs font-medium bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 rounded-full"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Story Content - Maximum breathing room */}
                    <div className="w-full mb-20">
                        <p className="text-stone-700 dark:text-stone-300 text-lg leading-[2] whitespace-pre-wrap">
                            {sanitizeText(story.content)}
                        </p>
                    </div>

                    {/* Actions - Split: Immediate (Brave, Save) vs Secondary (Share, Stats) */}
                    <div className="border-y border-stone-200/60 dark:border-zinc-700/60 py-6 mb-12">
                        {/* Immediate actions - Primary row */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex flex-col items-start gap-1">
                                <ReactionButton
                                    storyId={story.id}
                                    currentReaction={userReaction}
                                    onReact={handleReact}
                                    supportCount={supportCount}
                                />
                                {/* Microcopy for Brave */}
                                <span className="text-[10px] text-stone-400 dark:text-stone-500 italic pl-1">
                                    A quiet way to say "I read this."
                                </span>
                            </div>

                            {user && (
                                <button
                                    onClick={handleToggleBookmark}
                                    aria-label={isBookmarked ? 'Remove from saved' : 'Save this story'}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isBookmarked
                                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                        : 'border-stone-200 dark:border-zinc-600 text-stone-600 dark:text-stone-400 hover:border-amber-400'
                                        }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
                                    <span className="text-sm">{isBookmarked ? 'Saved' : 'Save'}</span>
                                </button>
                            )}
                        </div>

                        {/* Secondary actions - Subtle row */}
                        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                            <button
                                onClick={handleShare}
                                aria-label="Share this story"
                                className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                            >
                                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Share</span>
                            </button>

                            <span className="text-stone-300 dark:text-zinc-600">·</span>

                            <span className="text-xs text-stone-400 dark:text-stone-500">
                                {story.comment_count} responses
                            </span>

                            {/* Author Actions - Edit/Delete */}
                            {isAuthor && (
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => navigate(`/edit/${story.id}`)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-stone-200 dark:border-zinc-600 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-all"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="w-full space-y-6">
                        <h2 className="text-xl font-semibold text-stone-700 dark:text-stone-200">
                            Responses ({comments.length})
                        </h2>

                        {/* Emotional guardrail */}
                        <p className="text-xs text-stone-500 dark:text-stone-400 italic border-l-2 border-stone-200 dark:border-zinc-700 pl-3">
                            Responses here are meant to support, not judge.
                        </p>

                        {/* Add Comment - Softer borders, thoughtful placeholder */}
                        <div className="bg-stone-50/50 dark:bg-zinc-800/50 rounded-lg border border-stone-200/60 dark:border-zinc-700/60 p-4">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write something kind, or simply be present."
                                rows={3}
                                className="w-full px-4 py-3 border border-stone-200 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-stone-700 dark:text-stone-200 placeholder-stone-400 dark:placeholder-stone-500 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 resize-none mb-3 text-sm"
                            />
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymousComment}
                                        onChange={(e) => setIsAnonymousComment(e.target.checked)}
                                        className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    Share anonymously
                                </label>
                                <button
                                    onClick={handleComment}
                                    disabled={!commentText.trim()}
                                    className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Respond
                                </button>
                            </div>
                        </div>

                        {/* Comments List - Softer styling */}
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="bg-white/60 dark:bg-zinc-800/60 rounded-lg border border-stone-100 dark:border-zinc-700/50 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">
                                                    {comment.author?.display_name || comment.author?.username || 'Anonymous'}
                                                </span>
                                                <span className="text-xs text-stone-400 dark:text-stone-500">
                                                    {formatCommentDate(comment.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                                {comment.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </article>
            </div>
        </>
    );
}
