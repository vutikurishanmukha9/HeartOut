import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Mail, BookOpen, Edit, Award, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getApiUrl } from '../config/api';

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
            const headers = isOwnProfile
                ? { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                : {};

            const response = await fetch(endpoint, { headers });
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

                    {/* Story Analytics Section - Clean Redesign */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg shadow-purple-500/25">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Story Analytics</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Your writing journey at a glance</p>
                                </div>
                            </div>
                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filter
                                </button>
                            )}
                        </div>

                        {/* Stats Cards Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                            {storyTypes.map((type) => {
                                const Icon = type.icon;
                                const count = storiesByType[type.value] || 0;
                                const isSelected = selectedCategory === type.value;
                                return (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedCategory(isSelected ? null : type.value)}
                                        className={`
                                            relative p-4 rounded-xl border-2 text-center transition-all duration-200
                                            ${isSelected
                                                ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/20 scale-105'
                                                : count > 0
                                                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-violet-300 dark:hover:border-violet-600 hover:shadow-md'
                                                    : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-50 cursor-default'
                                            }
                                        `}
                                        disabled={count === 0}
                                    >
                                        <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${type.color} mb-2 shadow-md`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className={`text-2xl font-bold ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-gray-900 dark:text-white'}`}>
                                            {count}
                                        </p>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{type.label}</p>
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Pie Chart Card - Reference Design */}
                        {stories.length > 0 && (
                            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                                <div className="flex flex-col lg:flex-row items-center gap-12">
                                    {/* Chart with custom labels */}
                                    <div className="w-full lg:w-1/2 flex justify-center">
                                        <div className="relative" style={{ width: 320, height: 320 }}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <defs>
                                                        {/* Gradient definitions for 3D effect */}
                                                        <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#34d399" />
                                                            <stop offset="100%" stopColor="#059669" />
                                                        </linearGradient>
                                                        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#60a5fa" />
                                                            <stop offset="100%" stopColor="#2563eb" />
                                                        </linearGradient>
                                                        <linearGradient id="grayGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#9ca3af" />
                                                            <stop offset="100%" stopColor="#6b7280" />
                                                        </linearGradient>
                                                        <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#f87171" />
                                                            <stop offset="100%" stopColor="#dc2626" />
                                                        </linearGradient>
                                                        <linearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#fcd34d" />
                                                            <stop offset="100%" stopColor="#f59e0b" />
                                                        </linearGradient>
                                                        <linearGradient id="lightGrayGrad" x1="0" y1="0" x2="1" y2="1">
                                                            <stop offset="0%" stopColor="#e5e7eb" />
                                                            <stop offset="100%" stopColor="#d1d5db" />
                                                        </linearGradient>
                                                        {/* Shadow filter */}
                                                        <filter id="chartShadow" x="-20%" y="-20%" width="140%" height="140%">
                                                            <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15" />
                                                        </filter>
                                                    </defs>
                                                    <Pie
                                                        data={storyTypes.map(type => ({
                                                            name: type.label,
                                                            value: storiesByType[type.value] || 0,
                                                            type: type.value,
                                                            chartColor: type.chartColor
                                                        })).filter(d => d.value > 0)}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={80}
                                                        outerRadius={140}
                                                        paddingAngle={3}
                                                        dataKey="value"
                                                        onClick={(data) => setSelectedCategory(data.type)}
                                                        style={{ cursor: 'pointer', filter: 'url(#chartShadow)' }}
                                                        stroke="none"
                                                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                                                            const RADIAN = Math.PI / 180;
                                                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                            const percentage = ((value / stories.length) * 100).toFixed(1);

                                                            return (
                                                                <g>
                                                                    <rect
                                                                        x={x - 28}
                                                                        y={y - 14}
                                                                        width={56}
                                                                        height={28}
                                                                        rx={6}
                                                                        fill="rgba(17, 24, 39, 0.85)"
                                                                    />
                                                                    <text
                                                                        x={x}
                                                                        y={y}
                                                                        fill="white"
                                                                        textAnchor="middle"
                                                                        dominantBaseline="central"
                                                                        className="text-sm font-bold"
                                                                        style={{ fontSize: '14px', fontWeight: 'bold' }}
                                                                    >
                                                                        {percentage}
                                                                    </text>
                                                                </g>
                                                            );
                                                        }}
                                                        labelLine={false}
                                                    >
                                                        {storyTypes.map((type, index) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    type.value === 'achievement' ? 'url(#greenGrad)' :
                                                                        type.value === 'regret' ? 'url(#blueGrad)' :
                                                                            type.value === 'unsent_letter' ? 'url(#grayGrad)' :
                                                                                type.value === 'sacrifice' ? 'url(#redGrad)' :
                                                                                    type.value === 'life_story' ? 'url(#yellowGrad)' : 'url(#lightGrayGrad)'
                                                                }
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        content={({ active, payload }) => {
                                                            if (active && payload && payload.length) {
                                                                const percentage = ((payload[0].value / stories.length) * 100).toFixed(1);
                                                                return (
                                                                    <div className="bg-gray-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-gray-700">
                                                                        <p className="font-bold text-lg">{payload[0].name}</p>
                                                                        <p className="text-gray-300 text-sm mt-1">{payload[0].value} {payload[0].value === 1 ? 'story' : 'stories'} ({percentage}%)</p>
                                                                    </div>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    {/* Legend and Stats */}
                                    <div className="w-full lg:w-1/2 space-y-6">
                                        <div className="text-center lg:text-left">
                                            <p className="text-6xl font-black text-gray-900 dark:text-white">{stories.length}</p>
                                            <p className="text-xl text-gray-500 dark:text-gray-400 mt-1">Total Stories</p>
                                        </div>

                                        <div className="space-y-4">
                                            {storyTypes.filter(type => (storiesByType[type.value] || 0) > 0).map((type) => {
                                                const count = storiesByType[type.value] || 0;
                                                const percentage = ((count / stories.length) * 100).toFixed(1);
                                                return (
                                                    <button
                                                        key={type.value}
                                                        onClick={() => setSelectedCategory(selectedCategory === type.value ? null : type.value)}
                                                        className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 ${selectedCategory === type.value
                                                            ? 'bg-gray-100 dark:bg-gray-700 shadow-md scale-102'
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        <div
                                                            className="w-5 h-5 rounded-lg flex-shrink-0 shadow-sm"
                                                            style={{ backgroundColor: type.chartColor }}
                                                        />
                                                        <span className="flex-1 text-left font-medium text-gray-800 dark:text-gray-200">{type.label}</span>
                                                        <span className="text-lg font-bold text-gray-900 dark:text-white">{count}</span>
                                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-16 text-right">{percentage}%</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <p className="text-center lg:text-left text-sm text-gray-500 dark:text-gray-400 italic">
                                            Click on a slice or legend to filter stories
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
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
