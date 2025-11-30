import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

// Loading component
const Loading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading HeartOut...</p>
        </div>
    </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <React.Suspense fallback={<Loading />}>
                <BrowserRouter>
                    <ThemeProvider>
                        <AuthProvider>
                            <App />
                            <Toaster position="top-right" />
                        </AuthProvider>
                    </ThemeProvider>
                </BrowserRouter>
            </React.Suspense>
        </ErrorBoundary>
    </React.StrictMode>
);
