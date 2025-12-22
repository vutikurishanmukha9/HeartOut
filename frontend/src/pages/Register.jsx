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
                <div className="relative z-10 flex flex-col justify-center px-8 lg:px-12 py-8 text-white h-full font-body">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="relative p-4 bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 rounded-2xl shadow-2xl">
                                    <Heart className="w-10 h-10 text-white animate-pulse" />
                                </div>
                            </div>
                            <span className="text-4xl font-heading font-extrabold tracking-tight">
                                <span className="text-white drop-shadow-lg">Heart</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-rose-300">Out</span>
                            </span>
                        </div>
                        <h2 className="font-heading text-3xl lg:text-4xl font-bold leading-tight tracking-wide">
                            <span className="text-white drop-shadow-md">Don't Hold It In.</span> <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-purple-300 tracking-wider">
                                Heart It Out.
                            </span>
                        </h2>
                    </div>

                    {/* Premium Feature Cards */}
                    <div className="space-y-3">
                        {[
                            { title: 'Send the Unsent', desc: 'Post the text, letter, or apology you never delivered.' },
                            { title: 'Claim Your Wins', desc: 'Shout out the achievements you usually celebrate alone.' },
                            { title: 'Vent Your Regrets', desc: 'Turn your painful mistakes into shared lessons.' },
                            { title: 'Reveal the Cost', desc: 'Share the sacrifices behind your success.' },
                            { title: 'Be Unapologetic', desc: 'No filters. No judgment. Just your life story.' },
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <span className="font-heading font-semibold text-white group-hover:text-orange-300 transition-colors tracking-wide">
                                    {feature.title}:
                                </span>
                                <span className="font-light text-white/90 ml-2">
                                    {feature.desc}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/20">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50" />
                            <p className="font-heading text-lg font-semibold text-white tracking-wide drop-shadow-md">
                                Your voice has found its home.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6 sm:p-8 bg-gradient-to-br from-rose-50/50 to-purple-50/50 dark:from-gray-900 dark:to-gray-800 min-h-screen lg:min-h-0 safe-area-top safe-area-bottom">
                <div className="w-full max-w-md animate-slide-up font-body">
                    {/* Mobile Logo - Premium Styling */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl blur-md opacity-50" />
                                <div className="relative p-2.5 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
                                    <Heart className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <span className="text-2xl font-heading font-extrabold tracking-tight text-gray-900 dark:text-white">
                                Heart<span className="text-gradient">Out</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                            Share your authentic stories
                        </p>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl font-bold tracking-wide text-gray-900 dark:text-white mb-2">
                            Create your account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 font-light">
                            Start your storytelling journey today
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5 font-body">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-slide-down font-medium">
                                {error}
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                                Username
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="relative w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:text-white transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                                    placeholder="johndoe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                                Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="relative w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:text-white transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                                    placeholder="you@gmail.com"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-medium">
                                <span className="inline-block w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                Use Gmail, Outlook, Yahoo, or iCloud email only
                            </p>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-sm font-heading font-semibold text-gray-700 dark:text-gray-300 tracking-wide">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-300" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="relative w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 dark:text-white transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
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
