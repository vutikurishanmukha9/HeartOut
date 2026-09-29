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
import HeartOutBackground from '../components/HeartOutBackground';

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
            className="min-h-[100dvh] lg:h-screen lg:max-h-screen w-full heartout-auth-bg text-[#1C1917] flex flex-col justify-between relative selection:bg-orange-500/30 selection:text-orange-900 transition-colors duration-300 overflow-x-hidden overflow-y-auto lg:overflow-hidden no-scrollbar"
            style={{
                background:
                    'radial-gradient(circle at 100% 0%, #FED3A2 0%, transparent 28%), radial-gradient(circle at 0% 100%, #FFD8B0 0%, transparent 30%), #FBEFE5'
            }}
        >
            {/* Organic Floral Blobs, Glows, and Hand-Drawn Accents */}
            <HeartOutBackground />

            {/* Top Navigation Bar: Floating Island Pill */}
            <header className="relative z-10 w-full max-w-[1080px] mx-auto px-3 sm:px-6 pt-2 sm:pt-2.5 shrink-0">
                <div className="w-full px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#FFFDF9]/90 backdrop-blur-xl border border-[#E8DDD0] shadow-[0_4px_20px_-4px_rgba(200,88,40,0.08),0_2px_6px_-1px_rgba(0,0,0,0.03)] ring-1 ring-black/[0.02] flex items-center justify-between transition-all duration-300">
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

                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-stone-700 font-medium">
                        <Link 
                            to="/support" 
                            className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-stone-700 hover:text-stone-950 hover:bg-stone-300/40 transition-all duration-150 font-medium whitespace-nowrap"
                        >
                            <span className="hidden sm:inline">Help & Support</span>
                            <span className="sm:hidden inline">Help</span>
                        </Link>
                        <span className="w-px h-3.5 bg-stone-300 select-none" />
                        <Link 
                            to="/support" 
                            className="px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-stone-700 hover:text-stone-950 hover:bg-stone-300/40 transition-all duration-150 font-medium whitespace-nowrap"
                        >
                            About
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Stage: Symmetrically Sized Duo */}
            <main className="relative z-10 flex-1 w-full max-w-[1080px] mx-auto px-3 sm:px-6 py-2 sm:py-3 lg:py-1.5 flex items-center justify-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 items-stretch justify-items-center">
                    
                    {/* Left Column: Symmetrically Expanded 500px Register Card */}
                    <div className="w-full max-w-[500px] flex flex-col justify-center">
                        {/* Warm Linen Sanctuary Card */}
                        <div className="w-full h-full rounded-[22px] sm:rounded-[26px] bg-[#FFFDF9]/95 sm:bg-[#FFFDF9] border border-[#EADDCF] p-4 sm:p-6 lg:p-5 shadow-[0_20px_50px_-12px_rgba(180,80,20,0.09),0_4px_16px_-2px_rgba(0,0,0,0.03)] ring-1 ring-[#C85828]/10 flex flex-col justify-center gap-4 sm:gap-5 lg:gap-4">
                            
                            {/* Centered Brand Header matching design lockup */}
                            <div className="text-center flex flex-col items-center">
                                <p className="text-[10px] sm:text-[10.5px] tracking-[0.22em] font-semibold text-stone-400 dark:text-stone-500 uppercase select-none">
                                    CREATE YOUR ACCOUNT
                                </p>
                                <h1 className="flex items-center justify-center gap-2.5 sm:gap-3 mt-1.5 mb-1">
                                    <span className="font-signature text-[34px] sm:text-[42px] lg:text-[38px] font-normal text-stone-900 dark:text-stone-100 select-none leading-none tracking-normal drop-shadow-[0_2px_4px_rgba(200,88,40,0.12)] -translate-y-0.5">
                                        Join
                                    </span>
                                    <img 
                                        src="/text-logo.png" 
                                        alt="HeartOut" 
                                        className="h-7 sm:h-[34px] lg:h-[32px] w-auto max-w-[140px] sm:max-w-[170px] object-contain drop-shadow-[0_2px_6px_rgba(200,88,40,0.16)] select-none translate-y-[1px]" 
                                    />
                                </h1>
                                <p className="text-xs sm:text-[13px] text-stone-500 dark:text-stone-400 font-normal leading-snug mt-0.5">
                                    A safe space to share, reflect, and grow together.
                                </p>
                            </div>

                            {/* Register Form */}
                            <form onSubmit={handleSubmit} data-testid="register-form" className="space-y-2 sm:space-y-2.5 lg:space-y-2">
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
                                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#FAF7F2] dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
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
                                            className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-[#FAF7F2] dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
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
                                            className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-[#FAF7F2] dark:bg-[#201D1A] border border-[#DDD1BF] dark:border-[#3D3730] focus:bg-white dark:focus:bg-[#25221E] focus:border-[#C85828] dark:focus:border-[#E06E3E] rounded-xl text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 outline-none focus:ring-4 focus:ring-[#C85828]/15 transition-all shadow-[0_1px_3px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] dark:shadow-none font-sans [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_white] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#201D1A] [&:-webkit-autofill]:-webkit-text-fill-color-[inherit]"
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
                                        className="group relative w-full py-2.5 sm:py-3 pl-5 pr-2.5 bg-gradient-to-r from-[#541203] via-[#9B2F0B] to-[#D84B16] hover:from-[#6A1705] hover:via-[#B03810] hover:to-[#EA551E] text-white text-xs sm:text-sm font-semibold rounded-full flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-orange-600/30 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
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

                    {/* Right Column: Symmetrically Expanded 500px Community Story Showcase */}
                    <div className="hidden lg:flex w-full max-w-[500px] flex-col justify-center">
                        {/* Warm Linen Sanctuary Card */}
                        <div className="w-full h-full rounded-[22px] sm:rounded-[26px] bg-[#FFFDF9]/95 sm:bg-[#FFFDF9] border border-[#EADDCF] p-4 sm:p-6 lg:p-5 shadow-[0_20px_50px_-12px_rgba(180,80,20,0.09),0_4px_16px_-2px_rgba(0,0,0,0.03)] ring-1 ring-[#C85828]/10 flex flex-col justify-between">
                            
                            {/* Showcase Header */}
                            <div className="mb-2 pb-2 border-b border-[#EFE5D8]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-stories text-[19px] sm:text-[21px] font-semibold text-stone-900 tracking-[-0.015em] leading-tight select-none">
                                            Stories on HeartOut
                                        </h2>
                                    </div>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF5EE] text-[10.5px] font-semibold text-stone-700 border border-[#E0D3C3] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                        100% Anonymous
                                    </span>
                                </div>
                                <p className="text-[11px] text-stone-500 font-normal mt-0.5 leading-snug">
                                    Read what others feel in a safe space to exhale.
                                </p>
                            </div>

                            {/* Animated Community Story Cards Conveyor */}
                            <div className="w-full my-auto">
                                <AuthDemoStoryCards showHeader={false} />
                            </div>

                            {/* Showcase Bottom Telemetry */}
                            <div className="mt-2 pt-2 border-t border-[#EFE5D8] flex items-center justify-between text-[10.5px] text-stone-500">
                                <div className="flex items-center gap-2">
                                    {/* Overlapping Alphabet User Profiles Avatar Stack */}
                                    <div className="flex items-center -space-x-1.5 shrink-0" aria-label="Community members">
                                        <div className="relative z-30 w-5 h-5 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-heading font-extrabold text-[9px] flex items-center justify-center ring-2 ring-[#FFFDF9] shadow-xs select-none">
                                            <span className="leading-none drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]">S</span>
                                        </div>
                                        <div className="relative z-20 w-5 h-5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-heading font-extrabold text-[9px] flex items-center justify-center ring-2 ring-[#FFFDF9] shadow-xs select-none">
                                            <span className="leading-none drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]">G</span>
                                        </div>
                                        <div className="relative z-10 w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white font-heading font-extrabold text-[9px] flex items-center justify-center ring-2 ring-[#FFFDF9] shadow-xs select-none">
                                            <span className="leading-none drop-shadow-[0_0.5px_1px_rgba(0,0,0,0.3)]">K</span>
                                        </div>
                                    </div>
                                    <span className="text-[10.5px] sm:text-[11px] font-medium text-stone-700">
                                        14,000+ reflections shared
                                    </span>
                                </div>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FCEEE8] text-[9.5px] font-bold uppercase tracking-wider text-[#C85828] border border-orange-200/80 shadow-xs">
                                    Safe Sanctuary
                                </span>
                            </div>

                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
