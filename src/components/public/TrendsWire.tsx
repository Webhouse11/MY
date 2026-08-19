import React, { useState } from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Flame,
  Zap,
  ArrowUpRight,
  Pause,
  Play,
  Clock,
  Sparkles
} from 'lucide-react';

interface TrendsWireProps {
  articles: Article[];
}

export const TrendsWire: React.FC<TrendsWireProps> = ({ articles }) => {
  const { goToArticle } = useApp();
  const [isPaused, setIsPaused] = useState(false);

  // Filter published articles and sort to highlight hot, trending, and latest posts
  const publishedArticles = articles.filter(a => a.status === 'published');
  
  if (publishedArticles.length === 0) return null;

  // Prepare wire items prioritizing trending and newest
  const wireArticles = [...publishedArticles].sort((a, b) => {
    // Priority: featured & trending first, then newest
    if ((b.isTrending || b.isFeatured) && !(a.isTrending || a.isFeatured)) return 1;
    if ((a.isTrending || a.isFeatured) && !(b.isTrending || b.isFeatured)) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return '1d ago';
      if (diffDays < 7) return `${diffDays}d ago`;
      return `${Math.floor(diffDays / 7)}w ago`;
    } catch {
      return 'Recent';
    }
  };

  const getArticleBadge = (art: Article, index: number) => {
    if (art.isTrending || art.viewsCount > 4000) {
      return {
        label: 'HOT',
        className: 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
      };
    }
    if (index === 0 || new Date().getTime() - new Date(art.publishedAt).getTime() < 86400000 * 3) {
      return {
        label: 'NEW',
        className: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
      };
    }
    if (art.category === 'motivation') {
      return {
        label: 'GROWTH',
        className: 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
      };
    }
    return {
      label: art.category.toUpperCase().replace('-', ' '),
      className: 'bg-blue-500/15 text-[#0066CC] border border-blue-500/30'
    };
  };

  // Duplicate items to ensure smooth infinite loop scroll
  const repeatedItems = [...wireArticles, ...wireArticles];

  return (
    <section
      id="trends-wire-live-feed"
      aria-label="Trends Wire Breaking Headlines"
      className="mb-8 relative rounded-2xl bg-white border border-slate-200/90 shadow-xs overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center">
        {/* Left Fixed Header / Badge */}
        <div className="shrink-0 flex items-center justify-between sm:justify-start gap-2.5 px-4 py-3 sm:py-3.5 bg-gradient-to-r from-[#071A33] via-[#0B2548] to-[#071A33] text-white border-b sm:border-b-0 sm:border-r border-slate-700/60 z-10 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7931E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F7931E]"></span>
            </span>
            <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-1.5 text-white">
              <TrendingUp className="w-4 h-4 text-[#F7931E]" />
              TRENDS WIRE
            </span>
          </div>

          <span className="hidden md:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white/10 text-slate-300">
            Hot &amp; New
          </span>

          <button
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? 'Resume scrolling' : 'Pause scrolling'}
            className="sm:hidden p-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-xs transition-colors"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Marquee Content Stream */}
        <div
          className="relative flex-1 overflow-hidden py-2 sm:py-2.5 bg-slate-50/60 group"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className={`animate-marquee ${isPaused ? 'animate-marquee-paused' : ''} flex items-center gap-8 px-4`}
          >
            {repeatedItems.map((art, idx) => {
              const badge = getArticleBadge(art, idx % wireArticles.length);
              return (
                <button
                  key={`${art.id}-${idx}`}
                  onClick={() => goToArticle(art.slug)}
                  className="inline-flex items-center gap-3 shrink-0 py-1.5 px-3 rounded-xl hover:bg-white hover:shadow-xs transition-all text-left cursor-pointer group/item"
                >
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider uppercase shrink-0 ${badge.className}`}
                  >
                    {badge.label}
                  </span>

                  <span className="text-xs sm:text-sm font-bold text-[#071A33] group-hover/item:text-[#0066CC] transition-colors line-clamp-1 max-w-[260px] sm:max-w-[420px]">
                    {art.title}
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    {formatTimeAgo(art.publishedAt)}
                  </span>

                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#0066CC] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all shrink-0" />

                  <span className="text-slate-300 ml-2 select-none">•</span>
                </button>
              );
            })}
          </div>

          {/* Right Fade Gradient */}
          <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none z-1" />
        </div>

        {/* Right Play/Pause Controls */}
        <div className="hidden sm:flex items-center px-3 border-l border-slate-200/80 shrink-0 bg-white">
          <button
            onClick={() => setIsPaused(prev => !prev)}
            title={isPaused ? 'Resume auto-scroll' : 'Pause ticker'}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0066CC] transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </section>
  );
};
