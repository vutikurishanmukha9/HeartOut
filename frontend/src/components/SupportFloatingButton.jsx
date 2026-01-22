import React, { useState } from 'react';
import { Heart, Phone, X, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { helplines, HelplineCard } from './HelplineCard';

export default function SupportFloatingButton() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-24 md:bottom-6 left-6 z-50">
            {/* Expanded Panel */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-4 text-white">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Heart className="w-5 h-5" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Need Support?</h3>
                                    <p className="text-sm text-white">We're here for you</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close support panel"
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
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

            {/* Floating Button - calm amber/rose, slow breathing pulse */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close support resources' : 'Open support resources'}
                aria-expanded={isOpen}
                className={`
                    group flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full
                    bg-gradient-to-r from-amber-500 via-amber-600 to-rose-500
                    text-white text-sm font-medium shadow-lg shadow-amber-500/20
                    hover:shadow-xl hover:shadow-amber-500/30 hover:scale-105
                    transition-all duration-300
                    focus:outline-none focus:ring-4 focus:ring-amber-300 dark:focus:ring-amber-700
                    ${isOpen ? 'ring-4 ring-amber-300 dark:ring-amber-700' : 'animate-breathe'}
                `}
            >
                {isOpen ? (
                    <ChevronUp className="w-4 h-4" aria-hidden="true" />
                ) : (
                    <>
                        <div className="relative">
                            <Heart className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <span className="hidden sm:inline">I need support right now</span>
                        <Phone className="w-3.5 h-3.5 sm:hidden" aria-hidden="true" />
                    </>
                )}
            </button>
        </div>
    );
}
