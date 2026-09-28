import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Feather, Clock, Share2, Check, Copy, Globe, Sparkles } from 'lucide-react';
import haptic from '../utils/haptics';

export const SITE_NAME = 'HeartOut';
export const DEFAULT_TAGLINE = 'Where Every Story Finds Sanctuary';
export const DEFAULT_DESCRIPTION =
  'An anonymous, emotionally authentic sanctuary to share raw reflections, unspoken confessions, heartfelt dreams, and enduring memories.';

/**
 * Resolve canonical site origin safely across client and SSR environments
 */
export const getSiteUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return import.meta.env?.VITE_APP_URL || 'https://heartout.in';
};

export const SITE_URL = getSiteUrl();

/**
 * Category-specific metadata definitions
 * Aligned with HeartOut's authentic story categories with legacy fallback support.
 */
export const CATEGORY_META = {
  vent: {
    label: 'Vent',
    description: 'A cathartic unburdening of raw emotions in the HeartOut anonymous sanctuary.',
    badgeColor: 'text-[#8C3A16] dark:text-[#E8A87C] bg-[#C85828]/10 border-[#C85828]/25',
  },
  confession: {
    label: 'Confession',
    description: 'An honest, whispered truth shared in the HeartOut anonymous sanctuary.',
    badgeColor: 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/25',
  },
  dream: {
    label: 'Dream',
    description: 'Aspirations, nocturnal hopes, and future desires shared in the HeartOut sanctuary.',
    badgeColor: 'text-stone-700 dark:text-stone-300 bg-stone-500/10 border-stone-500/25',
  },
  memory: {
    label: 'Memory',
    description: 'A nostalgic reflection on past moments and cherished chapters in HeartOut.',
    badgeColor: 'text-stone-800 dark:text-stone-200 bg-stone-400/15 border-stone-400/30',
  },
  other: {
    label: 'Reflection',
    description: 'An authentic personal narrative shared anonymously in the HeartOut Sanctuary.',
    badgeColor: 'text-[#8C3A16] dark:text-[#E8A87C] bg-[#C85828]/10 border-[#C85828]/25',
  },
  // Legacy category mappings for complete backward compatibility
  achievement: {
    label: 'Achievement',
    description: 'A personal milestone and quiet victory shared in the HeartOut sanctuary.',
    badgeColor: 'text-[#8C3A16] dark:text-[#E8A87C] bg-[#C85828]/10 border-[#C85828]/25',
  },
  regret: {
    label: 'Regret',
    description: 'A heartfelt reflection on difficult choices and lessons learned in HeartOut.',
    badgeColor: 'text-stone-700 dark:text-stone-300 bg-stone-500/10 border-stone-500/25',
  },
  unsent_letter: {
    label: 'Unsent Letter',
    description: 'Unspoken words and private letters released into the HeartOut sanctuary.',
    badgeColor: 'text-amber-800 dark:text-amber-300 bg-amber-500/10 border-amber-500/25',
  },
  sacrifice: {
    label: 'Sacrifice',
    description: 'A poignant account of sacrifices made and endurance shared on HeartOut.',
    badgeColor: 'text-stone-800 dark:text-stone-200 bg-stone-400/15 border-stone-400/30',
  },
  life_story: {
    label: 'Life Story',
    description: 'A profound journey through life chapters shared on the HeartOut sanctuary.',
    badgeColor: 'text-[#8C3A16] dark:text-[#E8A87C] bg-[#C85828]/10 border-[#C85828]/25',
  },
};

/**
 * Architectural Social Card Preview Component
 * Renders an exact, non-generic sanctuary visual preview of how this story appears
 * when shared across messaging platforms, social timelines, and rich search cards.
 */
