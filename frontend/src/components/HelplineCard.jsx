import React, { useState } from 'react';
import { Phone, Mail, Globe, Copy, Check, Clock, Shield, ArrowUpRight } from 'lucide-react';
import haptic from '../utils/haptics';

const helplines = [
  {
    id: 'telemanas',
    name: 'Tele MANAS',
    description: 'Government of India Mental Health Helpline',
    phone: '14416',
    tollFree: '1800-891-4416',
    availability: '24/7, Free',
    badge: 'Govt. of India',
    badgeColor: 'bg-[#C85828]/10 text-[#8C3A16] dark:bg-amber-400/15 dark:text-[#E8A87C] border-[#C85828]/20 dark:border-amber-400/20',
    type: 'National Crisis & Support',
  },
  {
    id: 'icall',
    name: 'iCall',
    description: 'Tata Institute of Social Sciences Helpline',
    phone: '9152987821',
    email: 'icall@tiss.edu',
    website: 'https://icallhelpline.org',
    availability: 'Mon-Sat, 8AM-10PM',
    badge: 'TISS',
    badgeColor: 'bg-stone-200/60 text-stone-700 dark:bg-stone-800/80 dark:text-stone-300 border-stone-300/60 dark:border-stone-700/60',
    type: 'Psychosocial Counseling',
  },
];

/**
 * Tactile Copy Action Button
 * Provides instant clipboard copy with tactile haptic confirmation.
 */
function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      haptic.success();
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
      className={`
        p-2.5 rounded-lg border transition-all duration-150 shrink-0
        ${
          copied
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
            : 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#E8DDD0] dark:border-[#2D2621] text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50'
        }
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C85828]
      `}
      title={`Copy ${label}`}
      aria-label={`Copy ${label}`}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

/**
 * Sanctuary Helpline Card Component
 * Architectural support tile with high-legibility contact actions,
 * verified institutional badges, and zero generic styling.
 */
export function HelplineCard({ helpline, compact = false }) {
  if (compact) {
    return (
      <div className="p-3.5 rounded-xl bg-[#FFFDF9] dark:bg-[#141210] border border-[#E8DDD0] dark:border-[#2D2621] shadow-[0_2px_12px_rgba(20,10,5,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-all">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <h4 className="font-heading font-semibold text-stone-900 dark:text-stone-100 text-xs sm:text-sm tracking-tight">
              {helpline.name}
            </h4>
          </div>
          <span
            className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${helpline.badgeColor}`}
          >
            {helpline.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${helpline.phone}`}
            onClick={() => haptic.selection()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg bg-[#C85828] hover:bg-[#B34C20] text-white text-xs font-semibold shadow-2xs transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
          >
            <Phone className="w-3 h-3" />
            <span className="font-mono tabular-nums">Call {helpline.phone}</span>
          </a>
          <CopyButton text={helpline.phone} label="phone number" />
        </div>
      </div>
    );
  }

  return (
    <article className="bg-[#FFFDF9] dark:bg-[#141210] border border-[#E8DDD0] dark:border-[#2D2621] rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(20,10,5,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-[#C85828]/50 dark:hover:border-amber-400/50 hover:shadow-[0_12px_32px_rgba(200,88,40,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.6)] hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between h-full group">
      {/* Card Header & Institutional Credentials */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h3 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                {helpline.name}
              </h3>
              <span
                className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${helpline.badgeColor}`}
              >
                {helpline.badge}
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {helpline.description}
            </p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] text-[#C85828] dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-[#C85828]/30 transition-colors">
            <Phone className="w-4 h-4" />
          </div>
        </div>

        {/* Operating Hours & Availability */}
        <div className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-lg bg-[#FAF5EF]/80 dark:bg-[#1C1815]/80 border border-[#E8DDD0]/70 dark:border-[#2D2621]/70 text-xs text-stone-600 dark:text-stone-300 font-body">
          <Clock className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0" />
          <span className="font-mono text-[11px] tabular-nums">{helpline.availability}</span>
          <span className="ml-auto flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Verified
          </span>
        </div>
      </div>

      {/* Structured Contact Actions */}
      <div className="space-y-2.5 pt-1">
        {/* Primary Direct Helpline Phone */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${helpline.phone}`}
            onClick={() => haptic.selection()}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#C85828] hover:bg-[#B34C20] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">Call {helpline.phone}</span>
          </a>
          <CopyButton text={helpline.phone} label="phone number" />
        </div>

        {/* Toll-Free Alternate Line */}
        {helpline.tollFree && (
          <div className="flex items-center gap-2">
            <a
              href={`tel:${helpline.tollFree.replace(/-/g, '')}`}
              onClick={() => haptic.selection()}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium hover:border-amber-400/50 hover:bg-[#F4ECE2] dark:hover:bg-[#25201B] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
            >
              <Phone className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              <span className="font-mono tabular-nums">Toll Free: {helpline.tollFree}</span>
            </a>
            <CopyButton text={helpline.tollFree} label="toll free number" />
          </div>
        )}

        {/* Email Support */}
        {helpline.email && (
          <div className="flex items-center gap-2">
            <a
              href={`mailto:${helpline.email}`}
              onClick={() => haptic.selection()}
              className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-[#FAF5EF] dark:bg-[#1C1815] border border-[#E8DDD0] dark:border-[#2D2621] text-stone-800 dark:text-stone-200 text-xs sm:text-sm font-medium hover:border-amber-400/50 hover:bg-[#F4ECE2] dark:hover:bg-[#25201B] transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
            >
              <Mail className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500" />
              <span className="font-mono text-xs">{helpline.email}</span>
            </a>
            <CopyButton text={helpline.email} label="email" />
          </div>
        )}

        {/* Official Website */}
        {helpline.website && (
          <a
            href={helpline.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => haptic.selection()}
            className="inline-flex items-center justify-center gap-1.5 w-full h-10 px-4 rounded-lg bg-[#F6EFE6] dark:bg-[#1A1714] border border-[#E8DDD0] dark:border-[#2D2621] text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:border-amber-400/50 hover:bg-[#EFE5D8] dark:hover:bg-[#231F1C] text-xs sm:text-sm font-medium transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-[#C85828]"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Official Website</span>
            <ArrowUpRight className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        )}
      </div>

      {/* Confidentiality Guarantee Seal */}
      <div className="flex items-center gap-2 mt-5 pt-3.5 border-t border-[#E8DDD0] dark:border-[#26211C] text-xs text-stone-500 dark:text-stone-400 font-body">
        <Shield className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400 shrink-0" />
        <span>Your call is confidential and anonymous.</span>
      </div>
    </article>
  );
}

export { helplines };
export default HelplineCard;
