import React, { useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ReadingProgress } from '../components/public/ReadingProgress';
import { SocialShare } from '../components/public/SocialShare';
import { ArticlePermalinkCard } from '../components/public/ArticlePermalinkCard';
import { TableOfContents } from '../components/public/TableOfContents';
import { AuthorCard } from '../components/public/AuthorCard';
import { CommentsSection } from '../components/public/CommentsSection';
import { ArticleCard } from '../components/public/ArticleCard';
import { ReviewCard } from '../components/public/ReviewCard';
import { AdvertisementSlot } from '../components/layout/AdvertisementSlot';
import {
  Clock,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Bookmark,
  ExternalLink,
  Tag,
  Share2,
  Edit
} from 'lucide-react';

export const ArticlePage: React.FC = () => {
  const {
    currentRoute,
    articles,
    categories,
    goHome,
    goToCategory,
    goToArticle,
    goToAdmin,
    recordArticleView,
    bookmarks,
    toggleBookmark,
    navigate,
    settings,
    isAdminAuthenticated
  } = useApp();

  const articleSlug = currentRoute.articleSlug;
  const article = articles.find(a => a.slug === articleSlug || a.id === articleSlug);

  useEffect(() => {
    if (article) {
      recordArticleView(article.slug);
    }
  }, [article?.slug]);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
          Article Not Found
        </h2>
        <p className="text-sm text-slate-600">
          The requested article may have been moved, updated, or archived.
        </p>
        <button
          onClick={goHome}
          className="px-5 py-2.5 bg-[#071A33] text-white rounded-xl text-xs font-bold hover:bg-[#0066CC] transition-colors cursor-pointer"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const categoryObj = categories.find(c => c.id === article.category);
  const formattedPubDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const formattedUpDate = new Date(article.updatedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const isBookmarked = bookmarks.includes(article.id);

  // Related articles in same category
  const relatedArticles = articles
    .filter(a => a.category === article.category && a.id !== article.id && a.status === 'published')
    .slice(0, 3);

  // Popular articles for sidebar
  const sidebarPopular = [...articles]
    .filter(a => a.id !== article.id && a.status === 'published')
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 4);

  // Simple Markdown/HTML Parser for article body
  const parsedContent = useMemo(() => {
    // Generate headings for TOC
    const headings: { id: string; text: string; level: number }[] = [];
    const lines = article.content.split('\n');

    lines.forEach((line, idx) => {
      const matchH2 = line.match(/^##\s+(.*)/);
      const matchH3 = line.match(/^###\s+(.*)/);
      if (matchH2) {
        const text = matchH2[1].trim();
        const id = `heading-${idx}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        headings.push({ id, text, level: 2 });
      } else if (matchH3) {
        const text = matchH3[1].trim();
        const id = `heading-${idx}-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        headings.push({ id, text, level: 3 });
      }
    });

    return { headings };
  }, [article.content]);

  // Convert raw text into styled editorial JSX blocks
  const renderArticleBody = () => {
    const rawParagraphs = article.content.split('\n\n');

    return rawParagraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // H2
      if (trimmed.startsWith('## ')) {
        const titleText = trimmed.replace('## ', '');
        const headingId = `heading-${titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        return (
          <h2 key={idx} id={headingId} className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33] mt-10 mb-4 pt-4 border-t border-slate-100">
            {titleText}
          </h2>
        );
      }

      // Standalone CTA / Action button like `### [Text](url)` or `[Text](url)`
      const ctaLinkMatch = trimmed.match(/^###?\s*\[(.*?)\]\((.*?)\)$/);
      if (ctaLinkMatch) {
        const linkText = ctaLinkMatch[1];
        const linkUrl = ctaLinkMatch[2];
        const isSelar = linkUrl.includes('selar.');
        return (
          <div key={idx} className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0B2548] to-[#071A33] border border-amber-500/30 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" /> Official Store
              </div>
              <h4 className="font-serif-heading text-lg sm:text-xl font-bold text-white">
                Ready to Read?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300">
                Instant digital download available in PDF & ePub formats.
              </p>
            </div>
            <a
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group shrink-0 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#F7931E] via-[#FF8A00] to-[#E67E0A] hover:from-[#E67E0A] hover:to-[#F7931E] text-white font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer border border-amber-300/40"
            >
              <span>{linkText}</span>
              <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        );
      }

      // Standard H3
      if (trimmed.startsWith('### ')) {
        const titleText = trimmed.replace('### ', '');
        const headingId = `heading-${titleText.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        return (
          <h3 key={idx} id={headingId} className="font-serif-heading text-xl sm:text-2xl font-bold text-[#071A33] mt-8 mb-3">
            {titleText}
          </h3>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-l-4 border-[#0066CC] pl-4 py-3 my-6 bg-slate-50 text-slate-800 italic rounded-r-xl text-base sm:text-lg font-serif">
            {trimmed.replace('> ', '').replace(/"/g, '')}
          </blockquote>
        );
      }

      // Unordered list
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map(l => l.replace(/^(\*|-)\s+/, ''));
        return (
          <ul key={idx} className="space-y-2 my-4 pl-6 list-disc text-slate-700 text-base sm:text-lg leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ul>
        );
      }

      // Ordered list
      if (/^\d+\.\s/.test(trimmed)) {
        const items = trimmed.split('\n').map(l => l.replace(/^\d+\.\s+/, ''));
        return (
          <ol key={idx} className="space-y-2.5 my-4 pl-6 list-decimal text-slate-700 text-base sm:text-lg leading-relaxed">
            {items.map((item, itemIdx) => (
              <li key={itemIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
            ))}
          </ol>
        );
      }

      // Table representation (Markdown format)
      if (trimmed.includes('|') && trimmed.includes('\n|')) {
        const rows = trimmed.split('\n').filter(r => r.includes('|') && !r.includes('---'));
        if (rows.length > 0) {
          const headerCells = rows[0].split('|').map(c => c.trim()).filter(Boolean);
          const bodyRows = rows.slice(1).map(r => r.split('|').map(c => c.trim()).filter(Boolean));

          return (
            <div key={idx} className="overflow-x-auto my-8 border border-slate-200 rounded-xl shadow-2xs">
              <table className="w-full text-left text-sm font-sans">
                <thead className="bg-[#071A33] text-white">
                  <tr>
                    {headerCells.map((cell, cIdx) => (
                      <th key={cIdx} className="p-3 font-semibold text-xs uppercase tracking-wider" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-slate-700 text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell) }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Standard prose paragraph
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-slate-800 leading-relaxed sm:leading-loose mb-6 font-editorial-body"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(
        /\[(.*?)\]\((https?:\/\/(?:www\.)?selar\.(?:com|co)\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 mx-1 my-0.5 rounded-xl bg-gradient-to-r from-[#F7931E] to-[#FF8A00] hover:from-[#E67E0A] hover:to-[#F7931E] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:shadow transition-all no-underline">$1 <svg class="w-3.5 h-3.5 inline ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0066CC] hover:text-[#F7931E] font-bold underline transition-colors">$1</a>'
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#071A33]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-[#0066CC] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Scroll Reading Progress Bar */}
      <ReadingProgress />

      {/* TOP IN-ARTICLE LEADERBOARD AD */}
      <AdvertisementSlot placement="article_top" />

      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between gap-4 text-xs text-slate-500 mb-6 pb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={goHome}
            className="hover:text-[#0066CC] font-medium flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </button>
          <span>/</span>
          <button
            onClick={() => goToCategory(article.category)}
            className="hover:text-[#0066CC] font-medium cursor-pointer"
          >
            {categoryObj?.name || article.category}
          </button>
          {article.subcategory && (
            <>
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[200px]">{article.subcategory}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isAdminAuthenticated && (
            <button
              onClick={() => goToAdmin('editor', article.id)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-[#071A33] hover:bg-[#0066CC] text-white transition-colors cursor-pointer shadow-2xs"
              title="Edit this post in the CMS Admin Dashboard"
            >
              <Edit className="w-3.5 h-3.5 text-[#F7931E]" />
              <span>Edit Post</span>
            </button>
          )}

          <button
            onClick={() => toggleBookmark(article.id)}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'bg-blue-50 border-[#0066CC] text-[#0066CC]'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0066CC]' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save for Later'}</span>
          </button>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="max-w-4xl mx-auto mb-8">
        {/* Category & Badge */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            onClick={() => goToCategory(article.category)}
            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0066CC] text-white shadow-2xs hover:bg-[#071A33] transition-colors cursor-pointer"
          >
            {categoryObj?.name || article.category}
          </button>

          {article.isSponsored && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#071A33] text-[#F7931E]">
              Sponsored Analysis
            </span>
          )}

          {article.isAffiliate && (
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-900 text-white">
              Product Review
            </span>
          )}
        </div>

        {/* Main Headline */}
        <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#071A33] leading-tight mb-4">
          {article.title}
        </h1>

        {/* Subtitle Excerpt */}
        <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-6 font-normal">
          {article.excerpt}
        </p>

        {/* Author & Publication Metadata */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200/80 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-3">
            <img
              src={
                (article.author.avatar && !article.author.avatar.includes('photo-1534528741775'))
                  ? article.author.avatar
                  : (settings.authorAvatar || 'https://res.cloudinary.com/dhzouslh1/image/upload/v1787058447/681239616_960194553518462_5873236656219850661_n_wyww4k.jpg')
              }
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#071A33]">{article.author.name}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#0066CC]" title="Verified Publisher" />
              </div>
              <p className="text-xs text-[#0066CC] font-medium">{article.author.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Published: {formattedPubDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      {article.coverImage && (
        <div className="max-w-5xl mx-auto mb-10">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-950 aspect-[16/9] max-h-[520px]">
            <img
              src={article.coverImage}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          {article.coverImageCaption && (
            <p className="text-xs text-slate-500 mt-2 text-center italic">
              {article.coverImageCaption}
            </p>
          )}
        </div>
      )}

      {/* Social Share Bar Top */}
      <div className="max-w-4xl mx-auto">
        <SocialShare title={article.title} articleSlug={article.slug} />
      </div>

      {/* Main Reading Grid: 8 Cols Prose + 4 Cols Intelligent Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
        {/* Article Body (8 cols on lg) */}
        <main className="lg:col-span-8">
          {/* Automatic Table of Contents if available */}
          {parsedContent.headings.length > 2 && (
            <TableOfContents headings={parsedContent.headings} />
          )}

          {/* Investment or Review Trust Disclaimers */}
          {article.category === 'investment' && (
            <div className="p-4 my-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-amber-950 mb-0.5">
                  Educational Disclaimer
                </strong>
                The insights and market principles presented in this article are strictly for educational and informational purposes and do not constitute financial, investment, or tax advice. Always conduct independent due diligence.
              </div>
            </div>
          )}

          {/* Dedicated Product Review Structured Box if review data exists */}
          {article.reviewDetails && (
            <div className="my-8">
              <ReviewCard article={article} />
            </div>
          )}

          {/* Render Processed Article Prose */}
          <div className="article-prose">
            {renderArticleBody()}
          </div>

          {/* Dedicated Book Spotlight Card for RUTH: The Informant */}
          {article.slug === 'the-informants-price-ruth-book-oluranti-clement' && (
            <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0B2548] to-[#071A33] text-white shadow-xl border border-slate-700/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F7931E]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
                {article.coverImage ? (
                  <div className="w-28 sm:w-36 shrink-0 aspect-[2/3] rounded-xl bg-slate-900 shadow-2xl overflow-hidden border border-amber-500/30">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-28 sm:w-36 shrink-0 aspect-[2/3] rounded-xl bg-slate-900 shadow-2xl overflow-hidden border border-amber-500/30 flex flex-col justify-between p-3.5 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/40 via-slate-900 to-black">
                    <span className="text-[9px] uppercase tracking-widest text-[#F7931E] font-bold">New Release</span>
                    <div>
                      <h4 className="font-serif-heading font-bold text-base text-amber-200 leading-tight">RUTH</h4>
                      <p className="text-[10px] text-slate-300 font-sans tracking-wide">The Informant</p>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">By Oluranti Clement</span>
                  </div>
                )}
                <div className="space-y-3 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" /> Official Book Release
                  </div>
                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-white leading-tight">
                    Get Your Copy of <span className="text-[#F7931E]">RUTH: The Informant</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                    A true-inspired story of ambition, survival in Abuja, choices under pressure, and redemption by Oluranti Clement.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <a
                      href="https://selar.com/004b489141"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#F7931E] to-[#FF8A00] hover:from-[#E67E0A] hover:to-[#F7931E] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" /> Download on Selar Store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MID-ARTICLE AD */}
          <AdvertisementSlot placement="article_middle" />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-200 my-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#0066CC]" /> Topic Tags:
              </span>
              {article.tags.map(t => (
                <button
                  key={t}
                  onClick={() => navigate({ page: 'search', searchQuery: t })}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#0066CC] text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          {/* Dedicated Persona Link & Share Card */}
          <ArticlePermalinkCard
            title={article.title}
            slug={article.slug}
            excerpt={article.excerpt}
          />

          {/* Author Bio Card */}
          <AuthorCard author={article.author} />

          {/* ARTICLE BOTTOM AD */}
          <AdvertisementSlot placement="article_bottom" />

          {/* Comments & Discussion System */}
          <CommentsSection articleId={article.id} />
        </main>

        {/* Intelligent Desktop Sidebar (4 cols on lg) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Sidebar Advertisement */}
          <AdvertisementSlot placement="sidebar" variant="sidebar" />

          {/* Popular Articles Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" /> Popular Analysis
            </h3>
            <div className="divide-y divide-slate-100">
              {sidebarPopular.map(art => (
                <ArticleCard key={art.id} article={art} variant="compact" />
              ))}
            </div>
          </div>

          {/* Related Articles in same vertical */}
          {relatedArticles.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] pb-3 border-b border-slate-100">
                More in {categoryObj?.name}
              </h3>
              <div className="divide-y divide-slate-100">
                {relatedArticles.map(art => (
                  <ArticleCard key={art.id} article={art} variant="compact" />
                ))}
              </div>
            </div>
          )}

          {/* Editorial Trust Note */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-[#F7931E] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> ClementTrends Trust Guarantee
            </div>
            <p className="text-slate-300 leading-relaxed">
              We uphold uncompromising editorial rigor. We do not promote get-rich-quick schemes, unverified investment claims, or fake testimonials.
            </p>
            <button
              onClick={() => navigate({ page: 'legal', legalTab: 'editorial' })}
              className="text-[#F7931E] hover:underline font-bold inline-block pt-1 cursor-pointer"
            >
              Read Our Editorial Charter →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
