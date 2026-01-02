/**
 * Parse a date string, ensuring UTC timestamps are handled correctly
 * Backend returns timestamps in UTC without 'Z' suffix, so we append it
 * @param {string} dateString - ISO date string
 * @returns {Date} Parsed Date object
 */
function parseUTCDate(dateString) {
    if (!dateString) return new Date();
    // If the date string doesn't have timezone info, assume it's UTC
    if (!dateString.endsWith('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
        return new Date(dateString + 'Z');
    }
    return new Date(dateString);
}

/**
 * Format a date string to a human-readable relative time
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatRelativeDate(dateString) {
    const date = parseUTCDate(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format a date to a full readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted full date string
 */
export function formatFullDate(dateString) {
    const date = parseUTCDate(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format a date for comments (shorter format)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export function formatCommentDate(dateString) {
    const date = parseUTCDate(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
