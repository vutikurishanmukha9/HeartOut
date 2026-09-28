import React from 'react';
import { EyeOff, Eye, Shield, Users } from 'lucide-react';

export default function AnonymousToggle({ isAnonymous, onChange, disabled = false }) {
    // Handle both prop names for compatibility
    const checked = isAnonymous;

    return (
        <div
            className={`
                relative p-4 rounded-2xl border transition-all duration-300 cursor-pointer
                ${checked
                    ? 'bg-[#FFF9F3] dark:bg-[#201B17] border-[#C85828]/60 dark:border-[#E07A48]/50 shadow-sm'
                    : 'bg-[#FFFDF9] dark:bg-[#181614] border-[#EADDCF] dark:border-[#2C2723] hover:border-[#D4832D]/60'
                }
            `}
            onClick={() => !disabled && onChange(!checked)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`
                        p-2.5 rounded-xl transition-all duration-300
                        ${checked
                            ? 'bg-[#C85828] text-white shadow-sm'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                        }
                    `}>
                        {checked ? (
                            <Shield className="w-5 h-5 text-white stroke-[2]" />
                        ) : (
                            <Users className="w-5 h-5 stroke-[2]" />
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-heading font-semibold text-stone-900 dark:text-stone-100 cursor-pointer block">
                            {checked ? 'Post Anonymously' : 'Post Publicly'}
                        </label>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-body">
                            {checked
                                ? 'Your identity is completely hidden from readers'
                                : 'Your name will be visible alongside your story'
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
                        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
                        focus:outline-none focus:ring-2 focus:ring-[#C85828] focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${checked
                            ? 'bg-[#C85828]'
                            : 'bg-stone-300 dark:bg-stone-700'
                        }
                    `}
                >
                    <span
                        className={`
                            inline-block h-4 w-4 transform rounded-full bg-white shadow-sm 
                            transition-transform duration-300 ease-out
                            ${checked ? 'translate-x-6' : 'translate-x-1'}
                        `}
                    />
                </button>
            </div>

            {/* Privacy indicator */}
            {checked && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40">
                    <div className="flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 font-medium">
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Blind anonymity enabled • No author profile linked</span>
                    </div>
                </div>
            )}
        </div>
    );
}
