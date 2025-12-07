import React from 'react';
import { EyeOff, Eye, Shield, Users } from 'lucide-react';

export default function AnonymousToggle({ isAnonymous, onChange, disabled = false }) {
    // Handle both prop names for compatibility
    const checked = isAnonymous;

    return (
        <div
            className={`
                relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${checked
                    ? 'bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-primary-200 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }
            `}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`
                        p-2.5 rounded-xl transition-all duration-300
                        ${checked
                            ? 'bg-gradient-to-br from-primary-500 to-secondary-500 shadow-lg shadow-primary-500/30'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }
                    `}>
                        {checked ? (
                            <Shield className="w-5 h-5 text-white" />
                        ) : (
                            <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-900 dark:text-white cursor-pointer block">
                            {checked ? 'Post Anonymously' : 'Post Publicly'}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
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
                        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${checked
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 shadow-md shadow-primary-500/30'
                            : 'bg-gray-300 dark:bg-gray-600'
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
                <div className="mt-3 pt-3 border-t border-primary-100 dark:border-primary-800/50">
                    <div className="flex items-center gap-2 text-xs text-primary-600 dark:text-primary-400">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Only you can see your identity on this story</span>
                    </div>
                </div>
            )}
        </div>
    );
}
