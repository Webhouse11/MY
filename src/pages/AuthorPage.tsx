import React from 'react';
import { useApp } from '../context/AppContext';
import { ArticleCard } from '../components/public/ArticleCard';
import { ShieldCheck, Mail, Globe, ArrowLeft, Twitter, Linkedin, BookOpen, Flame } from 'lucide-react';

export const AuthorPage: React.FC = () => {
  const { settings, articles, goHome, navigate } = useApp();

  const authorArticles = articles.filter(
    a => a.author.name.toLowerCase() === settings.authorName.toLowerCase() && a.status === 'published'
  );

  const totalViews = authorArticles.reduce((acc, a) => acc + a.viewsCount, 0);

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
        <span className="text-[#071A33] font-bold">Author Profile</span>
      </div>

      {/* Author Hero Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm mb-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        <img
          src={settings.authorAvatar}
          alt={settings.authorName}
          referrerPolicy="no-referrer"
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover ring-4 ring-[#071A33]/10 shadow-md shrink-0"
        />

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0066CC] text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Editor &amp; Publisher
            </div>
            <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
              {settings.authorName}
            </h1>
            <p className="text-sm font-semibold text-[#0066CC] mt-1">
              Founder &amp; Editor-in-Chief, ClementTrends
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {settings.authorBio}
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#0066CC]" />
              <span>{authorArticles.length} Published Articles</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-[#F7931E]" />
              <span>{totalViews.toLocaleString()} Total Article Reads</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Lagos, Nigeria &amp; Global Desk</span>
            </div>
          </div>

          {/* Contact & Social Buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={() => navigate({ page: 'contact' })}
              className="px-4 py-2 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" /> Contact Editorial Desk
            </button>
            <a
              href={settings.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Twitter className="w-3.5 h-3.5 text-[#0066CC]" /> Follow on 𝕏
            </a>
            <a
              href={settings.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Articles by Clement */}
      <div className="space-y-6">
        <div className="pb-3 border-b-2 border-[#071A33] flex items-center justify-between">
          <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
            Published Articles &amp; Strategic Analyses ({authorArticles.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">All Verticals</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authorArticles.map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </div>
    </div>
  );
};
