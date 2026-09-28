import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Trash2, 
    Clock, 
    Sparkles, 
    ArrowLeft, 
    Plus, 
    Feather, 
    FileText, 
    AlertTriangle,
    PenSquare
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../config/api';
import { formatRelativeDate } from '../utils/dateFormat';
import { storyTypes } from '../components/StoryTypeSelector';

export default function Drafts() {
    const navigate = useNavigate();
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, draftId: null, title: '' });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const response = await fetch(getApiUrl('/api/posts/drafts'), {
                credentials: 'include',
            });

            let serverDrafts = [];
            if (response.ok) {
                const data = await response.json();
                serverDrafts = data.drafts || [];
            }
            
            // Check for local unsaved draft
            const savedDraft = localStorage.getItem('heartout_draft');
            if (savedDraft) {
                try {
                    const parsed = JSON.parse(savedDraft);
                    if (parsed.title || parsed.content) {
                        const localDraft = {
                            id: 'local',
                            title: parsed.title || '(Unsaved local draft)',
                            content: parsed.content || '',
                            story_type: parsed.story_type || 'unsent_letter',
                            updated_at: parsed.savedAt || new Date().toISOString(),
                            isLocal: true
                        };
                        setDrafts([localDraft, ...serverDrafts]);
                        return;
                    }
                } catch (e) {
                    console.error('Failed to parse local draft:', e);
                }
            }
            setDrafts(serverDrafts);
        } catch (error) {
            console.error('Failed to fetch drafts:', error);
            toast.error('Unable to load drafts');
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id, title) => {
        setDeleteModal({ show: true, draftId: id, title: title || 'Untitled Draft' });
    };

    const deleteDraft = async () => {
        const id = deleteModal.draftId;
        if (!id) return;

        setDeleting(true);
        try {
            if (id === 'local') {
                localStorage.removeItem('heartout_draft');
                setDrafts(prev => prev.filter(d => d.id !== id));
                toast.success('Local draft discarded');
            } else {
                const response = await fetch(getApiUrl(`/api/posts/${id}`), {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (response.ok) {
                    setDrafts(prev => prev.filter(d => d.id !== id));
                    toast.success('Draft removed from sanctuary');
                } else {
                    toast.error('Failed to delete draft');
                }
            }
        } catch (error) {
            console.error('Failed to delete draft:', error);
            toast.error('Network error. Could not delete draft.');
        } finally {
            setDeleting(false);
            setDeleteModal({ show: false, draftId: null, title: '' });
        }
    };

    const getStoryType = (type) => {
        return storyTypes.find(t => t.value === type) || storyTypes[storyTypes.length - 1];
    };

    if (loading) {
        return (
            <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] flex items-center justify-center p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600/30 border-t-amber-600 animate-spin" />
                    <p className="font-body text-sm text-stone-600 dark:text-stone-400">Loading your drafts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-16 transition-colors duration-300">
            
            {/* Top Sanctuary Control Console */}
            <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    
                    {/* Left: Navigation & Context */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/feed"
                            className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2.5 py-1.5 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Sanctuary</span>
                        </Link>

                        {/* Hairline Divider */}
                        <div className="hidden sm:block w-[1px] h-4 bg-[#EADDCF] dark:bg-[#2C2723]" />

                        {/* Draft count badge */}
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-body">
                            {drafts.length} {drafts.length === 1 ? 'saved reflection' : 'saved reflections'}
                        </span>
                    </div>

                    {/* Right: New Story Action */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/feed/create"
                            className="inline-flex items-center gap-2 h-10 px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white bg-[#C85828] hover:bg-[#B54D20] active:scale-[0.98] rounded-xl shadow-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            <span>New Reflection</span>
                        </Link>
                    </div>

                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
                
                {/* Page Intro */}
                <div className="mb-8 text-left">
                    <h1 className="font-stories text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                        My Saved Drafts
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5">
                        Reflections you began in quiet. Return to them whenever you are ready to speak.
                    </p>
                </div>

                {drafts.length === 0 ? (
                    /* Empty State Card */
                    <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-10 sm:p-14 text-center shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] max-w-2xl mx-auto space-y-5">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/40">
                            <Feather className="w-6 h-6 stroke-[1.75]" />
                        </div>

                        <div>
                            <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 mb-2">
                                Your desk is clear
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
                                You don't have any saved drafts right now. When you start an unsent reflection, your words will be safely kept here.
                            </p>
                        </div>

                        <p className="font-body text-xs text-stone-400 dark:text-stone-500 italic">
                            Drafts are strictly private and visible only to you on this account.
                        </p>

                        <div className="pt-2">
                            <Link
                                to="/feed/create"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Begin Writing</span>
                            </Link>
                        </div>
                    </article>
                ) : (
                    /* Draft Cards Grid */
                    <div className="space-y-4">
                        {drafts.map((draft, index) => {
                            const storyType = getStoryType(draft.story_type);
                            const Icon = storyType.icon;
                            const words = draft.content?.trim().split(/\s+/).filter(Boolean).length || 0;
                            const readTime = Math.max(1, Math.ceil(words / 210));

                            return (
                                <article
                                    key={draft.id}
                                    className="group bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 sm:p-7 shadow-[0_2px_14px_rgba(200,140,90,0.04)] dark:shadow-[0_2px_14px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:border-[#D4832D]/70 dark:hover:border-[#D4832D]/50 hover:shadow-[0_10px_28px_rgba(200,120,60,0.08)] transition-all duration-300"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                                        
                                        {/* Main Content Area */}
                                        <div className="flex-1 min-w-0 space-y-2.5">
                                            
                                            {/* Category & Status Bar */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${storyType.accentBg} ${storyType.accentText}`}>
                                                    <Icon className="w-3.5 h-3.5 stroke-[1.75]" />
                                                    <span>{storyType.label}</span>
                                                </span>

                                                {draft.isLocal && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300/50 dark:border-amber-800/40">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                        Local Unsaved Draft
                                                    </span>
                                                )}

                                                <div className="flex items-center gap-1 text-xs text-stone-400 dark:text-stone-500 ml-auto sm:ml-2">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>Last edited {formatRelativeDate(draft.updated_at)}</span>
                                                </div>
                                            </div>

                                            {/* Headline */}
                                            <h2 className="font-stories text-xl sm:text-2xl font-normal text-stone-900 dark:text-stone-100 group-hover:text-[#C85828] transition-colors leading-snug">
                                                {draft.title || '(Untitled Reflection)'}
                                            </h2>

                                            {/* Reflection Excerpt */}
                                            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                                                {draft.content?.substring(0, 180) || 'No words written yet. Ready for your thoughts...'}
                                            </p>

                                            {/* Telemetry snippet */}
                                            <div className="pt-1 text-[11px] text-stone-400 dark:text-stone-500 font-body">
                                                {words} words • ~{readTime} min read
                                            </div>

                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 sm:gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EADDCF]/60 dark:border-[#2C2723]">
                                            <Link
                                                to={draft.id === 'local' ? `/feed/create` : `/feed/create?draft=${draft.id}`}
                                                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 sm:px-5 bg-[#C85828] hover:bg-[#B54D20] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                                            >
                                                <PenSquare className="w-3.5 h-3.5" />
                                                <span>Continue</span>
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => confirmDelete(draft.id, draft.title)}
                                                className="inline-flex items-center justify-center h-10 w-10 text-stone-400 hover:text-red-600 dark:hover:text-red-400 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-950/20 border border-transparent hover:border-red-200 dark:hover:border-red-900/40 transition-colors"
                                                title="Delete draft"
                                                aria-label={`Delete ${draft.title || 'draft'}`}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

            </main>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="w-full max-w-md bg-[#FFFDF9] dark:bg-[#181614] rounded-3xl p-6 sm:p-8 border border-[#EADDCF] dark:border-[#2C2723] shadow-2xl space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-2">
                                <Trash2 className="w-6 h-6 stroke-[1.75]" />
                            </div>
                            <h3 className="font-stories text-2xl text-stone-900 dark:text-stone-100">
                                Discard this draft?
                            </h3>
                            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                                Are you sure you want to permanently erase “<span className="font-semibold text-stone-800 dark:text-stone-200">{deleteModal.title}</span>”? This cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteModal({ show: false, draftId: null, title: '' })}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 border border-stone-300 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            >
                                Keep Draft
                            </button>
                            <button
                                type="button"
                                onClick={deleteDraft}
                                disabled={deleting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                {deleting ? (
                                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <span>Discard Permanently</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
