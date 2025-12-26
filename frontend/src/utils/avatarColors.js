// Avatar colors based on alphabet letters
// Each color carries symbolic meaning

const letterColors = {
    'A': 'from-red-700 to-red-600',           // Deep Red - grounded, origin, courage
    'B': 'from-blue-500 to-blue-600',         // Calm Blue - trust, steadiness
    'C': 'from-yellow-400 to-yellow-500',     // Soft Yellow - clarity, warmth
    'D': 'from-amber-700 to-amber-800',       // Earth Brown - weight, reality
    'E': 'from-green-500 to-green-600',       // Leaf Green - growth, continuity
    'F': 'from-purple-400 to-purple-500',     // Muted Purple - reflection, depth
    'G': 'from-orange-600 to-orange-700',     // Burnt Orange - change, motion
    'H': 'from-pink-300 to-pink-400',         // Dusty Pink - empathy, tenderness
    'I': 'from-gray-100 to-gray-200',         // Off-White - space, pause
    'J': 'from-teal-500 to-teal-600',         // Teal - balance, curiosity
    'K': 'from-slate-500 to-slate-600',       // Slate Gray - neutral strength
    'L': 'from-lime-400 to-lime-500',         // Lime Green - renewal, lightness
    'M': 'from-rose-800 to-rose-900',         // Maroon - gravity, memory
    'N': 'from-blue-800 to-blue-900',         // Navy Blue - introspection, night-thoughts
    'O': 'from-gray-800 to-gray-900',         // Charcoal Black - containment, silence
    'P': 'from-orange-300 to-orange-400',     // Peach - openness, vulnerability
    'Q': 'from-cyan-400 to-cyan-500',         // Aqua - rare, searching
    'R': 'from-red-600 to-red-700',           // Crimson - emotion, intensity
    'S': 'from-gray-400 to-gray-500',         // Silver Gray - distance, wisdom
    'T': 'from-amber-400 to-amber-500',       // Warm Tan - stability, patience
    'U': 'from-violet-500 to-violet-600',     // Violet - inner world
    'V': 'from-indigo-600 to-indigo-700',     // Indigo - depth, intuition
    'W': 'from-yellow-500 to-amber-500',      // Soft Gold - worth, resilience
    'X': 'from-cyan-500 to-cyan-600',         // Cyan - unknown, crossing paths
    'Y': 'from-amber-500 to-amber-600',       // Amber - attention, meaning
    'Z': 'from-fuchsia-500 to-fuchsia-600',   // Magenta - edge, individuality
};

// Get text color based on background brightness
const lightBackgrounds = ['C', 'H', 'I', 'L', 'P', 'S', 'W'];

export function getAvatarColor(letter) {
    const upperLetter = (letter || 'A').toUpperCase();
    return letterColors[upperLetter] || letterColors['A'];
}

export function getAvatarTextColor(letter) {
    const upperLetter = (letter || 'A').toUpperCase();
    return lightBackgrounds.includes(upperLetter)
        ? 'text-gray-800'
        : 'text-white';
}

export default { getAvatarColor, getAvatarTextColor };
