import React from 'react';
import { Trophy, Lightbulb, Mail, Heart, Sparkles, BookOpen, Check } from 'lucide-react';

const storyTypes = [
    {
        value: 'achievement',
        label: 'Success Stories',
        icon: Trophy,
        description: 'Something you survived, earned, or finally became.',
        preview: 'I didn\'t think I\'d make it. Today, I proved myself wrong.',
        color: 'from-amber-600 to-amber-700',
        bgColor: 'bg-amber-500/10 dark:bg-amber-950/20',
        borderColor: 'border-amber-200 dark:border-amber-800/40',
        hoverBorderColor: 'hover:border-amber-400 dark:hover:border-amber-700',
        textColor: 'text-amber-800 dark:text-amber-300',
        hoverTextColor: 'group-hover:text-amber-700',
        shadowColor: 'shadow-amber-500/10',
        chartColor: '#d97706',
        canonicalBg: 'bg-amber-600',
        accentBg: 'bg-amber-100/70 dark:bg-amber-950/40',
        accentText: 'text-amber-700 dark:text-amber-300'
    },
    {
        value: 'confession',
        label: 'Dreams',
        icon: Sparkles,
        description: 'What you\'re still reaching for.',
        preview: 'One day, they will know my name.',
        color: 'from-amber-500 to-orange-500',
        bgColor: 'bg-orange-500/10 dark:bg-orange-950/20',
        borderColor: 'border-orange-200 dark:border-orange-800/40',
        hoverBorderColor: 'hover:border-orange-400 dark:hover:border-orange-700',
        textColor: 'text-orange-800 dark:text-orange-300',
        hoverTextColor: 'group-hover:text-orange-700',
        shadowColor: 'shadow-orange-500/10',
        chartColor: '#ea580c',
        canonicalBg: 'bg-orange-600',
        accentBg: 'bg-orange-100/70 dark:bg-orange-950/40',
        accentText: 'text-orange-700 dark:text-orange-300'
    },
    {
        value: 'regret',
        label: 'Life Lessons',
        icon: Lightbulb,
        description: 'The hard ones. The ones that changed you.',
        preview: 'It broke my heart, but it opened my eyes.',
        color: 'from-[#c1714a] to-[#a25936]',
        bgColor: 'bg-[#c1714a]/10 dark:bg-[#c1714a]/20',
        borderColor: 'border-[#c1714a]/30 dark:border-[#c1714a]/40',
        hoverBorderColor: 'hover:border-[#c1714a]/60 dark:hover:border-[#c1714a]/60',
        textColor: 'text-[#9c4c26] dark:text-[#e49876]',
        hoverTextColor: 'group-hover:text-[#9c4c26]',
        shadowColor: 'shadow-[#c1714a]/10',
        chartColor: '#c1714a',
        canonicalBg: 'bg-[#c1714a]',
        accentBg: 'bg-[#c1714a]/15 dark:bg-[#c1714a]/25',
        accentText: 'text-[#9c4c26] dark:text-[#e49876]'
    },
    {
        value: 'unsent_letter',
        label: 'Unsent Letters',
        icon: Mail,
        description: 'To the person you never got to tell.',
        preview: 'I still look for your car in every parking lot.',
        color: 'from-[#9e5a5a] to-[#7f4242]',
        bgColor: 'bg-[#9e5a5a]/10 dark:bg-[#9e5a5a]/20',
        borderColor: 'border-[#9e5a5a]/30 dark:border-[#9e5a5a]/40',
        hoverBorderColor: 'hover:border-[#9e5a5a]/60 dark:hover:border-[#9e5a5a]/60',
        textColor: 'text-[#844343] dark:text-[#df9f9f]',
        hoverTextColor: 'group-hover:text-[#844343]',
        shadowColor: 'shadow-[#9e5a5a]/10',
        chartColor: '#9e5a5a',
        canonicalBg: 'bg-[#9e5a5a]',
        accentBg: 'bg-[#9e5a5a]/15 dark:bg-[#9e5a5a]/25',
        accentText: 'text-[#844343] dark:text-[#df9f9f]'
    },
    {
        value: 'sacrifice',
        label: 'Sacrifices',
        icon: Heart,
        description: 'What it cost you to get here.',
        preview: 'I let go of my dream so she could have hers.',
        color: 'from-rose-700 to-rose-800',
        bgColor: 'bg-rose-500/10 dark:bg-rose-950/20',
        borderColor: 'border-rose-200 dark:border-rose-800/40',
        hoverBorderColor: 'hover:border-rose-400 dark:hover:border-rose-700',
        textColor: 'text-rose-900 dark:text-rose-300',
        hoverTextColor: 'group-hover:text-rose-800',
        shadowColor: 'shadow-rose-700/10',
        chartColor: '#991b1b',
        canonicalBg: 'bg-rose-800',
        accentBg: 'bg-rose-100/70 dark:bg-rose-950/40',
        accentText: 'text-rose-800 dark:text-rose-300'
    },
    {
        value: 'other',
        label: 'Quiet Confessions',
        icon: BookOpen,
        description: 'The things you\'ve never said out loud.',
        preview: 'I\'m terrified they\'ll find out I\'m making it up as I go.',
        color: 'from-stone-700 to-stone-800',
        bgColor: 'bg-stone-500/10 dark:bg-stone-900/40',
        borderColor: 'border-stone-200 dark:border-stone-800',
        hoverBorderColor: 'hover:border-stone-400 dark:hover:border-stone-700',
        textColor: 'text-stone-900 dark:text-stone-200',
        hoverTextColor: 'group-hover:text-stone-900',
        shadowColor: 'shadow-stone-800/10',
        chartColor: '#57534e',
        canonicalBg: 'bg-stone-800',
        accentBg: 'bg-stone-100 dark:bg-stone-800/60',
        accentText: 'text-stone-800 dark:text-stone-200'
    }
];

