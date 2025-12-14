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
        color: 'from-blue-500 to-indigo-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        borderColor: 'border-blue-200 dark:border-blue-700',
        badge: 'Govt. of India',
        badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
    },
    {
        id: 'icall',
        name: 'iCall',
        description: 'Tata Institute of Social Sciences Helpline',
        phone: '9152987821',
        email: 'icall@tiss.edu',
        website: 'https://icallhelpline.org',
        availability: 'Mon-Sat, 8AM-10PM',
        color: 'from-emerald-500 to-teal-600',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        badge: 'TISS',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
    }
];

function CopyButton({ text, label }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title={`Copy ${label}`}
        >
            {copied ? (
                <Check className="w-4 h-4 text-green-500" />
            ) : (
                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
        </button>
    );
}

export function HelplineCard({ helpline, compact = false }) {
    if (compact) {
        return (
            <div className={`p-4 rounded-xl ${helpline.bgColor} ${helpline.borderColor} border`}>
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{helpline.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${helpline.badgeColor}`}>
                        {helpline.badge}
                    </span>
                </div>
                <a
                    href={`tel:${helpline.phone}`}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${helpline.color} text-white font-medium hover:opacity-90 transition-opacity`}
                >
                    <Phone className="w-4 h-4" />
                    {helpline.phone}
                </a>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-2xl ${helpline.bgColor} ${helpline.borderColor} border-2 transition-all duration-300 hover:shadow-lg`}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{helpline.name}</h3>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${helpline.badgeColor}`}>
                            {helpline.badge}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{helpline.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${helpline.color} shadow-lg`}>
                    <Phone className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{helpline.availability}</span>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
                {/* Primary Phone */}
                <div className="flex items-center gap-3">
                    <a
                        href={`tel:${helpline.phone}`}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${helpline.color} text-white font-semibold hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-md`}
                    >
                        <Phone className="w-5 h-5" />
                        Call {helpline.phone}
                    </a>
                    <CopyButton text={helpline.phone} label="phone number" />
                </div>

                {/* Toll Free */}
                {helpline.tollFree && (
                    <div className="flex items-center gap-3">
                        <a
                            href={`tel:${helpline.tollFree.replace(/-/g, '')}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            Toll Free: {helpline.tollFree}
                        </a>
                        <CopyButton text={helpline.tollFree} label="toll free number" />
                    </div>
                )}

                {/* Email */}
                {helpline.email && (
                    <div className="flex items-center gap-3">
                        <a
                            href={`mailto:${helpline.email}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            {helpline.email}
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
                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Globe className="w-4 h-4" />
                        Visit Website
                    </a>
                )}
            </div>

            {/* Privacy Note */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <Shield className="w-3.5 h-3.5" />
                <span>Your call is confidential and anonymous</span>
            </div>
        </div>
    );
}

export { helplines };
export default HelplineCard;
