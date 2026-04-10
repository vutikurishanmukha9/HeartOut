import React from 'react';
import { EyeOff, Eye, Shield, Users } from 'lucide-react';

export default function AnonymousToggle({ isAnonymous, onChange, disabled = false }) {
    // Handle both prop names for compatibility
    const checked = isAnonymous;

    return (
        <div
            className={`
                relative p-4 rounded-2xl border-[1.5px] transition-all duration-300 cursor-pointer
                ${checked
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                    : 'bg-stone-50 dark:bg-stone-800/50 border-stone-200 dark:border-stone-700 hover:border-amber-300 dark:hover:border-amber-600'
                }
            `}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`
                        p-2.5 rounded-xl transition-all duration-300
                        ${checked
                            ? 'bg-amber-500 dark:bg-amber-600 shadow-lg shadow-amber-500/25'
                            : 'bg-stone-200 dark:bg-stone-700'
                        }
                    `}>
                        {checked ? (
                            <Shield className="w-5 h-5 text-white" />
                        ) : (
                            <Users className="w-5 h-5 text-stone-500 dark:text-stone-400" />
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-stone-900 dark:text-white cursor-pointer block">
                            {checked ? 'Post Anonymously' : 'Post Publicly'}
                        </label>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                            {checked
                                ? 'Your identity will be hidden from other users'
                                : 'Your name will be visible to readers'
                            }
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    role="switch"
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={(e) => {
                        e.stopPropagation();
                        onChange(!checked);
                    }}
                    className={`
                        relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300
                        focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${checked
                            ? 'bg-amber-500 dark:bg-amber-600'
                            : 'bg-stone-300 dark:bg-stone-600'
                        }
                    `}
                >
                    <span
                        className={`
                            inline-block h-5 w-5 transform rounded-full bg-white shadow-md 
                            transition-transform duration-300 ease-out
                            ${checked ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                </button>
            </div>

            {/* Privacy indicator */}
            {checked && (
                <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/50">
                    <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Only you can see your identity on this story</span>
                    </div>
                </div>
            )}
        </div>
    );
}

