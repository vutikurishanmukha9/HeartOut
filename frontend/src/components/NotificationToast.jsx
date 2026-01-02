/**
 * Real-Time Notification Toast Component
 * Shows popup notifications when someone reacts or comments on your story
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, X, Sparkles, ThumbsUp, Lightbulb, HeartHandshake, Zap } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket.jsx';

// Reaction type icons
const reactionIcons = {
    love: Heart,
    inspiring: Lightbulb,
    save: Sparkles,
    hug: HeartHandshake,
    mind_blown: Zap,
    default: ThumbsUp
};

// Reaction type colors
const reactionColors = {
    love: 'text-rose-500 bg-rose-50 dark:bg-rose-900/30',
    inspiring: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
    save: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
    hug: 'text-pink-500 bg-pink-50 dark:bg-pink-900/30',
    mind_blown: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
    comment: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30'
};

function NotificationItem({ notification, onDismiss }) {
    const [isExiting, setIsExiting] = useState(false);

    // Auto-dismiss after 6 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss();
        }, 6000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(() => {
            onDismiss(notification.id);
        }, 300);
    };

    const isReaction = notification.type === 'reaction';
    const Icon = isReaction
        ? (reactionIcons[notification.reaction_type] || reactionIcons.default)
        : MessageCircle;
    const colorClass = isReaction
        ? (reactionColors[notification.reaction_type] || reactionColors.love)
        : reactionColors.comment;

    return (
        <div
            className={`
                relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 
                p-4 mb-3 transform transition-all duration-300 ease-out
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                hover:scale-[1.02] hover:shadow-xl
            `}
        >
            {/* Close button */}
            <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <X className="w-4 h-4 text-gray-400" />
            </button>

            <Link
                to={`/feed/${notification.story_id}`}
                onClick={handleDismiss}
                className="flex items-start gap-3"
            >
                {/* Icon */}
                <div className={`p-2.5 rounded-xl ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {notification.story_title}
                    </p>
                    {notification.comment_preview && (
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 italic truncate">
                            "{notification.comment_preview}"
                        </p>
                    )}
                </div>
            </Link>

            {/* Progress bar (auto-dismiss indicator) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-2xl overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-shrink"
                    style={{ animationDuration: '6s' }}
                />
            </div>
        </div>
    );
}

export default function NotificationToast() {
    const ws = useWebSocket();

    // Don't render if WebSocket is not available
    if (!ws) return null;

    const { notifications, dismissNotification } = ws;

    // Only show latest 3 notifications
    const visibleNotifications = notifications.slice(0, 3);

    if (visibleNotifications.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-[100] w-80 max-w-[calc(100vw-2rem)]">
            {/* Add shrink animation to CSS */}
            <style>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-shrink {
                    animation: shrink linear forwards;
                }
            `}</style>

            {visibleNotifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDismiss={dismissNotification}
                />
            ))}
        </div>
    );
}
