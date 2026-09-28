import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Save, 
    Send, 
    Sparkles, 
    Clock, 
    Check, 
    X, 
    Heart, 
    AlertCircle, 
    Shield, 
    Maximize2, 
    Minimize2, 
    Trash2,
    PhoneCall,
    SlidersHorizontal,
    Feather
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl, apiFetch } from '../config/api';
import { AuthContext } from '../context/AuthContext';
import StoryTypeSelector, { storyTypes } from '../components/StoryTypeSelector';
import AnonymousToggle from '../components/AnonymousToggle';
import haptic from '../utils/haptics';

const WRITING_GUIDANCE = {
    unsent_letter: {
        tip: 'Write directly to them as if they will never read it. The weight belongs on the page, not inside your chest.',
        prompt: 'To the person you never got to tell: say what you carried in silence.'
    },
    regret: {
        tip: 'Be honest and reflective. What did this experience teach you about who you used to be and who you are now?',
        prompt: 'What hard experience reshaped how you walk through the world?'
    },
    confession: {
        tip: 'Longing is a natural human pulse. Give a name to the ambition, hope, or secret wish you have kept quiet.',
        prompt: 'What quiet ambition or longing are you still secretly reaching for?'
    },
    achievement: {
        tip: 'Focus on the inner climb, not just the summit. What quiet resistance did you have to overcome to get here?',
        prompt: 'What did you survive, build, or overcome that you never thought you could?'
    },
    sacrifice: {
        tip: 'Describe what you chose to surrender, and what made that surrender worth the weight you carried.',
        prompt: 'What did it cost you to protect someone else or reach this moment?'
    },
    other: {
        tip: 'No filters, no performance. Let your authentic reflection breathe in the quiet.',
        prompt: 'The truths that breathe easiest in the quiet.'
    }
};

