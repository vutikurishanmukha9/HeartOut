import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Mail, BookOpen, Edit, Award, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

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
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
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
            const response = await fetch(`/api/posts/user/${userId}/stories`);
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
            const endpoint = isOwnProfile
                ? '/api/posts?status=published'
                : `/api/posts/user/${userId}/stories`;

            const headers = isOwnProfile
                ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                : {};

            const response = await fetch(endpoint, { headers });
            const data = await response.json();
            setStories(data.stories || []);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
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
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const storiesByType = storyTypes.reduce((acc, type) => {
        acc[type.value] = stories.filter(s => s.story_type === type.value).length;
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
                                {profile?.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            {profile?.is_featured_author && (
                                <div className="mt-4 flex items-center justify-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full text-white text-sm font-semibold">
                                    <Award className="w-4 h-4" />
                                    Featured Author
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            {editing ? (
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={formData.display_name}
                                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                        placeholder="Display Name"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        placeholder="Short bio..."
                                        rows={2}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                    <textarea
                                        value={formData.author_bio}
                                        onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                                        placeholder="Detailed author biography..."
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                    <input
                                        type="url"
                                        value={formData.website_url}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                        placeholder="Website URL"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                                {profile?.display_name || profile?.username}
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                @{profile?.username}
                                            </p>
                                        </div>
                                        {isOwnProfile && (
                                            <button
                                                onClick={() => setEditing(true)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                            >
                                                <Edit className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    {profile?.bio && (
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {profile.bio}
                                        </p>
                                    )}

                                    {profile?.author_bio && (
                                        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About the Author</h3>
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

                    {/* Story Stats with Pie Chart */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </span>
                                Your Story Analytics
                            </h3>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:shadow-md transition-all duration-300"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Pie Chart */}
                            <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg overflow-hidden">
                                {/* Decorative background */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-full blur-2xl" />

                                <h4 className="relative text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                                    Story Distribution
                                </h4>

                                {stories.length > 0 ? (
                                    <div className="relative">
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <defs>
                                                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                                        <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.2" />
                                                    </filter>
                                                </defs>
                                                <Pie
                                                    data={storyTypes.map(type => ({
                                                        name: type.label,
                                                        value: storiesByType[type.value] || 0,
                                                        type: type.value,
                                                    })).filter(d => d.value > 0)}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={70}
                                                    outerRadius={100}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                    onClick={(data) => setSelectedCategory(data.type)}
                                                    style={{ cursor: 'pointer', filter: 'url(#shadow)' }}
                                                >
                                                    {storyTypes.map((type, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={type.value === 'achievement' ? '#f97316' :
                                                                type.value === 'regret' ? '#ec4899' :
                                                                    type.value === 'unsent_letter' ? '#f43f5e' :
                                                                        type.value === 'sacrifice' ? '#10b981' :
                                                                            type.value === 'life_story' ? '#3b82f6' : '#8b5cf6'}
                                                            stroke={selectedCategory === type.value ? '#ffffff' : 'transparent'}
                                                            strokeWidth={selectedCategory === type.value ? 4 : 0}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                                        border: 'none',
                                                        borderRadius: '12px',
                                                        color: '#fff',
                                                        padding: '12px 16px',
                                                        boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                                                    }}
                                                    formatter={(value, name) => [`${value} stories`, name]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        {/* Center label */}
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                            <div className="bg-white dark:bg-gray-800 rounded-full p-5 shadow-xl border-4 border-orange-400">
                                                <p className="text-5xl font-extrabold text-orange-500">
                                                    {stories.length}
                                                </p>
                                                <p className="text-sm text-pink-500 font-bold uppercase tracking-wider">
                                                    Stories
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-72 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                                        <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                                        <p className="text-lg font-medium">No stories yet</p>
                                        <p className="text-sm">Start writing to see your analytics!</p>
                                    </div>
                                )}

                                <p className="relative text-center text-sm text-gray-500 dark:text-gray-400 mt-4 font-medium">
                                    Click on a slice to filter stories
                                </p>
                            </div>

                            {/* Category Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {storyTypes.map((type) => {
                                    const Icon = type.icon;
                                    const count = storiesByType[type.value] || 0;
                                    const isSelected = selectedCategory === type.value;
                                    const hasStories = count > 0;
                                    return (
                                        <button
                                            key={type.value}
                                            onClick={() => setSelectedCategory(isSelected ? null : type.value)}
                                            className={`
                                                relative p-5 rounded-2xl border-2 text-center transition-all duration-300 group overflow-hidden
                                                ${isSelected
                                                    ? `${type.bgColor} ${type.borderColor} shadow-xl scale-105`
                                                    : hasStories
                                                        ? `bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-102 hover:border-gray-300 dark:hover:border-gray-600`
                                                        : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-60'
                                                }
                                            `}
                                        >
                                            {/* Hover gradient overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                            <div className={`relative inline-flex p-3 rounded-xl bg-gradient-to-br ${type.color} mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <p className={`relative text-3xl font-bold mb-1 ${isSelected ? type.textColor : 'text-gray-900 dark:text-white'}`}>
                                                {count}
                                            </p>
                                            <p className={`relative text-sm font-medium ${isSelected ? type.textColor : 'text-gray-600 dark:text-gray-400'}`}>
                                                {type.label}
                                            </p>

                                            {isSelected && (
                                                <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-white shadow-md animate-pulse" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCategory
                                ? `${storyTypes.find(t => t.value === selectedCategory)?.label || 'Filtered'} Stories`
                                : 'Published Stories'
                            }
                        </h2>
                        {selectedCategory && (
                            <span className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                                {stories.filter(s => s.story_type === selectedCategory).length} stories
                            </span>
                        )}
                    </div>
                    {(() => {
                        const filteredStories = selectedCategory
                            ? stories.filter(s => s.story_type === selectedCategory)
                            : stories;

                        return filteredStories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStories.map((story) => (
                                    <StoryCard key={story.id} story={story} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
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
                                        className="inline-block px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Clear Filter
                                    </button>
                                ) : isOwnProfile && (
                                    <Link
                                        to="/feed/create"
                                        className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        Write Your First Story
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
