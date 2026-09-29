import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    Globe, 
    BookOpen, 
    Edit3, 
    Award, 
    X, 
    ArrowLeft, 
    Settings, 
    Bookmark, 
    Plus, 
    Feather, 
    Check, 
    Compass 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/PostCard';
import { storyTypes } from '../components/StoryTypeSelector';
import StoryConstellation from '../components/StoryConstellation';
import { ProfileSEO } from '../components/SEO';
import { getApiUrl, apiFetch } from '../config/api';

export default function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, updateProfile: authUpdateProfile, setUser: setAuthUser } = useContext(AuthContext);

    // Profile & Story states
    const [profile, setProfile] = useState(null);
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Edit form state
    const [formData, setFormData] = useState({
        display_name: '',
        bio: '',
        author_bio: '',
        website_url: '',
        social_links: {}
    });

    const isOwnProfile = !userId || 
        userId === currentUser?.id || 
        userId === currentUser?.public_id || 
        userId === currentUser?.username;

    const fetchOwnProfile = useCallback(async () => {
        try {
            const response = await apiFetch('/api/auth/profile');
            if (response.ok) {
                const data = await response.json();
                setProfile(data.user);
                if (setAuthUser) {
                    setAuthUser(data.user);
                }
                setFormData({
                    display_name: data.user?.display_name || '',
                    bio: data.user?.bio || '',
                    author_bio: data.user?.author_bio || '',
                    website_url: data.user?.website_url || '',
                    social_links: data.user?.social_links || {}
                });
            }
        } catch (error) {
            console.error('Failed to fetch own profile:', error);
        } finally {
            setLoading(false);
        }
    }, [setAuthUser]);

    const fetchUserProfile = useCallback(async () => {
        try {
            const response = await apiFetch(`/api/posts/user/${userId}/stories`);
            if (response.ok) {
                const data = await response.json();
                setProfile(data.author);
            }
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const fetchUserStories = useCallback(async () => {
        try {
            const targetUserId = isOwnProfile 
                ? (currentUser?.id || currentUser?.public_id) 
                : userId;

            if (!targetUserId) {
                setStories([]);
                return;
            }

            const response = await apiFetch(`/api/posts/user/${targetUserId}/stories`);
            if (response.ok) {
                const data = await response.json();
                setStories(data.stories || []);
            } else {
                setStories([]);
            }
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            setStories([]);
        }
    }, [isOwnProfile, currentUser, userId]);

    useEffect(() => {
        if (isOwnProfile) {
            fetchOwnProfile();
        } else {
            fetchUserProfile();
        }
        fetchUserStories();
    }, [userId, isOwnProfile, fetchOwnProfile, fetchUserProfile, fetchUserStories]);

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);

        try {
            // Trim inputs and convert empty strings to null for clean database persistence
            const sanitizedData = {
                display_name: formData.display_name?.trim() || null,
                bio: formData.bio?.trim() || null,
                author_bio: formData.author_bio?.trim() || null,
                website_url: formData.website_url?.trim() || null,
                social_links: formData.social_links || {}
            };

            const result = authUpdateProfile 
                ? await authUpdateProfile(sanitizedData)
                : await (async () => {
                    const response = await apiFetch('/api/auth/profile', {
                        method: 'PUT',
                        body: JSON.stringify(sanitizedData)
                    });
                    const data = await response.json().catch(() => ({}));
                    if (response.ok) {
                        return { success: true, user: data.user };
                    }
                    const errorMsg = data.error || data.detail || 'Failed to update profile';
                    return { success: false, error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg) };
                })();

            if (result.success && result.user) {
                setProfile(result.user);
                if (setAuthUser) {
                    setAuthUser(result.user);
                }
                setFormData({
                    display_name: result.user?.display_name || '',
                    bio: result.user?.bio || '',
                    author_bio: result.user?.author_bio || '',
                    website_url: result.user?.website_url || '',
                    social_links: result.user?.social_links || {}
                });
                setEditing(false);
                toast.success('Sanctuary presence updated');
            } else {
                toast.error(result.error || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Network error. Could not update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">
                        Opening sanctuary archive...
                    </p>
                </div>
            </div>
        );
    }

    const authorDisplayName = profile?.display_name || profile?.username || 'Sanctuary Author';
    const storiesByType = storyTypes.reduce((acc, type) => {
        acc[type.value] = stories.filter(s => s.story_type === type.value).length;
        return acc;
    }, {});

    const filteredStories = selectedCategory
        ? stories.filter(s => s.story_type === selectedCategory)
        : stories;

    return (
        <>
            <ProfileSEO username={authorDisplayName} storyCount={stories.length} />

            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
                {/* Top Sanctuary Navigation Bar */}
                <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                    <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                        {/* Left: Return to Feed */}
                        <button
                            onClick={() => navigate('/feed')}
                            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2 py-1.5 rounded-xl text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0"
                            aria-label="Return to feed"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Return to Sanctuary</span>
                            <span className="sm:hidden">Sanctuary</span>
                        </button>

                        {/* Right: Quick Actions */}
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            {isOwnProfile && (
                                <>
                                    <Link
                                        to="/feed/saved"
                                        aria-label="Saved reflections"
                                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                                    >
                                        <Bookmark className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Saved</span>
                                    </Link>

                                    <Link
                                        to="/profile/settings"
                                        aria-label="Sanctuary settings"
                                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
                                    >
                                        <Settings className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">Settings</span>
                                    </Link>

                                    <Link
                                        to="/feed/create"
                                        className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#C85828] hover:bg-[#B54D20] active:scale-[0.98] shadow-sm transition-all whitespace-nowrap"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">New Story</span>
                                        <span className="sm:hidden">New</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
                    
                    {/* Author Sanctuary Profile Card */}
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-10 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
                            
                            {/* Author Ceramic Disc */}
                            <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 border border-amber-200/70 dark:border-amber-900/50 flex items-center justify-center font-stories text-3xl sm:text-4xl font-normal shadow-sm">
                                    {(profile?.username || 'U').charAt(0).toUpperCase()}
                                </div>

                                {profile?.is_featured_author && (
                                    <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-full text-amber-700 dark:text-amber-400 text-xs font-medium">
                                        <Award className="w-3.5 h-3.5" />
                                        <span>Featured Guide</span>
                                    </div>
                                )}
                            </div>

                            {/* Author Information or Edit Mode */}
                            <div className="flex-1 w-full text-left">
                                {editing ? (
                                    /* Inline Edit Form */
                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                                                    Display Name
                                                </label>
                                                <span className="text-[10px] text-stone-400 font-mono">
                                                    {(formData.display_name || '').length}/100
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={100}
                                                value={formData.display_name}
                                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                                placeholder="Your public pen name"
                                                className="w-full px-4 py-2 text-sm rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                                                    Short Reflection Bio
                                                </label>
                                                <span className="text-[10px] text-stone-400 font-mono">
                                                    {(formData.bio || '').length}/1000
                                                </span>
                                            </div>
                                            <textarea
                                                maxLength={1000}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                placeholder="A gentle sentence on who you are..."
                                                rows={2}
                                                className="w-full px-4 py-2 text-sm rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                                                    About the Author
                                                </label>
                                                <span className="text-[10px] text-stone-400 font-mono">
                                                    {(formData.author_bio || '').length}/5000
                                                </span>
                                            </div>
                                            <textarea
                                                maxLength={5000}
                                                value={formData.author_bio}
                                                onChange={(e) => setFormData({ ...formData, author_bio: e.target.value })}
                                                placeholder="Write something extended about your reflections, background, or spirit."
                                                rows={3}
                                                className="w-full px-4 py-2 text-sm rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 resize-none"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
                                                    Personal Website
                                                </label>
                                                <span className="text-[10px] text-stone-400 font-mono">
                                                    {(formData.website_url || '').length}/200
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                maxLength={200}
                                                value={formData.website_url}
                                                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                                placeholder="https://yoursite.com or yoursite.com"
                                                className="w-full px-4 py-2 text-sm rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#C85828] hover:bg-[#B54D20] active:scale-[0.98] transition-all disabled:opacity-50"
                                            >
                                                {saving ? 'Saving...' : 'Save Presence'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* Read Mode */
                                    <>
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                                            <div>
                                                <h1 className="font-stories text-2xl sm:text-3xl lg:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                                                    {authorDisplayName}
                                                </h1>
                                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-medium">
                                                    @{profile?.username}
                                                </p>
                                            </div>

                                            {isOwnProfile && (
                                                <button
                                                    onClick={() => setEditing(true)}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] hover:border-amber-400/50 text-stone-700 dark:text-stone-300 text-xs font-medium transition-all self-start sm:self-auto"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit Profile</span>
                                                </button>
                                            )}
                                        </div>

                                        {profile?.bio && (
                                            <p className="font-body text-sm sm:text-base text-stone-700 dark:text-stone-300 mt-2 leading-relaxed">
                                                {profile.bio}
                                            </p>
                                        )}

                                        {profile?.author_bio && (
                                            <div className="mt-4 pt-4 border-t border-[#EADDCF]/60 dark:border-[#2C2723]">
                                                <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1 font-body">
                                                    About the Author
                                                </h2>
                                                <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                                                    {profile.author_bio}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4 text-xs font-body text-stone-500 dark:text-stone-400 mt-4 pt-3 border-t border-[#EADDCF]/60 dark:border-[#2C2723]">
                                            <div className="inline-flex items-center gap-1.5">
                                                <BookOpen className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                                                <span>{profile?.total_stories || stories.length} published {stories.length === 1 ? 'reflection' : 'reflections'}</span>
                                            </div>

                                            {profile?.website_url && (
                                                <a
                                                    href={profile.website_url.startsWith('http://') || profile.website_url.startsWith('https://') 
                                                        ? profile.website_url 
                                                        : `https://${profile.website_url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1.5 hover:text-[#C85828] transition-colors"
                                                >
                                                    <Globe className="w-3.5 h-3.5" />
                                                    <span>{profile.website_url.replace(/^https?:\/\//, '')}</span>
                                                </a>
                                            )}

                                            <span className="italic text-stone-400 dark:text-stone-500">
                                                Sharing in quiet, without judgment
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>

                    {/* Writing Constellation & Journey Section */}
                    <section className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <div>
                                <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                                    Contemplative Map
                                </span>
                                <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                    Writing Constellation
                                </h2>
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                                    A visual landscape of shared moments: not a scorecard, but a quiet map of reflections.
                                </p>
                            </div>

                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="inline-flex items-center gap-1.5 text-xs text-[#C85828] hover:underline font-medium self-start sm:self-auto"
                                >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Clear Filter</span>
                                </button>
                            )}
                        </div>

                        {/* Category Filter Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                            {storyTypes.map((type) => {
                                const TypeIcon = type.icon;
                                const count = storiesByType[type.value] || 0;
                                const isSelected = selectedCategory === type.value;

                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => setSelectedCategory(isSelected ? null : type.value)}
                                        disabled={count === 0}
                                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border text-center transition-all ${isSelected
                                            ? 'border-[#C85828] bg-amber-50/70 dark:bg-amber-950/30 shadow-sm'
                                            : count > 0
                                                ? 'border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/50 dark:bg-[#121110] hover:border-amber-400/50 cursor-pointer'
                                                : 'border-[#EADDCF]/40 dark:border-[#2C2723]/40 bg-stone-50/20 dark:bg-[#121110]/20 opacity-40 cursor-default'
                                        }`}
                                    >
                                        <TypeIcon className="w-4 h-4 text-[#C85828] dark:text-amber-400 mb-1.5" />
                                        <span className="text-xs font-medium text-stone-800 dark:text-stone-200">
                                            {type.label}
                                        </span>
                                        <span className="text-xs text-stone-400 dark:text-stone-500 font-mono mt-0.5">
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Constellation Canvas View */}
                        {stories.length > 0 && (
                            <div className="pt-2">
                                <StoryConstellation
                                    stories={stories}
                                    storiesByType={storiesByType}
                                    onCategoryClick={(value) => setSelectedCategory(selectedCategory === value ? null : value)}
                                />
                            </div>
                        )}

                        <p className="text-center font-body text-xs text-stone-400 dark:text-stone-500 italic mt-4">
                            There is no right balance. This is simply a snapshot of your heart in time.
                        </p>
                    </section>

                    {/* Stories Archive Grid */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                                    {selectedCategory
                                        ? `${storyTypes.find(t => t.value === selectedCategory)?.label || 'Filtered'} Reflections`
                                        : isOwnProfile ? 'Your Reflections' : 'Published Reflections'
                                    }
                                </h2>
                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                                    {isOwnProfile ? 'Words you have shared with the sanctuary.' : 'Public reflections by this author.'}
                                </p>
                            </div>

                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-700 dark:text-stone-300">
                                {filteredStories.length}
                            </span>
                        </div>

                        {filteredStories.length === 0 ? (
                            <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 sm:p-12 text-center max-w-xl mx-auto space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/40">
                                    <Feather className="w-6 h-6 stroke-[1.75]" />
                                </div>

                                <h3 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                                    {selectedCategory
                                        ? `No ${storyTypes.find(t => t.value === selectedCategory)?.label} reflections`
                                        : 'No reflections shared yet'
                                    }
                                </h3>

                                <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                                    {selectedCategory
                                        ? 'Select another category or clear the filter to view all reflections.'
                                        : isOwnProfile
                                            ? 'When you are ready, share your first story anonymously or openly with the sanctuary.'
                                            : 'This author has not published any reflections in this category yet.'
                                    }
                                </p>

                                {selectedCategory ? (
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className="inline-flex items-center gap-1.5 text-xs text-[#C85828] hover:underline font-medium"
                                    >
                                        <span>Show all reflections</span>
                                    </button>
                                ) : isOwnProfile && (
                                    <div className="pt-2">
                                        <Link
                                            to="/feed/create"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Begin Your Reflection</span>
                                        </Link>
                                    </div>
                                )}
                            </article>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStories.map((story, index) => (
                                    <StoryCard key={story.id} story={story} index={index} />
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </>
    );
}
