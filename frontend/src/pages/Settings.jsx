import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Lock,
    Eye,
    EyeOff,
    Sun,
    Moon,
    Monitor,
    Trash2,
    AlertTriangle,
    Check,
    ArrowLeft,
    ShieldCheck,
    Shield,
    User,
    Mail
} from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { getApiUrl } from '../config/api';

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { theme, setTheme, THEMES } = useContext(ThemeContext);

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    // Delete account state
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [showDeletePassword, setShowDeletePassword] = useState(false);

    // Password requirements definition
    const passwordRequirements = [
        { label: 'At least 8 characters', test: (p) => p.length >= 8 },
        { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
        { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
        { label: 'One number', test: (p) => /\d/.test(p) },
        { label: 'One special symbol', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) }
    ];

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            const err = 'New passwords do not match';
            setPasswordError(err);
            toast.error(err);
            return;
        }

        const failedReq = passwordRequirements.find(req => !req.test(passwordData.newPassword));
        if (failedReq) {
            const err = `Password must contain: ${failedReq.label.toLowerCase()}`;
            setPasswordError(err);
            toast.error(err);
            return;
        }

        setPasswordLoading(true);
        try {
            const response = await fetch(getApiUrl('/api/auth/change-password'), {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    current_password: passwordData.currentPassword,
                    new_password: passwordData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Failed to change password');
            }

            const successMsg = 'Password successfully updated';
            setPasswordSuccess(successMsg);
            toast.success(successMsg);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPasswordError(err.message);
            toast.error(err.message || 'Unable to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!deletePassword) {
            const err = 'Please enter your password to confirm deletion';
            setDeleteError(err);
            toast.error(err);
            return;
        }

        setDeleteLoading(true);
        setDeleteError('');

        try {
            const response = await fetch(getApiUrl('/api/auth/account'), {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: deletePassword })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Failed to delete account');
            }

            toast.success('Your account has been deleted');
            logout();
            navigate('/');
        } catch (err) {
            setDeleteError(err.message);
            toast.error(err.message || 'Failed to delete account');
        } finally {
            setDeleteLoading(false);
        }
    };

    const themeOptions = [
        { 
            value: THEMES.LIGHT, 
            label: 'Warm Daylight', 
            sublabel: 'Warm ceramic parchment palette',
            icon: Sun 
        },
        { 
            value: THEMES.DARK, 
            label: 'Obsidian Haven', 
            sublabel: 'Charcoal parchment for night reading',
            icon: Moon 
        },
        { 
            value: THEMES.AUTO, 
            label: 'System Match', 
            sublabel: 'Harmonizes with device schedule',
            icon: Monitor 
        }
    ];

    return (
        <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] pb-24 sm:pb-20 transition-colors duration-300">
            {/* Top Sanctuary Navigation Console */}
            <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Navigation */}
                    <button
                        onClick={() => navigate('/profile')}
                        className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label="Back to profile"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Profile</span>
                    </button>

                    {/* Right: Sanctuary Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] text-stone-600 dark:text-stone-300 text-xs font-medium">
                        <Shield className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                        <span>Settings</span>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-8">
                {/* Page Intro Header */}
                <div className="text-left">
                    <h1 className="font-stories text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 font-normal">
                        Sanctuary Settings
                    </h1>
                    <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1.5">
                        Calibrate your personal sanctuary, adjust your reading atmosphere, and safeguard your account.
                    </p>
                </div>

                {/* Section 1: Appearance & Theme */}
                <section className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    <div className="mb-6">
                        <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                            Environment
                        </span>
                        <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                            Reading Atmosphere
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Choose the lighting that best rests your eyes while reading and writing reflections.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        {themeOptions.map((option) => {
                            const IconComponent = option.icon;
                            const isSelected = theme === option.value;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        setTheme(option.value);
                                        toast.success(`Atmosphere set to ${option.label}`);
                                    }}
                                    className={`flex flex-col text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 relative group ${isSelected
                                        ? 'border-[#C85828] bg-amber-50/70 dark:bg-amber-950/20 shadow-sm'
                                        : 'border-[#EADDCF] dark:border-[#2C2723] bg-[#FFFDF9] dark:bg-[#181614] hover:border-amber-400/50 hover:bg-stone-50/50 dark:hover:bg-[#1c1917]'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3 w-full">
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${isSelected
                                            ? 'bg-[#C85828] text-white border-[#C85828]'
                                            : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-stone-400 border-stone-200/80 dark:border-zinc-700/60 group-hover:border-amber-400/40'
                                        }`}>
                                            <IconComponent className="w-4 h-4" />
                                        </div>

                                        {isSelected && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C85828] dark:text-amber-400 uppercase tracking-wide">
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Active</span>
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`font-semibold text-sm mb-1 ${isSelected
                                        ? 'text-stone-900 dark:text-stone-100'
                                        : 'text-stone-800 dark:text-stone-200'
                                    }`}>
                                        {option.label}
                                    </h3>

                                    <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                        {option.sublabel}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Sanctuary Identity Overview */}
                <section className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    <div className="mb-6">
                        <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                            Identity
                        </span>
                        <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                            Sanctuary Presence
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Your credentials and privacy configuration on HeartOut.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723]">
                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium mb-1.5">
                                <User className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                                <span>Username</span>
                            </div>
                            <p className="font-body text-sm font-semibold text-stone-800 dark:text-stone-200">
                                @{user?.username || 'sanctuary_user'}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-[#121110] border border-[#EADDCF] dark:border-[#2C2723]">
                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 font-medium mb-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
                                <span>Registered Email</span>
                            </div>
                            <p className="font-body text-sm font-semibold text-stone-800 dark:text-stone-200 truncate">
                                {user?.email || 'Not provided'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        <span className="font-semibold text-stone-800 dark:text-stone-200">Anonymity Note:</span> Your username and email are never shown on stories or comments marked as anonymous. Your vulnerability remains completely protected.
                    </div>
                </section>

                {/* Section 3: Password Update */}
                <section className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    <div className="mb-6">
                        <span className="text-[10px] font-semibold tracking-wider text-[#C85828] dark:text-amber-400 uppercase font-body block mb-1">
                            Security
                        </span>
                        <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                            Change Passphrase
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Maintain a strong and distinct passphrase to protect your account and private drafts.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordChange} className="space-y-5">
                        {/* Current Password */}
                        <div>
                            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 transition-colors"
                                    placeholder="Enter your current password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                    aria-label={showPasswords.current ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                                >
                                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 transition-colors"
                                    placeholder="Choose a strong new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                    aria-label={showPasswords.new ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                                >
                                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Requirements Checklist */}
                            {passwordData.newPassword && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {passwordRequirements.map((req, i) => {
                                        const isMet = req.test(passwordData.newPassword);
                                        return (
                                            <div 
                                                key={i} 
                                                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs transition-colors ${isMet
                                                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                                    : 'bg-stone-50/70 dark:bg-[#121110] border-[#EADDCF] dark:border-[#2C2723] text-stone-500 dark:text-stone-400'
                                                }`}
                                            >
                                                <Check className={`w-3.5 h-3.5 ${isMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-stone-300 dark:text-stone-600'}`} />
                                                <span>{req.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm focus:outline-none focus:border-[#C85828] focus:ring-1 focus:ring-[#C85828]/30 transition-colors"
                                    placeholder="Retype your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                    aria-label={showPasswords.confirm ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    Passwords do not match
                                </p>
                            )}
                        </div>

                        {/* Inline Messages */}
                        {passwordError && (
                            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-xs">
                                {passwordSuccess}
                            </div>
                        )}

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#C85828] hover:bg-[#B54D20] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {passwordLoading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        <span>Updating Passphrase...</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Update Passphrase</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                {/* Section 4: Departure (Danger Zone) */}
                <section className="bg-[#FFFDF9] dark:bg-[#181614] border border-red-200/80 dark:border-red-950/50 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
                    <div className="mb-4">
                        <span className="text-[10px] font-semibold tracking-wider text-red-600 dark:text-red-400 uppercase font-body block mb-1">
                            Departure
                        </span>
                        <h2 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 font-normal">
                            Close Sanctuary Account
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                            Permanently delete your account. All your published stories, private drafts, bookmarks, and responses will be permanently removed.
                        </p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50/70 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-medium rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-100/80 dark:hover:bg-red-900/30 text-xs sm:text-sm transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Account Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-stone-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity"
                        onClick={() => !deleteLoading && setShowDeleteModal(false)}
                    />

                    <div className="relative bg-[#FFFDF9] dark:bg-[#181614] rounded-3xl border border-[#EADDCF] dark:border-[#2C2723] p-6 sm:p-8 max-w-md w-full shadow-2xl z-10 animate-scale-in">
                        <div className="w-12 h-12 rounded-2xl bg-red-100/80 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 border border-red-200/70 dark:border-red-900/50">
                            <AlertTriangle className="w-6 h-6 stroke-[1.75]" />
                        </div>

                        <h3 className="font-stories text-xl sm:text-2xl text-stone-900 dark:text-stone-100 mb-2 font-normal">
                            Permanently delete account?
                        </h3>

                        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed mb-5">
                            This action cannot be undone. All your reflections, comments, bookmarks, and account records will be permanently erased. Please enter your password to confirm.
                        </p>

                        <div className="mb-5">
                            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                                Account Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showDeletePassword ? 'text' : 'password'}
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Enter your password to confirm"
                                    className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[#EADDCF] dark:border-[#2C2723] bg-stone-50/70 dark:bg-[#121110] text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowDeletePassword(!showDeletePassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                                    aria-label={showDeletePassword ? 'Hide password' : 'Show password'}
                                >
                                    {showDeletePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {deleteError && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{deleteError}</p>
                            )}
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeletePassword('');
                                    setDeleteError('');
                                }}
                                disabled={deleteLoading}
                                className="px-5 py-2.5 text-xs sm:text-sm font-medium rounded-xl text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                            >
                                Keep Account
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading || !deletePassword}
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 min-w-[140px]"
                            >
                                {deleteLoading ? (
                                    <>
                                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    'Permanently Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
