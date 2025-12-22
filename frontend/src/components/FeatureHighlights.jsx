import React, { useState, useEffect } from 'react';
import {
    Shield,
    Users,
    Heart,
    Sparkles,
    Eye,
    EyeOff,
    Star,
    Zap
} from 'lucide-react';

/**
 * Ultra Premium Feature Highlights v2
 * 
 * Completely redesigned for maximum visual impact
 * Features:
 * - Floating 3D glass cards with depth
 * - Animated glowing icons
 * - Smooth particle trails
 * - Premium typography
 * - Stunning hover effects
 */

const features = [
    {
        icon: EyeOff,
        title: 'Anonymous',
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-500/50',
    },
    {
        icon: Shield,
        title: 'Secure',
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-500/50',
    },
    {
        icon: Users,
        title: 'Community',
        gradient: 'from-sky-400 to-blue-500',
        shadow: 'shadow-sky-500/50',
    },
    {
        icon: Heart,
        title: 'Heartfelt',
        gradient: 'from-rose-400 to-pink-500',
        shadow: 'shadow-rose-500/50',
    },
];

const testimonials = [
    {
        quote: "HeartOut gave me the courage to share my story.",
        author: "Anonymous Writer"
    },
    {
        quote: "Finally, a safe space to express myself freely.",
        author: "First-time Storyteller"
    },
    {
        quote: "The support from this community is incredible.",
        author: "Grateful Member"
    }
];

export default function FeatureHighlights() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [hoveredFeature, setHoveredFeature] = useState(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="feature-highlights-v2">
            {/* Premium Feature Pills - Mobile Responsive */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    const isHovered = hoveredFeature === index;

                    return (
                        <div
                            key={index}
                            onMouseEnter={() => setHoveredFeature(index)}
                            onMouseLeave={() => setHoveredFeature(null)}
                            onTouchStart={() => setHoveredFeature(index)}
                            onTouchEnd={() => setTimeout(() => setHoveredFeature(null), 1000)}
                            className={`
                                feature-pill group relative
                                flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-3
                                bg-white/15 backdrop-blur-xl
                                rounded-full
                                border border-white/30
                                cursor-pointer
                                transform transition-all duration-500
                                ${isHovered ? 'scale-105 sm:scale-110 bg-white/25 shadow-2xl ' + feature.shadow : 'hover:bg-white/20 active:bg-white/25'}
                            `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Glow ring on hover */}
                            <div className={`
                                absolute inset-0 rounded-full
                                bg-gradient-to-r ${feature.gradient}
                                opacity-0 group-hover:opacity-20 blur-xl
                                transition-opacity duration-500
                            `} />

                            {/* Icon with gradient background */}
                            <div className={`
                                relative z-10
                                w-9 h-9 rounded-xl
                                bg-gradient-to-br ${feature.gradient}
                                flex items-center justify-center
                                shadow-lg ${feature.shadow}
                                transform transition-all duration-300
                                ${isHovered ? 'scale-110 rotate-6' : ''}
                            `}>
                                <Icon className="w-4 h-4 text-white" strokeWidth={2.5} />

                                {/* Shine effect */}
                                <div className="absolute inset-0 rounded-xl overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent" />
                                </div>
                            </div>

                            {/* Text */}
                            <span className={`
                                relative z-10
                                text-sm font-semibold text-white
                                transition-all duration-300
                                ${isHovered ? 'tracking-wide' : ''}
                            `}>
                                {feature.title}
                            </span>

                            {/* Sparkle on hover */}
                            {isHovered && (
                                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Animated Divider */}
            <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" aria-hidden="true" />
                <Star className="w-4 h-4 text-white" aria-hidden="true" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" aria-hidden="true" />
            </div>

            {/* Testimonial Carousel */}
            <div className="relative h-24 overflow-hidden">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`
                            absolute inset-0
                            flex flex-col items-center justify-center
                            text-center px-6
                            transition-all duration-700 ease-out
                            ${activeTestimonial === index
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8 pointer-events-none'}
                        `}
                    >
                        <p className="text-white text-base italic font-light leading-relaxed mb-2">
                            "{testimonial.quote}"
                        </p>
                        <p className="text-white/90 text-sm font-medium flex items-center gap-2">
                            <Heart className="w-3 h-3 text-rose-400" fill="currentColor" aria-hidden="true" />
                            {testimonial.author}
                        </p>
                    </div>
                ))}
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`
                            h-1.5 rounded-full transition-all duration-300
                            ${activeTestimonial === index
                                ? 'w-8 bg-white'
                                : 'w-1.5 bg-white/40 hover:bg-white/60'}
                        `}
                    />
                ))}
            </div>

            <style>{`
                .feature-highlights-v2 {
                    padding: 1.5rem 0;
                }

                .feature-pill {
                    animation: slideUp 0.6s ease-out both;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
