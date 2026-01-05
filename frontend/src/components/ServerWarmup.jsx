import React, { useState, useEffect, createContext, useContext } from 'react';
import { Coffee, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../config/api';

// Context to track server status across the app
const ServerStatusContext = createContext();

export function useServerStatus() {
    return useContext(ServerStatusContext);
}

export function ServerStatusProvider({ children }) {
    const [serverStatus, setServerStatus] = useState('checking'); // checking, warming, ready, error
    const [warmupTime, setWarmupTime] = useState(0);

    useEffect(() => {
        warmupServer();
    }, []);

    const warmupServer = async () => {
        const startTime = Date.now();
        setServerStatus('checking');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            const response = await fetch(getApiUrl('/api/health'), {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const elapsed = Math.round((Date.now() - startTime) / 1000);
                setWarmupTime(elapsed);
                setServerStatus('ready');
            } else {
                setServerStatus('error');
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                setServerStatus('error');
            } else {
                // Server might be waking up, show warming status
                setServerStatus('warming');
                // Retry after a delay
                setTimeout(warmupServer, 3000);
            }
        }
    };

    return (
        <ServerStatusContext.Provider value={{ serverStatus, warmupTime, warmupServer }}>
            {children}
        </ServerStatusContext.Provider>
    );
}

// Toast component to show during cold start
export function ServerWarmupToast() {
    const { serverStatus, warmupTime } = useServerStatus();
    const [visible, setVisible] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [startedAt, setStartedAt] = useState(null);

    useEffect(() => {
        if (serverStatus === 'checking' && !startedAt) {
            // Start timer when checking begins
            setStartedAt(Date.now());
        }

        if (serverStatus === 'warming') {
            // Show immediately when server is in warming state
            setVisible(true);
        } else if (serverStatus === 'checking' && startedAt) {
            // Only show toast if checking takes more than 2 seconds
            const showAfterDelay = setTimeout(() => {
                if (serverStatus === 'checking') {
                    setVisible(true);
                }
            }, 2000);
            return () => clearTimeout(showAfterDelay);
        } else if (serverStatus === 'ready') {
            // Only show success if we were actually visible (slow warmup)
            if (visible) {
                setShowSuccess(true);
                setTimeout(() => {
                    setVisible(false);
                    setShowSuccess(false);
                    setStartedAt(null);
                }, 6000);
            } else {
                // Fast response - don't show anything
                setStartedAt(null);
            }
        }
    }, [serverStatus, visible, startedAt]);

    if (!visible) return null;

    return (
        <div className="fixed bottom-20 right-4 w-auto max-w-[200px] md:bottom-4 md:max-w-none md:w-80 z-[100] animate-slide-up">
            <div className={`rounded-2xl shadow-2xl border backdrop-blur-xl p-4 ${showSuccess
                ? 'bg-green-50/95 dark:bg-green-900/30 border-green-200 dark:border-green-800'
                : 'bg-white/95 dark:bg-gray-800/95 border-gray-200 dark:border-gray-700'
                }`}>
                {showSuccess ? (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-800 dark:text-green-300">
                                Server is ready!
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                                Warmed up in {warmupTime}s. Enjoy!
                            </p>
                        </div>
                    </div>
                ) : serverStatus === 'error' ? (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-xl">
                            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-red-800 dark:text-red-300">
                                Connection issue
                            </p>
                            <p className="text-sm text-red-600 dark:text-red-400">
                                Please check your internet connection
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-800/50 rounded-xl">
                            <Coffee className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    Waking up our server...
                                </p>
                                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Our free server sleeps when inactive. This usually takes 15-30 seconds on first visit.
                            </p>
                            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"
                                    style={{ width: '60%' }} />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Thanks for your patience!
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ServerWarmupToast;
