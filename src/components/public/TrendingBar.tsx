import React from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import { Flame, ArrowUpRight, TrendingUp } from 'lucide-react';

interface TrendingBarProps {
  articles: Article[];
}

export const TrendingBar: React.FC<TrendingBarProps> = ({ articles }) => {
  const { goToArticle } = useApp();

  const trendingList = articles.filter(a => a.isTrending || a.viewsCount > 3000).slice(0, 4);
  if (trendingList.length === 0) return null;

  return (
    <section id="trending-now-section" className="mb-12">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
          <div className="w-6 h-6 rounded-lg bg-[#F7931E]/15 text-[#F7931E] flex items-center justify-center">
            <Flame className="w-4 h-4 fill-[#F7931E]" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#071A33]">
            Trending Now Across ClementTrends
          </h3>
          <span className="ml-auto text-[11px] text-slate-400 font-medium hidden sm:inline">
            Real-time reading activity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingList.map((art, index) => (
            <div
              key={art.id}
              onClick={() => goToArticle(art.slug)}
              className="group p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer flex items-start gap-3"
            >
              <span className="text-2xl font-extrabold text-slate-300 group-hover:text-[#0066CC] font-serif transition-colors leading-none">
                0{index + 1}
              </span>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-[#071A33] group-hover:text-[#0066CC] transition-colors line-clamp-2 leading-snug mb-1">
                  {art.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  {art.readingTimeMinutes} min read • {art.viewsCount.toLocaleString()} reads
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
