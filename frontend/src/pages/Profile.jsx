import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, Mail, BookOpen, Edit, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';

export default function Profile() {
    const { userId } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
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

                    {/* Story Stats */}
                    <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Stories by Category
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {storyTypes.map((type) => {
                                const Icon = type.icon;
                                const count = storiesByType[type.value] || 0;
                                return (
                                    <div
                                        key={type.value}
                                        className={`p-4 rounded-lg ${type.bgColor} ${type.borderColor} border text-center`}
                                    >
                                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${type.color} mb-2`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className={`text-2xl font-bold ${type.textColor}`}>{count}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{type.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stories Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Published Stories
                    </h2>
                    {stories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {stories.map((story) => (
                                <StoryCard key={story.id} story={story} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <BookOpen className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No stories yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {isOwnProfile ? "Start sharing your stories with the world!" : "This author hasn't published any stories yet."}
                            </p>
                            {isOwnProfile && (
                                <Link
                                    to="/feed/create"
                                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Write Your First Story
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
