import React, { useState } from 'react';
import { Heart, Phone, X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { helplines, HelplineCard } from './HelplineCard';

export default function SupportFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Expanded Panel */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Heart className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Need Support?</h3>
                                    <p className="text-sm text-white/80">We're here for you</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            If you're going through a difficult time, please reach out to these free, confidential helplines:
                        </p>

                        {helplines.map((helpline) => (
                            <HelplineCard key={helpline.id} helpline={helpline} compact />
                        ))}

                        <Link
                            to="/support"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-3 mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            View All Resources
                        </Link>
                    </div>

                    {/* Footer */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                            All calls are free and confidential
                        </p>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    group flex items-center gap-2 px-4 py-3 rounded-full
                    bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500
                    text-white font-semibold shadow-lg shadow-pink-500/30
                    hover:shadow-xl hover:shadow-pink-500/40 hover:scale-105
                    transition-all duration-300
                    ${isOpen ? 'ring-4 ring-pink-300 dark:ring-pink-700' : ''}
                `}
            >
                {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                ) : (
                    <>
                        <div className="relative">
                            <Heart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span className="hidden sm:inline">Need Support?</span>
                        <Phone className="w-4 h-4 sm:hidden" />
                    </>
                )}
            </button>
        </div>
    );
}
