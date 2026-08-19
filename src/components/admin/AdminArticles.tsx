import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Article, CategoryId } from '../../types';
import {
  PlusCircle,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Star,
  Flame,
  Sparkles,
  DollarSign,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface AdminArticlesProps {
  onNewArticle: () => void;
  onEditArticle: (articleId: string) => void;
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  onNewArticle,
  onEditArticle
}) => {
  const { articles, categories, deleteArticle, updateArticle, goToArticle } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtering
  const filteredArticles = articles.filter(art => {
    if (filterCategory !== 'all' && art.category !== filterCategory) return false;
    if (filterStatus !== 'all' && art.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.excerpt.toLowerCase().includes(q) ||
        art.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    deleteArticle(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish, edit, feature, schedule, and optimize editorial articles and product reviews.
          </p>
        </div>

        <button
          onClick={onNewArticle}
          className="px-4 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#F7931E]" /> Create Article
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search articles by title or tag..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-[#0066CC]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0066CC]"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0066CC]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Article Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4">Promotions</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No articles found matching the current search criteria.
                  </td>
                </tr>
              ) : (
                filteredArticles.map(art => {
                  const catObj = categories.find(c => c.id === art.category);
                  const isDeleting = confirmDeleteId === art.id;

                  return (
                    <tr
                      key={art.id}
                      onClick={() => onEditArticle(art.id)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      {/* Title & Cover */}
                      <td className="p-4 min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={art.coverImage}
                            alt={art.title}
                            referrerPolicy="no-referrer"
                            className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#071A33] group-hover:text-[#0066CC] text-sm truncate max-w-sm transition-colors">
                              {art.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              Published: {new Date(art.publishedAt).toLocaleDateString()} • By {art.author.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-[#0066CC]">
                          {catObj?.name || art.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold capitalize ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : art.status === 'draft'
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="p-4 whitespace-nowrap font-bold text-slate-700">
                        {art.viewsCount.toLocaleString()}
                      </td>

                      {/* Quick Feature/Trending/Sponsored Toggles */}
                      <td className="p-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateArticle(art.id, { isFeatured: !art.isFeatured })}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              art.isFeatured
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title="Toggle Lead Featured Article"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => updateArticle(art.id, { isTrending: !art.isTrending })}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              art.isTrending
                                ? 'bg-orange-100 text-orange-900'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title="Toggle Trending"
                          >
                            <Flame className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => updateArticle(art.id, { isSponsored: !art.isSponsored })}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                              art.isSponsored
                                ? 'bg-indigo-100 text-indigo-900'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                            title="Toggle Sponsored Badge"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        {isDeleting ? (
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-[11px] text-rose-600 font-bold">Confirm?</span>
                            <button
                              onClick={() => handleDelete(art.id)}
                              className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Yes, Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-[10px] font-bold cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => goToArticle(art.slug)}
                              className="p-1.5 text-slate-500 hover:text-[#0066CC] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              title="View Public Article Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => onEditArticle(art.id)}
                              className="px-2.5 py-1 text-xs font-bold text-[#0066CC] bg-blue-50 hover:bg-[#0066CC] hover:text-white rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                              title="Edit Article & SEO"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => setConfirmDeleteId(art.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
