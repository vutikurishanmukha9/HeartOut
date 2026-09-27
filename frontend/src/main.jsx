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

// Loading component - uses a clean editorial fallback until app loads
const Loading = () => (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] dark:bg-[#121214]">
        <div className="flex flex-col items-center space-y-4">
            <img src="/logo.png" alt="HeartOut Logo" className="w-14 h-14 object-contain animate-pulse select-none" />
            <img src="/text-logo.png" alt="HeartOut" className="h-8 w-auto object-contain select-none" />
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
