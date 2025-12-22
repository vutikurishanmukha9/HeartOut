import { Link } from 'react-router-dom';

/**
 * Skip to Main Content Link
 * 
 * Accessibility feature that allows keyboard users to skip
 * navigation and jump directly to main content.
 * 
 * Hidden visually but accessible to screen readers and keyboard.
 * Becomes visible when focused.
 */
export default function SkipToContent({ targetId = 'main-content' }) {
    return (
        <Link
            to={`#${targetId}`}
            className="
                sr-only focus:not-sr-only
                focus:absolute focus:top-4 focus:left-4 focus:z-[9999]
                focus:px-6 focus:py-3 focus:rounded-xl
                focus:bg-primary-600 focus:text-white
                focus:font-semibold focus:shadow-lg
                focus:outline-none focus:ring-4 focus:ring-primary-400
                focus:animate-fade-in
                transition-all
            "
            onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(targetId);
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }}
        >
            Skip to main content
        </Link>
    );
}

/**
 * Visually Hidden Component
 * Content is hidden visually but accessible to screen readers.
 */
export function VisuallyHidden({ children, as: Component = 'span' }) {
    return (
        <Component className="sr-only">
            {children}
        </Component>
    );
}

/**
 * Live Region for Screen Reader Announcements
 * Use for dynamic content that should be announced.
 */
export function LiveRegion({ children, politeness = 'polite' }) {
    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            className="sr-only"
        >
            {children}
        </div>
    );
}
