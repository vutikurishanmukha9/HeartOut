import React from 'react';

/**
 * HeartOutBackground
 * Organic decorative ambient background for HeartOut authentication pages.
 * Features:
 * - Base warm peach-cream canvas with soft corner radial gradients:
 *   radial-gradient(circle at 100% 0%, #FED3A2 0%, transparent 28%),
 *   radial-gradient(circle at 0% 100%, #FFD8B0 0%, transparent 30%),
 *   #FBEFE5
 * - Hand-crafted organic flower/blob petals with multi-layer radial & linear paint gradients
 * - Soft atmospheric ambient glow halos
 * - Decorative hand-drawn curved accent line
 * - Floating brand heart outline
 */
export default function HeartOutBackground() {
    return (
        <div
            className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-10"
            aria-hidden="true"
        >
            {/* Soft Ambient Glow Halos */}
            <div className="absolute -left-16 -bottom-16 w-[360px] h-[360px] rounded-full bg-[#FF9A52] blur-[90px] opacity-25" />
            <div className="absolute -right-16 -top-16 w-[340px] h-[340px] rounded-full bg-[#FF9A52] blur-[90px] opacity-25" />

            {/* Bottom-Left Organic Flower / Blob */}
            <div
                className="absolute -left-28 -bottom-32 sm:-left-24 sm:-bottom-28 w-[370px] h-[370px] sm:w-[420px] sm:h-[420px] -rotate-[20deg] opacity-85 blur-[0.5px] transition-transform duration-700"
                style={{
                    borderRadius: '45% 55% 65% 35% / 55% 40% 60% 45%',
                    background:
                        'radial-gradient(circle at 30% 25%, rgba(255, 239, 207, 0.95), transparent 22%), radial-gradient(circle at 65% 70%, rgba(255, 96, 39, 0.85), transparent 55%), linear-gradient(135deg, #FFD7A8 0%, #FF9A52 52%, #ED4C24 100%)',
                    boxShadow: '0 30px 80px rgba(241, 111, 47, 0.22)'
                }}
            >
                {/* Left Petal */}
                <div
                    className="absolute -left-12 top-6 w-[200px] h-[260px] -rotate-[35deg] opacity-80"
                    style={{
                        borderRadius: '60% 40% 65% 35%',
                        background:
                            'radial-gradient(circle at 35% 25%, #FFDCAE 0%, #FF9A52 55%, #ED4C24 100%)'
                    }}
                />
                {/* Right Petal */}
                <div
                    className="absolute -right-10 top-4 w-[180px] h-[250px] rotate-[35deg] opacity-80"
                    style={{
                        borderRadius: '40% 60% 35% 65%',
                        background:
                            'radial-gradient(circle at 35% 25%, #FFDCAE 0%, #FF9A52 55%, #ED4C24 100%)'
                    }}
                />
            </div>

            {/* Top-Right Organic Flower / Blob */}
            <div
                className="absolute -right-28 -top-28 sm:-right-24 sm:-top-24 w-[350px] h-[350px] sm:w-[400px] sm:h-[400px] rotate-[25deg] opacity-80 blur-[0.5px] transition-transform duration-700"
                style={{
                    borderRadius: '55% 45% 35% 65% / 45% 60% 40% 55%',
                    background:
                        'radial-gradient(circle at 30% 25%, rgba(255, 239, 207, 0.95), transparent 20%), radial-gradient(circle at 65% 70%, rgba(255, 96, 39, 0.85), transparent 55%), linear-gradient(135deg, #FFD7A8 0%, #FF9A52 52%, #ED4C24 100%)',
                    boxShadow: '0 30px 80px rgba(241, 111, 47, 0.2)'
                }}
            >
                {/* Left Petal */}
                <div
                    className="absolute -left-10 top-6 w-[180px] h-[240px] -rotate-[28deg] opacity-75"
                    style={{
                        borderRadius: '55% 45% 60% 40%',
                        background:
                            'radial-gradient(circle at 35% 25%, #FFDCAE 0%, #FF9A52 55%, #ED4C24 100%)'
                    }}
                />
                {/* Right Petal */}
                <div
                    className="absolute -right-8 top-8 w-[170px] h-[230px] rotate-[32deg] opacity-75"
                    style={{
                        borderRadius: '45% 55% 40% 60%',
                        background:
                            'radial-gradient(circle at 35% 25%, #FFDCAE 0%, #FF9A52 55%, #ED4C24 100%)'
                    }}
                />
            </div>

            {/* Organic Hand-Drawn Curved Line Accent */}
            <svg
                className="absolute -left-12 sm:-left-16 -bottom-12 sm:-bottom-16 w-[380px] h-[380px] sm:w-[420px] sm:h-[420px]"
                viewBox="0 0 400 400"
                fill="none"
            >
                <path
                    d="M40 320 C130 280 70 190 180 150 C260 120 220 60 340 40"
                    stroke="#F27A42"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    opacity="0.45"
                />
            </svg>

            {/* Floating Brand Hand-Drawn Heart Outline */}
            <svg
                className="absolute left-3 sm:left-7 top-[36%] sm:top-[38%] w-9 h-9 sm:w-11 sm:h-11 -rotate-12 drop-shadow-xs"
                viewBox="0 0 100 100"
                fill="none"
            >
                <path
                    d="M50 82 C45 76 15 58 15 35 C15 15 38 10 50 27 C62 10 85 15 85 35 C85 58 55 76 50 82Z"
                    stroke="#F06B3B"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.72"
                />
            </svg>
        </div>
    );
}
