import { Helmet } from 'react-helmet-async';

/**
 * SEO Component for Dynamic Meta Tags
 * 
 * Generates Open Graph and Twitter Card meta tags for:
 * - WhatsApp link previews
 * - Twitter/X card previews
 * - Facebook sharing
 * - LinkedIn sharing
 * - General SEO
 */

const SITE_NAME = 'HeartOut';
const SITE_URL = 'https://heartout.vercel.app'; // Update with your actual domain

// Category-specific descriptions
const CATEGORY_META = {
    achievement: {
        description: 'A HeartOut story about Achievements - celebrating victories and milestones.',
    },
    regret: {
        description: 'A HeartOut story about Regrets - lessons from difficult experiences.',
    },
    unsent_letter: {
        description: 'A HeartOut story - an Unsent Letter expressing words never said.',
    },
    sacrifice: {
        description: 'A HeartOut story about Sacrifices - documenting what was given up.',
    },
    life_story: {
        description: 'A HeartOut Life Story - sharing a personal journey.',
    },
    other: {
        description: 'A personal story shared on HeartOut.',
    },
};

/**
 * Generate SEO meta tags for any page
 * 
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} props.description - Meta description
 * @param {string} props.type - og:type (website, article, etc.)
 * @param {string} props.url - Canonical URL
 * @param {string} props.image - Open Graph image URL
 * @param {string} props.storyType - Story category for dynamic descriptions
 * @param {string} props.author - Author name for articles
 * @param {string} props.publishedTime - ISO date for articles
 */
export default function SEO({
    title,
    description,
    type = 'website',
    url,
    image,
    storyType,
    author,
    publishedTime,
    noIndex = false,
}) {
    // Generate category-aware description if story type is provided
    const categoryMeta = storyType ? CATEGORY_META[storyType] || CATEGORY_META.other : null;

    const finalTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const finalDescription = description || categoryMeta?.description || 'Where every story matters. Share your authentic stories anonymously.';
    const finalUrl = url || SITE_URL;
    const finalImage = image || `${SITE_URL}/og-image.png`; // Default OG image

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <link rel="canonical" href={finalUrl} />

            {/* Open Graph Tags (Facebook, WhatsApp, LinkedIn) */}
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />

            {/* Article-specific tags */}
            {type === 'article' && author && (
                <meta property="article:author" content={author} />
            )}
            {type === 'article' && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === 'article' && storyType && (
                <meta property="article:section" content={storyType} />
            )}

            {/* JSON-LD Structured Data for Rich Results */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": type === 'article' ? "Article" : "WebSite",
                    ...(type === 'article' ? {
                        "headline": title,
                        "description": finalDescription,
                        "image": finalImage,
                        "author": {
                            "@type": "Person",
                            "name": author || "Anonymous"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": SITE_NAME,
                            "logo": {
                                "@type": "ImageObject",
                                "url": `${SITE_URL}/favicon.png`
                            }
                        },
                        "datePublished": publishedTime,
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": finalUrl
                        },
                        "articleSection": storyType
                    } : {
                        "name": SITE_NAME,
                        "url": SITE_URL,
                        "description": "Where every story matters. Share your authentic stories anonymously.",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": `${SITE_URL}/feed?search={search_term_string}`,
                            "query-input": "required name=search_term_string"
                        }
                    })
                })}
            </script>
        </Helmet>
    );
}

/**
 * Pre-configured SEO for common pages
 */
export function HomeSEO() {
    return (
        <SEO
            title="Home"
            description="HeartOut - Where every story matters. Share your authentic stories anonymously in a safe, supportive community."
        />
    );
}

export function FeedSEO() {
    return (
        <SEO
            title="Stories"
            description="Discover heartfelt stories from our community. Read achievements, regrets, unsent letters, and more on HeartOut."
        />
    );
}

export function LoginSEO() {
    return (
        <SEO
            title="Sign In"
            description="Sign in to HeartOut to share your story and connect with our supportive community."
            noIndex={true}
        />
    );
}

export function RegisterSEO() {
    return (
        <SEO
            title="Create Account"
            description="Join HeartOut today. Create your account and start sharing your authentic stories anonymously."
            noIndex={true}
        />
    );
}

export function ProfileSEO({ username, storyCount }) {
    return (
        <SEO
            title={username ? `${username}'s Profile` : 'Profile'}
            description={username
                ? `${username}'s stories on HeartOut. ${storyCount || 0} stories shared.`
                : 'View your profile and stories on HeartOut.'
            }
        />
    );
}

/**
 * Dynamic Story SEO - The main use case for social sharing
 */
export function StorySEO({ story }) {
    if (!story) return null;

    const categoryMeta = CATEGORY_META[story.story_type] || CATEGORY_META.other;

    // Create compelling preview description
    const preview = story.content
        ? story.content.substring(0, 150).trim() + (story.content.length > 150 ? '...' : '')
        : categoryMeta.description;

    return (
        <SEO
            title={story.title}
            description={preview}
            type="article"
            url={`${SITE_URL}/story/${story.id}`}
            storyType={story.story_type}
            author={story.is_anonymous ? 'Anonymous' : story.author?.display_name}
            publishedTime={story.published_at}
        />
    );
}