export function SocialPreviewCard({
  story,
  title,
  description,
  url,
  image,
  compact = false,
}) {
  const [copied, setCopied] = useState(false);

  const currentCategory = story?.story_type
    ? CATEGORY_META[story.story_type] || CATEGORY_META.other
    : CATEGORY_META.other;

  const displayTitle = title || story?.title || DEFAULT_TAGLINE;
  const displayDesc =
    description ||
    (story?.content
      ? story.content.substring(0, 160).trim() + (story.content.length > 160 ? '...' : '')
      : currentCategory.description);

  const displayUrl = url || (story?.id ? `${SITE_URL}/story/${story.id}` : SITE_URL);
  const authorName = story?.is_anonymous
    ? 'Anonymous Soul'
    : story?.author?.display_name || story?.author?.username || 'Anonymous Soul';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      haptic.success();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write errors
    }
  };

  if (compact) {
    return (
      <div className="p-3.5 rounded-xl bg-[#FFFDF9] dark:bg-[#141210] border border-[#E8DDD0] dark:border-[#2D2621] shadow-[0_2px_12px_rgba(20,10,5,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#C85828] dark:text-amber-400 font-semibold">
            {currentCategory.label}
          </span>
          <span className="font-mono text-[9px] text-stone-400">heartout.in</span>
        </div>
        <h4 className="font-heading font-semibold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate mb-1">
          {displayTitle}
        </h4>
        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
          {displayDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl bg-[#FFFDF9] dark:bg-[#141210] border border-[#E8DDD0] dark:border-[#2D2621] rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(20,10,5,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-all">
      {/* Masthead Label */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#E8DDD0] dark:border-[#26211C]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C85828] dark:bg-amber-400" />
          <span className="font-heading font-semibold text-xs tracking-tight text-stone-800 dark:text-stone-200">
            {SITE_NAME} Social Card Preview
          </span>
        </div>
        <span
          className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border font-medium ${currentCategory.badgeColor}`}
        >
          {currentCategory.label}
        </span>
      </div>

      {/* Main Content Preview */}
      <div className="space-y-2 mb-4">
        <h3 className="font-stories text-xl sm:text-2xl font-normal leading-snug tracking-tight text-stone-900 dark:text-stone-100">
          {displayTitle}
        </h3>
        <p className="font-body text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
          {displayDesc}
        </p>
      </div>

      {/* Footer Metadata & Action */}
      <div className="pt-3 border-t border-[#E8DDD0] dark:border-[#26211C] flex items-center justify-between flex-wrap gap-2 text-xs text-stone-500 dark:text-stone-400">
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <div className="flex items-center gap-1 text-stone-700 dark:text-stone-300">
            <Feather className="w-3.5 h-3.5 text-[#C85828] dark:text-amber-400" />
            <span>{authorName}</span>
          </div>
          <span>•</span>
          <span>heartout.in</span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold
            transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#C85828]
            ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-[#FAF5EF] dark:bg-[#1C1815] border-[#E8DDD0] dark:border-[#2D2621] text-stone-700 dark:text-stone-300 hover:border-amber-400/50 hover:text-stone-900 dark:hover:text-stone-100'
            }
          `}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Link Copied' : 'Copy Share Link'}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Sanctuary SEO Dynamic Head & Schema Component
 * Sets up full OpenGraph, Twitter Cards, canonical links, and JSON-LD structured data.
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
  modifiedTime,
  noIndex = false,
  tags = [],
  readingTime,
  children,
}) {
  const categoryMeta = storyType ? CATEGORY_META[storyType] || CATEGORY_META.other : null;

  const resolvedOrigin = getSiteUrl();
  const finalTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | ${DEFAULT_TAGLINE}`;
  const finalDescription = description || categoryMeta?.description || DEFAULT_DESCRIPTION;
  const finalUrl = url || resolvedOrigin;
  const finalImage = image || `${resolvedOrigin}/og-image.png`;
  const authorName = author || 'Anonymous Soul';

  // Construct comprehensive JSON-LD Structured Data
  const structuredData =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title || finalTitle,
          description: finalDescription,
          image: [finalImage],
          author: {
            '@type': 'Person',
            name: authorName,
          },
          publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            logo: {
              '@type': 'ImageObject',
              url: `${resolvedOrigin}/logo.png`,
            },
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': finalUrl,
          },
          articleSection: categoryMeta?.label || storyType || 'Reflection',
          keywords: tags.join(', '),
          ...(readingTime ? { timeRequired: `PT${readingTime}M` } : {}),
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: resolvedOrigin,
          description: DEFAULT_DESCRIPTION,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${resolvedOrigin}/feed/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };

  return (
    <Helmet>
      {/* Standard Document Metadata */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Theme Color (Sanctuary Light & Dark Mode) */}
      <meta name="theme-color" content="#FFFDF9" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#141210" media="(prefers-color-scheme: dark)" />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* Open Graph Meta Tags (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@HeartOutApp" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalTitle} />

      {/* Article Specific Metadata */}
      {type === 'article' && author && <meta property="article:author" content={authorName} />}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (storyType || categoryMeta?.label) && (
        <meta property="article:section" content={categoryMeta?.label || storyType} />
      )}
      {tags.map((tag, idx) => (
        <meta key={idx} property="article:tag" content={tag} />
      ))}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      {/* Additional Child Elements */}
      {children}
    </Helmet>
  );
}

/**
 * Pre-configured SEO for Sanctuary Homepage
 */
export function HomeSEO() {
  return (
    <SEO
      title="Sanctuary"
      description="HeartOut is a peaceful sanctuary to share raw reflections, unspoken truths, and heartfelt stories with genuine anonymity."
    />
  );
}

/**
 * Pre-configured SEO for Stories Feed
 */
export function FeedSEO() {
  return (
    <SEO
      title="Community Stories & Reflections"
      description="Explore heartfelt vents, whispered confessions, quiet dreams, and tender memories from our empathetic community."
    />
  );
}

/**
 * Pre-configured SEO for Sign In Page
 */
export function LoginSEO() {
  return (
    <SEO
      title="Sign In to Sanctuary"
      description="Access your confidential HeartOut account to reflect, draft, and engage with the community."
      noIndex={true}
    />
  );
}

/**
 * Pre-configured SEO for Account Creation Page
 */
export function RegisterSEO() {
  return (
    <SEO
      title="Join the Sanctuary"
      description="Begin your anonymous journey on HeartOut. Express your genuine self in a safe, judgment-free space."
      noIndex={true}
    />
  );
}

/**
 * Pre-configured SEO for Profile View
 */
export function ProfileSEO({ username, storyCount }) {
  return (
    <SEO
      title={username ? `${username}'s Sanctuary Profile` : 'Sanctuary Profile'}
      description={
        username
          ? `Discover written reflections and shared moments by ${username} on HeartOut (${storyCount || 0} stories shared).`
          : 'View your profile and written reflections in the HeartOut sanctuary.'
      }
    />
  );
}

/**
 * Dynamic Story SEO for Social Timeline & Search Indexing
 */
export function StorySEO({ story }) {
  if (!story) return null;

  const categoryMeta = CATEGORY_META[story.story_type] || CATEGORY_META.other;

  // Extract clean snippet from markdown / raw content
  const preview = story.content
    ? story.content.replace(/<[^>]*>?/gm, '').substring(0, 155).trim() +
      (story.content.length > 155 ? '...' : '')
    : categoryMeta.description;

  const authorName = story.is_anonymous
    ? 'Anonymous Soul'
    : story.author?.display_name || story.author?.username || 'Anonymous Soul';

  return (
    <SEO
      title={story.title}
      description={preview}
      type="article"
      url={`${SITE_URL}/story/${story.id}`}
      storyType={story.story_type}
      author={authorName}
      publishedTime={story.created_at || story.published_at}
      modifiedTime={story.updated_at}
      tags={story.tags || []}
      readingTime={story.reading_time || 1}
    />
  );
}