export default function CreatePost() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const textareaRef = useRef(null);
    const authContext = useContext(AuthContext);
    const currentUser = authContext?.user;

    const [isFocusMode, setIsFocusMode] = useState(false);
    const [draftId, setDraftId] = useState(null);
    const [loadingDraft, setLoadingDraft] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        story_type: 'unsent_letter',
        is_anonymous: false,
        tags: [],
        status: 'draft'
    });

    const [tagInput, setTagInput] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);
    const [showCrisisModal, setShowCrisisModal] = useState(false);
    const [autoSaved, setAutoSaved] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);

    // Load draft if editing existing one from backend or local storage
    useEffect(() => {
        const draftParam = searchParams.get('draft');
        if (draftParam) {
            setDraftId(draftParam);
            setLoadingDraft(true);
            loadRemoteDraft(draftParam);
        } else {
            const savedDraft = localStorage.getItem('heartout_draft');
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    setFormData(prev => ({
                        ...prev,
                        title: parsed.title || '',
                        content: parsed.content || '',
                        story_type: parsed.story_type || 'unsent_letter',
                        is_anonymous: parsed.is_anonymous ?? false,
                        tags: Array.isArray(parsed.tags) ? parsed.tags : []
                    }));
                    if (parsed.savedAt) {
                        setLastSaved(new Date(parsed.savedAt));
                    }
                    setAutoSaved(true);
                    const timer = setTimeout(() => setAutoSaved(false), 2000);
                    return () => clearTimeout(timer);
                } catch (e) {
                    console.error('Failed to parse cached draft:', e);
                }
            }
        }
    }, [searchParams]);

    const loadRemoteDraft = async (id) => {
        try {
            const response = await apiFetch(`/api/posts/${id}`);
            if (response.ok) {
                const data = await response.json();
                const story = data.story;
                setFormData({
                    title: story.title || '',
                    content: story.content || '',
                    story_type: story.story_type || 'unsent_letter',
                    is_anonymous: story.is_anonymous ?? true,
                    tags: Array.isArray(story.tags) ? story.tags : [],
                    status: story.status || 'draft'
                });
                setLastSaved(story.updated_at ? new Date(story.updated_at) : new Date());
            } else {
                toast.error('Unable to load requested draft');
            }
        } catch (error) {
            console.error('Failed to fetch remote draft:', error);
            toast.error('Network issue loading draft');
        } finally {
            setLoadingDraft(false);
        }
    };

    const clearLocalDraft = () => {
        localStorage.removeItem('heartout_draft');
    };

    const handleDiscard = () => {
        haptic.heavy();
        clearLocalDraft();
        setFormData({
            title: '',
            content: '',
            story_type: 'unsent_letter',
            is_anonymous: false,
            tags: [],
            status: 'draft'
        });
        setLastSaved(null);
        setShowDiscardModal(false);
        toast.success('Draft cleared');
    };

    // Auto-save draft to localStorage every 4 seconds when dirty
    useEffect(() => {
        if (!draftId) {
            if (formData.title.trim() || formData.content.trim()) {
                const timer = setTimeout(() => {
                    const now = new Date();
                    localStorage.setItem('heartout_draft', JSON.stringify({
                        title: formData.title,
                        content: formData.content,
                        story_type: formData.story_type,
                        is_anonymous: formData.is_anonymous,
                        tags: formData.tags,
                        savedAt: now.toISOString()
                    }));
                    setAutoSaved(true);
                    setLastSaved(now);
                    setTimeout(() => setAutoSaved(false), 2000);
                }, 4000);
                return () => clearTimeout(timer);
            } else {
                localStorage.removeItem('heartout_draft');
            }
        }
    }, [formData.title, formData.content, formData.story_type, formData.is_anonymous, formData.tags, draftId]);

    // Adaptive auto-growing textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const minHeight = window.innerWidth < 640 ? 240 : 380;
            const newHeight = Math.max(textarea.scrollHeight, minHeight);
            textarea.style.height = `${newHeight}px`;
        }
    }, [formData.content]);

    const detectCrisisSignals = (text) => {
        const distressPatterns = [
            /suicide/i, 
            /end my life/i, 
            /want to die/i, 
            /kill myself/i, 
            /no reason to live/i, 
            /giving up on life/i, 
            /self-harm/i
        ];
        return distressPatterns.some(pattern => pattern.test(text));
    };

    const handleSubmit = async (publishNow = false, bypassCrisisCheck = false) => {
        if (!formData.title.trim()) {
            toast.error('Please give your story a title');
            return;
        }
        if (!formData.content.trim()) {
            toast.error('Please write something in your story');
            return;
        }
        if (!formData.story_type) {
            toast.error('Please select a story category');
            return;
        }

        if (publishNow && !bypassCrisisCheck && detectCrisisSignals(`${formData.title} ${formData.content}`)) {
            setShowPublishModal(false);
            setShowCrisisModal(true);
            return;
        }

        setSubmitting(true);
        try {
            const endpoint = draftId ? `/api/posts/${draftId}` : '/api/posts';
            const method = draftId ? 'PUT' : 'POST';

            const response = await apiFetch(endpoint, {
                method,
                body: JSON.stringify({
                    title: formData.title.trim(),
                    content: formData.content.trim(),
                    story_type: formData.story_type,
                    is_anonymous: Boolean(formData.is_anonymous),
                    tags: formData.tags,
                    status: publishNow ? 'published' : 'draft'
                })
            });

            if (response.ok) {
                haptic.success();
                const data = await response.json();
                clearLocalDraft();
                toast.success(publishNow ? 'Your story is out in the sanctuary' : 'Draft safely saved');
                navigate(publishNow ? `/feed/story/${data.story.id}` : '/feed/drafts');
            } else {
                haptic.warning();
                const errorData = await response.json().catch(() => ({}));
                let errorMsg = 'Failed to submit story';
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
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
                toast.error(errorMsg, {
                    duration: 5000,
                    style: { maxWidth: '420px', whiteSpace: 'pre-line' }
                });
            }
        } catch (error) {
            haptic.error();
            console.error('Error submitting story:', error);
            toast.error('Network connection error. Please try again.');
        } finally {
            setSubmitting(false);
            setShowPublishModal(false);
        }
    };

    const addTag = (rawTag) => {
        const clean = (rawTag || tagInput).trim().toLowerCase().replace(/^#/, '');
        if (!clean) return;
        if (formData.tags.includes(clean)) {
            setTagInput('');
            return;
        }
        if (formData.tags.length >= 5) {
            haptic.warning();
            toast.error('You can add up to 5 tags');
            return;
        }
        haptic.selection();
        setFormData(prev => ({
            ...prev,
            tags: [...prev.tags, clean]
        }));
        setTagInput('');
    };

    const removeTag = (tagToRemove) => {
        haptic.light();
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const wordsArray = formData.content.trim().split(/\s+/).filter(Boolean);
    const wordCount = formData.content.trim() ? wordsArray.length : 0;
    const charCount = formData.content.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 210));

    const activeTypeMeta = storyTypes.find(t => t.value === formData.story_type) || storyTypes[0];
    const activeGuidance = WRITING_GUIDANCE[formData.story_type] || WRITING_GUIDANCE.other;

    if (loadingDraft) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">Opening your draft...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isFocusMode ? 'bg-[#FAF6F0] dark:bg-[#0E0D0C]' : 'heartout-auth-bg dark:bg-[#121110]'}`}>
            
            {/* Top Sanctuary Control Console */}
            <header className={`sticky top-0 z-40 transition-all duration-300 ${
                isFocusMode 
                    ? 'py-3 px-6 bg-transparent' 
                    : 'py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]'
            }`}>
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    
                    {/* Left: Navigation & Context */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/feed"
                            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2.5 py-1.5 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Sanctuary</span>
                        </Link>

                        {/* Subtle hairline divider */}
                        <div className="hidden sm:block w-[1px] h-4 bg-[#EADDCF] dark:bg-[#2C2723]" />

                        {/* Live auto-save telemetry badge */}
                        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-body">
                            {autoSaved ? (
                                <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    Draft saved
                                </span>
                            ) : lastSaved ? (
                                <span className="inline-flex items-center gap-1 text-stone-500 dark:text-stone-400">
                                    <Clock className="w-3.5 h-3.5" />
                                    Saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            ) : (
                                <span className="text-stone-400 dark:text-stone-500">Unsaved draft</span>
                            )}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Focus Mode Switch */}
                        <button
                            type="button"
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            title={isFocusMode ? "Exit quiet focus" : "Enter quiet focus"}
                            className="p-2.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/60 rounded-xl transition-all"
                            aria-label={isFocusMode ? "Exit focus mode" : "Enter focus mode"}
                        >
                            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>

                        {/* Discard Button */}
                        {!draftId && (formData.title || formData.content) && !isFocusMode && (
                            <button
                                type="button"
                                onClick={() => setShowDiscardModal(true)}
                                className="inline-flex items-center gap-1.5 h-10 px-3.5 text-xs sm:text-sm font-medium text-stone-500 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 rounded-xl hover:bg-red-50/60 dark:hover:bg-red-950/20 transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Discard</span>
                            </button>
                        )}

                        {/* Save Draft Button */}
                        <button
                            type="button"
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="inline-flex items-center gap-1.5 h-10 px-4 text-xs sm:text-sm font-medium text-stone-700 dark:text-stone-300 bg-[#FFFDF9] dark:bg-[#1A1816] border border-[#EADDCF] dark:border-[#2C2723] rounded-xl hover:bg-stone-50 dark:hover:bg-[#221E1A] transition-all shadow-sm disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Save Draft</span>
                        </button>

                        {/* Primary Publish Action */}
                        <button
                            type="button"
                            onClick={() => setShowPublishModal(true)}
                            disabled={submitting || !formData.title.trim() || !formData.content.trim()}
                            className="inline-flex items-center gap-2 h-10 px-5 text-xs sm:text-sm font-semibold text-white bg-[#C85828] hover:bg-[#B54D20] active:scale-[0.98] rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <Send className="w-3.5 h-3.5" />
                            <span>Share Story</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Sanctuary Experience */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
                
                {/* SECTION 1: Story Category Cards Grid */}
                {!isFocusMode && (
                    <section className="mb-10">
                        <div className="mb-5 text-left">
                            <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                                Choose your reflection atmosphere
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                                Every story belongs somewhere. Pick the tone that gives your words room to breathe.
                            </p>
                        </div>

                        {/* The 6 Redesigned Story Tone Cards */}
                        <StoryTypeSelector
                            selected={formData.story_type}
                            onChange={(type) => setFormData({ ...formData, story_type: type })}
                            variant="cards"
                        />
                    </section>
                )}

                {/* SECTION 2: Writing Canvas & Companion Cards */}
                <div className={`transition-all duration-500 ${isFocusMode ? 'max-w-4xl mx-auto' : 'grid grid-cols-1 lg:grid-cols-12 gap-8'}`}>
                    
                    {/* Main Writing Canvas Parchment Card */}
                    <div className={isFocusMode ? 'w-full' : 'lg:col-span-8'}>
                        <article className="relative bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-all space-y-6">
                            
                            {/* Card Top: Selected Atmosphere Guidance */}
                            <div className="pb-4 border-b border-[#EADDCF]/70 dark:border-[#26221E] flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTypeMeta.accentBg} ${activeTypeMeta.accentText}`}>
                                    <activeTypeMeta.icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="font-heading text-xs font-semibold text-stone-900 dark:text-stone-100 block">
                                        {activeTypeMeta.label}
                                    </span>
                                    <p className="font-stories italic text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                                        "{activeGuidance.prompt}"
                                    </p>
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="space-y-1.5">
                                <label className="font-heading text-[11px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 block">
                                    Story Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Give your story a title..."
                                    maxLength={200}
                                    className="w-full bg-transparent font-stories text-2xl sm:text-3xl lg:text-4xl text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none border-b border-transparent focus:border-amber-500/40 pb-2 transition-all leading-snug"
                                />
                                {formData.title.length > 150 && (
                                    <div className="text-right text-[11px] text-stone-400">
                                        {200 - formData.title.length} characters left
                                    </div>
                                )}
                            </div>

                            {/* Content Body Textarea */}
                            <div className="relative pt-2">
                                <label className="font-heading text-[11px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500 block mb-2">
                                    Your Reflection
                                </label>
                                <textarea
                                    ref={textareaRef}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Start anywhere. Even the middle is fine. Write what was never spoken..."
                                    className="w-full bg-transparent font-body text-base sm:text-lg leading-[1.8] text-stone-800 dark:text-stone-200 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none resize-none overflow-y-hidden"
                                    style={{ minHeight: '340px' }}
                                />
                            </div>

                            {/* Tags Card Row */}
                            <div className="pt-6 border-t border-[#EADDCF]/70 dark:border-[#26221E] space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="font-heading text-[11px] uppercase tracking-wider font-semibold text-stone-400 dark:text-stone-500">
                                        Feelings & Themes <span className="font-normal lowercase">(optional)</span>
                                    </label>
                                    <span className="text-xs text-stone-400">
                                        {formData.tags.length}/5 tags
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {formData.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-[#221F1B] border border-[#EADDCF] dark:border-[#332E29] text-stone-700 dark:text-stone-300 rounded-full text-xs font-medium"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-stone-400 hover:text-red-500 transition-colors"
                                                aria-label={`Remove tag ${tag}`}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}

                                    {formData.tags.length < 5 && (
                                        <div className="inline-flex items-center gap-1.5">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addTag();
                                                    }
                                                }}
                                                placeholder="+ Add feeling or topic..."
                                                className="px-3 py-1 text-xs bg-transparent border border-dashed border-stone-300 dark:border-stone-700 rounded-full text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 w-36 sm:w-44"
                                            />
                                            {tagInput.trim() && (
                                                <button
                                                    type="button"
                                                    onClick={() => addTag()}
                                                    className="px-2 py-1 text-xs bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-full font-medium"
                                                >
                                                    Add
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Parchment Bottom Telemetry */}
                            <div className="pt-4 border-t border-[#EADDCF]/70 dark:border-[#26221E] flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400 font-body">
                                <div className="flex items-center gap-3">
                                    <span>{wordCount} words</span>
                                    <span>•</span>
                                    <span>~{readingTime} min read</span>
                                    <span>•</span>
                                    <span>{charCount} characters</span>
                                </div>
                                <div className="text-stone-400 dark:text-stone-500 italic">
                                    Your words are held with respect here.
                                </div>
                            </div>

                        </article>
                    </div>

                    {/* Companion Sidebar Cards */}
                    {!isFocusMode && (
                        <div className="lg:col-span-4 space-y-5">
                            
                            {/* Privacy & Anonymity Card */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-sm space-y-3">
                                <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                                    Author Identity
                                </h3>
                                <AnonymousToggle
                                    isAnonymous={formData.is_anonymous}
                                    onChange={(val) => setFormData({ ...formData, is_anonymous: val })}
                                />
                            </div>

                            {/* Writing Companion Guidance Card */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] border-l-4 border-l-[#C85828] rounded-2xl p-5 shadow-sm space-y-2">
                                <div className="flex items-center gap-2">
                                    <Feather className="w-4 h-4 text-[#C85828]" />
                                    <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                                        Companion Note
                                    </h3>
                                </div>
                                <p className="font-stories italic text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                    "{activeGuidance.tip}"
                                </p>
                            </div>

                            {/* Sanctuary Promise Card */}
                            <div className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-sm space-y-2 text-center">
                                <p className="font-stories italic text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                    "You do not have to write perfectly. You only have to write what is true."
                                </p>
                            </div>

                        </div>
                    )}

                </div>

            </main>

            {/* Discard Confirmation Modal */}
            {showDiscardModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#181614] rounded-2xl p-6 border border-[#EADDCF] dark:border-[#2C2723] shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="font-stories text-2xl text-stone-900 dark:text-stone-100 mb-2">
                                Discard this reflection?
                            </h3>
                            <p className="text-sm text-stone-600 dark:text-stone-400">
                                This will erase your unsaved changes from this device. Once removed, it cannot be recovered.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDiscardModal(false)}
                                className="flex-1 px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                Keep Writing
                            </button>
                            <button
                                type="button"
                                onClick={handleDiscard}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                            >
                                Discard Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Publish Confirmation Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-lg bg-[#FFFDF9] dark:bg-[#181614] rounded-3xl p-6 sm:p-8 border border-[#EADDCF] dark:border-[#2C2723] shadow-2xl space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 mb-1">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <h3 className="font-stories text-2xl text-stone-900 dark:text-stone-100">
                                Ready to share your story?
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                                Your voice will join the HeartOut sanctuary. Take a gentle breath and review your choices.
                            </p>
                        </div>

                        {/* Story Summary Card */}
                        <div className="p-4 bg-stone-100/70 dark:bg-[#201D19] rounded-2xl border border-[#EADDCF]/70 dark:border-[#2C2723] space-y-3">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                                    Headline
                                </span>
                                <p className="font-stories font-medium text-stone-900 dark:text-stone-100 text-base line-clamp-2 mt-0.5">
                                    {formData.title}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-stone-200/60 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
                                <span className="inline-flex items-center gap-1 font-medium text-amber-800 dark:text-amber-400">
                                    <activeTypeMeta.icon className="w-3.5 h-3.5" />
                                    {activeTypeMeta.label}
                                </span>
                                <span>•</span>
                                <span>{wordCount} words</span>
                                <span>•</span>
                                <span className="font-medium text-stone-800 dark:text-stone-200">
                                    {formData.is_anonymous ? 'Anonymous Author' : 'Public Profile'}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPublishModal(false)}
                                className="flex-1 px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                Back to Edit
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSubmit(true)}
                                disabled={submitting}
                                className="flex-1 px-4 py-3 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {submitting ? (
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Confirm & Share</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Crisis Support Safeguard Dialog */}
            {showCrisisModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#FFFDF9] dark:bg-[#181614] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-rose-300/60 dark:border-rose-900/40 text-center animate-scale-up space-y-5">
                        <div className="w-14 h-14 bg-rose-100 dark:bg-rose-950/60 rounded-2xl flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
                            <Heart className="w-7 h-7 fill-rose-500/20" />
                        </div>

                        <div>
                            <h3 className="font-stories text-2xl text-stone-900 dark:text-stone-100 mb-2">
                                You do not have to carry this alone
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                We noticed words that carry immense weight. Please know that your life and your heart matter deeply. Free, confidential support is available right now.
                            </p>
                        </div>

                        {/* Helplines Card */}
                        <div className="space-y-2 text-left bg-stone-100/70 dark:bg-[#201D19] p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800">
                            <a 
                                href="tel:14416" 
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#2A2622] transition-colors group"
                            >
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">Tele MANAS Helpline</p>
                                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">14416 or 1800 891 4416</p>
                                </div>
                                <span className="text-[11px] px-2.5 py-1 bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 rounded-full font-medium">Free 24/7</span>
                            </a>
                            <a 
                                href="tel:9152987821" 
                                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#2A2622] transition-colors group"
                            >
                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">iCall Helpline</p>
                                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">9152987821</p>
                                </div>
                                <span className="text-[11px] px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full font-medium">Mon-Sat</span>
                            </a>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-1">
                            <a
                                href="tel:14416"
                                className="inline-flex items-center justify-center gap-2 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold shadow-md transition-all"
                            >
                                <PhoneCall className="w-4 h-4" />
                                Call Free Helpline (14416)
                            </a>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowCrisisModal(false);
                                    handleSubmit(true, true);
                                }}
                                className="text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 underline pt-2"
                            >
                                I understand, publish my story anyway
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
