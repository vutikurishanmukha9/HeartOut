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
        <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/30 dark:from-zinc-900 dark:to-zinc-900 py-8 relative overflow-hidden">
            {/* Single subtle floating orb */}
            <div className="absolute top-40 right-10 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

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
                            <h1 className="text-2xl sm:text-3xl font-medium text-stone-800 dark:text-stone-100 mb-2">
                                This space is yours
                            </h1>
                            <p className="text-sm text-stone-500 dark:text-stone-400">
                                You're in control of who sees this.
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
                                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
                                    Title
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Name this, or leave it blank for now."
                                        className="w-full px-5 py-4 text-lg font-medium border border-stone-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900/50 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:ring-0 focus:border-amber-500 transition-all duration-300"
                                        maxLength={200}
                                    />
                                </div>
                            </div>

                            {/* Content Textarea */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-stone-500 dark:text-stone-400 mb-2">
                                    Your story
                                </label>
                                <div className="relative group">
                                    <textarea
                                        ref={textareaRef}
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Start anywhere. Even the middle is fine."
                                        className="w-full px-6 py-5 border border-stone-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-900/50 text-stone-700 dark:text-stone-200 placeholder-stone-400 focus:ring-0 focus:border-amber-500 transition-all duration-300 resize-none leading-loose min-h-[200px] sm:min-h-[400px] overflow-y-auto"
                                        style={{ maxHeight: '500px' }}
                                    />
                                </div>

                                {/* Stats Bar - Hidden until 50+ words */}
                                {wordCount >= 50 && (
                                    <div className="flex items-center justify-end mt-3 px-1 animate-fade-in">
                                        <span className="text-xs text-stone-400 dark:text-stone-500">
                                            {wordCount} words · ~{readingTime} min read
                                        </span>
                                    </div>
                                )}
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

                        {/* Action Buttons - Quieter */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button
                                onClick={() => handleSubmit(false)}
                                disabled={submitting}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-stone-600 dark:text-stone-400 rounded-xl font-medium hover:bg-stone-50 dark:hover:bg-zinc-700 transition-all duration-200 disabled:opacity-50"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={() => setShowPublishModal(true)}
                                disabled={submitting || !formData.title || !formData.content}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 disabled:cursor-not-allowed ${formData.content.length > 50
                                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                                    : 'bg-stone-200 dark:bg-zinc-700 text-stone-400 dark:text-stone-500'
                                    }`}
                            >
                                {formData.content.length > 50 ? 'Publish when ready' : 'Publish (keep writing...)'}
                            </button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 animate-slide-up stagger-2">
                        {/* Privacy - Warmer framing */}
                        <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-xl p-5 border border-stone-200/50 dark:border-zinc-700/50">
                            <h3 className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">
                                Share when you're ready
                            </h3>
                            <AnonymousToggle
                                isAnonymous={formData.is_anonymous}
                                onChange={(value) => setFormData({ ...formData, is_anonymous: value })}
                            />
                            <p className="text-xs text-stone-400 dark:text-stone-500 mt-2 italic">
                                You can stay anonymous if you choose.
                            </p>
                        </div>

                        {/* Writing Tips - Softer, less prominent */}
                        <div className="bg-stone-50 dark:bg-zinc-800/50 rounded-xl p-5 border border-stone-100 dark:border-zinc-700/50">
                            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed italic">
                                "{writingTips[formData.story_type] || writingTips.other}"
                            </p>
                        </div>

                        {/* Story Preview - Only show after 50+ words */}
                        {wordCount >= 50 && (
                            <div className="bg-white/60 dark:bg-zinc-800/60 rounded-xl p-5 border border-stone-100 dark:border-zinc-700/50 animate-fade-in">
                                <div className="space-y-3 text-sm text-stone-500 dark:text-stone-400">
                                    <div className="flex justify-between">
                                        <span>Words</span>
                                        <span className="text-stone-700 dark:text-stone-300">{wordCount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Read time</span>
                                        <span className="text-stone-700 dark:text-stone-300">~{readingTime} min</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Visibility</span>
                                        <span className="text-stone-700 dark:text-stone-300">
                                            {formData.is_anonymous ? 'Anonymous' : 'Public'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guideline - Single reassuring line */}
                        <p className="text-xs text-stone-400 dark:text-stone-500 text-center italic">
                            Be authentic. Be kind. That's all.
                        </p>
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
