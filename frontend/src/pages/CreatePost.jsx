import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Eye, EyeOff, Save, Send } from 'lucide-react';
import StoryTypeSelector from '../components/StoryTypeSelector';
import AnonymousToggle from '../components/AnonymousToggle';

export default function CreatePost() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Select Type, 2: Write Story
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        story_type: '',
        is_anonymous: true,
        tags: [],
        status: 'draft'
    });
    const [tagInput, setTagInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (publishNow = false) => {
        if (!formData.title || !formData.content || !formData.story_type) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
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
                navigate(publishNow ? `/feed/story/${data.story.id}` : '/feed/drafts');
            } else {
                alert('Failed to create story');
            }
        } catch (error) {
            console.error('Error creating story:', error);
            alert('An error occurred');
        } finally {
            setSubmitting(false);
        }
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()]
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
    const readingTime = Math.max(1, Math.ceil(wordCount / 225));

    if (step === 1) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Share Your Story
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Choose the type of story you want to tell
                        </p>
                    </div>

                    <StoryTypeSelector
                        selected={formData.story_type}
                        onChange={(type) => {
                            setFormData({ ...formData, story_type: type });
                            setStep(2);
                        }}
                        variant="cards"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => setStep(1)}
                        className="text-primary-600 dark:text-primary-400 hover:underline mb-4"
                    >
                        ← Change Story Type
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Write Your Story
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Share your authentic experience with the world
                    </p>
                </div>

                {/* Editor */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Give your story a compelling title..."
                            className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.title.length}/200 characters
                        </p>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Your Story *
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Tell your story... Be authentic, be you."
                            rows={16}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <span>{wordCount} words</span>
                            <span>~{readingTime} min read</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Tags (Optional)
                        </label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                placeholder="Add a tag..."
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            <button
                                onClick={addTag}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                                >
                                    #{tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="hover:text-primary-900 dark:hover:text-primary-100"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Anonymous Toggle */}
                    <div>
                        <AnonymousToggle
                            isAnonymous={formData.is_anonymous}
                            onChange={(value) => setFormData({ ...formData, is_anonymous: value })}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => handleSubmit(false)}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            Save as Draft
                        </button>
                        <button
                            onClick={() => handleSubmit(true)}
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                            Publish Story
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
