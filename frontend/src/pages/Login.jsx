import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import FeatureHighlights from '../components/FeatureHighlights';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate('/feed');
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:p-8 bg-gradient-to-br from-rose-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 min-h-screen lg:min-h-0 safe-area-top safe-area-bottom">
                <div className="w-full max-w-md animate-slide-up font-body">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg shadow-primary-500/30">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <span className="text-3xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Heart<span className="text-gradient">Out</span>
                            </span>
                        </div>
                        <h1 className="font-heading text-3xl font-bold tracking-wide text-gray-900 dark:text-white mb-2">
                            Welcome back!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 font-light">
                            Continue your storytelling journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-slide-down font-medium">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:text-white transition-all duration-300 font-body placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:text-white transition-all duration-300 font-body placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                className="w-5 h-5 rounded-md border-2 border-gray-300 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 transition-all duration-200 cursor-pointer"
                            />
                            <label htmlFor="remember" className="ml-3 text-sm text-gray-600 dark:text-gray-400 cursor-pointer font-medium">
                                Keep me signed in
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-premium flex items-center justify-center gap-2 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link
                                to="/auth/register"
                                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                Sign up free
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent-500 via-primary-500 to-secondary-500 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-white/5 rounded-full blur-xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center px-8 lg:px-12 text-white text-center h-full">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-medium">Discover amazing stories</span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Every story is a journey
                        </h2>
                        <p className="text-lg text-white/80 max-w-md">
                            Join our community of storytellers sharing life's most meaningful moments.
                        </p>
                    </div>

                    {/* Premium Feature Highlights */}
                    <div className="w-full max-w-md">
                        <FeatureHighlights />
                    </div>
                </div>
            </div>
        </div>
    );
}
