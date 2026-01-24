import React from 'react';
import { Heart, Phone, Shield, ExternalLink, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelplineCard, helplines } from '../components/HelplineCard';

export default function Support() {
    return (
        <div className="min-h-screen bg-stone-50 dark:bg-zinc-950 font-body">
            {/* Top Bar - Subtle Navigation & Framing Quote */}
            <div className="max-w-4xl mx-auto px-4 pt-6 pb-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <p className="hidden sm:block text-xs font-medium text-stone-400 dark:text-stone-500 italic">
                    "Your feelings are valid. You deserve support."
                </p>
            </div>

            <div className="max-w-3xl mx-auto px-4 pb-20">
                {/* Header Section */}
                <div className="text-center mb-10 pt-8 animate-slide-up">
                    <div className="inline-flex p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/30 mb-6">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500/20" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-stone-800 dark:text-stone-100 mb-3">
                        You're Not Alone
                    </h1>
                    <p className="text-base text-stone-500 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                        All helplines listed here are free, confidential, and anonymous.
                    </p>
                </div>

                {/* Grounding & Immediate Action */}
                <div className="animate-slide-up stagger-1 mb-12">
                    <p className="text-center text-stone-400 dark:text-stone-500 italic mb-6">
                        Take a breath. You don't have to decide everything right now.
                    </p>

                    {/* Immediate CTA - Warm, Urgent but Safe */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-rose-100 dark:border-rose-900/30 p-6 sm:p-8 shadow-xl shadow-rose-100/50 dark:shadow-none text-center">
                        <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400 mb-6">
                            Need help right now?
                        </h2>
                        <a
                            href="tel:14416"
                            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-rose-600 text-white text-lg font-bold rounded-xl hover:bg-rose-700 hover:-translate-y-0.5 transition-all shadow-lg shadow-rose-600/20"
                        >
                            <Phone className="w-6 h-6" />
                            Call 14416
                        </a>
                        <p className="mt-4 text-xs text-stone-400 dark:text-stone-600">
                            Tele MANAS • 24/7 • Free • Govt. of India
                        </p>
                    </div>
                </div>

                {/* Quick Stats - Reassurance */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16 animate-slide-up stagger-2">
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                            <Phone className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                        </div>
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">24/7</p>
                        <p className="text-[10px] text-stone-400">Available</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                            <Shield className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                        </div>
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">100%</p>
                        <p className="text-[10px] text-stone-400">Confidential</p>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-stone-100 dark:bg-zinc-800 flex items-center justify-center mb-2">
                            <MessageCircle className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                        </div>
                        <p className="text-sm font-semibold text-stone-700 dark:text-stone-300">Free</p>
                        <p className="text-[10px] text-stone-400">No Cost</p>
                    </div>
                </div>

                {/* Helplines List */}
                <div className="space-y-8 animate-slide-up stagger-3">
                    <h3 className="text-lg font-bold text-stone-800 dark:text-stone-200 text-center mb-6">
                        Mental Health Helplines
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {helplines.map((helpline) => (
                            <HelplineCard key={helpline.id} helpline={helpline} />
                        ))}
                    </div>
                </div>

                {/* Additional Resources - Secondary Hierarchy */}
                <div className="mt-12 pt-12 border-t border-stone-100 dark:border-zinc-800 animate-slide-up stagger-4">
                    <h3 className="text-sm font-semibold text-stone-500 dark:text-stone-400 mb-6 uppercase tracking-wider text-center">
                        Additional Resources
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <a
                            href="https://www.nimhans.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                <ExternalLink className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-700 dark:text-stone-200 text-sm">NIMHANS</p>
                                <p className="text-xs text-stone-400 dark:text-stone-500">National Institute of Mental Health</p>
                            </div>
                        </a>
                        <a
                            href="https://www.vandrevalafoundation.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 dark:border-zinc-700 hover:bg-stone-50 dark:hover:bg-zinc-800 transition-colors group"
                        >
                            <div className="p-2 rounded-lg bg-stone-100 dark:bg-zinc-800 group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
                                <ExternalLink className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                            </div>
                            <div>
                                <p className="font-medium text-stone-700 dark:text-stone-200 text-sm">Vandrevala Foundation</p>
                                <p className="text-xs text-stone-400 dark:text-stone-500">Mental Health Support</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Emergency Disclaimer - Separate & Serious */}
                <div className="mt-12 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-5 text-center">
                    <p className="text-xs text-amber-800 dark:text-amber-500 leading-relaxed">
                        <span className="font-bold block mb-1">Emergency Situations</span>
                        If you or someone you know is in immediate danger, please call emergency services (112)
                        or go to your nearest hospital emergency room immediately.
                    </p>
                </div>
            </div>
        </div>
    );
}
