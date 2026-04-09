import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, User, ArrowRight, Sparkles, Eye, EyeOff, Shield, Users } from 'lucide-react';

const featurePills = [
    { icon: EyeOff, label: 'Anonymous' },
    { icon: Shield, label: 'Secure' },
    { icon: Users, label: 'Community' },
    { icon: Heart, label: 'Heartfelt' },
];

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        display_name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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

    // Password strength
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
        <div className="min-h-screen auth-gradient flex flex-col">
            {/* ===== MOBILE: Gradient Hero Header ===== */}
            <div className="lg:hidden relative z-10 pt-12 pb-4 px-6 text-center">
                {/* Logo */}
                <div className="inline-flex items-center gap-2.5 mb-5">
                    <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-xl border border-white/20">
                        <Heart className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-heading font-extrabold tracking-tight">
                        <span className="text-white/90">Heart</span>
                        <span className="text-amber-200 font-bold">Out</span>
                    </span>
                </div>

                {/* Tagline */}
                <h2 className="font-editorial text-2xl text-white/95 mb-3 leading-snug">
                    Don't Hold It In.<br />Heart It Out.
                </h2>
                <p className="text-white/60 text-sm font-light">Share your authentic stories</p>

                {/* Feature pills */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {featurePills.map((pill, i) => {
                        const Icon = pill.icon;
                        return (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/12 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-medium">
                                <Icon className="w-3 h-3" />
                                {pill.label}
                            </span>
                        );
                    })}
                </div>

                {/* Social proof — fills the gap between pills and card */}
                <p className="text-white/50 text-xs mt-4 font-medium">
                    Joined by 10,000+ storytellers
                </p>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6 lg:py-12">
                {/* Animated floating orbs (desktop) */}
                <div className="hidden lg:block">
                    <div className="fixed top-16 left-[12%] w-72 h-72 bg-white/8 rounded-full blur-3xl animate-float pointer-events-none" />
                    <div className="fixed bottom-24 right-[15%] w-96 h-96 bg-white/6 rounded-full blur-3xl animate-float-slow pointer-events-none" />
                </div>

                <div className="w-full max-w-lg">
                    {/* Glass Card */}
                    <div className="auth-glass-card p-8 sm:p-12 animate-slide-up">
                        {/* Desktop Logo */}
                        <div className="hidden lg:block text-center mb-6">
                            <div className="inline-flex items-center gap-3 mb-2">
                                <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/20">
                                    <Heart className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="text-3xl font-heading font-extrabold tracking-tight">
                                    <span className="text-stone-700 dark:text-stone-200">Heart</span>
                                    <span className="text-gradient font-bold">Out</span>
                                </span>
                            </div>
                        </div>

                        {/* Heading */}
                        <div className="text-center mb-8">
                            <h1 className="font-editorial text-[28px] lg:text-[32px] text-stone-800 dark:text-stone-100 mb-2 leading-tight">
                                Create your account
                            </h1>
                            <p className="text-stone-500 dark:text-stone-400 text-sm font-light">
                                Start your storytelling journey today
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-slide-down font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Username */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 pointer-events-none" />
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder="johndoe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 pointer-events-none" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder="you@gmail.com"
                                    />
                                </div>
                                <p className="flex items-center gap-1.5 text-[13px] text-stone-500 dark:text-stone-400 font-medium">
                                    <span className="inline-block w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></span>
                                    Use Gmail, Outlook, Yahoo, or iCloud email only
                                </p>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 pointer-events-none" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="auth-input pr-12"
                                        placeholder="••••••••"
                                        minLength="8"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors duration-200 focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} /> : <Eye className="w-[18px] h-[18px]" strokeWidth={2} />}
                                    </button>
                                </div>

                                {/* Password Strength */}
                                {formData.password && (
                                    <div className="space-y-1.5 animate-slide-up">
                                        <div className="flex gap-1">
                                            {[...Array(4)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                        i < passwordStrength.strength
                                                            ? passwordStrength.color
                                                            : 'bg-stone-200 dark:bg-stone-700'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-stone-500 dark:text-stone-400">
                                            Strength: <span className="font-medium">{passwordStrength.label || 'Too weak'}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* CTA */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium flex items-center justify-center gap-2 py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-[18px] h-[18px]" />
                                        Create Account
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Sign In Link */}
                            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
                                Already have an account?{' '}
                                <Link
                                    to="/auth/login"
                                    className="font-medium text-amber-700 dark:text-amber-400 hover:text-amber-600 hover:underline transition-all"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </form>

                        {/* Feature Pills — inside card (desktop) */}
                        <div className="hidden lg:flex flex-wrap justify-center gap-2 mt-8 pt-6 border-t border-stone-200/60 dark:border-white/10">
                            {featurePills.map((pill, i) => {
                                const Icon = pill.icon;
                                return (
                                    <span key={i} className="auth-pill">
                                        <Icon className="w-3.5 h-3.5" />
                                        {pill.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
