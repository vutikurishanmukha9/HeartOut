import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Edit, Clock, AlertTriangle, PenLine, Sparkles } from 'lucide-react';
import { getApiUrl } from '../config/api';
import { formatRelativeDate } from '../utils/dateFormat';
import { storyTypes } from '../components/StoryTypeSelector';

export default function Drafts() {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, draftId: null, title: '' });

    useEffect(() => {
        fetchDrafts();
    }, []);

    const fetchDrafts = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(getApiUrl('/api/posts/drafts'), {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setDrafts(data.drafts || []);
            }
        } catch (error) {
            console.error('Failed to fetch drafts:', error);
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

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(getApiUrl(`/api/posts/${id}`), {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setDrafts(drafts.filter(d => d.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete draft:', error);
        } finally {
            setDeleteModal({ show: false, draftId: null, title: '' });
        }
    };

    const getStoryType = (type) => {
        return storyTypes.find(t => t.value === type) || storyTypes[storyTypes.length - 1];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading drafts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-24 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            My Drafts
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-12">
                        Continue working on your unfinished stories
                    </p>
                </div>

                {drafts.length === 0 ? (
                    /* Empty State - Premium Design */
                    <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-8 sm:p-12 text-center">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full blur-3xl opacity-10" />
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-3xl opacity-10" />

                        <div className="relative">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                <PenLine className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                No drafts yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                Start writing a story and save it as a draft to continue later
                            </p>
                            <Link
                                to="/feed/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-full shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                <Sparkles className="w-4 h-4" />
                                Create Story
                            </Link>
                        </div>
                    </div>
                ) : (
                    /* Drafts List */
                    <div className="space-y-4">
                        {drafts.map((draft, index) => {
                            const storyType = getStoryType(draft.story_type);
                            const Icon = storyType.icon;

                            return (
                                <div
                                    key={draft.id}
                                    className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 hover:-translate-y-0.5 transition-all duration-300 animate-slide-up"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            {/* Story Type Badge */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`p-1.5 rounded-lg bg-gradient-to-br ${storyType.color}`}>
                                                    <Icon className="w-3 h-3 text-white" />
                                                </div>
                                                <span className={`text-xs font-medium ${storyType.textColor}`}>
                                                    {storyType.label}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                                                {draft.title || 'Untitled Draft'}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                                                {draft.content?.substring(0, 150) || 'No content yet...'}
                                            </p>

                                            {/* Last Edited */}
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                <Clock className="w-3.5 h-3.5" />
                                                Last edited {formatRelativeDate(draft.updated_at)}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 sm:gap-3 sm:ml-4">
                                            <Link
                                                to={`/feed/create?draft=${draft.id}`}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-xl shadow-md shadow-violet-500/20 hover:shadow-lg hover:shadow-violet-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
                                            >
                                                <Edit className="w-4 h-4" />
                                                <span>Continue</span>
                                            </Link>
                                            <button
                                                onClick={() => confirmDelete(draft.id, draft.title)}
                                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-700 active:scale-95 transition-all duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Delete Draft?
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This action cannot be undone.
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Are you sure you want to delete "<span className="font-semibold">{deleteModal.title}</span>"?
                            </p>

                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setDeleteModal({ show: false, draftId: null, title: '' })}
                                    className="px-5 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteDraft}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
