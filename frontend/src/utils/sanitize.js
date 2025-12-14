/**
 * Content Sanitization Utilities
 * Prevents XSS attacks by sanitizing user-generated content.
 */
import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * @param {string} dirty - Potentially unsafe HTML content
 * @returns {string} Sanitized HTML safe for rendering
 */
export function sanitizeHtml(dirty) {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'strike', 's',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'blockquote', 'pre', 'code',
            'a', 'span', 'div'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
        ALLOW_DATA_ATTR: false,
        ADD_ATTR: ['target'], // Allow target for links
        FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input'],
        FORBID_ATTR: ['onclick', 'onerror', 'onload', 'onmouseover'],
    });
}

/**
 * Sanitize plain text - strips ALL HTML tags.
 * Use for content that should never contain HTML.
 * @param {string} dirty - Potentially unsafe text
 * @returns {string} Plain text with no HTML
 */
export function sanitizeText(dirty) {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [], // No tags allowed
        ALLOWED_ATTR: [],
    });
}

/**
 * Sanitize content for safe innerHTML rendering.
 * Returns object compatible with React's dangerouslySetInnerHTML.
 * @param {string} dirty - Potentially unsafe HTML content
 * @returns {object} Object with __html property
 */
export function createSafeMarkup(dirty) {
    return {
        __html: sanitizeHtml(dirty)
    };
}

/**
 * Escape HTML entities for display as text.
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return text.replace(/[&<>"']/g, char => htmlEntities[char]);
}

export default {
    sanitizeHtml,
    sanitizeText,
    createSafeMarkup,
    escapeHtml,
};