export default function StoryTypeSelector({ selected, onChange, variant = 'cards' }) {
    if (variant === 'tabs') {
        return (
            <div className="flex gap-2 p-1 overflow-x-auto scrollbar-none">
                {storyTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.value;

                    return (
                        <button
                            key={type.value}
                            onClick={() => onChange(type.value)}
                            title={type.label}
                            className={`
                                group relative flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0
                                ${isSelected
                                    ? 'bg-[#2D2621] text-white dark:bg-[#FAF6F0] dark:text-[#181614] shadow-sm'
                                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/80 dark:hover:bg-zinc-800/60'
                                }
                            `}
                        >
                            <Icon strokeWidth={1.75} className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-amber-400 dark:text-[#C85828]' : 'text-stone-500 dark:text-stone-400'}`} />
                            <span>
                                {type.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        );
    }

    // High-End Sanctuary Cards variant
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {storyTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selected === type.value;

                return (
                    <button
                        key={type.value}
                        type="button"
                        onClick={() => onChange(type.value)}
                        className={`
                            group relative p-5 sm:p-6 rounded-2xl text-left flex flex-col justify-between h-full transition-all duration-300
                            ${isSelected
                                ? 'bg-[#FFF9F3] dark:bg-[#201B17] border-2 border-[#C85828] dark:border-[#E07A48] shadow-[0_8px_24px_rgba(200,88,40,0.12)]'
                                : 'bg-[#FFFDF9] dark:bg-[#181614] border border-[#EADDCF] dark:border-[#2C2723] hover:border-[#D4832D]/70 dark:hover:border-[#D4832D]/60 hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(200,140,90,0.08)]'
                            }
                        `}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {/* Top: Icon + Selection Badge */}
                        <div className="flex items-start justify-between gap-3 w-full mb-3">
                            <div className={`
                                w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300
                                ${isSelected 
                                    ? 'bg-[#C85828] text-white shadow-sm' 
                                    : `${type.accentBg} ${type.accentText} group-hover:scale-105`
                                }
                            `}>
                                <Icon className="w-5 h-5 stroke-[1.75]" />
                            </div>

                            {isSelected ? (
                                <div className="w-6 h-6 rounded-full bg-[#C85828] text-white flex items-center justify-center shadow-sm animate-scale-in">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                            ) : (
                                <div className="w-6 h-6 rounded-full border border-stone-200 dark:border-stone-700 group-hover:border-stone-400 dark:group-hover:border-stone-500 transition-colors" />
                            )}
                        </div>

                        {/* Title & Description */}
                        <div className="w-full">
                            <h3 className={`font-heading text-base sm:text-lg font-semibold mb-1.5 transition-colors ${
                                isSelected ? 'text-stone-900 dark:text-stone-50' : 'text-stone-800 dark:text-stone-100 group-hover:text-stone-900'
                            }`}>
                                {type.label}
                            </h3>

                            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-4">
                                {type.description}
                            </p>
                        </div>

                        {/* Bottom Literary Preview Quote */}
                        <div className={`
                            w-full pt-3 border-t border-dashed transition-colors
                            ${isSelected ? 'border-amber-300 dark:border-amber-900/60' : 'border-[#EADDCF] dark:border-[#2C2723]'}
                        `}>
                            <p className="font-stories italic text-xs text-stone-600 dark:text-stone-400 leading-relaxed pl-2.5 border-l-2 border-amber-500/40 line-clamp-2">
                                "{type.preview}"
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export { storyTypes };
