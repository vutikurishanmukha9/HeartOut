import React, { useState, useEffect, useCallback } from 'react';
import {
  EyeOff,
  Shield,
  Users,
  Heart,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Quote,
  Feather,
  CheckCircle2,
} from 'lucide-react';
import haptic from '../utils/haptics';

/**
 * Sanctuary Core Architectural Pillars & Ethical Features
 * Designed from scratch in accordance with design-highlights-50 principles:
 * - Linear Pick #24 surface ladder with crisp 1px hairlines
 * - Claude Pick #9 warm sanctuary parchment and obsidian palette
 * - Apple Pick #3 literary typography with tight tracking
 * - Raycast Pick #39 monospace indices and tabular figures
 * - Sensory haptic feedback on interactive pillars and testimonial rotation
 */

export const SANCTUARY_PILLARS = [
  {
    id: 'anonymity',
    index: '01',
    icon: EyeOff,
    title: 'Absolute Anonymity',
    subtitle: 'Zero Identity Footprint',
    description: 'Share your most vulnerable truths with zero profiles, public handles, or digital tracking.',
    metric: '100% Anonymous',
    accentColor: '#C85828',
    darkAccentColor: '#E8A87C',
  },
  {
    id: 'security',
    index: '02',
    icon: Shield,
    title: 'Encrypted Solace',
    subtitle: 'Sanctuary Privacy Guards',
    description: 'Protected data boundaries, automatic screenshot obscuration, and strict ephemeral retention.',
    metric: 'Zero-Knowledge',
    accentColor: '#B45309',
    darkAccentColor: '#F59E0B',
  },
  {
    id: 'community',
    index: '03',
    icon: Users,
    title: 'Quiet Resonance',
    subtitle: 'Shared Human Moments',
    description: 'Feel connected with live gentle signals of souls reading and reflecting beside you in real time.',
    metric: 'Live Presence',
    accentColor: '#8C3A16',
    darkAccentColor: '#E8A87C',
  },
  {
    id: 'care',
    index: '04',
    icon: Heart,
    title: 'Immediate Care',
    subtitle: '24/7 Lifeline Anchors',
    description: 'Instant, judgment-free access to verified government and community helplines whenever you need.',
    metric: 'Always Active',
    accentColor: '#991B1B',
    darkAccentColor: '#F87171',
  },
];

export const SANCTUARY_TESTIMONIALS = [
  {
    quote: 'HeartOut gave me the courage to write words I had buried for years. Seeing others read with me without judging made me feel human again.',
    author: 'Anonymous Writer',
    context: 'Shared in Unsent Letters',
  },
  {
    quote: 'Finally, a quiet digital sanctuary where my feelings are not commodified for engagement metrics, ads, or competitive likes.',
    author: 'Sanctuary Soul',
    context: 'First-time Storyteller',
  },
  {
    quote: 'When everything felt overwhelming in the middle of the night, the immediate crisis support button connected me to a voice that listened.',
    author: 'Grateful Member',
    context: 'Tele MANAS Partner',
  },
];

