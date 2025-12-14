import React from 'react';
import { Heart, Phone, Shield, Clock, MessageCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelplineCard, helplines } from '../components/HelplineCard';

export default function Support() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10" />
                <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 dark:bg-rose-900 rounded-full blur-3xl opacity-20" />
                <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full blur-3xl opacity-20" />

                <div className="relative max-w-4xl mx-auto px-4 py-16">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>

                    <div className="text-center mb-12">
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 mb-6 shadow-xl shadow-pink-500/25">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                            You're Not Alone
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            If you're going through a difficult time, please know that help is available.
                            Reach out to these free, confidential helplines anytime.
                        </p>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-12">
                        <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                            <Phone className="w-6 h-6 mx-auto text-rose-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">24/7</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                            <Shield className="w-6 h-6 mx-auto text-emerald-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Confidential</p>
                        </div>
                        <div className="text-center p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                            <MessageCircle className="w-6 h-6 mx-auto text-blue-500 mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">Free</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">No Cost</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Helplines Section */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Mental Health Helplines
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {helplines.map((helpline) => (
                        <HelplineCard key={helpline.id} helpline={helpline} />
                    ))}
                </div>

                {/* Additional Resources */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        Additional Resources
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <a
                            href="https://www.nimhans.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">NIMHANS</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">National Institute of Mental Health</p>
                            </div>
                        </a>
                        <a
                            href="https://www.vandrevalafoundation.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                <ExternalLink className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Vandrevala Foundation</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Mental Health Support</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl p-6">
                    <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">
                        Emergency Situations
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                        If you or someone you know is in immediate danger, please call emergency services (112)
                        or go to your nearest hospital emergency room immediately.
                    </p>
                </div>

                {/* Footer Message */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                        "Every story matters. Your feelings are valid. You deserve support."
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-4">
                        HeartOut cares about your mental wellbeing
                    </p>
                </div>
            </div>
        </div>
    );
}
