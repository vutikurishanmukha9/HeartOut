import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
    Mail, 
    Lock, 
    User, 
    Eye, 
    EyeOff, 
    ArrowRight,
    ShieldCheck
} from 'lucide-react';
import AuthDemoStoryCards from '../components/AuthDemoStoryCards';

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
            setError('Gateway error. Please verify your connection.');
        } finally {
            setLoading(false);
        }
    };

    // Password strength evaluator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*]/.test(password)) strength++;

        const levels = [
            { label: 'Weak', color: 'bg-rose-500' },
            { label: 'Fair', color: 'bg-orange-500' },
            { label: 'Good', color: 'bg-amber-500' },
            { label: 'Strong', color: 'bg-emerald-500' }
        ];

        return { strength, ...levels[Math.min(strength - 1, 3)] || { label: '', color: '' } };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div
            data-testid="register-page"
            className="min-h-[100dvh] lg:h-screen lg:max-h-screen w-full bg-[#FAF6F0] dark:bg-[#0F0F11] text-[#1C1917] dark:text-[#F4F4F5] flex flex-col justify-between relative selection:bg-orange-200 selection:text-orange-950 transition-colors duration-300 overflow-x-hidden overflow-y-auto lg:overflow-hidden no-scrollbar"
        >
            {/* Ambient Warmth Atmospheric Lighting System */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[680px] h-[340px] bg-gradient-to-b from-amber-200/35 via-orange-100/20 to-transparent dark:from-amber-950/25 dark:via-orange-950/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[25%] -left-[6%] w-[500px] h-[500px] bg-gradient-to-br from-[#E06E3E]/12 via-[#D97706]/8 to-transparent dark:from-[#C85828]/15 dark:via-transparent dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-[20%] -right-[6%] w-[540px] h-[540px] bg-gradient-to-bl from-rose-200/20 via-orange-100/20 to-transparent dark:from-rose-950/25 dark:via-orange-950/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Top Navigation Bar: Floating Island Pill with Multi-Layered Tactile Shadow */}
            <header className="relative z-10 w-full max-w-[1080px] mx-auto px-3 sm:px-6 pt-2 sm:pt-2.5 shrink-0">
                <div className="w-full px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-white/95 dark:bg-[#18181B]/95 backdrop-blur-xl border border-stone-200/90 dark:border-stone-800 ring-1 ring-stone-900/[0.04] dark:ring-white/[0.06] shadow-[0_4px_20px_-2px_rgba(28,25,23,0.08),0_2px_6px_-1px_rgba(28,25,23,0.04),0_10px_25px_-5px_rgba(200,88,40,0.07),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_6px_24px_-2px_rgba(28,25,23,0.11),0_3px_8px_-1px_rgba(28,25,23,0.06),0_12px_30px_-4px_rgba(200,88,40,0.1),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_10px_30px_-4px_rgba(0,0,0,0.5),0_2px_8px_-1px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)] flex items-center justify-between transition-all duration-300">
                    <Link to="/feed" className="inline-flex items-center gap-2 sm:gap-2.5 group shrink-0" aria-label="HeartOut Home">
                        <img 
                            src="/logo.png" 
                            alt="HeartOut Logo" 
                            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform duration-200 select-none" 
                        />
                        <img
                            src="/text-logo.png"
                            alt="HeartOut"
                            className="h-5 sm:h-6 w-auto max-w-[110px] sm:max-w-[130px] object-contain shrink-0 drop-shadow-xs group-hover:opacity-95 transition-opacity select-none"
                        />
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-600 dark:text-stone-400 font-medium">
                        <Link 
                            to="/support" 
                            className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 transition-all duration-150 font-medium whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">Help & Support</span>
                            <span className="sm:hidden inline">Help</span>
                        </Link>
                        <span className="w-px h-3.5 bg-stone-200 dark:bg-stone-800 select-none" />
                        <Link 
                            to="/support" 
                            className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 transition-all duration-150 font-medium whitespace-nowrap"
                        >
                            About
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Stage: Symmetrically Sized Duo Eliminating Empty Void */}
            <main className="relative z-10 flex-1 w-full max-w-[1080px] mx-auto px-3 sm:px-6 py-2 sm:py-3 lg:py-1.5 flex items-center justify-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch justify-items-center">
                    
                    {/* Left Column: Symmetrically Expanded 500px Register Card */}
                    <div className="w-full max-w-[500px] flex flex-col justify-center">
                        {/* Outer Shell */}
                        <div className="w-full h-full rounded-[20px] sm:rounded-[24px] p-1 sm:p-1.5 bg-gradient-to-b from-[#EBE1D4] via-[#F3E8DC] to-[#E5DACB] dark:from-[#2B2723] dark:via-[#221F1B] dark:to-[#1B1917] border border-[#DDD0C0] dark:border-[#3A342D] ring-1 ring-[#C85828]/15 dark:ring-orange-500/20 shadow-[0_16px_40px_-12px_rgba(200,88,40,0.12)]">
                            {/* Inner Core: Warm Linen Surface Palette per mega-design.md */}
                            <div className="w-full h-full bg-gradient-to-b from-[#FBF8F3] via-[#F7F2EB] to-[#F1EAE0] dark:from-[#1D1A17] dark:via-[#181614] dark:to-[#141211] rounded-[17px] sm:rounded-[20px] border border-[#E5DACB] dark:border-[#332F2A] p-3.5 sm:p-5 lg:p-3.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.9),0_6px_20px_-6px_rgba(200,88,40,0.05)] flex flex-col justify-between">
                                
                                {/* Centered Brand Header */}
                                <div className="text-center mb-2 sm:mb-2.5 lg:mb-1.5 flex flex-col items-center">
                                    <div className="relative inline-flex items-center justify-center group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-[#E06E3E]/25 to-rose-400/20 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                                        <img 
                                            src="/logo.png" 
                                            alt="HeartOut Emblem" 
                                            className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-12 lg:h-12 object-contain drop-shadow-[0_4px_12px_rgba(200,88,40,0.25)] select-none group-hover:scale-105 transition-transform duration-300" 
                                        />
                                    </div>
                                    <h1 className="flex justify-center mt-1.5 sm:mt-2 mb-0.5">
                                        <img 
                                            src="/text-logo.png" 
                                            alt="HeartOut" 
                                            className="h-6 sm:h-7 lg:h-[26px] w-auto max-w-[130px] sm:max-w-[155px] object-contain drop-shadow-[0_2px_6px_rgba(200,88,40,0.16)] select-none" 
                                        />
                                    </h1>
                                    <p className="text-[10.5px] tracking-[0.18em] font-semibold text-stone-500 dark:text-stone-400 uppercase mt-0.5">
                                        Create your account
                                    </p>
                                </div>

                                {/* Register Form */}
                                <form onSubmit={handleSubmit} data-testid="register-form" className="space-y-1.5 sm:space-y-2 lg:space-y-1.5">
                                    {error && (
                                        <div data-testid="error-message" role="alert" className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 text-rose-800 dark:text-rose-300 text-xs font-medium leading-snug">
                                            {error}
                                        </div>
                                    )}

                                    {/* Username Field */}
                                    <div className="space-y-0.5">
                                        <label htmlFor="username" className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                            Username
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#C85828] transition-colors pointer-events-none" />
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                required
                                                minLength={3}
                                                maxLength={30}
                                                value={formData.username}
                                                onChange={handleChange}
                                                data-testid="username-input"
                                                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white/95 dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
                                                placeholder="Choose a username"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-0.5">
                                        <label htmlFor="email" className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                            Email
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#C85828] transition-colors pointer-events-none" />
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                data-testid="email-input"
                                                className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-white/95 dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-0.5">
                                        <label htmlFor="password" className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-[#C85828] transition-colors pointer-events-none" />
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                data-testid="password-input"
                                                className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white/95 dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
                                                placeholder="Create a password"
                                            />
                                            <button
                                                type="button"
                                                data-testid="toggle-password"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 transition-colors"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        {formData.password && (
                                            <div data-testid="password-strength" data-strength={passwordStrength.strength} className="pt-0.5 space-y-0.5">
                                                <div className="flex gap-1">
                                                    {[...Array(4)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                i < passwordStrength.strength
                                                                    ? passwordStrength.color
                                                                    : 'bg-stone-200 dark:bg-stone-800'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-[9.5px] text-stone-500 font-medium">
                                                    Password Strength: <span className="font-semibold text-stone-800 dark:text-stone-200">{passwordStrength.label || 'None'}</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Button-in-Button Island CTA Button */}
                                    <div className="pt-1.5">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            data-testid="submit-button"
                                            className="group relative w-full py-2.5 sm:py-3 pl-5 pr-2.5 bg-gradient-to-r from-stone-900 via-stone-800 to-[#261712] hover:from-[#C85828] hover:via-[#B4471B] hover:to-[#993A14] text-white text-xs sm:text-sm font-semibold rounded-full flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange-600/25 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                                        >
                                            <span>{loading ? 'Creating account...' : 'Create account'}</span>
                                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white/25 transition-all duration-300">
                                                {loading ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {/* Switch to Login Link */}
                                    <div className="text-center pt-2 border-t border-stone-200/80 dark:border-stone-800/80">
                                        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                                            Already have an account?{' '}
                                            <Link
                                                to="/auth/login"
                                                data-testid="login-link"
                                                className="font-bold text-[#C85828] hover:text-[#993A14] dark:hover:text-[#E06E3E] hover:underline transition-colors"
                                            >
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Symmetrically Expanded 500px Community Story Showcase */}
                    <div className="w-full max-w-[500px] flex flex-col justify-center">
                        {/* Outer Shell - Refined Champagne Sand Bezel */}
                        <div className="w-full h-full rounded-[20px] sm:rounded-[24px] p-1 sm:p-1.5 bg-gradient-to-b from-[#EBE1D4] via-[#F3E8DC] to-[#E5DACB] dark:from-[#2B2723] dark:via-[#221F1B] dark:to-[#1B1917] border border-[#DDD0C0] dark:border-[#3A342D] ring-1 ring-[#C85828]/15 dark:ring-orange-500/20 shadow-[0_16px_40px_-12px_rgba(200,88,40,0.12)]">
                            {/* Inner Core: Warm Cashmere Sanctuary Surface */}
                            <div className="w-full h-full bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EFE7DC] dark:from-[#1D1A17] dark:via-[#171513] dark:to-[#131110] rounded-[17px] sm:rounded-[20px] border border-[#E5DACB] dark:border-[#332F2A] p-3.5 sm:p-5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.95),0_6px_20px_-6px_rgba(200,88,40,0.05)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_6px_20px_-6px_rgba(0,0,0,0.35)] flex flex-col justify-between">
                                
                                {/* Showcase Header */}
                                <div className="mb-2 pb-2 border-b border-[#E6D9CA]/80 dark:border-stone-800/80">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-stone-900 dark:text-stone-100 font-heading">
                                                Stories on HeartOut
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-stone-800/90 text-[10.5px] font-semibold text-stone-600 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                            100% Anonymous
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-stone-500 dark:text-stone-400 font-normal mt-0.5 leading-snug">
                                        Read what others feel in a safe space to exhale.
                                    </p>
                                </div>

                                {/* Animated Community Story Cards Conveyor */}
                                <div className="w-full my-auto">
                                    <AuthDemoStoryCards showHeader={false} />
                                </div>

                                {/* Showcase Bottom Telemetry */}
                                <div className="mt-2 pt-2 border-t border-[#E6D9CA]/80 dark:border-stone-800/80 flex items-center justify-between text-[10.5px] text-stone-500 dark:text-stone-400">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-stone-600 dark:text-stone-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#C85828]/70" />
                                        14,000+ reflections shared
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/10 text-[9.5px] font-bold uppercase tracking-wider text-[#C85828] dark:text-[#E06E3E] border border-orange-500/20">
                                        Safe Sanctuary
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
