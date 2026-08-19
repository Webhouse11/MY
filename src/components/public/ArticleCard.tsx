import React, { useState } from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, Bookmark, Sparkles, Star, ArrowUpRight, Flame, Edit, Share2, Check, Link2 } from 'lucide-react';
import { getArticlePersonalUrl, copyToClipboard } from '../../utils/linkUtils';

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'horizontal' | 'compact' | 'minimal';
  showExcerpt?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'standard',
  showExcerpt = true
}) => {
  const {
    goToArticle,
    goToCategory,
    goToAdmin,
    categories,
    bookmarks,
    toggleBookmark,
    isAdminAuthenticated
  } = useApp();
  const isBookmarked = bookmarks.includes(article.id);
  const [copiedLink, setCopiedLink] = useState(false);

  const categoryObj = categories.find(c => c.id === article.category);
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToAdmin('editor', article.id);
  };

  const handleCardClick = () => {
    goToArticle(article.slug);
  };

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToCategory(article.category);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(article.id);
  };

  const handleShareClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const personalUrl = getArticlePersonalUrl(article.slug);
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt || article.title,
          url: personalUrl
        });
        return;
      } catch {
        // User dismissed
      }
    }
    const ok = await copyToClipboard(personalUrl);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80';
  const displayImage = article.coverImage && article.coverImage.trim() !== '' ? article.coverImage : fallbackImage;

  // Horizontal variant (used in feeds & lists)
  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleCardClick}
        className="group flex flex-col sm:flex-row gap-5 p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#0066CC]/40 hover:shadow-md transition-all duration-200 cursor-pointer relative"
      >
        <div className="relative sm:w-56 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-40 rounded-xl overflow-hidden bg-slate-100">
          <img
            src={displayImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {article.isSponsored && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#071A33]/90 text-[#F7931E] backdrop-blur-xs">
              Sponsored
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <button
                type="button"
                onClick={handleCategoryClick}
                className="text-xs font-bold uppercase tracking-wider text-[#0066CC] hover:underline"
              >
                {categoryObj?.name || article.category}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleShareClick}
                  className={`p-1 rounded-lg transition-colors cursor-pointer ${
                    copiedLink ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 hover:text-[#0066CC] hover:bg-slate-100'
                  }`}
                  title={copiedLink ? 'Personal Link Copied!' : 'Share / Copy Post Link'}
                >
                  {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className={`p-1 rounded-lg text-slate-400 hover:text-[#0066CC] transition-colors ${
                    isBookmarked ? 'text-[#0066CC]' : ''
                  }`}
                  title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-[#0066CC]' : ''}`} />
                </button>
              </div>
            </div>

            <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors leading-snug line-clamp-2 mb-2">
              {article.title}
            </h3>

            {showExcerpt && (
              <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                {article.excerpt}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-700">{article.author.name}</span>
              <span>•</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{article.readingTimeMinutes} min read</span>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Compact variant (used in sidebars & supporting stories)
  if (variant === 'compact') {
    return (
      <article
        onClick={handleCardClick}
        className="group flex gap-3.5 items-start py-3 border-b border-slate-100 last:border-0 cursor-pointer"
      >
        <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
          <img
            src={displayImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066CC] block mb-1">
            {categoryObj?.name || article.category}
          </span>
          <h4 className="text-xs sm:text-sm font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.readingTimeMinutes}m read</span>
          </div>
        </div>
      </article>
    );
  }

  // Minimal variant (simple text link list)
  if (variant === 'minimal') {
    return (
      <article
        onClick={handleCardClick}
        className="group py-2.5 border-b border-slate-100 last:border-0 cursor-pointer"
      >
        <div className="flex items-center gap-2 text-xs text-[#0066CC] font-bold uppercase tracking-wider mb-1">
          <span>{categoryObj?.name || article.category}</span>
          <span>•</span>
          <span className="text-slate-400 font-normal">{formattedDate}</span>
        </div>
        <h4 className="text-sm font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors leading-snug">
          {article.title}
        </h4>
      </article>
    );
  }

  // Standard vertical grid card
  return (
    <article
      onClick={handleCardClick}
      className="group flex flex-col rounded-3xl bg-white border border-slate-200/90 hover:border-[#0066CC]/40 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={displayImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {article.isTrending && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F7931E] text-[#071A33] shadow-xs">
              <Flame className="w-3 h-3 fill-[#071A33]" /> Trending
            </span>
          )}
          {article.isSponsored && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#071A33] text-white shadow-xs">
              Sponsored
            </span>
          )}
          {article.isAffiliate && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-900 text-white shadow-xs">
              Review
            </span>
          )}
        </div>

        {/* Quick Actions (Share & Bookmark) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShareClick}
            className={`p-2 rounded-full backdrop-blur-xs shadow-xs transition-transform active:scale-90 ${
              copiedLink
                ? 'bg-emerald-600 text-white'
                : 'bg-white/90 text-slate-700 hover:text-[#0066CC]'
            }`}
            title={copiedLink ? 'Personal Post Link Copied!' : 'Share / Copy Direct Link'}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-[#0066CC] shadow-xs transition-transform active:scale-90 ${
              isBookmarked ? 'text-[#0066CC]' : ''
            }`}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Bookmark'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-[#0066CC]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={handleCategoryClick}
              className="text-xs font-bold uppercase tracking-wider text-[#0066CC] hover:underline"
            >
              {categoryObj?.name || article.category}
            </button>
            {article.subcategory && (
              <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                {article.subcategory}
              </span>
            )}
          </div>

          {/* Headline */}
          <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors leading-snug line-clamp-2 mb-2.5">
            {article.title}
          </h3>

          {/* Short Excerpt */}
          {showExcerpt && (
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Metadata Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="font-semibold text-slate-700">{article.author.name}</span>
          </div>

          <div className="flex items-center gap-3">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={handleEditClick}
                className="px-2 py-0.5 rounded-md bg-[#071A33] hover:bg-[#0066CC] text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Edit this post in CMS"
              >
                <Edit className="w-3 h-3 text-[#F7931E]" />
                <span>Edit</span>
              </button>
            )}
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {article.readingTimeMinutes}m
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
