import React from 'react';
import { EyeOff, Eye } from 'lucide-react';

export default function AnonymousToggle({ checked, onChange, disabled = false }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
                {checked ? (
                    <EyeOff className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                )}
                <div>
                    <label htmlFor="anonymous-toggle" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
                        Post Anonymously
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Your identity will be hidden from other users
                    </p>
                </div>
            </div>

            <button
                type="button"
                id="anonymous-toggle"
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}
        `}
            >
                <span
                    className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
                />
            </button>
        </div>
    );
}
