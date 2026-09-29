import React from 'react';
import { 
    Heart, 
    Phone, 
    Shield, 
    ExternalLink, 
    ArrowLeft, 
    PhoneCall, 
    Clock, 
    AlertCircle,
    Building2,
    LifeBuoy,
    HelpCircle,
    CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HelplineCard, helplines } from '../components/HelplineCard';

export default function Support() {
    return (
        <div className="min-h-screen heartout-auth-bg dark:bg-[#121110] font-body transition-colors duration-300 pb-24 sm:pb-20">
            
            {/* Top Sanctuary Control Bar */}
            <header className="sticky top-0 z-40 py-3.5 px-4 sm:px-8 bg-[#FBEFE5]/90 dark:bg-[#121110]/90 backdrop-blur-md border-b border-[#EADDCF]/80 dark:border-[#26221E]">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors px-2.5 py-1.5 rounded-xl text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Back to Home</span>
                        <span className="sm:hidden">Home</span>
                    </Link>

                    <p className="hidden sm:block font-stories text-xs text-stone-500 dark:text-stone-400 italic">
                        "Your feelings are valid. You deserve a safe space to breathe."
                    </p>
                </div>
            </header>

            {/* Main Sanctuary Support Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
                
                {/* Masthead */}
                <div className="text-center mb-10 sm:mb-12 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center mx-auto border border-amber-200/60 dark:border-amber-900/40">
                        <Heart className="w-6 h-6 stroke-[1.75]" />
                    </div>

                    <h1 className="font-stories text-3xl sm:text-4xl lg:text-5xl text-stone-900 dark:text-stone-100 font-normal leading-tight">
                        You do not have to carry this alone
                    </h1>

                    <p className="font-body text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
                        Free, confidential, and anonymous listening spaces. Verified mental health resources available at any hour of the day or night.
                    </p>
                </div>

                {/* Acute Crisis Lifeline Card */}
                <section className="mb-10">
                    <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-10 shadow-[0_4px_30px_rgba(200,140,90,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                            <span className="w-2 h-2 rounded-full bg-[#C85828] animate-pulse" />
                            <span>National 24/7 Crisis Lifeline</span>
                        </div>

                        <div className="space-y-2">
                            <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                                Need someone to talk to right now?
                            </h2>
                            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
                                Tele MANAS offers free, confidential tele-counseling by trained mental health professionals across India.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                            <a
                                href="tel:14416"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 rounded-xl bg-[#C85828] hover:bg-[#B54D20] text-white text-sm sm:text-base font-semibold shadow-sm transition-all active:scale-[0.98]"
                            >
                                <PhoneCall className="w-4 h-4" />
                                <span>Call Lifeline 14416</span>
                            </a>

                            <a
                                href="tel:18008914416"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-[#FFFDF9] dark:bg-[#1E1A17] border border-[#EADDCF] dark:border-[#332E29] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium hover:bg-stone-50 dark:hover:bg-[#25211D] transition-colors"
                            >
                                <span>Toll-Free: 1800-891-4416</span>
                            </a>
                        </div>

                        <p className="text-[11px] text-stone-400 dark:text-stone-500 font-body">
                            Government of India • Toll-free from any mobile operator • Zero charge
                        </p>
                    </article>
                </section>

                {/* Pillars of Sanctuary Listening */}
                <section className="mb-12">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-[0_2px_12px_rgba(200,140,90,0.03)] text-left space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                                <Clock className="w-4 h-4" />
                            </div>
                            <h3 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100">
                                Continuous Support
                            </h3>
                            <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                Mental health crises do not follow a schedule. Help is available 24 hours a day, every day of the year.
                            </p>
                        </article>

                        <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-[0_2px_12px_rgba(200,140,90,0.03)] text-left space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                                <Shield className="w-4 h-4" />
                            </div>
                            <h3 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100">
                                100% Confidential
                            </h3>
                            <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                You do not have to provide your name or identity. Your conversation stays private between you and the listener.
                            </p>
                        </article>

                        <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-[0_2px_12px_rgba(200,140,90,0.03)] text-left space-y-2">
                            <div className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                                <Heart className="w-4 h-4" />
                            </div>
                            <h3 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100">
                                Zero Cost
                            </h3>
                            <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                                Every helpline listed on this page is free. You will never be asked for billing details or subscription fees.
                            </p>
                        </article>

                    </div>
                </section>

                {/* Verified Helplines Section */}
                <section className="mb-12 space-y-6">
                    <div className="text-left">
                        <h2 className="font-stories text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 font-normal">
                            Verified Helplines & Listening Spaces
                        </h2>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                            Choose the helpline that suits your preferred language, schedule, and comfort.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {helplines.map((helpline) => (
                            <HelplineCard key={helpline.id} helpline={helpline} />
                        ))}
                    </div>
                </section>

                {/* Academic & Foundation Resources */}
                <section className="mb-12 space-y-4">
                    <div className="text-left">
                        <h3 className="font-heading text-xs uppercase tracking-wider font-semibold text-stone-500 dark:text-stone-400">
                            Recognized Institutes & Foundations
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <a
                            href="https://www.nimhans.ac.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-sm hover:border-[#D4832D]/70 dark:hover:border-[#D4832D]/50 hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#C85828] transition-colors">
                                        NIMHANS
                                    </h4>
                                    <p className="font-body text-xs text-stone-500 dark:text-stone-400">
                                        National Institute of Mental Health and Neurosciences
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors shrink-0" />
                        </a>

                        <a
                            href="https://www.vandrevalafoundation.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-2xl p-5 shadow-sm hover:border-[#D4832D]/70 dark:hover:border-[#D4832D]/50 hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                                    <LifeBuoy className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-heading text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-[#C85828] transition-colors">
                                        Vandrevala Foundation
                                    </h4>
                                    <p className="font-body text-xs text-stone-500 dark:text-stone-400">
                                        24/7 Mental Health and Crisis Counseling
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-stone-200 transition-colors shrink-0" />
                        </a>
                    </div>
                </section>

                {/* Emergency Situation Advisory */}
                <section className="mb-12">
                    <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-red-200/80 dark:border-red-900/40 rounded-2xl p-5 sm:p-6 text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 text-red-700 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">
                            <AlertCircle className="w-4 h-4" />
                            <span>Immediate Medical Emergency</span>
                        </div>
                        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mx-auto">
                            If you or someone around you is in immediate physical danger or facing a medical crisis, please call emergency services immediately at <span className="font-semibold text-stone-900 dark:text-stone-100">112</span> (National Emergency Number) or proceed to the nearest hospital casualty department.
                        </p>
                    </article>
                </section>

                {/* Closing Literary Grounding */}
                <div className="text-center pt-4">
                    <p className="font-stories italic text-sm text-stone-500 dark:text-stone-400 leading-relaxed max-w-md mx-auto">
                        "Whatever you are experiencing in this moment, you are allowed to feel it. Reaching out for help is an act of quiet courage."
                    </p>
                </div>

            </main>

        </div>
    );
}
