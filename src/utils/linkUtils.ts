/**
 * Generates personal permalinks and direct shareable URLs for articles
 */

export function getArticlePersonalUrl(slug: string): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    return `${origin}/?article=${encodeURIComponent(slug)}`;
  }
  return `https://clementtrends.com.ng/?article=${encodeURIComponent(slug)}`;
}

export function getCategoryPersonalUrl(categorySlug: string): string {
  if (typeof window !== 'undefined' && window.location) {
    const origin = window.location.origin;
    return `${origin}/?category=${encodeURIComponent(categorySlug)}`;
  }
  return `https://clementtrends.com.ng/?category=${encodeURIComponent(categorySlug)}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older environments
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
