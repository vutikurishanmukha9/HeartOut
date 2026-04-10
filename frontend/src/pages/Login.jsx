import React, { useState, useContext, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Shield, Users, Check } from 'lucide-react';


const featurePills = [
    { icon: EyeOff, label: 'Anonymous' },
    { icon: Shield, label: 'Secure' },
    { icon: Users, label: 'Community' },
    { icon: Heart, label: 'Heartfelt' },
];

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Ambient floating hearts
    const ambientHearts = useMemo(() => [...Array(12)].map((_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`, // 10% to 90% wide
        animationDuration: `${15 + Math.random() * 20}s`, // 15s to 35s
        animationDelay: `${Math.random() * 10}s`, // 0s to 10s
        size: `${12 + Math.random() * 16}px`, // 12px to 28px
        rotate: `${-30 + Math.random() * 60}deg`
    })), []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const emailValue = emailRef.current?.value || email;
        const passwordValue = passwordRef.current?.value || password;

        if (!emailValue || !passwordValue) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            const result = await login(emailValue, passwordValue);
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
        <div className="min-h-screen auth-gradient flex flex-col relative overflow-hidden">
            {/* Ambient Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {ambientHearts.map(h => (
                    <div 
                        key={h.id} 
                        className="particle" 
                        style={{ 
                            left: h.left, 
                            animationDuration: h.animationDuration, 
                            animationDelay: h.animationDelay 
                        }}
                    >
                        <Heart 
                            style={{ width: h.size, height: h.size, transform: `rotate(${h.rotate})` }} 
                            fill="currentColor" 
                            strokeWidth={0}
                        />
                    </div>
                ))}
            </div>

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
                    <div className="fixed top-20 right-[15%] w-72 h-72 bg-white/8 rounded-full blur-3xl animate-float pointer-events-none" />
                    <div className="fixed bottom-20 left-[10%] w-96 h-96 bg-white/6 rounded-full blur-3xl animate-float-slow pointer-events-none" />
                </div>

                <div className="w-full max-w-md">
                    {/* Glass Card */}
                    <div className="auth-glass-card p-8 sm:p-10 animate-card-enter">
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

                        {/* Headline */}
                        <div className="text-center mb-8">
                            <h1 className="font-editorial text-[28px] lg:text-[32px] text-stone-800 dark:text-stone-100 mb-2 leading-tight">
                                Welcome back!
                            </h1>
                            <p className="text-stone-500 dark:text-stone-400 text-sm font-light">
                                Continue your storytelling journey
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm animate-slide-down font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 pointer-events-none" />
                                    <input
                                        ref={emailRef}
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="auth-input"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-stone-600 dark:text-stone-400">
                                        Password
                                    </label>
                                    <a href="#" className="text-xs font-medium text-amber-700 dark:text-amber-500 hover:text-amber-600 hover:underline transition-all">
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-stone-400 pointer-events-none" />
                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="auth-input pr-12"
                                        placeholder="••••••••"
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
                            </div>

                            {/* Remember Me — custom checkbox */}
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200 border-2 ${
                                        rememberMe
                                            ? 'bg-gradient-to-br from-amber-500 to-amber-700 border-amber-600'
                                            : 'bg-stone-100 dark:bg-white/5 border-stone-300 dark:border-white/20 hover:border-amber-500'
                                    }`}
                                    aria-label="Keep me signed in"
                                >
                                    {rememberMe && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                </button>
                                <span
                                    onClick={() => setRememberMe(!rememberMe)}
                                    className="text-sm text-stone-500 dark:text-stone-400 cursor-pointer select-none"
                                >
                                    Keep me signed in
                                </span>
                            </div>

                            {/* CTA */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-premium flex items-center justify-center gap-2 py-4 mt-2 disabled:opacity-50 disabled:cursor-not-allowed animate-cta-pulse"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Sparkles className="w-[18px] h-[18px]" />
                                        Sign In
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            {/* Sign Up Link */}
                            <p className="text-center text-sm text-stone-500 dark:text-stone-400">
                                Don't have an account?{' '}
                                <Link
                                    to="/auth/register"
                                    className="font-medium text-amber-700 dark:text-amber-400 hover:text-amber-600 hover:underline transition-all"
                                >
                                    Sign up free
                                </Link>
                            </p>
                        </form>

                        {/* Feature Pills — inside card with divider */}
                        <div className="hidden lg:block mt-8 pb-2">
                            <div className="border-t border-stone-200/80 dark:border-white/10 mb-5" />
                            <div className="flex flex-wrap justify-center gap-2">
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

                    {/* Mobile social proof */}
                    <p className="lg:hidden text-center text-xs text-white/60 mt-6">
                        Trusted by thousands of storytellers worldwide
                    </p>
                </div>
            </div>
        </div>
    );
}
