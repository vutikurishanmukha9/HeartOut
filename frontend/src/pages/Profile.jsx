import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Mail, BookOpen, Edit, Award, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';
import StoryConstellation from '../components/StoryConstellation';
import { getApiUrl } from '../config/api';
import { getAvatarColor } from '../utils/avatarColors';

export default function Profile() {
    const { userId } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        author_bio: '',
        website_url: '',
        social_links: {}
    });

    const isOwnProfile = !userId || userId === currentUser?.id;

    useEffect(() => {
        if (isOwnProfile) {
            fetchOwnProfile();
        } else {
            fetchUserProfile();
        }
        fetchUserStories();
    }, [userId]);

    const fetchOwnProfile = async () => {
        try {
            const response = await fetch(getApiUrl('/api/auth/profile'), {
                credentials: 'include',
            });
            const data = await response.json();
            setProfile(data.user);
            setFormData({
                display_name: data.user.display_name || '',
                bio: data.user.bio || '',
                author_bio: data.user.author_bio || '',
                website_url: data.user.website_url || '',
                social_links: data.user.social_links || {}
            });
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(getApiUrl(`/api/posts/user/${userId}/stories`));
            const data = await response.json();
            setProfile(data.author);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStories = async () => {
        try {
            // For own profile, use current user's ID to fetch only THEIR stories
            const targetUserId = isOwnProfile ? currentUser?.id : userId;

            if (!targetUserId) {
                console.error('No user ID available to fetch stories');
                setStories([]);
                return;
            }

            const endpoint = getApiUrl(`/api/posts/user/${targetUserId}/stories`);

            const response = await fetch(endpoint, { credentials: 'include' });
            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            setStories([]);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch(getApiUrl('/api/auth/profile'), {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data.user);
                setEditing(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    const storiesByType = storyTypes.reduce((acc, type) => {
        acc[type.value] = stories.filter(s => s.story_type === type.value).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
                {/* Profile Header - Premium Glassmorphism */}
                <div className="relative bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-amber-100/50 dark:border-zinc-700/50 p-6 sm:p-8 mb-8 shadow-xl shadow-amber-100/30 dark:shadow-zinc-900/50 overflow-hidden">

                    <div className="relative">
                        {/* Mobile Layout: Avatar row with Edit button */}
                        <div className="flex md:hidden items-center justify-between mb-4">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className={`absolute -inset-1 bg-gradient-to-br ${getAvatarColor(profile?.username?.[0])} rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-pulse`} />
                                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getAvatarColor(profile?.username?.[0])} flex items-center justify-center text-white text-3xl font-bold shadow-2xl ring-4 ring-white dark:ring-gray-800`}>
                                    {profile?.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                            </div>
                            {/* Edit button on mobile */}
                            {isOwnProfile && !editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="group relative flex items-center gap-2 px-4 py-2 btn-premium text-white text-sm font-medium rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                    Edit Profile
                                </button>
                            )}
                        </div>

                        {/* Mobile Profile Info - Below avatar row */}
                        <div className="md:hidden">
                            {editing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="Display Name"
                                        className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                    />
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Short bio..."
                                        rows={2}
                                        className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                    />
                                    <textarea
                                        value={formData.author_bio}
                                        onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                                        placeholder="Something about you, in your own words."
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                    />
                                    <div className="flex gap-3 pt-1">
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="px-5 py-2 btn-premium text-white text-sm font-medium rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 text-stone-500 dark:text-stone-400 text-sm font-medium hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                        {profile?.display_name || profile?.username}
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium text-sm mb-1">
                                        @{profile?.username}
                                    </p>
                                    {isOwnProfile && (
                                        <p className="text-xs text-stone-400 dark:text-stone-500 italic mb-3">
                                            Your stories, at your pace
                                        </p>
                                    )}
                                    {profile?.bio && (
                                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                                            {profile.bio}
                                        </p>
                                    )}
                                    {profile?.author_bio && (
                                        <div className="mb-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">About the Author</h3>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                                {profile.author_bio}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                                        {profile?.website_url && (
                                            <a
                                                href={profile.website_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 hover:text-primary-600"
                                            >
                                                <Globe className="w-3 h-3" />
                                                Website
                                            </a>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" />
                                            {profile?.total_stories || stories.length} stories
                                        </div>
                                    </div>
                                    {profile?.is_featured_author && (
                                        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-white text-xs font-semibold">
                                            <Award className="w-3 h-3" />
                                            Featured Author
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="hidden md:flex flex-row gap-8">
                            {/* Avatar - Animated Gradient Ring */}
                            <div className="flex-shrink-0 flex flex-col items-start">
                                <div className="relative group">
                                    <div className={`absolute -inset-1 bg-gradient-to-br ${getAvatarColor(profile?.username?.[0])} rounded-full blur-sm opacity-75 group-hover:opacity-100 transition-opacity animate-pulse`} />
                                    <div className={`relative w-32 h-32 rounded-full bg-gradient-to-br ${getAvatarColor(profile?.username?.[0])} flex items-center justify-center text-white text-5xl font-bold shadow-2xl ring-4 ring-white dark:ring-gray-800`}>
                                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                {profile?.is_featured_author && (
                                    <div className="mt-4 flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-white text-sm font-semibold shadow-lg shadow-amber-500/30">
                                        <Award className="w-4 h-4" />
                                        Featured Author
                                    </div>
                                )}
                            </div>

                            {/* Profile Info - Desktop */}
                            <div className="flex-1">
                                {editing ? (
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            value={formData.display_name}
                                            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                            placeholder="Display Name"
                                            className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                        />
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Short bio..."
                                            rows={2}
                                            className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                        />
                                        <textarea
                                            value={formData.author_bio}
                                            onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                                            placeholder="Something about you, in your own words."
                                            rows={4}
                                            className="w-full px-4 py-2.5 border border-amber-100 dark:border-zinc-700 rounded-xl bg-amber-50/20 dark:bg-zinc-800/50 text-gray-900 dark:text-white placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 transition-colors"
                                        />
                                        <div className="flex gap-3 pt-1">
                                            <button
                                                onClick={handleUpdateProfile}
                                                className="px-6 py-2.5 btn-premium text-white font-medium rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                                            >
                                                Save Changes
                                            </button>
                                            <button
                                                onClick={() => setEditing(false)}
                                                className="px-4 py-2.5 text-stone-500 dark:text-stone-400 font-medium hover:text-stone-700 dark:hover:text-stone-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="text-left">
                                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                                                    {profile?.display_name || profile?.username}
                                                </h1>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                    @{profile?.username}
                                                </p>
                                                {isOwnProfile && (
                                                    <p className="text-sm text-stone-400 dark:text-stone-500 italic mt-1">
                                                        Your stories, at your pace
                                                    </p>
                                                )}
                                            </div>
                                            {isOwnProfile && (
                                                <button
                                                    onClick={() => setEditing(true)}
                                                    className="group relative flex items-center gap-2 px-5 py-2.5 btn-premium text-white font-medium rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                                                >
                                                    <Edit className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                                                    Edit Profile
                                                </button>
                                            )}
                                        </div>

                                        {profile?.bio && (
                                            <p className="text-gray-700 dark:text-gray-300 mb-4 text-left">
                                                {profile.bio}
                                            </p>
                                        )}

                                        {profile?.author_bio && (
                                            <div className="mb-4 mt-2 text-left">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">About the Author</h3>
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {profile.author_bio}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            {profile?.website_url && (
                                                <a
                                                    href={profile.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400"
                                                >
                                                    <Globe className="w-4 h-4" />
                                                    Website
                                                </a>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                {profile?.total_stories || stories.length} stories
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Story Analytics Section - Premium Design */}
                    <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white">Your Writing Journey</h3>
                                    <p className="text-xs sm:text-sm text-stone-400 dark:text-stone-500">A reflection, not a scorecard</p>
                                </div>
                            </div>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="group relative flex items-center gap-2 px-4 py-2 text-red-500 dark:text-red-400 font-medium transition-all duration-300 hover:text-red-600 dark:hover:text-red-300"
                                >
                                    <X className="w-4 h-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90" />
                                    <span className="relative text-sm">
                                        Clear Filter
                                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-red-500 to-rose-500 transition-all duration-300 group-hover:w-full" />
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Stats Cards Row - Premium Design */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            {storyTypes.map((type) => {
                                const Icon = type.icon;
                                const count = storiesByType[type.value] || 0;
                                const isSelected = selectedCategory === type.value;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedCategory(isSelected ? null : type.value)}
                                        className={`
                                            group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl text-center transition-all duration-300 overflow-hidden
                                            ${isSelected
                                                ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-400 dark:border-amber-500 shadow-lg shadow-amber-500/20 scale-[1.02]'
                                                : count > 0
                                                    ? 'bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm border border-amber-100/50 dark:border-zinc-700/50 hover:border-amber-300 dark:hover:border-amber-600 hover:shadow-lg hover:scale-[1.02]'
                                                    : 'bg-white/40 dark:bg-zinc-900/30 border border-stone-100 dark:border-zinc-800 opacity-40 cursor-default'
                                            }
                                        `}
                                        disabled={count === 0}
                                    >
                                        {/* Subtle gradient glow on hover */}
                                        {count > 0 && (
                                            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                                        )}
                                        <div className="relative">
                                            <div className={`inline-flex p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-gradient-to-br ${type.color} mb-2 shadow-md group-hover:shadow-lg transition-shadow opacity-80`}>
                                                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                            <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 mb-1">{type.label}</p>
                                            <p className={`text-base sm:text-lg font-medium transition-colors ${isSelected ? 'text-stone-800 dark:text-stone-200' : 'text-stone-500 dark:text-stone-400'}`}>
                                                {count}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                                                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Helper text - reduces self-judgment */}
                        <p className="text-xs text-stone-400 dark:text-stone-500 italic text-center mb-6">
                            There's no right balance. This is just a snapshot.
                        </p>

                        {/* Story Constellation */}
                        {stories.length > 0 && (
                            <StoryConstellation
                                stories={stories}
                                storiesByType={storiesByType}
                                onCategoryClick={(value) => setSelectedCategory(selectedCategory === value ? null : value)}
                            />
                        )}

                        {/* Grounding sentence */}
                        {isOwnProfile && (
                            <p className="text-center text-xs text-stone-400 dark:text-stone-500 italic mt-4">
                                There's no finish line here.
                            </p>
                        )}
                    </div>
                </div>

                {/* Stories Grid - Archive, not feed */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-medium text-stone-800 dark:text-stone-200">
                            {selectedCategory
                                ? `${storyTypes.find(t => t.value === selectedCategory)?.label || 'Filtered'} Stories`
                                : isOwnProfile ? 'Your Stories' : 'Stories'
                            }
                        </h2>
                        {selectedCategory && (
                            <span className="px-3 py-1 text-xs bg-stone-100 dark:bg-zinc-800 text-stone-500 dark:text-stone-400 rounded-full">
                                {stories.filter(s => s.story_type === selectedCategory).length}
                            </span>
                        )}
                    </div>
                    {isOwnProfile && !selectedCategory && stories.length > 0 && (
                        <p className="text-xs text-stone-400 dark:text-stone-500 italic mb-6">
                            You can return to these anytime.
                        </p>
                    )}
                    {(() => {
                        const filteredStories = selectedCategory
                            ? stories.filter(s => s.story_type === selectedCategory)
                            : stories;

                        return filteredStories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredStories.map((story) => (
                                    <StoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-amber-50/20 dark:bg-zinc-800/50 rounded-xl border border-amber-100 dark:border-zinc-700">
                                <BookOpen className="w-16 h-16 mx-auto text-stone-300 dark:text-stone-600 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {selectedCategory
                                        ? `No ${storyTypes.find(t => t.value === selectedCategory)?.label || ''} stories yet`
                                        : 'No stories yet'
                                    }
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    {selectedCategory
                                        ? 'Try selecting a different category or clear the filter.'
                                        : isOwnProfile
                                            ? "Start sharing your stories with the world!"
                                            : "This author hasn't published any stories yet."
                                    }
                                </p>
                                {selectedCategory ? (
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="group relative inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 font-medium transition-all duration-300 hover:text-gray-800 dark:hover:text-white"
                                    >
                                        <span className="relative">
                                            Clear Filter
                                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gray-400 transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </button>
                                ) : isOwnProfile && (
                                    <Link
                                        to="/feed/create"
                                        className="group relative inline-flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 font-medium transition-all duration-300 hover:text-amber-700 dark:hover:text-amber-300"
                                    >
                                        <span className="relative">
                                            Write Your First Story
                                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 group-hover:w-full" />
                                        </span>
                                    </Link>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
