import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/public/ArticleCard';
import { ReviewCard } from '../components/public/ReviewCard';
import { AdvertisementSlot } from '../components/layout/AdvertisementSlot';
import { Filter, Layers, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { CategoryId } from '../types';

export const CategoryPage: React.FC = () => {
  const { currentRoute, categories, articles, goHome, goToCategory } = useApp();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular'>('latest');

  const categorySlug = currentRoute.categorySlug || 'investment';
  const categoryObj = categories.find(c => c.slug === categorySlug) || categories[0];

  // Filter articles
  let filtered = articles.filter(
    a => a.category === categoryObj.id && a.status === 'published'
  );

  if (selectedSubcategory !== 'all') {
    filtered = filtered.filter(a => a.subcategory === selectedSubcategory);
  }

  if (sortBy === 'popular') {
    filtered.sort((a, b) => b.viewsCount - a.viewsCount);
  } else {
    filtered.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  const isReviewsCategory = categoryObj.id === 'reviews';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button
          onClick={goHome}
          className="hover:text-[#0066CC] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
        <span>/</span>
        <span className="text-[#071A33] font-bold">{categoryObj.name}</span>
      </div>

      {/* Category Hero Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#071A33] to-[#0A2540] text-white mb-10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F7931E] text-[#071A33] inline-block shadow-sm">
            Core Vertical
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight">
            {categoryObj.name}
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {categoryObj.description}
          </p>
          <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-[#F7931E]" /> {filtered.length} Analysis Guides
            </span>
          </div>
        </div>
      </div>

      {/* Subcategory Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        {/* Subcategories */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedSubcategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              selectedSubcategory === 'all'
                ? 'bg-[#071A33] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Sub-topics
          </button>
          {categoryObj.subcategories.map(sub => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedSubcategory === sub
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 text-xs shrink-0 self-end sm:self-auto">
          <span className="text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0066CC]"
          >
            <option value="latest">Latest Published</option>
            <option value="popular">Most Read</option>
          </select>
        </div>
      </div>

      {/* Articles Grid or Reviews Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-3">
          <p className="text-sm font-semibold">No articles found in this subcategory yet.</p>
          <button
            onClick={() => setSelectedSubcategory('all')}
            className="px-4 py-2 bg-[#071A33] text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            View All {categoryObj.name} Articles
          </button>
        </div>
      ) : isReviewsCategory ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map(art => (
              <ReviewCard key={art.id} article={art} />
            ))}
          </div>
          <AdvertisementSlot placement="category_middle" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(art => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>
          <AdvertisementSlot placement="category_middle" />
        </div>
      )}
    </div>
  );
};
