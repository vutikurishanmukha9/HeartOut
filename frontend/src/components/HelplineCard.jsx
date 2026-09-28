import React, { useState } from 'react';
import { Phone, Mail, Globe, Copy, Check, Clock, Shield } from 'lucide-react';

const helplines = [
    {
        id: 'telemanas',
        name: 'Tele MANAS',
        description: 'Government of India Mental Health Helpline',
        phone: '14416',
        tollFree: '1800-891-4416',
        availability: '24/7, Free',
        color: 'from-amber-600 to-amber-700',
        bgColor: 'bg-[#FFFDF9] dark:bg-[#181614]',
        borderColor: 'border-[#EADDCF] dark:border-[#2C2723]',
        badge: 'Govt. of India',
        badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
    },
    {
        id: 'icall',
        name: 'iCall',
        description: 'Tata Institute of Social Sciences Helpline',
        phone: '9152987821',
        email: 'icall@tiss.edu',
        website: 'https://icallhelpline.org',
        availability: 'Mon-Sat, 8AM-10PM',
        color: 'from-stone-700 to-stone-800',
        bgColor: 'bg-[#FFFDF9] dark:bg-[#181614]',
        borderColor: 'border-[#EADDCF] dark:border-[#2C2723]',
        badge: 'TISS',
        badgeColor: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
    }
];

function CopyButton({ text, label }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error('Clipboard copy error:', e);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition-colors"
            title={`Copy ${label}`}
            aria-label={`Copy ${label}`}
        >
            {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
                <Copy className="w-4 h-4" />
            )}
        </button>
    );
}

export function HelplineCard({ helpline, compact = false }) {
    if (compact) {
        return (
            <div className={`p-4 rounded-2xl bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] shadow-sm`}>
                <div className="flex items-center justify-between mb-3">
                    <h4 className="font-heading font-semibold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                        {helpline.name}
                    </h4>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${helpline.badgeColor}`}>
                        {helpline.badge}
                    </span>
                </div>
                <a
                    href={`tel:${helpline.phone}`}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#C85828] hover:bg-[#B54D20] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
                >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {helpline.phone}</span>
                </a>
            </div>
        );
    }

    return (
        <article className="bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] rounded-3xl p-6 sm:p-7 shadow-[0_2px_14px_rgba(200,140,90,0.04)] dark:shadow-[0_2px_14px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 hover:border-[#D4832D]/70 dark:hover:border-[#D4832D]/50 hover:shadow-[0_10px_28px_rgba(200,120,60,0.08)] transition-all duration-300 flex flex-col justify-between h-full">
            
            {/* Header */}
            <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h3 className="font-heading text-lg sm:text-xl font-semibold text-stone-900 dark:text-stone-100">
                                {helpline.name}
                            </h3>
                            <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${helpline.badgeColor}`}>
                                {helpline.badge}
                            </span>
                        </div>
                        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                            {helpline.description}
                        </p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-[#C85828] dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-900/40">
                        <Phone className="w-4 h-4 stroke-[2]" />
                    </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2 mb-6 text-xs text-stone-500 dark:text-stone-400 font-body">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{helpline.availability}</span>
                </div>
            </div>

            {/* Contact Actions */}
            <div className="space-y-3 pt-2">
                {/* Primary Phone */}
                <div className="flex items-center gap-2.5">
                    <a
                        href={`tel:${helpline.phone}`}
                        className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#C85828] hover:bg-[#B54D20] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
                    >
                        <Phone className="w-4 h-4" />
                        <span>Call {helpline.phone}</span>
                    </a>
                    <CopyButton text={helpline.phone} label="phone number" />
                </div>

                {/* Toll Free */}
                {helpline.tollFree && (
                    <div className="flex items-center gap-2.5">
                        <a
                            href={`tel:${helpline.tollFree.replace(/-/g, '')}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1E1A17] border border-[#EADDCF] dark:border-[#332E29] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium hover:bg-stone-50 dark:hover:bg-[#25211D] transition-colors"
                        >
                            <Phone className="w-3.5 h-3.5 text-stone-500" />
                            <span>Toll Free: {helpline.tollFree}</span>
                        </a>
                        <CopyButton text={helpline.tollFree} label="toll free number" />
                    </div>
                )}

                {/* Email */}
                {helpline.email && (
                    <div className="flex items-center gap-2.5">
                        <a
                            href={`mailto:${helpline.email}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#FFFDF9] dark:bg-[#1E1A17] border border-[#EADDCF] dark:border-[#332E29] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium hover:bg-stone-50 dark:hover:bg-[#25211D] transition-colors"
                        >
                            <Mail className="w-3.5 h-3.5 text-stone-500" />
                            <span>{helpline.email}</span>
                        </a>
                        <CopyButton text={helpline.email} label="email" />
                    </div>
                )}

                {/* Website */}
                {helpline.website && (
                    <a
                        href={helpline.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 rounded-xl bg-stone-100 hover:bg-stone-200/80 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs sm:text-sm font-medium transition-colors"
                    >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Official Website</span>
                    </a>
                )}
            </div>

            {/* Privacy Note */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[#EADDCF]/70 dark:border-[#2C2723] text-xs text-stone-500 dark:text-stone-400 font-body">
                <Shield className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Your call is confidential and anonymous.</span>
            </div>
        </article>
    );
}

export { helplines };
export default HelplineCard;
