import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, User, ArrowRight, BookOpen, Sparkles, Check } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        display_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register(formData);
            if (result.success) {
                navigate('/feed');
            } else {
                setError(result.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Password strength check
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;

        const levels = [
            { label: 'Weak', color: 'bg-red-500' },
            { label: 'Fair', color: 'bg-orange-500' },
            { label: 'Good', color: 'bg-yellow-500' },
            { label: 'Strong', color: 'bg-green-500' }
        ];

        return { strength, ...levels[Math.min(strength - 1, 3)] || { label: '', color: '' } };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-600 via-purple-700 to-indigo-800 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-slow" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-10 py-8 text-white h-full">
                    {/* Logo */}
                    <div className="mb-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-4 bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 rounded-2xl shadow-lg">
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                            <span className="text-4xl font-bold">
                                <span className="text-gray-900">Heart</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400">Out</span>
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight">
                            Don't Hold It In. Heart It Out.
                        </h2>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-3">
                        <p className="text-base text-white/90">
                            <span className="font-bold">Send the Unsent:</span>{' '}
                            <span className="font-light">Post the text, letter, or apology you never delivered.</span>
                        </p>
                        <p className="text-base text-white/90">
                            <span className="font-bold">Claim Your Wins:</span>{' '}
                            <span className="font-light">Shout out the achievements you usually celebrate alone.</span>
                        </p>
                        <p className="text-base text-white/90">
                            <span className="font-bold">Vent Your Regrets:</span>{' '}
                            <span className="font-light">Turn your painful mistakes into shared lessons.</span>
                        </p>
                        <p className="text-base text-white/90">
                            <span className="font-bold">Reveal the Cost:</span>{' '}
                            <span className="font-light">Share the sacrifices behind your success.</span>
                        </p>
                        <p className="text-base text-white/90">
                            <span className="font-bold">Be Unapologetic:</span>{' '}
                            <span className="font-light">No filters. No judgment. Just your life story.</span>
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/20">
                        <p className="text-lg font-bold">Your voice has found its home.</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:p-8 bg-gradient-to-br from-rose-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 min-h-screen lg:min-h-0 safe-area-top safe-area-bottom">
                <div className="w-full max-w-md animate-slide-up">
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl">
                                <Heart className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                Heart<span className="text-primary-500">Out</span>
                            </span>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Create your account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Start your storytelling journey today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-slide-down">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-300"
                                    placeholder="johndoe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:text-white transition-all duration-300"
                                    placeholder="••••••••"
                                    minLength="8"
                                />
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="space-y-2 animate-slide-up">
                                    <div className="flex gap-1">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength.strength
                                                    ? passwordStrength.color
                                                    : 'bg-gray-200 dark:bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Password strength: <span className="font-medium">{passwordStrength.label || 'Too weak'}</span>
                                    </p>
                                </div>
                            )}
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
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Sign In Link */}
                        <p className="text-center text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link
                                to="/auth/login"
                                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
