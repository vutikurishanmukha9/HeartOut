import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Eye, Calendar, Share2, Bookmark, MessageCircle, ArrowLeft, Trash2, Edit } from 'lucide-react';
import { storyTypes } from '../components/StoryTypeSelector';
import ReactionButton from '../components/SupportButton';
import { AuthContext } from '../context/AuthContext';
import { sanitizeText } from '../utils/sanitize';
import { getApiUrl } from '../config/api';
import { formatFullDate, formatCommentDate } from '../utils/dateFormat';

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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Story Type Badge */}
                <div className="mb-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${storyType.bgColor} ${storyType.borderColor} border-2`}>
                        <div className={`p-1.5 rounded-lg bg-gradient-to-br ${storyType.color}`}>
                            <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className={`font-semibold ${storyType.textColor}`}>
                            {storyType.label}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                    {story.title}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
                    {/* Author */}
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white text-lg font-semibold">
                            {story.author?.username?.[0]?.toUpperCase() || 'A'}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {story.author?.display_name || story.author?.username || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                {formatFullDate(story.created_at)}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{story.reading_time} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{story.view_count} views</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                {story.tags && story.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                        {story.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Story Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                        {sanitizeText(story.content)}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 py-6 border-y border-gray-200 dark:border-gray-700 mb-8">
                    <ReactionButton
                        storyId={story.id}
                        currentReaction={userReaction}
                        onReact={handleReact}
                        supportCount={supportCount}
                    />

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-400 transition-all"
                    >
                        <Share2 className="w-5 h-5" />
                        Share
                    </button>

                    {user && (
                        <button
                            onClick={handleToggleBookmark}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${isBookmarked
                                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-amber-400'
                                }`}
                        >
                            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            {isBookmarked ? 'Saved' : 'Save'}
                        </button>
                    )}

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MessageCircle className="w-5 h-5" />
                        <span>{story.comment_count} comments</span>
                    </div>

                    {/* Author Actions - Edit/Delete */}
                    {isAuthor && (
                        <div className="ml-auto flex items-center gap-2">
                            <button
                                onClick={() => navigate(`/edit/${story.id}`)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Comments ({comments.length})
                    </h2>

                    {/* Add Comment */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                        <textarea
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none mb-3"
                        />
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <input
                                    type="checkbox"
                                    checked={isAnonymousComment}
                                    onChange={(e) => setIsAnonymousComment(e.target.checked)}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                Comment anonymously
                            </label>
                            <button
                                onClick={handleComment}
                                disabled={!commentText.trim()}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Post Comment
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <div
                                key={comment.id}
                                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                                        {comment.author?.username?.[0]?.toUpperCase() || 'A'}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {comment.author?.display_name || comment.author?.username || 'Anonymous'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {formatCommentDate(comment.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300">
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
    );
}
