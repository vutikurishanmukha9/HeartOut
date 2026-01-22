import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PenTool, Save, Send, ArrowLeft, Sparkles, Clock, Hash, Check, X, Heart, Lightbulb, AlertCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import StoryTypeSelector from '../components/StoryTypeSelector';
import AnonymousToggle from '../components/AnonymousToggle';
import { getApiUrl } from '../config/api';

export default function CreatePost() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const textareaRef = useRef(null);
    const [step, setStep] = useState(1);
    const [draftId, setDraftId] = useState(null);
    const [loadingDraft, setLoadingDraft] = useState(false); // Prevents flash when loading draft
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        story_type: '',
        is_anonymous: false,
        tags: [],
        status: 'draft'
    });
    const [tagInput, setTagInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [autoSaved, setAutoSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load draft if editing existing one
    useEffect(() => {
        const draftParam = searchParams.get('draft');
        if (draftParam) {
            setDraftId(draftParam);
            setLoadingDraft(true); // Show loading while fetching draft
            loadDraft(draftParam);
        } else {
            // Restore from localStorage if not editing existing draft
            const savedDraft = localStorage.getItem('heartout_draft');
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    setFormData(prev => ({
                        ...prev,
                        title: parsed.title || '',
                        content: parsed.content || '',
                        story_type: parsed.story_type || '',
                        is_anonymous: parsed.is_anonymous ?? false,
                        tags: parsed.tags || []
                    }));
                    if (parsed.story_type) setStep(2);
                    setAutoSaved(true);
                    setTimeout(() => setAutoSaved(false), 2000);
                } catch (e) {
                    console.error('Failed to restore draft:', e);
                }
            }
        }
    }, [searchParams]);

    const loadDraft = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            console.log('Loading draft:', id);
            const response = await fetch(getApiUrl(`/api/posts/${id}`), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Draft loaded:', data);
                const story = data.story;
                setFormData({
                    title: story.title || '',
                    content: story.content || '',
                    story_type: story.story_type || '',
                    is_anonymous: story.is_anonymous ?? true,
                    tags: story.tags || [],
                    status: story.status || 'draft'
                });
                // Skip to step 2 if story type is set
                if (story.story_type) setStep(2);
            } else {
                console.error('Failed to load draft, status:', response.status);
                toast.error('Failed to load draft');
            }
        } catch (error) {
            console.error('Failed to load draft:', error);
            toast.error('Failed to load draft');
        } finally {
            setLoadingDraft(false); // Done loading
        }
    };

    // Clear localStorage draft helper
    const clearLocalDraft = () => {
        localStorage.removeItem('heartout_draft');
    };

    // Auto-save draft to localStorage every 5 seconds
    useEffect(() => {
        if (!draftId && (formData.title || formData.content)) {
            const timer = setTimeout(() => {
                localStorage.setItem('heartout_draft', JSON.stringify({
                    title: formData.title,
                    content: formData.content,
                    story_type: formData.story_type,
                    is_anonymous: formData.is_anonymous,
                    tags: formData.tags,
                    savedAt: new Date().toISOString()
                }));
                setAutoSaved(true);
                setLastSaved(new Date());
                setTimeout(() => setAutoSaved(false), 2000);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [formData.title, formData.content, formData.story_type, formData.is_anonymous, formData.tags, draftId]);

    // Auto-resize textarea on mobile
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            // Reset height to auto to get proper scrollHeight
            textarea.style.height = 'auto';
            // Set minimum height based on screen size
            const isMobile = window.innerWidth < 640;
            const minHeight = isMobile ? 120 : 400; // 4 rows mobile, 16 rows desktop
            const maxHeight = isMobile ? 400 : 600; // Cap height
            // Calculate new height
            const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }, [formData.content]);

    const handleSubmit = async (publishNow = false) => {
        if (!formData.title || !formData.content || !formData.story_type) {
            toast.error('Please fill in all required fields', {
                duration: 4000
            });
            return;
        }

        setSubmitting(true);
        try {
            // Use PUT for editing existing draft, POST for new story
            const url = draftId
                ? getApiUrl(`/api/posts/${draftId}`)
                : getApiUrl('/api/posts');
            const method = draftId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    ...formData,
                    status: publishNow ? 'published' : 'draft'
                })
            });

            if (response.ok) {
                const data = await response.json();
                clearLocalDraft(); // Clear localStorage after successful save
                navigate(publishNow ? `/feed/story/${data.story.id}` : '/feed/drafts');
            } else {
                const errorData = await response.json().catch(() => ({}));
                // Handle FastAPI validation errors (422 format: {detail: [{loc: [], msg: '...'}]})
                let errorMsg = 'Failed to create story';
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        // FastAPI validation error format
                        errorMsg = errorData.detail.map(err => {
                            const field = err.loc?.slice(-1)[0] || 'field';
                            return `${field}: ${err.msg}`;
                        }).join('\n');
                    } else if (typeof errorData.detail === 'string') {
                        errorMsg = errorData.detail;
                    }
                } else if (errorData.error) {
                    errorMsg = errorData.error;
                } else if (errorData.message) {
                    errorMsg = errorData.message;
                }
                // Show styled toast with the actual validation error
                toast.error(errorMsg, {
                    duration: 6000,
                    style: {
                        maxWidth: '400px',
                        whiteSpace: 'pre-line'
                    }
                });
            }
        } catch (error) {
            console.error('Error creating story:', error);
            toast.error('Network error. Please check your connection.', {
                duration: 5000
            });
        } finally {
            setSubmitting(false);
            setShowPublishModal(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim().toLowerCase()]
            });
            setTagInput('');
        }
    };

    const removeTag = (tag) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter(t => t !== tag)
        });
    };

    const wordCount = formData.content.split(/\s+/).filter(w => w.length > 0).length;
    const charCount = formData.content.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 225));
    const titleProgress = (formData.title.length / 200) * 100;

    // Writing tips based on story type
    const writingTips = {
        achievement: "Focus on the journey, not just the destination. What obstacles did you overcome?",
        regret: "Be honest and reflective. What would you do differently?",
        unsent_letter: "Write from the heart. What do you wish you had said?",
        sacrifice: "Describe the weight of your choice. What made it worth it?",
        life_story: "Share the moments that shaped who you are today.",
        other: "Let your authentic voice shine through."
    };

    // Show loading screen while loading draft (prevents flash of step 1)
    if (loadingDraft) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your draft...</p>
                </div>
            </div>
        );
    }

    // Step 1: Story Type Selection
    if (step === 1) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900 py-12">
                {/* Single subtle floating orb - morning fog feel */}
                <div className="fixed top-40 right-20 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 animate-slide-up">

                        <h1 className="text-3xl sm:text-4xl font-medium text-stone-800 dark:text-stone-100 mb-4">
                            What would you like to write today?
                        </h1>
                        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
                            There's no right choice. Start where it feels easiest.
                        </p>
                    </div>

                    <div className="animate-slide-up stagger-2">
                        <StoryTypeSelector
                            selected={formData.story_type}
                            onChange={(type) => {
                                setFormData({ ...formData, story_type: type });
                                setStep(2);
                            }}
                            variant="cards"
                        />

                        {/* Permission sentence - emotional grounding */}
                        <p className="text-center text-sm text-stone-400 dark:text-stone-500 italic mt-10">
                            You don't have to write perfectly. You just have to write honestly.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Step 2: Write Story
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-orange-50/30 to-purple-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-20 -left-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl animate-float pointer-events-none" />
            <div className="absolute bottom-40 -right-20 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 animate-slide-up">
                    <button
                        onClick={() => setStep(1)}
                        className="group inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Change Story Type</span>
                    </button>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-4xl font-bold">
                                    <span className="text-gray-900 dark:text-white">Write Your </span>
                                    <span className="text-gradient">Story</span>
                                </h1>
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Share your authentic experience with the world
                            </p>
                        </div>

                        {/* Auto-save indicator */}
                        <div className="flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-gray-700/30">
                            {autoSaved && (
                                <span className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Auto-saved
                                </span>
                            )}
                            {lastSaved && !autoSaved && (
                                <span className="text-gray-500 dark:text-gray-400">
                                    <Clock className="w-4 h-4 inline mr-1" />
                                    {lastSaved.toLocaleTimeString()}
                                </span>
                            )}
                            {!lastSaved && !autoSaved && (
                                <span className="text-gray-400">Draft not saved</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Editor */}
                    <div className="lg:col-span-2 space-y-6 animate-slide-up">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 border border-white/50 dark:border-gray-700/50 space-y-8">
                            {/* Title Input */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    <PenTool className="w-4 h-4 text-primary-500" />
                                    Title <span className="text-primary-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Give your story a compelling title..."
                                        className="w-full px-5 py-4 text-xl font-semibold border-2 border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-primary-500 focus:shadow-lg focus:shadow-primary-500/10 transition-all duration-300"
                                        maxLength={200}
                                    />
                                    {/* Animated gradient border on focus */}
                                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300" />
                                </div>
                                <div className="flex justify-between items-center mt-2 px-1">
                                    <div className="h-1 flex-1 max-w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 rounded-full ${titleProgress > 80 ? 'bg-gradient-to-r from-red-400 to-red-500' : titleProgress > 50 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-primary-400 to-secondary-500'}`}
                                            style={{ width: `${titleProgress}%` }}
                                        />
                                    </div>
                                    <span className={`text-xs font-medium ${titleProgress > 80 ? 'text-red-500' : 'text-gray-400'}`}>
                                        {formData.title.length}/200
                                    </span>
                                </div>
                            </div>

                            {/* Content Textarea */}
                            <div className="relative">
                                <label className="flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    <span>Your Story <span className="text-primary-500">*</span></span>
                                    {formData.content.length > 0 && (
                                        <span className="text-xs font-normal text-emerald-500 flex items-center gap-1 animate-fade-in">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Writing...
                                        </span>
                                    )}
                                </label>
                                <div className="relative group">
                                    <textarea
                                        ref={textareaRef}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Tell your story... Be authentic, be you."
                                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-primary-500 focus:shadow-lg focus:shadow-primary-500/10 transition-all duration-300 resize-none leading-relaxed min-h-[120px] sm:min-h-[400px] overflow-y-auto"
                                        style={{ maxHeight: '400px' }}
                                    />
                                    {/* Gradient fade at bottom when scrollable */}
                                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none rounded-b-xl sm:rounded-b-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                </div>

                                {/* Stats Bar - Enhanced */}
                                <div className="flex items-center justify-between mt-3 px-1">
                                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                        <span className="flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                                            <PenTool className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span className="font-medium">{wordCount}</span> words
                                        </span>
                                        <span className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                                            <Hash className="w-4 h-4" />
                                            <span className="font-medium">{charCount}</span> chars
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-700/50">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        ~{readingTime} min
                                    </span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Tags <span className="text-gray-400 font-normal">(up to 5)</span>
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <div className="relative flex-1">
                                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Add a tag..."
                                            className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-primary-500 transition-all"
                                            disabled={formData.tags.length >= 5}
                                        />
                                    </div>
                                    <button
                                        onClick={addTag}
                                        disabled={formData.tags.length >= 5}
                                        className="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map((tag, index) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-medium border border-primary-100 dark:border-primary-800/50 animate-scale-in"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            #{tag}
                                            <button
                                                onClick={() => removeTag(tag)}
                                                className="hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </span>
                                    ))}
                                    {formData.tags.length === 0 && (
                                        <span className="text-sm text-gray-400">No tags added yet</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="group flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl sm:rounded-2xl font-semibold hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-300 hover:shadow-lg hover:shadow-violet-500/10 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={() => setShowPublishModal(true)}
                                disabled={submitting || !formData.title || !formData.content}
                                className="group flex-1 flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-4 bg-gradient-to-r from-orange-400 via-rose-400 to-pink-400 text-white rounded-xl sm:rounded-2xl font-semibold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
                                Publish Story
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 animate-slide-up stagger-2">
                        {/* Anonymous Toggle Card */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30 border border-white/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-1.5 rounded-lg bg-primary-100 dark:bg-primary-900/30">
                                    <Shield className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Privacy Settings</h3>
                            </div>
                            <AnonymousToggle
                                isAnonymous={formData.is_anonymous}
                                onChange={(value) => setFormData({ ...formData, is_anonymous: value })}
                            />
                        </div>

                        {/* Writing Tips Card */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-200/50 dark:border-amber-700/30">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                                    <Lightbulb className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Writing Tip</h3>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">For your story type</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                "{writingTips[formData.story_type] || writingTips.other}"
                            </p>
                        </div>

                        {/* Preview Stats Card */}
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg shadow-gray-200/30 dark:shadow-gray-900/30 border border-white/50 dark:border-gray-700/50">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="p-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-900/30">
                                    <Sparkles className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                                </div>
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Story Preview</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <PenTool className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Words</span>
                                    </div>
                                    <span className="text-lg font-bold text-gradient">{wordCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Read time</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">{readingTime} min</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Tags</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-colors ${i < formData.tags.length ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Visibility</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${formData.is_anonymous
                                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'}`}>
                                            {formData.is_anonymous ? 'Anonymous' : 'Public'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guidelines */}
                        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-100 dark:border-primary-800/30 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-primary-500" />
                                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Guidelines</h3>
                            </div>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    Be respectful and authentic
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    No hate speech or harassment
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                                    Protect others' privacy
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Publish Confirmation Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md glass-card rounded-2xl p-6 animate-scale-in">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Ready to Publish?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your story will be visible to everyone. Make sure you're ready to share!
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                {formData.title}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {wordCount} words • {readingTime} min read • {formData.is_anonymous ? 'Anonymous' : 'Public'}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowPublishModal(false)}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSubmit(true)}
                                disabled={submitting}
                                className="flex-1 btn-premium flex items-center justify-center gap-2 py-3"
                            >
                                {submitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Publish Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
