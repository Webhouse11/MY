import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateAndDownloadProjectZip } from '../../utils/projectExport';
import {
  FileText,
  Eye,
  Users,
  MessageSquare,
  Sparkles,
  TrendingUp,
  BarChart3,
  PlusCircle,
  Megaphone,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Star,
  Flame,
  Settings as SettingsIcon,
  Search,
  Image as ImageIcon,
  Download,
  Github
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigateTab: (tab: any) => void;
  onNewArticle: () => void;
  onEditArticle?: (articleId: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onNavigateTab,
  onNewArticle,
  onEditArticle
}) => {
  const { articles, ads, subscribers, comments, activityLogs, settings, updateAd, updateArticle, goToArticle } = useApp();

  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      await generateAndDownloadProjectZip({
        articles,
        ads,
        settings,
        comments,
        subscribers
      });
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const draftArticles = articles.filter(a => a.status === 'draft').length;
  const totalViews = articles.reduce((acc, a) => acc + a.viewsCount, 0);
  const totalAdClicks = ads.reduce((acc, a) => acc + a.clicks, 0);
  const totalAdImpressions = ads.reduce((acc, a) => acc + a.impressions, 0);
  const activeAdsCount = ads.filter(a => a.isActive).length;
  const pendingComments = comments.filter(c => c.status === 'pending').length;

  const topArticles = [...articles].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 6);
  const recentArticles = [...articles].slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#071A33] via-[#0A2540] to-[#0066CC] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F7931E] text-[#071A33]">
              CMS Operations Desk
            </span>
            <span className="text-xs text-slate-300">Editor-in-Chief: {settings.authorName}</span>
          </div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold">
            Editorial &amp; Monetization Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl">
            Manage publications, update advertising codes, review reader comments, and download full project backups.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNewArticle}
            className="px-4 py-2.5 rounded-xl bg-[#F7931E] hover:bg-[#ff9e30] text-[#071A33] font-bold text-xs transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" /> Create New Article
          </button>
          <button
            onClick={() => onNavigateTab('ads')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Megaphone className="w-4 h-4 text-[#F7931E]" /> Manage Ads ({activeAdsCount} Active)
          </button>
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#F7931E] hover:text-[#071A33] text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shrink-0 disabled:opacity-50"
            title="Download full project source code ZIP for GitHub"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Exporting...' : 'Export ZIP for GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Quick Launchpad Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <button
          onClick={onNewArticle}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066CC] group-hover:bg-[#0066CC] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">New Post</p>
            <p className="text-[10px] text-slate-400">Write article</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('articles')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-[#071A33] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">All Posts</p>
            <p className="text-[10px] text-slate-400">{totalArticles} articles</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('ads')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-[#F7931E] group-hover:text-[#071A33] transition-colors flex items-center justify-center shrink-0">
            <Megaphone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">Ad Placements</p>
            <p className="text-[10px] text-slate-400">{ads.length} slots</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('comments')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">Comments</p>
            <p className="text-[10px] text-slate-400">{pendingComments} pending</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('subscribers')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">Subscribers</p>
            <p className="text-[10px] text-slate-400">{subscribers.length} total</p>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('settings')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#0066CC] hover:shadow-xs transition-all text-left flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
            <SettingsIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#071A33] truncate">Settings</p>
            <p className="text-[10px] text-slate-400">Site & Bio</p>
          </div>
        </button>

        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-[#F7931E] hover:shadow-md transition-all text-left flex items-center gap-3 cursor-pointer group disabled:opacity-50"
        >
          <div className="w-9 h-9 rounded-xl bg-[#0066CC] text-white group-hover:bg-[#F7931E] group-hover:text-[#071A33] transition-colors flex items-center justify-center shrink-0">
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Export ZIP</p>
            <p className="text-[10px] text-slate-400">For GitHub</p>
          </div>
        </button>
      </div>

      {/* Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Articles */}
        <div
          onClick={() => onNavigateTab('articles')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0066CC] transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Publications</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066CC] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33] font-serif">{totalArticles}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            <span className="text-emerald-600 font-bold">{publishedArticles} Published</span> • {draftArticles} Drafts
          </p>
        </div>

        {/* Total Reads */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Article Reads</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33] font-serif">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Aggregated traffic across all posts
          </p>
        </div>

        {/* Subscribers */}
        <div
          onClick={() => onNavigateTab('subscribers')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0066CC] transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Database</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33] font-serif">{subscribers.length}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Weekly newsletter subscribers
          </p>
        </div>

        {/* Ad Monetization */}
        <div
          onClick={() => onNavigateTab('ads')}
          className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#0066CC] transition-all cursor-pointer space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ad Monetization</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#071A33] font-serif">{totalAdClicks.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Clicks / {totalAdImpressions.toLocaleString()} Impr. ({activeAdsCount} Active Slots)
          </p>
        </div>
      </div>

      {/* QUICK EDIT POSTS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0066CC]" /> Quick Post Editor Desk
            </h3>
            <p className="text-xs text-slate-500">
              Click &quot;Edit Post&quot; on any article below to edit content, review boxes, tags, cover image, and SEO instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-bold text-[#0066CC] hover:underline cursor-pointer"
            >
              View Full Articles Table ({totalArticles}) →
            </button>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {recentArticles.map(art => (
            <div
              key={art.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 p-2 rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  referrerPolicy="no-referrer"
                  className="w-14 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-[#0066CC]">
                      {art.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold capitalize ${
                        art.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {art.status}
                    </span>
                    {art.isFeatured && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5" /> Featured
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#071A33] truncate mt-1">
                    {art.title}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {art.viewsCount.toLocaleString()} reads • Published {new Date(art.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => goToArticle(art.slug)}
                  className="p-2 text-slate-500 hover:text-[#0066CC] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  title="View on site"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (onEditArticle) {
                      onEditArticle(art.id);
                    } else {
                      onNavigateTab('articles');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#F7931E]" /> Edit Post
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUICK ADS MONETIZATION CONTROL */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-[#F7931E]" /> Active Ad Placements & Controls
            </h3>
            <p className="text-xs text-slate-500">
              Toggle ad banners on/off or configure custom Google AdSense / Sponsor banners across the website.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('ads')}
            className="text-xs font-bold text-[#0066CC] hover:underline cursor-pointer"
          >
            Open Ads Manager →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.slice(0, 6).map(ad => (
            <div
              key={ad.id}
              className={`p-4 rounded-2xl border transition-all ${
                ad.isActive
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-slate-100/40 border-slate-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#071A33] text-white">
                  {ad.placement.replace(/_/g, ' ')}
                </span>

                <button
                  onClick={() => updateAd(ad.id, { isActive: !ad.isActive })}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                    ad.isActive
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {ad.isActive ? 'Active' : 'Paused'}
                </button>
              </div>

              <h5 className="font-bold text-xs text-[#071A33] truncate mb-1">
                {ad.name || ad.title || 'Ad Campaign'}
              </h5>
              <p className="text-[11px] text-slate-500 mb-3">
                {ad.advertiser || ad.sponsorName || 'Direct Sponsor'} • Type: {ad.type}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                <span>{ad.clicks.toLocaleString()} clicks</span>
                <span>{ad.impressions.toLocaleString()} impr.</span>
                <span className="font-bold text-[#0066CC]">
                  {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : '0.0'}% CTR
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Highest Traffic Articles + Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Traffic Content */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0066CC]" /> Highest Traffic Articles
            </h3>
            <button
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-bold text-[#0066CC] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topArticles.map((art, idx) => (
              <div key={art.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-bold text-slate-400 font-mono w-4">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#071A33] truncate">
                      {art.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 uppercase tracking-wider">
                      {art.category} • {art.readingTimeMinutes}m read
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#071A33] block">
                      {art.viewsCount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">views</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onEditArticle) {
                        onEditArticle(art.id);
                      } else {
                        onNavigateTab('articles');
                      }
                    }}
                    className="p-1.5 text-slate-500 hover:text-[#0066CC] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit this article"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity & Moderation Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Moderation Alert Card if pending comments */}
          {pendingComments > 0 && (
            <div
              onClick={() => onNavigateTab('comments')}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="text-xs font-bold">{pendingComments} Comment(s) Pending Moderation</p>
                  <p className="text-[11px] text-amber-700">Review before publishing to reader feed</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-900 underline">Review →</span>
            </div>
          )}

          {/* Activity Logs */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2 pb-3 border-b border-slate-100">
              <Clock className="w-4 h-4 text-slate-500" /> Recent CMS Audit Logs
            </h3>

            <div className="space-y-3 text-xs max-h-60 overflow-y-auto pr-1">
              {activityLogs.slice(0, 6).map(log => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-600">{log.user}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-800 font-medium leading-snug">{log.action}</p>
                  {log.details && (
                    <p className="text-[10px] text-slate-500">{log.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

