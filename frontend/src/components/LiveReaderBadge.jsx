/**
 * Live Reader Badge Component
 * Shows "X people are reading this" in real-time
 */

import React, { useEffect } from 'react';
import { Eye, Users } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket.jsx';

export default function LiveReaderBadge({ storyId }) {
    const ws = useWebSocket();

    // Join story on mount, leave on unmount
    useEffect(() => {
        if (ws && storyId) {
            ws.joinStory(storyId);

            return () => {
                ws.leaveStory(storyId);
            };
        }
    }, [ws, storyId]);

    // Don't render if WebSocket is not available
    if (!ws) return null;

    const readerCount = ws.getReaderCount(storyId);

    // Don't show if only 1 reader (yourself) or no readers
    if (readerCount <= 1) return null;

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200/50 dark:border-emerald-700/30 rounded-full animate-pulse-slow">
            <div className="relative">
                <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {/* Live indicator dot */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                {readerCount} {readerCount === 1 ? 'person' : 'people'} reading
            </span>
        </div>
    );
}
