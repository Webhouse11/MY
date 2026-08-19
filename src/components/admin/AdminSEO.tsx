import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Save, CheckCircle2, Globe, FileCode, Check, ShieldCheck, Download, Github } from 'lucide-react';
import { generateAndDownloadProjectZip } from '../../utils/projectExport';

export const AdminSEO: React.FC = () => {
  const { settings, updateSettings, articles, categories, ads, comments, subscribers } = useApp();
  const [gaId, setGaId] = useState(settings.googleAnalyticsId);
  const [gscToken, setGscToken] = useState(settings.googleSearchConsoleVerification || 'OPwA4jsEQlNmexmjnpSelvz-brNETmETUn1gSU-YC14');
  const [siteName, setSiteName] = useState(settings.siteName);
  const [tagline, setTagline] = useState(settings.siteTagline);
  const [saved, setSaved] = useState(false);
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      googleAnalyticsId: gaId,
      googleSearchConsoleVerification: gscToken,
      siteName,
      siteTagline: tagline
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Generate dynamic XML sitemap preview
  const sitemapUrls = [
    'https://clementtrends.com.ng/',
    ...categories.map(c => `https://clementtrends.com.ng/category/${c.slug}`),
    ...articles.filter(a => a.status === 'published').map(a => `https://clementtrends.com.ng/article/${a.slug}`),
    'https://clementtrends.com.ng/about',
    'https://clementtrends.com.ng/contact',
    'https://clementtrends.com.ng/advertise',
    'https://clementtrends.com.ng/author',
    'https://clementtrends.com.ng/legal'
  ];

  const generatedRobotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://clementtrends.com.ng/sitemap.xml`;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            SEO Architecture &amp; Webmaster Toolkit
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control search engine indexing, Google Analytics, XML Sitemaps, and robots.txt protocols.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> SEO Settings Updated!
          </span>
        )}
      </div>

      {/* Global Metadata Form */}
      <form onSubmit={handleSave} className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
        <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#0066CC]" /> Global Search Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Global Platform Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={e => setSiteName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Analytics 4 Measurement ID
            </label>
            <input
              type="text"
              value={gaId}
              onChange={e => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Google Search Console Verification
            </label>
            <input
              type="text"
              value={gscToken}
              onChange={e => setGscToken(e.target.value)}
              placeholder="OPwA4jsEQlNmexmjnpSelvz-brNETmETUn1gSU-YC14"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Global Search Meta Tagline
          </label>
          <textarea
            rows={2}
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Save className="w-4 h-4 text-[#F7931E]" /> Save SEO Configuration
          </button>
        </div>
      </form>

      {/* Dynamic XML Sitemap Inspector */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" /> XML Sitemap Generation (sitemap.xml)
            </h3>
            <p className="text-xs text-slate-500">
              Auto-indexes all {sitemapUrls.length} live canonical URLs across categories, reviews, and publications.
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full">
            {sitemapUrls.length} URLs Indexed
          </span>
        </div>

        <div className="max-h-48 overflow-y-auto p-4 rounded-xl bg-slate-900 font-mono text-xs text-slate-200 space-y-1">
          {sitemapUrls.map(url => (
            <div key={url} className="text-slate-300 hover:text-white truncate">
              &lt;url&gt;&lt;loc&gt;{url}&lt;/loc&gt;&lt;changefreq&gt;daily&lt;/changefreq&gt;&lt;/url&gt;
            </div>
          ))}
        </div>
      </div>

      {/* Robots.txt Configuration */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
        <h3 className="font-serif-heading text-lg font-bold text-[#071A33] flex items-center gap-2 pb-2 border-b border-slate-100">
          <FileCode className="w-4 h-4 text-slate-700" /> Web Crawler Protocol (robots.txt)
        </h3>
        <p className="text-xs text-slate-500">
          Directives instructing Googlebot, Bingbot, and AI scrapers to crawl editorial articles while keeping CMS admin private.
        </p>

        <pre className="p-4 rounded-xl bg-slate-900 font-mono text-xs text-amber-400 whitespace-pre-wrap">
          {generatedRobotsTxt}
        </pre>
      </div>

      {/* Quick Project Backup & Export */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-white text-sm flex items-center gap-2">
            <Github className="w-4 h-4 text-[#F7931E]" /> Full Project Code &amp; Database Backup
          </h4>
          <p className="text-xs text-slate-400">
            Export all source code, TypeScript files, and Firestore database snapshot to a ZIP file.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="px-5 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#F7931E] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-md shrink-0 disabled:opacity-50"
        >
          {isExporting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Preparing ZIP...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#F7931E]" />
              <span>Download Project ZIP</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
