import { Article, Category } from '../types';

/**
 * Dynamically updates document title, Open Graph tags, Twitter card tags,
 * and canonical link for SEO and rich social sharing previews (WhatsApp, Twitter, LinkedIn, Facebook, Telegram).
 */
export function updatePageSEO(options: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: Article;
}) {
  if (typeof document === 'undefined') return;

  const defaultTitle = 'ClementTrends — Insights, Trends & Ideas for a Smarter Future';
  const defaultDesc = 'Premium insights on Blockchain, AI, Digital Marketing, Technology, Product Reviews, and Business for Nigeria, Africa, and global readers.';
  const defaultImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
  const defaultUrl = typeof window !== 'undefined' ? window.location.href : 'https://clementtrends.com.ng';

  const pageTitle = options.title
    ? (options.title.includes('ClementTrends') ? options.title : `${options.title} | ClementTrends`)
    : defaultTitle;
  const pageDesc = options.description || defaultDesc;
  const pageImage = options.image || defaultImage;
  const pageUrl = options.url || defaultUrl;
  const pageType = options.type || (options.article ? 'article' : 'website');

  // 1. Update Browser Window / Tab Document Title
  document.title = pageTitle;

  // Helper to set or create meta tag by selector
  const setMetaTag = (selector: string, attr: 'name' | 'property', attrValue: string, content: string) => {
    let el = document.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 2. Standard Meta Description
  setMetaTag('meta[name="description"]', 'name', 'description', pageDesc);

  // 3. Open Graph (Facebook, WhatsApp, LinkedIn, Discord, Telegram, iMessage)
  setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
  setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDesc);
  setMetaTag('meta[property="og:image"]', 'property', 'og:image', pageImage);
  setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
  setMetaTag('meta[property="og:type"]', 'property', 'og:type', pageType);
  setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'ClementTrends');

  // 4. Twitter Card (X / Twitter rich previews with large image)
  setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
  setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
  setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDesc);
  setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', pageImage);
  setMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', pageUrl);

  // 5. Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', pageUrl);

  // 6. Structured Schema.org Article Data for Google Search & Rich Results
  if (options.article) {
    const art = options.article;
    const schemaId = 'article-structured-data';
    let schemaScript = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = schemaId;
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }

    const schemaData = {
      '@context': 'https://schema.org',
      '@type': art.seo?.schemaType || 'NewsArticle',
      'headline': art.title,
      'description': art.excerpt,
      'image': [art.coverImage || pageImage],
      'datePublished': art.publishedAt,
      'dateModified': art.updatedAt || art.publishedAt,
      'author': {
        '@type': 'Person',
        'name': art.author.name,
        'url': 'https://clementtrends.com.ng/about'
      },
      'publisher': {
        '@type': 'NewsMediaOrganization',
        'name': 'ClementTrends',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://clementtrends.com.ng/logo.png'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageUrl
      }
    };

    schemaScript.textContent = JSON.stringify(schemaData);
  } else {
    // Remove specific article schema if navigating to general page
    const existingSchema = document.getElementById('article-structured-data');
    if (existingSchema) {
      existingSchema.remove();
    }
  }
}

/**
 * Resets the SEO metadata back to default ClementTrends homepage settings
 */
export function resetDefaultSEO() {
  updatePageSEO({
    title: 'ClementTrends — Insights, Trends & Ideas for a Smarter Future',
    description: 'ClementTrends is a premium digital media and knowledge publication covering Blockchain News, Blockchain Fortune, AI, Digital Marketing, Technology, Product Reviews, Business, and Personal Growth.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://clementtrends.com.ng',
    type: 'website'
  });
}
