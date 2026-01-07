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
    const [dismissed, setDismissed] = useState(false); // Global dismissed state

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
        <ServerStatusContext.Provider value={{ serverStatus, warmupTime, warmupServer, dismissed, setDismissed }}>
            {children}
        </ServerStatusContext.Provider>
    );
}

// Compact loading indicator - always visible until server is ready
export function ServerWarmupToast() {
    const { serverStatus, warmupTime, dismissed, setDismissed } = useServerStatus();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (serverStatus === 'ready' && !showSuccess && !dismissed) {
            setShowSuccess(true);
            // Auto-hide success message after 3 seconds
            setTimeout(() => {
                setDismissed(true);
            }, 3000);
        }
    }, [serverStatus, showSuccess, dismissed, setDismissed]);

    // Don't show if dismissed or if there's an error
    if (dismissed) return null;

    return (
        <div className="fixed bottom-20 right-4 z-[100] animate-slide-up md:bottom-4">
            {showSuccess ? (
                // Success state - compact green pill
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-green-500/90 shadow-lg backdrop-blur-xl">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                        Connected ({warmupTime}s)
                    </span>
                </div>
            ) : serverStatus === 'error' ? (
                // Error state - compact red pill
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-500/90 shadow-lg backdrop-blur-xl">
                    <AlertCircle className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                        Connection failed
                    </span>
                </div>
            ) : (
                // Loading state - compact orange pill (always shown while checking/warming)
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-500/90 shadow-lg backdrop-blur-xl">
                    <Coffee className="w-4 h-4 text-white" />
                    <span className="text-sm font-medium text-white">
                        {serverStatus === 'warming' ? 'Waking up...' : 'Connecting...'}
                    </span>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                </div>
            )}
        </div>
    );
}

export default ServerWarmupToast;