export default function FeatureHighlights({
  variant = 'bento',
  showTestimonials = true,
  autoPlay = true,
  className = '',
}) {
  const [activePillar, setActivePillar] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic testimonial rotation
  useEffect(() => {
    if (!autoPlay || isPaused || !showTestimonials) return;

    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % SANCTUARY_TESTIMONIALS.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, showTestimonials]);

  const handlePillarClick = (index) => {
    haptic.selection();
    setActivePillar(index);
  };

  const handlePrevTestimonial = useCallback(() => {
    haptic.selection();
    setActiveTestimonial((prev) => (prev - 1 + SANCTUARY_TESTIMONIALS.length) % SANCTUARY_TESTIMONIALS.length);
  }, []);

  const handleNextTestimonial = useCallback(() => {
    haptic.selection();
    setActiveTestimonial((prev) => (prev + 1) % SANCTUARY_TESTIMONIALS.length);
  }, []);

  // Variant: Compact Horizontal Pills
  if (variant === 'pills') {
    return (
      <div
        data-testid="feature-highlights-pills"
        className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${className}`}
      >
        {SANCTUARY_PILLARS.map((pillar, index) => {
          const Icon = pillar.icon;
          const isActive = activePillar === index;

          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => handlePillarClick(index)}
              className={`
                inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs
                transition-all duration-200 active:scale-95 border
                ${
                  isActive
                    ? 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#C85828] dark:border-amber-400 text-stone-900 dark:text-stone-100 shadow-sm'
                    : 'bg-[#FFFDF9]/80 dark:bg-[#141210]/80 border-[#E8DDD0] dark:border-[#2D2621] text-stone-600 dark:text-stone-400 hover:border-[#C85828]/50'
                }
              `}
            >
              <Icon className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" strokeWidth={1.75} />
              <span className="font-heading font-medium">{pillar.title}</span>
              <span className="font-mono text-[10px] tabular-nums text-stone-400">
                {pillar.index}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: Default Bento Architectural Showcase
  return (
    <section
      data-testid="feature-highlights-bento"
      className={`
        w-full bg-[#FFFDF9] dark:bg-[#141210]
        border border-[#E8DDD0] dark:border-[#2D2621]
        rounded-3xl p-6 sm:p-8 lg:p-10
        shadow-[0_8px_30px_rgba(20,10,5,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)]
        relative overflow-hidden transition-all duration-200
        ${className}
      `}
    >
      {/* Ambient Sanctuary Warmth Glow */}
      <div
        className="absolute -top-32 right-0 w-96 h-96 bg-[#C85828]/5 dark:bg-amber-400/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Masthead */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-[#E8DDD0]/70 dark:border-[#2D2621]/70">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10px] uppercase tracking-wider font-semibold bg-[#FAF5EF] dark:bg-[#1C1815] border-[#E8DDD0] dark:border-[#2D2621] text-[#8C3A16] dark:text-[#E8A87C] mb-2.5">
            <Sparkles className="w-3 h-3 text-[#C85828] dark:text-amber-400" />
            <span>Ethical Architecture</span>
          </div>
          <h2 className="font-stories text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 dark:text-stone-100 tracking-tight">
            Crafted for emotional safety.
          </h2>
        </div>
        <p className="font-body text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
          HeartOut is engineered from the ground up to protect your privacy, human dignity, and peace of mind.
        </p>
      </div>

      {/* Main Grid: 4 Pillars & Testimonial Sanctuary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Column: 4 Architectural Feature Pillars */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SANCTUARY_PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            const isSelected = activePillar === index;

            return (
              <div
                key={pillar.id}
                role="button"
                tabIndex={0}
                onClick={() => handlePillarClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePillarClick(index);
                  }
                }}
                data-testid={`pillar-card-${pillar.id}`}
                className={`
                  p-5 rounded-2xl border text-left cursor-pointer
                  transition-all duration-200 flex flex-col justify-between
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85828]
                  ${
                    isSelected
                      ? 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#C85828] dark:border-amber-400/80 shadow-[0_4px_20px_rgba(200,88,40,0.08)]'
                      : 'bg-[#FFFDF9] dark:bg-[#141210] border-[#E8DDD0] dark:border-[#2D2621] hover:border-[#C85828]/50 hover:bg-[#FAF5EF]/50 dark:hover:bg-[#1C1815]/50'
                  }
                `}
              >
                <div>
                  {/* Top Bar: Icon & Monospace Index */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="
                      w-9 h-9 rounded-xl flex items-center justify-center
                      bg-[#FAF5EF] dark:bg-[#181412]
                      border border-[#E8DDD0] dark:border-[#2D2621]
                    ">
                      <Icon className="w-4 h-4 text-[#C85828] dark:text-amber-400" strokeWidth={1.75} />
                    </div>

                    <span className="font-mono text-[11px] tabular-nums font-bold text-stone-400 dark:text-stone-500">
                      {pillar.index}
                    </span>
                  </div>

                  <h3 className="font-stories text-base sm:text-lg text-stone-900 dark:text-stone-100 font-normal mb-1">
                    {pillar.title}
                  </h3>
                  <p className="font-body text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>

                {/* Bottom Metric Chip */}
                <div className="pt-3 border-t border-[#E8DDD0]/50 dark:border-[#2D2621]/50 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-stone-400 dark:text-stone-500">{pillar.subtitle}</span>
                  <span className="text-[#8C3A16] dark:text-[#E8A87C] font-semibold">{pillar.metric}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Literary Testimonial Card */}
        {showTestimonials && (
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-[#FAF5EF] dark:bg-[#181412] border border-[#E8DDD0] dark:border-[#2D2621] relative overflow-hidden">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                  <Quote className="w-4 h-4 text-[#C85828] dark:text-amber-400" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Voices from the Sanctuary
                  </span>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevTestimonial}
                    aria-label="Previous testimonial"
                    data-testid="testimonial-prev-btn"
                    className="
                      p-1.5 rounded-lg border border-[#E8DDD0] dark:border-[#2D2621]
                      bg-[#FFFDF9] dark:bg-[#141210] text-stone-600 dark:text-stone-300
                      hover:border-[#C85828]/60 transition-colors
                    "
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextTestimonial}
                    aria-label="Next testimonial"
                    data-testid="testimonial-next-btn"
                    className="
                      p-1.5 rounded-lg border border-[#E8DDD0] dark:border-[#2D2621]
                      bg-[#FFFDF9] dark:bg-[#141210] text-stone-600 dark:text-stone-300
                      hover:border-[#C85828]/60 transition-colors
                    "
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Active Testimonial Content */}
              <div
                tabIndex={0}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
                className="focus:outline-none min-h-[140px] flex flex-col justify-center"
              >
                <p className="font-stories italic text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed mb-4">
                  "{SANCTUARY_TESTIMONIALS[activeTestimonial].quote}"
                </p>
                <div>
                  <div className="flex items-center gap-1.5 font-heading font-medium text-xs text-stone-900 dark:text-stone-100">
                    <Feather className="w-3 h-3 text-[#C85828] dark:text-amber-400" />
                    <span>{SANCTUARY_TESTIMONIALS[activeTestimonial].author}</span>
                  </div>
                  <p className="font-mono text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {SANCTUARY_TESTIMONIALS[activeTestimonial].context}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Progress Indicator Dots */}
            <div className="flex items-center justify-between pt-5 mt-6 border-t border-[#E8DDD0]/60 dark:border-[#2D2621]/60">
              <div className="flex items-center gap-1.5">
                {SANCTUARY_TESTIMONIALS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      haptic.selection();
                      setActiveTestimonial(idx);
                    }}
                    aria-label={`Go to testimonial ${idx + 1}`}
                    data-testid={`testimonial-dot-${idx}`}
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${activeTestimonial === idx ? 'w-6 bg-[#C85828] dark:bg-amber-400' : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'}
                    `}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-[11px] font-mono text-stone-500">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                <span>Verified Solace</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
