import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    ArrowUpRight
} from 'lucide-react';
import { getAvatarColor, getAvatarTextColor } from '../utils/avatarColors';

const demoStories = [
    {
        id: 'unsent-letter',
        author: 'Shanmukh',
        handle: '@shanmukh_v',
        category: 'Unsent Letters',
        readingTime: '2 min read',
        excerpt: '“To the person I never got to tell: I still look for you in every crowded station. I hope you found the peace you were searching for.”',
        reaction: 'Felt This',
        tagBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/90 dark:border-rose-800/60',
    },
    {
        id: 'achievement',
        author: 'Greeshmanth',
        handle: '@greeshmanth_k',
        category: 'Success Stories',
        readingTime: '1 min read',
        excerpt: '“I did not think I could overcome that difficult phase. Today marks two full years of rebuilding my life and standing on my own feet.”',
        reaction: 'Brave',
        tagBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/60',
    },
    {
        id: 'life-lesson',
        author: 'Sudeep',
        handle: '@sudeep_m',
        category: 'Life Lessons',
        readingTime: '3 min read',
        excerpt: '“I let go of my dream so she could pursue hers. It took years to realize that sacrifice was not a defeat, but love in its purest form.”',
        reaction: 'Holding Space',
        tagBg: 'bg-orange-50 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-200/90 dark:border-orange-800/60',
    },
    {
        id: 'healing-hope',
        author: 'Kiran',
        handle: '@kiran_b',
        category: 'Healing & Hope',
        readingTime: '2 min read',
        excerpt: '“The inner voice telling me I was broken was mistaken. Healing is never a straight line, but every sunrise is a quiet victory.”',
        reaction: 'Sending Warmth',
        tagBg: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/60',
    },
    {
        id: 'quiet-reflection',
        author: 'Karthik',
        handle: '@karthik_r',
        category: 'Quiet Reflections',
        readingTime: '2 min read',
        excerpt: '“I finally forgave them, not because what happened was okay, but because carrying that resentment was only poisoning my own spirit.”',
        reaction: 'Deeply Moved',
        tagBg: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/90 dark:border-indigo-800/60',
    },
    {
        id: 'gratitude',
        author: 'Tanush',
        handle: '@tanush_t',
        category: 'Moments of Gratitude',
        readingTime: '1 min read',
        excerpt: '“To the stranger on the train who noticed me holding back tears and offered a warm smile: you saved me on my lowest day.”',
        reaction: 'Pure Kindness',
        tagBg: 'bg-teal-50 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/90 dark:border-teal-800/60',
    },
    {
        id: 'new-chapter',
        author: 'Manoj',
        handle: '@manoj_s',
        category: 'New Beginnings',
        readingTime: '2 min read',
        excerpt: '“Starting fresh in a new town was daunting, but every quiet evening with my chai reminds me how resilient the human heart really is.”',
        reaction: 'Full Heart',
        tagBg: 'bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/90 dark:border-purple-800/60',
    },
    {
        id: 'brotherhood',
        author: 'Chaitanya',
        handle: '@chaitanya_p',
        category: 'Life Lessons',
        readingTime: '3 min read',
        excerpt: '“We did not speak for months out of stubborn ego. One simple phone call dissolved the silence and gave me my best friend back.”',
        reaction: 'Felt This',
        tagBg: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/60',
    },
    {
        id: 'quiet-courage',
        author: 'Pavan',
        handle: '@pavan_k',
        category: 'Quiet Courage',
        readingTime: '2 min read',
        excerpt: '“Saying no when everyone expected yes felt terrifying. But protecting my peace was the best decision I ever made for my sanity.”',
        reaction: 'Brave',
        tagBg: 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/90 dark:border-sky-800/60',
    },
    {
        id: 'gratitude-journey',
        author: 'Vivek',
        handle: '@vivek_r',
        category: 'Healing & Hope',
        readingTime: '2 min read',
        excerpt: '“When the doors kept closing, I learned to build my own window. Patience is not passive waiting; it is moving forward with quiet faith.”',
        reaction: 'Inspiring',
        tagBg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/90 dark:border-rose-800/60',
    }
];

// Physical layout geometry calibrated for generous readability and ensuring the second quote line is 100% visible
const CARD_HEIGHT = 108;
const CONTAINER_HEIGHT = 340;
const SLOT_Y = {
    0: 0,      // Slot 0 (Top card)
    1: 116,    // Slot 1 (Middle card)
    2: 232,    // Slot 2 (Bottom card)
    exit: -112 // Exit trajectory (Upward fade)
};

// Motion physics timing constants: Responsive cadence with swift and lively transitions
const SETTLE_DURATION = 360;
const REST_DURATION = 1100;

