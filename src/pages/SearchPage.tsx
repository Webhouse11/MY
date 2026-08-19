import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/public/ArticleCard';
import { Search, Filter, Sparkles, ArrowLeft, Tag } from 'lucide-react';
import { CategoryId } from '../types';

export const SearchPage: React.FC = () => {
  const { currentRoute, articles, categories, goHome, goToCategory } = useApp();
  const [query, setQuery] = useState(currentRoute.searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'latest' | 'views'>('relevance');

  useEffect(() => {
    if (currentRoute.searchQuery !== undefined) {
      setQuery(currentRoute.searchQuery);
    }
  }, [currentRoute.searchQuery]);

  const cleanQuery = query.trim().toLowerCase();

  // Search logic across title, excerpt, content, tags, author, category
  let results = articles.filter(art => {
    if (art.status !== 'published') return false;

    // Category filter
    if (selectedCategory !== 'all' && art.category !== selectedCategory) {
      return false;
    }

    if (!cleanQuery) return true;

    const inTitle = art.title.toLowerCase().includes(cleanQuery);
    const inExcerpt = art.excerpt.toLowerCase().includes(cleanQuery);
    const inContent = art.content.toLowerCase().includes(cleanQuery);
    const inTags = art.tags.some(t => t.toLowerCase().includes(cleanQuery));
    const inAuthor = art.author.name.toLowerCase().includes(cleanQuery);
    const inCategory = art.category.toLowerCase().includes(cleanQuery);

    return inTitle || inExcerpt || inContent || inTags || inAuthor || inCategory;
  });

  if (sortBy === 'latest') {
    results.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else if (sortBy === 'views') {
    results.sort((a, b) => b.viewsCount - a.viewsCount);
  }

  // Popular search terms
  const popularKeywords = [
    'Investment Principles',
    'AI Tools',
    'SEO Funnels',
    'Cursor IDE',
    'Bootstrapping',
    'Consistency',
    'Emerging Markets'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button
          onClick={goHome}
          className="hover:text-[#0066CC] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
        <span>/</span>
        <span className="text-[#071A33] font-bold">Search Archive</span>
      </div>

      {/* Search Header Hero */}
      <div className="max-w-3xl mx-auto text-center mb-10 space-y-4">
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
          Search ClementTrends Archive
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Find deep dives, market analyses, product benchmarks, and strategic frameworks.
        </p>

        {/* Live Search Form */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by topic, keyword, tool, or author..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-sm focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-all"
            autoFocus
          />
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Suggested:
          </span>
          {popularKeywords.map(kw => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#0066CC] transition-colors cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Results Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#071A33] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Verticals
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-xs self-end sm:self-auto">
          <span className="font-semibold text-slate-600">
            {results.length} {results.length === 1 ? 'result' : 'results'} found
          </span>
          <span>•</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0066CC]"
          >
            <option value="relevance">Relevance</option>
            <option value="latest">Latest First</option>
            <option value="views">Most Read</option>
          </select>
        </div>
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 text-slate-500 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#071A33]">
            No matching articles found
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any articles matching "{query}". Try checking your spelling or using broader search terms like "AI", "Investment", or "Marketing".
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-[#071A33] text-white rounded-xl text-xs font-bold hover:bg-[#0066CC] transition-colors cursor-pointer"
          >
            Clear Search Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      )}
    </div>
  );
};
