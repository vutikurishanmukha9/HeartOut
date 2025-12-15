import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Edit, Clock } from 'lucide-react';
import { getApiUrl } from '../config/api';

export default function Drafts() {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const deleteDraft = async (id) => {
        if (!confirm('Are you sure you want to delete this draft?')) return;

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
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-200 rounded-full animate-spin border-t-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading drafts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    My Drafts
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Continue working on your unfinished stories
                </p>
            </div>

            {drafts.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No drafts yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Start writing a story and save it as a draft
                    </p>
                    <Link
                        to="/feed/create"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Create Story
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {drafts.map((draft) => (
                        <div
                            key={draft.id}
                            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {draft.title || 'Untitled Draft'}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                                        {draft.content?.substring(0, 150)}...
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Clock className="w-4 h-4 mr-1" />
                                        Last edited {new Date(draft.updated_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 ml-4">
                                    <Link
                                        to={`/feed/create?draft=${draft.id}`}
                                        className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                                        title="Edit draft"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </Link>
                                    <button
                                        onClick={() => deleteDraft(draft.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete draft"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