export default function AuthDemoStoryCards({ showHeader = true }) {
    // Initial seated stack of 3 cards:
    // Slot 0: Story 0 (Top)
    // Slot 1: Story 1 (Mid)
    // Slot 2: Story 2 (Bot)
    const [cards, setCards] = useState(() => [
        {
            instanceId: 'card-init-0',
            story: demoStories[0],
            cardIndex: 0,
            entrySide: 'RIGHT',
            slot: 0,
            isNew: false
        },
        {
            instanceId: 'card-init-1',
            story: demoStories[1],
            cardIndex: 1,
            entrySide: 'LEFT',
            slot: 1,
            isNew: false
        },
        {
            instanceId: 'card-init-2',
            story: demoStories[2],
            cardIndex: 2,
            entrySide: 'RIGHT',
            slot: 2,
            isNew: false
        }
    ]);

    const [isPaused, setIsPaused] = useState(false);
    const isPausedRef = useRef(false);
    isPausedRef.current = isPaused;

    const nextCardIndexRef = useRef(3);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const triggerNextCard = () => {
            // Respect hover pause for reader comfort
            if (isPausedRef.current) {
                timeoutRef.current = setTimeout(triggerNextCard, 500);
                return;
            }

            const nextIndex = nextCardIndexRef.current;
            // Strict alternating side-entry:
            // Even index enters from RIGHT, Odd index enters from LEFT
            const entrySide = nextIndex % 2 === 0 ? 'RIGHT' : 'LEFT';
            const storyIdx = nextIndex % demoStories.length;
            const nextStory = demoStories[storyIdx];
            nextCardIndexRef.current += 1;

            const newInstanceId = `card-${nextIndex}-${Date.now()}`;
            const newCard = {
                instanceId: newInstanceId,
                story: nextStory,
                cardIndex: nextIndex,
                entrySide,
                slot: 2,
                isNew: true
            };

            // Atomic state transition:
            // Card at Slot 2 -> Slot 1 (moves UP)
            // Card at Slot 1 -> Slot 0 (moves UP)
            // Card at Slot 0 -> Slot 'exit' (moves UP and dissolves into top blur)
            // New Card -> Slot 2 (enters from alternating side with depth blur unblurring)
            setCards((prev) => {
                const updated = prev.map((c) => {
                    if (c.slot === 2) {
                        return { ...c, slot: 1, isNew: false };
                    }
                    if (c.slot === 1) {
                        return { ...c, slot: 0, isNew: false };
                    }
                    if (c.slot === 0) {
                        return { ...c, slot: 'exit', isNew: false };
                    }
                    return c;
                });
                return [...updated, newCard];
            });

            // After spring settling completes, prune exited card and rest before next cycle
            timeoutRef.current = setTimeout(() => {
                setCards((prev) => prev.filter((c) => c.slot !== 'exit'));
                timeoutRef.current = setTimeout(triggerNextCard, REST_DURATION);
            }, SETTLE_DURATION);
        };

        // Swift initial delay before first conveyor shift
        timeoutRef.current = setTimeout(triggerNextCard, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div 
            className="w-full select-none"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Optional Header Track Indicator */}
            {showHeader && (
                <div className="w-full mb-2.5 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200">
                            Stories on HeartOut
                        </span>
                    </div>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                        Read what others feel
                    </span>
                </div>
            )}

            {/* Conveyor Canvas */}
            <div
                className="relative w-full overflow-hidden"
                style={{
                    height: `${CONTAINER_HEIGHT}px`
                }}
                aria-label="Community stories conveyor"
            >
                {cards.map((item) => {
                    const story = item.story;
                    const isExiting = item.slot === 'exit';

                    return (
                        <motion.div
                            key={item.instanceId}
                            initial={
                                item.isNew
                                    ? {
                                          x: item.entrySide === 'RIGHT' ? '115%' : '-115%',
                                          y: SLOT_Y[2],
                                          scale: 0.96,
                                          rotate: item.entrySide === 'RIGHT' ? 1.6 : -1.6,
                                          opacity: 0,
                                          filter: 'blur(6px)'
                                      }
                                    : false
                            }
                            animate={{
                                x: 0,
                                y: SLOT_Y[item.slot] ?? SLOT_Y.exit,
                                scale: isExiting ? 0.94 : 1,
                                rotate: 0,
                                opacity: isExiting ? 0 : 1,
                                filter: isExiting ? 'blur(10px)' : 'blur(0px)'
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 165,
                                damping: 18,
                                mass: 0.48,
                                opacity: {
                                    duration: isExiting ? 0.12 : 0.28,
                                    ease: 'easeOut'
                                },
                                filter: {
                                    duration: isExiting ? 0.12 : 0.26,
                                    ease: 'easeOut'
                                }
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${CARD_HEIGHT}px`,
                                willChange: 'transform, opacity, filter',
                                zIndex: isExiting ? 0 : item.slot === 0 ? 30 : item.slot === 1 ? 20 : 15,
                                pointerEvents: isExiting ? 'none' : 'auto'
                            }}
                            className="group cursor-pointer"
                        >
                            {/* Tactile Card Architecture with Multi-Layered Drop Shadow */}
                            <div className="w-full h-full rounded-[16px] bg-gradient-to-b from-[#FFFFFF] to-[#FAF6F1] dark:from-[#201D1A] dark:to-[#191715] p-2.5 sm:p-3 border border-[#E5DACB] dark:border-[#38332D] ring-1 ring-stone-900/[0.03] dark:ring-white/[0.05] shadow-[0_2px_10px_-2px_rgba(28,25,23,0.05),0_1px_3px_rgba(28,25,23,0.03),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_3px_12px_-2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] group-hover:shadow-[0_6px_18px_-3px_rgba(28,25,23,0.09),0_2px_6px_-1px_rgba(200,88,40,0.06),inset_0_1px_0_rgba(255,255,255,1)] group-hover:border-orange-300/80 dark:group-hover:border-orange-800/60 group-hover:-translate-y-0.5 transition-all duration-200 flex items-start gap-2.5 sm:gap-3">
                                
                                {/* In-App Profile Picture: First letter of author's name with avatarColors */}
                                {(() => {
                                     const firstLetter = (story.author?.[0] || 'A').toUpperCase();
                                     const avatarGradient = getAvatarColor(firstLetter);
                                     const textColor = getAvatarTextColor(firstLetter);
                                     const isLightText = textColor === 'text-white';
                                     return (
                                         <div
                                             className="relative shrink-0 self-center group/avatar"
                                             aria-label={`${story.author}'s profile avatar with initial ${firstLetter}`}
                                         >
                                             {/* Ambient soft glow matching in-app profile avatar in Profile.jsx */}
                                             <div className={`absolute -inset-0.5 bg-gradient-to-br ${avatarGradient} rounded-full blur-[2px] opacity-35 group-hover:opacity-70 transition-opacity`} />
                                             
                                             {/* Avatar circle matching in-app profile layout */}
                                             <div className={`relative w-[34px] h-[34px] sm:w-9 sm:h-9 min-w-[34px] min-h-[34px] sm:min-w-[36px] sm:min-h-[36px] aspect-square rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center ${textColor} font-heading font-extrabold text-[12.5px] sm:text-[13.5px] shadow-sm ring-1 ring-white/90 dark:ring-stone-800 select-none group-hover:scale-105 transition-transform duration-200 shrink-0`}>
                                                 <span className={`leading-none inline-block select-none ${isLightText ? 'drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.35)]' : 'drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]'}`}>
                                                     {firstLetter}
                                                 </span>
                                             </div>
                                         </div>
                                     );
                                })()}

                                {/* Story Content & Metadata Stack */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
                                    {/* Author Name, Category Tag & Reading Time */}
                                    <div className="flex items-center justify-between gap-1.5 min-w-0">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="font-heading font-bold text-xs sm:text-[12.5px] text-stone-900 dark:text-stone-100 truncate">
                                                {story.author}
                                            </span>
                                            <span className="text-stone-300 dark:text-stone-600 text-[9px] select-none">•</span>
                                            <span
                                                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] sm:text-[9.5px] font-semibold tracking-wide ${story.tagBg} truncate`}
                                            >
                                                {story.category}
                                            </span>
                                        </div>
                                        <span className="text-[9.5px] sm:text-[10px] text-stone-400 dark:text-stone-500 font-medium shrink-0">
                                            {story.readingTime}
                                        </span>
                                    </div>

                                    {/* Story Excerpt Quote: Generously spaced so second line is fully visible */}
                                    <p className="text-[11px] sm:text-xs text-stone-700 dark:text-stone-300 font-normal leading-[1.35] sm:leading-[1.38] line-clamp-2 my-0.5 sm:my-1 select-none">
                                        {story.excerpt}
                                    </p>

                                    {/* Card Footer: Reaction Tag & Handle */}
                                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800/60 text-[10px]">
                                        <span className="inline-flex items-center gap-1 font-medium text-stone-600 dark:text-stone-400">
                                            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500 group-hover:scale-125 transition-transform duration-200" />
                                            <span>
                                                Reacted:{' '}
                                                <strong className="font-semibold text-stone-800 dark:text-stone-200 bg-stone-100/90 dark:bg-stone-800/90 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/50 group-hover:text-rose-700 dark:group-hover:text-rose-300 px-1 py-0.5 rounded text-[9.5px] transition-colors">
                                                    {story.reaction}
                                                </strong>
                                            </span>
                                        </span>
                                        <span className="inline-flex items-center gap-0.5 text-stone-400 group-hover:text-[#C85828] dark:group-hover:text-[#E06E3E] transition-colors">
                                            <span className="text-[10px] font-medium">
                                                {story.handle}
                                            </span>
                                            <ArrowUpRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
