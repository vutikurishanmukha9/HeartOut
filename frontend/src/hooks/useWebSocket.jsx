/**
 * WebSocket Hook for Real-Time Features
 * - Real-time notifications (reactions, comments)
 * - Live reader tracking
 */

import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { getApiUrl } from '../config/api';

// Get WebSocket URL from API URL
const getWsUrl = () => {
    const apiUrl = getApiUrl('');
    // Convert http(s) to ws(s)
    return apiUrl.replace(/^http/, 'ws');
};

// WebSocket Context
const WebSocketContext = createContext(null);

export function useWebSocket() {
    return useContext(WebSocketContext);
}

export function WebSocketProvider({ children, userId }) {
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [readerCounts, setReaderCounts] = useState({});
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    // Connect to WebSocket
    const connect = useCallback(() => {
        const token = localStorage.getItem('access_token');
        if (!userId || !token || wsRef.current?.readyState === WebSocket.OPEN) return;

        try {
            // Pass token as query parameter for authentication
            const wsUrl = `${getWsUrl()}/ws?token=${encodeURIComponent(token)}`;
            wsRef.current = new WebSocket(wsUrl);

            wsRef.current.onopen = () => {
                setIsConnected(true);
                reconnectAttempts.current = 0;
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (e) {
                    // Silently ignore parse errors
                }
            };

            wsRef.current.onclose = () => {
                setIsConnected(false);
                // Attempt reconnection with exponential backoff (silently)
                if (reconnectAttempts.current < maxReconnectAttempts) {
                    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        reconnectAttempts.current++;
                        connect();
                    }, delay);
                }
            };

            wsRef.current.onerror = () => {
                // Silently handle WebSocket errors - this is expected when server is not available
            };
        } catch (error) {
            // Silently fail - WebSocket not critical for app functionality
        }
    }, [userId]);

    // Handle incoming messages
    const handleMessage = useCallback((data) => {
        switch (data.type) {
            case 'reaction':
            case 'comment':
                // Add to notifications
                setNotifications(prev => [{
                    ...data,
                    id: Date.now(),
                    timestamp: new Date()
                }, ...prev.slice(0, 49)]); // Keep last 50 notifications
                break;

            case 'reader_count':
                // Update reader count for a story
                setReaderCounts(prev => ({
                    ...prev,
                    [data.story_id]: data.count
                }));
                break;

            case 'pong':
                // Heartbeat response
                break;

            default:
                console.log('Unknown message type:', data.type);
        }
    }, []);

    // Send message to WebSocket
    const sendMessage = useCallback((message) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, []);

    // Join a story (for live reader tracking)
    const joinStory = useCallback((storyId) => {
        sendMessage({ type: 'join_story', story_id: storyId });
    }, [sendMessage]);

    // Leave a story
    const leaveStory = useCallback((storyId) => {
        sendMessage({ type: 'leave_story', story_id: storyId });
    }, [sendMessage]);

    // Dismiss a notification
    const dismissNotification = useCallback((notificationId) => {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
    }, []);

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        if (userId) {
            connect();
        }

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [userId, connect]);

    // Heartbeat to keep connection alive
    useEffect(() => {
        if (!isConnected) return;

        const pingInterval = setInterval(() => {
            sendMessage({ type: 'ping' });
        }, 30000); // Ping every 30 seconds

        return () => clearInterval(pingInterval);
    }, [isConnected, sendMessage]);

    const value = {
        isConnected,
        notifications,
        readerCounts,
        joinStory,
        leaveStory,
        dismissNotification,
        getReaderCount: (storyId) => readerCounts[storyId] || 0
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}

export default WebSocketProvider;
