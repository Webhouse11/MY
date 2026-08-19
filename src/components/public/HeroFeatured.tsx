import React from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import { Clock, Calendar, ArrowRight, Sparkles, Flame } from 'lucide-react';

interface HeroFeaturedProps {
  leadArticle: Article;
  supportingArticles: Article[];
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  leadArticle,
  supportingArticles
}) => {
  const { goToArticle, goToCategory, categories } = useApp();

  const fallbackImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80';
  const leadImage = leadArticle.coverImage && leadArticle.coverImage.trim() !== '' ? leadArticle.coverImage : fallbackImage;

  const leadCategory = categories.find(c => c.id === leadArticle.category);
  const leadDate = new Date(leadArticle.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <section id="hero-featured-section" className="mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Large Primary Lead Story (7 cols on lg) */}
        <div
          onClick={() => goToArticle(leadArticle.slug)}
          className="lg:col-span-7 group flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0066CC]/40 transition-all duration-300 cursor-pointer"
        >
          {/* Main Visual Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
            <img
              src={leadImage}
              alt={leadArticle.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F7931E] text-[#071A33] shadow-md flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-[#071A33]" /> Lead Story
              </span>
            </div>

            {/* In-Image Category & Title snippet on mobile */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  goToCategory(leadArticle.category);
                }}
                className="text-xs font-bold uppercase tracking-wider text-[#F7931E] hover:underline"
              >
                {leadCategory?.name || leadArticle.category}
              </button>
            </div>
          </div>

          {/* Lead Body Content */}
          <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-serif-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors leading-tight mb-4">
                {leadArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed line-clamp-3 mb-6 font-normal">
                {leadArticle.excerpt}
              </p>
            </div>

            {/* Footer Metadata & CTA */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={leadArticle.author.avatar}
                  alt={leadArticle.author.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <p className="text-xs font-bold text-[#071A33]">{leadArticle.author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{leadDate}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {leadArticle.readingTimeMinutes} min read
                    </span>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#071A33] text-white font-bold text-xs group-hover:bg-[#0066CC] transition-colors shadow-sm">
                Read Full Analysis <ArrowRight className="w-4 h-4 text-[#F7931E] group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>

        {/* Supporting Featured Stories (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b-2 border-[#071A33]">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#071A33] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0066CC]" /> Editorial Selections
            </h3>
            <span className="text-xs text-slate-400 font-medium">Curated Insights</span>
          </div>

          <div className="flex flex-col divide-y divide-slate-100 bg-white rounded-3xl border border-slate-200/90 p-3 sm:p-5 shadow-xs">
            {supportingArticles.slice(0, 3).map((art, idx) => {
              const catObj = categories.find(c => c.id === art.category);
              const artDate = new Date(art.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={art.id}
                  onClick={() => goToArticle(art.slug)}
                  className="group py-4 first:pt-1 last:pb-1 flex gap-4 items-center cursor-pointer transition-all duration-150"
                >
                  <div className="relative w-24 h-20 sm:w-28 sm:h-22 shrink-0 rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={art.coverImage && art.coverImage.trim() !== '' ? art.coverImage : fallbackImage}
                      alt={art.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#071A33]/90 text-[#F7931E] text-[10px] font-bold flex items-center justify-center">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066CC] block mb-1">
                      {catObj?.name || art.category}
                    </span>
                    <h4 className="font-serif-heading text-sm sm:text-base font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors leading-snug line-clamp-2 mb-1.5">
                      {art.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{artDate}</span>
                      <span>•</span>
                      <span>{art.readingTimeMinutes}m read</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
