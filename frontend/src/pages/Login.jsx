import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Heart, Mail, Lock, ArrowRight, Sparkles, Eye, EyeOff, Shield, Users, EyeOff as Anon } from 'lucide-react';

const testimonials = [
    { quote: "HeartOut gave me the courage to share my story.", author: "Anonymous Writer" },
    { quote: "Finally, a safe space to express myself freely.", author: "First-time Storyteller" },
    { quote: "The support from this community is incredible.", author: "Grateful Member" }
];

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
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Cycle testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

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
        <div className="min-h-screen auth-gradient flex flex-col">
            {/* ===== MOBILE: Gradient Hero Header ===== */}
            <div className="lg:hidden relative z-10 pt-12 pb-8 px-6 text-center">
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
                    <div className="auth-glass-card p-8 sm:p-10 animate-slide-up">
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

                            {/* Remember Me */}
                            <div className="flex items-center gap-3 pt-1">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    className="auth-checkbox"
                                />
                                <label htmlFor="remember" className="text-sm text-stone-500 dark:text-stone-400 cursor-pointer select-none">
                                    Keep me signed in
                                </label>
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

                        {/* Feature Pills — inside card */}
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

                    {/* Mobile social proof */}
                    <p className="lg:hidden text-center text-xs text-white/60 mt-6">
                        Trusted by thousands of storytellers worldwide
                    </p>
                </div>

                {/* Desktop: Floating testimonial — bottom right */}
                <div className="hidden lg:block fixed bottom-8 right-8 z-20 animate-slide-up stagger-3">
                    <div className="auth-testimonial">
                        <div className="relative h-16 overflow-hidden">
                            {testimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ease-out ${
                                        activeTestimonial === i
                                            ? 'opacity-100 translate-y-0'
                                            : 'opacity-0 translate-y-6 pointer-events-none'
                                    }`}
                                >
                                    <p className="text-sm italic font-light leading-relaxed mb-1.5">"{t.quote}"</p>
                                    <p className="text-xs font-medium flex items-center gap-1.5 text-white/75">
                                        <Heart className="w-3 h-3 text-rose-400" fill="currentColor" />
                                        {t.author}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Progress dots */}
                        <div className="flex justify-center gap-1.5 mt-3">
                            {testimonials.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        activeTestimonial === i ? 'w-6 bg-white/80' : 'w-1.5 bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
