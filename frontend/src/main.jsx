import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient';
import './index.css';

// Simple wrapper to catch errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading App</h1>
                        <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 w-full py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

// Lazy load the app
const App = React.lazy(() => import('./App.jsx'));
const AuthProvider = React.lazy(() => import('./context/AuthContext').then(m => ({ default: m.AuthProvider })));
const ThemeProvider = React.lazy(() => import('./context/ThemeContext').then(m => ({ default: m.ThemeProvider })));
const InnovativeLoader = React.lazy(() => import('./components/InnovativeLoader'));

// Loading component - uses a simple fallback until InnovativeLoader loads
const Loading = () => (
    <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(-45deg, #fdf2f8, #fef7ee, #fefce8, #fff7ed)',
    }}>
        <div className="flex flex-col items-center space-y-4">
            <svg viewBox="0 0 24 24" className="w-12 h-12" fill="url(#heartGradient)">
                <defs>
                    <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                </defs>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                HeartOut
            </h1>
        </div>
    </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <HelmetProvider>
                <React.Suspense fallback={<Loading />}>
                    <QueryClientProvider client={queryClient}>
                        <BrowserRouter>
                            <ThemeProvider>
                                <AuthProvider>
                                    <App />
                                    <Toaster position="top-right" />
                                </AuthProvider>
                            </ThemeProvider>
                        </BrowserRouter>
                    </QueryClientProvider>
                </React.Suspense>
            </HelmetProvider>
        </ErrorBoundary>
    </React.StrictMode>
);
