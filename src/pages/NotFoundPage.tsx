import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/public/ArticleCard';
import { Search, Home, ArrowRight, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { goHome, goToSearch, articles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      goToSearch(searchQuery.trim());
    }
  };

  const popularArticles = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => b.viewsCount - a.viewsCount)
    .slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8">
      {/* 404 Visual */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#071A33] text-[#F7931E] shadow-xl">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0066CC]">
          Error 404 • Missing URL
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
          This page seems to have taken a different trend.
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The link you followed may be broken, renamed, or no longer available. Use the search bar below or explore our highest-rated publications.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search investment, AI, tech reviews, marketing..."
            className="w-full pl-10 pr-24 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:border-[#0066CC]"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3.5 py-1.5 bg-[#071A33] hover:bg-[#0066CC] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>
      </div>

      {/* Return Home Button */}
      <div className="pt-2">
        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#071A33] font-bold text-xs transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" /> Return to Homepage
        </button>
      </div>

      {/* Recommended Reading */}
      <div className="pt-12 text-left space-y-6">
        <div className="pb-2 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33]">
            Recommended Intelligence Briefings
          </h3>
          <span className="text-xs text-slate-400 font-medium">Most Read</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularArticles.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </div>
    </div>
  );
};
