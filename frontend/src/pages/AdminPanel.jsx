import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Users, 
    FileText, 
    Flag, 
    TrendingUp, 
    Shield, 
    ArrowLeft, 
    RefreshCw, 
    AlertTriangle, 
    Check, 
    CheckCircle2, 
    Trash2, 
    Search, 
    Eye, 
    Lock,
    MessageSquare,
    UserCheck,
    UserX
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
import { formatFullDate, formatCommentDate } from '../utils/dateFormat';

export default function AdminPanel() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Dashboard overview statistics
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        reportedPosts: 0,
        activeUsers: 0,
        totalReactions: 0,
        publishedStories: 0
    });

    // Sub-data collections
    const [flaggedStories, setFlaggedStories] = useState([]);
    const [flaggedComments, setFlaggedComments] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    // UI state
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'stories' | 'comments' | 'users'
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // Fetch summary statistics
    const fetchStats = useCallback(async () => {
        try {
            // Attempt primary FastAPI endpoint
            let response = await fetch(getApiUrl('/api/admin/dashboard'), {
                credentials: 'include',
            });

            // Fallback to stats endpoint if dashboard returns 404
            if (!response.ok && response.status === 404) {
                response = await fetch(getApiUrl('/api/admin/stats'), {
                    credentials: 'include',
                });
            }

            if (response.ok) {
                const data = await response.json();
                setStats({
                    totalUsers: data.totalUsers ?? data.users?.total ?? 0,
                    totalPosts: data.totalPosts ?? data.stories?.total ?? 0,
                    reportedPosts: data.reportedPosts ?? data.stories?.flagged ?? 0,
                    activeUsers: data.activeUsers ?? data.users?.active ?? 0,
                    totalReactions: data.reactions?.total ?? 0,
                    publishedStories: data.stories?.published ?? data.totalPosts ?? 0
                });
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        }
    }, []);

    // Fetch flagged stories
    const fetchFlaggedStories = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('/api/admin/posts/flagged'), {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setFlaggedStories(data.posts || data || []);
            }
        } catch (error) {
            console.error('Failed to fetch flagged stories:', error);
        }
    }, []);

    // Fetch flagged comments
    const fetchFlaggedComments = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('/api/admin/comments/flagged'), {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setFlaggedComments(data.comments || data || []);
            }
        } catch (error) {
            console.error('Failed to fetch flagged comments:', error);
        }
    }, []);

    // Fetch users list
    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(getApiUrl('/api/admin/users?per_page=50'), {
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setUsersList(data.users || data || []);
            }
        } catch (error) {
            console.error('Failed to fetch users list:', error);
        }
    }, []);

    // Load all data
    const loadAllData = useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            fetchStats(),
            fetchFlaggedStories(),
            fetchFlaggedComments(),
            fetchUsers()
        ]);
        setLoading(false);
        setRefreshing(false);
    }, [fetchStats, fetchFlaggedStories, fetchFlaggedComments, fetchUsers]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    // Handle story moderation action
    const handleModerateStory = async (storyId, action) => {
        setActionLoadingId(storyId);
        try {
            const response = await fetch(getApiUrl(`/api/admin/posts/${storyId}/moderate?action=${action}`), {
                method: 'PUT',
                credentials: 'include',
            });

            if (response.ok) {
                toast.success(action === 'approve' ? 'Story cleared and approved' : 'Story removed from sanctuary');
                fetchFlaggedStories();
                fetchStats();
            } else {
                const data = await response.json();
                toast.error(data.detail || 'Moderation action failed');
            }
        } catch (error) {
            console.error('Failed to moderate story:', error);
            toast.error('Network error during moderation');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Handle comment deletion
    const handleDeleteComment = async (commentId) => {
        setActionLoadingId(commentId);
        try {
            const response = await fetch(getApiUrl(`/api/admin/comments/${commentId}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                toast.success('Comment removed');
                fetchFlaggedComments();
                fetchStats();
            } else {
                toast.error('Failed to delete comment');
            }
        } catch (error) {
            console.error('Failed to delete comment:', error);
            toast.error('Network error deleting comment');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Handle user suspension toggle
    const handleToggleSuspendUser = async (userId, currentStatus) => {
        setActionLoadingId(userId);
        try {
            const response = await fetch(getApiUrl(`/api/admin/users/${userId}/suspend`), {
                method: 'PUT',
                credentials: 'include',
            });

            if (response.ok) {
                toast.success(currentStatus ? 'User account suspended' : 'User account restored');
                fetchUsers();
                fetchStats();
            } else {
                const data = await response.json();
                toast.error(data.detail || 'Failed to update user status');
            }
        } catch (error) {
            console.error('Failed to toggle user suspension:', error);
            toast.error('Network error updating user');
        } finally {
            setActionLoadingId(null);
        }
    };

    // Filter users by search input
    const filteredUsers = usersList.filter(u => {
        const query = userSearchQuery.toLowerCase();
        return (
            (u.username && u.username.toLowerCase().includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query)) ||
            (u.display_name && u.display_name.toLowerCase().includes(query))
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">
                        Opening sanctuary console...
                    </p>
                </div>
            </div>
        );
    }

    // Role verification
    const isAuthorized = user && (user.role === 'admin' || user.role === 'moderator');
    if (!isAuthorized) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-8 sm:p-12 text-center max-w-md w-full shadow-lg">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 dark:border-amber-900/40">
                        <Lock className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h2 className="font-stories text-2xl text-stone-900 dark:text-stone-100 mb-2">
                        Stewardship Access Required
                    </h2>
                    <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                        This control room is reserved for sanctuary guides and moderators. Please return to the reading sanctuary.
                    </p>
                    <Link
                        to="/feed"
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Return to Sanctuary</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
            {/* Top Sanctuary Control Bar */}
            <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Return */}
                    <button
                        onClick={() => navigate('/feed')}
                        className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
                        aria-label="Return to feed"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Return to Sanctuary</span>
                        <span className="sm:hidden">Sanctuary</span>
                    </button>

                    {/* Right: Badge & Refresh */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300 text-xs font-medium">
                            <Shield className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                            <span className="hidden sm:inline">Steward Console</span>
                            <span className="sm:hidden">Steward</span>
                        </div>

                        <button
                            onClick={loadAllData}
                            disabled={refreshing}
                            aria-label="Refresh dashboard data"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Container */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
                {/* Hero Header */}
                <div className="text-left">
                    <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                        Sanctuary Stewardship
                    </span>
                    <h1 className="font-stories text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                        Admin & Moderation Console
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5">
                        Oversee community well-being, moderate sensitive reflections, and ensure the sanctuary remains safe and dignified.
                    </p>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Total Members */}
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-5 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 font-body">
                                Community Members
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center">
                                <Users className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="font-stories text-3xl text-stone-900 dark:text-stone-100 font-normal">
                            {stats.totalUsers}
                        </div>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 font-body">
                            {stats.activeUsers} active accounts recorded
                        </p>
                    </div>

                    {/* Shared Stories */}
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-5 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 font-body">
                                Shared Reflections
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border border-stone-200/70 dark:border-zinc-700/60 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="font-stories text-3xl text-stone-900 dark:text-stone-100 font-normal">
                            {stats.totalPosts}
                        </div>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 font-body">
                            {stats.publishedStories} published to sanctuary
                        </p>
                    </div>

                    {/* Reported Items */}
                    <div className={`bg-[#FFFDF9] dark:bg-[#181614] border rounded-3xl p-5 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] ${
                        stats.reportedPosts > 0
                            ? 'border-red-300/80 dark:border-red-900/60'
                            : 'border-[#EADDCF] dark:border-[#2C2723]'
                    }`}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 font-body">
                                Flagged for Review
                            </span>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                                stats.reportedPosts > 0
                                    ? 'bg-red-100/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
                                    : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-300 border-stone-200/70 dark:border-zinc-700/60'
                            }`}>
                                <Flag className="w-4 h-4" />
                            </div>
                        </div>
                        <div className={`font-stories text-3xl font-normal ${
                            stats.reportedPosts > 0
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-stone-900 dark:text-stone-100'
                        }`}>
                            {stats.reportedPosts}
                        </div>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 font-body">
                            {stats.reportedPosts > 0 ? 'Requires moderation review' : 'No pending flags'}
                        </p>
                    </div>

                    {/* Total Support Reactions */}
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-5 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400 font-body">
                                Solidarity Reactions
                            </span>
                            <div className="w-8 h-8 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                        </div>
                        <div className="font-stories text-3xl text-stone-900 dark:text-stone-100 font-normal">
                            {stats.totalReactions}
                        </div>
                        <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1 font-body">
                            Total empathetic gestures shared
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-[#EADDCF]/80 dark:border-[#26221E] pb-3 overflow-x-auto overscroll-x-contain">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === 'overview'
                                ? 'bg-[#C85828] text-white shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#FFFDF9]/60 dark:hover:bg-[#181614]'
                        }`}
                    >
                        Overview
                    </button>

                    <button
                        onClick={() => setActiveTab('stories')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === 'stories'
                                ? 'bg-[#C85828] text-white shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#FFFDF9]/60 dark:hover:bg-[#181614]'
                        }`}
                    >
                        <span>Flagged Stories</span>
                        {flaggedStories.length > 0 && (
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                {flaggedStories.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === 'comments'
                                ? 'bg-[#C85828] text-white shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#FFFDF9]/60 dark:hover:bg-[#181614]'
                        }`}
                    >
                        <span>Flagged Comments</span>
                        {flaggedComments.length > 0 && (
                            <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                                {flaggedComments.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                            activeTab === 'users'
                                ? 'bg-[#C85828] text-white shadow-sm'
                                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-[#FFFDF9]/60 dark:hover:bg-[#181614]'
                        }`}
                    >
                        Members Directory
                    </button>
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stewardship Principles Card */}
                        <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                            <div className="flex items-center gap-2.5 mb-2">
                                <Shield className="w-5 h-5 text-[#C85828] dark:text-amber-400" />
                                <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                    Sanctuary Guidelines for Stewards
                                </h2>
                            </div>
                            <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mb-6 leading-relaxed">
                                HeartOut exists as a safe haven for authentic vulnerability. When moderating content, uphold compassion and preserve honesty while firmly excluding hate speech, targeted harassment, and non-consensual disclosures.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                <button
                                    onClick={() => setActiveTab('stories')}
                                    className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723] text-left hover:border-amber-400/50 transition-colors group"
                                >
                                    <FileText className="w-5 h-5 text-[#C85828] dark:text-amber-400 mb-2" />
                                    <h3 className="font-semibold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                                        Review Stories
                                    </h3>
                                    <p className="font-body text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                                        {flaggedStories.length} pending moderation
                                    </p>
                                </button>

                                <button
                                    onClick={() => setActiveTab('comments')}
                                    className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723] text-left hover:border-amber-400/50 transition-colors group"
                                >
                                    <MessageSquare className="w-5 h-5 text-[#C85828] dark:text-amber-400 mb-2" />
                                    <h3 className="font-semibold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                                        Review Comments
                                    </h3>
                                    <p className="font-body text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                                        {flaggedComments.length} flagged responses
                                    </p>
                                </button>

                                <button
                                    onClick={() => setActiveTab('users')}
                                    className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723] text-left hover:border-amber-400/50 transition-colors group"
                                >
                                    <Users className="w-5 h-5 text-[#C85828] dark:text-amber-400 mb-2" />
                                    <h3 className="font-semibold text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                                        Manage Members
                                    </h3>
                                    <p className="font-body text-[11px] text-stone-400 dark:text-stone-500 mt-0.5">
                                        {usersList.length} registered accounts
                                    </p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: FLAGGED STORIES */}
                {activeTab === 'stories' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                Flagged Reflections ({flaggedStories.length})
                            </h2>
                        </div>

                        {flaggedStories.length === 0 ? (
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200/60 dark:border-emerald-900/40">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-stories text-lg text-stone-900 dark:text-stone-100 mb-1">
                                    All Reflections Peaceful
                                </h3>
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                                    There are currently no reported stories requiring moderator review.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {flaggedStories.map((item) => (
                                    <div
                                        key={item.id || item.public_id}
                                        className="bg-[#FFFDF9] dark:bg-[#181614] border border-red-200/80 dark:border-red-950/50 rounded-2xl p-5 shadow-sm space-y-3"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                                                    {item.flagged_count || 1} {item.flagged_count === 1 ? 'Report' : 'Reports'}
                                                </span>
                                                <span className="text-xs text-stone-400">·</span>
                                                <span className="text-xs text-stone-500 dark:text-stone-400 font-body">
                                                    {formatFullDate(item.created_at)}
                                                </span>
                                            </div>

                                            <Link
                                                to={`/feed/story/${item.id || item.public_id}`}
                                                className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-300 hover:text-[#C85828] font-medium"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>View Full Story</span>
                                            </Link>
                                        </div>

                                        <h3 className="font-stories text-lg text-stone-900 dark:text-stone-100 font-normal">
                                            {item.title}
                                        </h3>

                                        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                                            {item.content}
                                        </p>

                                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[#EADDCF]/60 dark:border-[#2C2723]">
                                            <button
                                                onClick={() => handleModerateStory(item.id || item.public_id, 'approve')}
                                                disabled={actionLoadingId === (item.id || item.public_id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                                            >
                                                <Check className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Approve & Keep</span>
                                                <span className="sm:hidden">Approve</span>
                                            </button>

                                            <button
                                                onClick={() => handleModerateStory(item.id || item.public_id, 'remove')}
                                                disabled={actionLoadingId === (item.id || item.public_id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span className="hidden sm:inline">Remove from Sanctuary</span>
                                                <span className="sm:hidden">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 3: FLAGGED COMMENTS */}
                {activeTab === 'comments' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                Flagged Comments ({flaggedComments.length})
                            </h2>
                        </div>

                        {flaggedComments.length === 0 ? (
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 text-center">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200/60 dark:border-emerald-900/40">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="font-stories text-lg text-stone-900 dark:text-stone-100 mb-1">
                                    All Comments Harmonious
                                </h3>
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                                    No community responses are currently reported.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {flaggedComments.map((comment) => (
                                    <div
                                        key={comment.id || comment.public_id}
                                        className="bg-[#FFFDF9] dark:bg-[#181614] border border-red-200/80 dark:border-red-950/50 rounded-2xl p-5 shadow-sm space-y-3"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                                                {comment.author?.display_name || comment.author?.username || 'Anonymous Voice'}
                                            </span>
                                            <span className="text-[11px] text-stone-400">
                                                {formatCommentDate(comment.created_at)}
                                            </span>
                                        </div>

                                        <p className="font-body text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                                            {comment.content}
                                        </p>

                                        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EADDCF]/60 dark:border-[#2C2723]">
                                            <button
                                                onClick={() => handleDeleteComment(comment.id || comment.public_id)}
                                                disabled={actionLoadingId === (comment.id || comment.public_id)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete Comment</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 4: USERS DIRECTORY */}
                {activeTab === 'users' && (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                Community Members ({usersList.length})
                            </h2>

                            {/* Search filter */}
                            <div className="relative max-w-xs w-full">
                                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={userSearchQuery}
                                    onChange={(e) => setUserSearchQuery(e.target.value)}
                                    placeholder="Filter by username or email..."
                                    className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-[#FFFDF9] dark:bg-[#181614] text-stone-800 dark:text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#C85828]"
                                />
                            </div>
                        </div>

                        <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl overflow-hidden shadow-sm">
                            <div className="overflow-x-auto overscroll-x-contain">
                                <table className="w-full text-left text-xs sm:text-sm font-body">
                                    <thead>
                                        <tr className="border-b border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/50 dark:bg-[#121110]/50 text-stone-500 dark:text-stone-400">
                                            <th className="py-3 px-4 font-medium">Member</th>
                                            <th className="py-3 px-4 font-medium hidden sm:table-cell">Role</th>
                                            <th className="py-3 px-4 font-medium hidden md:table-cell">Joined</th>
                                            <th className="py-3 px-4 font-medium text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#EADDCF]/60 dark:divide-[#2C2723]">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-stone-400 italic">
                                                    No members match this search query.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((u) => {
                                                const userId = u.public_id || u.id;
                                                const isSuspended = u.is_active === false;

                                                return (
                                                    <tr key={userId} className="hover:bg-stone-50/40 dark:hover:bg-[#1c1917] transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-2.5">
                                                                <div className="w-7 h-7 rounded-full bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/40 flex items-center justify-center font-medium text-xs flex-shrink-0">
                                                                    {(u.username || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-semibold text-stone-800 dark:text-stone-200 truncate">
                                                                        {u.display_name || u.username}
                                                                    </div>
                                                                    <div className="text-[11px] text-stone-400 truncate">
                                                                        @{u.username} {u.email ? `· ${u.email}` : ''}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>

                                                        <td className="py-3 px-4 hidden sm:table-cell">
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                                                                u.role === 'admin'
                                                                    ? 'bg-amber-100 text-[#C85828] dark:bg-amber-950/40 dark:text-amber-300'
                                                                    : u.role === 'moderator'
                                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                                                                    : 'bg-stone-100 text-stone-600 dark:bg-zinc-800 dark:text-stone-400'
                                                            }`}>
                                                                {u.role || 'user'}
                                                            </span>
                                                        </td>

                                                        <td className="py-3 px-4 hidden md:table-cell text-xs text-stone-400">
                                                            {u.created_at ? formatFullDate(u.created_at) : 'N/A'}
                                                        </td>

                                                        <td className="py-3 px-4 text-right">
                                                            {u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleToggleSuspendUser(userId, !isSuspended)}
                                                                    disabled={actionLoadingId === userId}
                                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                                                        isSuspended
                                                                            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100'
                                                                            : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100'
                                                                    }`}
                                                                >
                                                                    {isSuspended ? (
                                                                        <>
                                                                            <UserCheck className="w-3.5 h-3.5" />
                                                                            <span>Restore</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <UserX className="w-3.5 h-3.5" />
                                                                            <span>Suspend</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
