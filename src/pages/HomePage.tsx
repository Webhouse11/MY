import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendsWire } from '../components/public/TrendsWire';
import { HeroFeatured } from '../components/public/HeroFeatured';
import { TrendingBar } from '../components/public/TrendingBar';
import { ArticleCard } from '../components/public/ArticleCard';
import { ReviewCard } from '../components/public/ReviewCard';
import { NewsletterSection } from '../components/public/NewsletterSection';
import { AdvertisementSlot } from '../components/layout/AdvertisementSlot';
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
  Coins,
  Layers,
  ChevronRight
} from 'lucide-react';
import { CategoryId } from '../types';

export const HomePage: React.FC = () => {
  const { articles, categories, goToCategory, goToArticle, navigate } = useApp();

  // Chronologically sort published articles (newest first)
  const publishedArticles = [...articles]
    .filter(a => a.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  // Any newest uploaded post automatically becomes the primary Lead Story
  const leadArticle = publishedArticles[0];
  const supportingArticles = publishedArticles.slice(1, 5);

  // Category specific slices
  const investmentArticles = publishedArticles.filter(a => a.category === 'investment');
  const marketingArticles = publishedArticles.filter(a => a.category === 'digital-marketing');
  const aiArticles = publishedArticles.filter(a => a.category === 'ai-tech');
  const reviewArticles = publishedArticles.filter(a => a.category === 'reviews' || !!a.reviewDetails);
  const businessArticles = publishedArticles.filter(a => a.category === 'business');
  const motivationArticles = publishedArticles.filter(a => a.category === 'motivation');

  // Most popular / most read
  const popularArticles = [...publishedArticles].sort((a, b) => b.viewsCount - a.viewsCount).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* SECTION A: TRENDS WIRE LIVE STREAM */}
      <TrendsWire articles={publishedArticles} />

      {/* SECTION B: TOP ADVERTISEMENT */}
      <AdvertisementSlot placement="top_banner" variant="leaderboard" />

      {/* SECTION C: EDITOR'S & FEATURED STORIES */}
      {leadArticle && (
        <HeroFeatured
          leadArticle={leadArticle}
          supportingArticles={supportingArticles}
        />
      )}

      {/* SECTION D: TRENDING NOW */}
      <TrendingBar articles={publishedArticles} />

      {/* SECTION E: LATEST ARTICLES FEED (with Sidebar) */}
      <section id="latest-articles-section" className="mb-14">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#071A33] mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0066CC]"></div>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#071A33]">
              Latest Intelligence &amp; Analysis
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            Chronological Dispatch
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main 2-Col Articles Feed (8 cols on lg) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {publishedArticles.slice(0, 4).map(art => (
              <ArticleCard key={art.id} article={art} />
            ))}
          </div>

          {/* Sidebar Area: Popular This Week + Sidebar Ad (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] pb-3 border-b border-slate-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" /> Most Read This Week
              </h3>
              <div className="divide-y divide-slate-100">
                {popularArticles.map(art => (
                  <ArticleCard key={art.id} article={art} variant="compact" />
                ))}
              </div>
            </div>

            {/* Sidebar Ad Slot */}
            <AdvertisementSlot placement="sidebar" variant="sidebar" />
          </div>
        </div>
      </section>

      {/* SECTION AD: HOMEPAGE MIDDLE */}
      <AdvertisementSlot placement="homepage_middle" />

      {/* SECTION F: INVESTMENT & FINANCIAL EDUCATION */}
      <section id="investment-section" className="mb-16">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0066CC] block">
              Financial Sovereignty &amp; Asset Allocation
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
              Investment &amp; Finance
            </h2>
          </div>
          <button
            onClick={() => goToCategory('investment')}
            className="text-xs font-bold text-[#0066CC] hover:text-[#071A33] flex items-center gap-1 cursor-pointer transition-colors"
          >
            Explore All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investmentArticles.slice(0, 3).map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* SECTION G: DIGITAL MARKETING */}
      <section id="marketing-section" className="mb-16">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 block">
              Growth Funnels &amp; Search Authority
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
              Digital Marketing
            </h2>
          </div>
          <button
            onClick={() => goToCategory('digital-marketing')}
            className="text-xs font-bold text-[#0066CC] hover:text-[#071A33] flex items-center gap-1 cursor-pointer transition-colors"
          >
            Explore All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {marketingArticles.slice(0, 3).map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* IN-FEED AD */}
      <AdvertisementSlot placement="category_middle" />

      {/* SECTION H: AI & TECHNOLOGY */}
      <section id="ai-tech-section" className="mb-16">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
              Frontier Models &amp; Automation
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
              AI &amp; Technology
            </h2>
          </div>
          <button
            onClick={() => goToCategory('ai-tech')}
            className="text-xs font-bold text-[#0066CC] hover:text-[#071A33] flex items-center gap-1 cursor-pointer transition-colors"
          >
            Explore All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiArticles.slice(0, 3).map(art => (
            <ArticleCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* SECTION I: PRODUCT REVIEWS ENGINE SHOWCASE */}
      <section id="product-reviews-section" className="mb-16">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F7931E] block">
              Tested &amp; Benchmarked
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
              Product &amp; Software Reviews
            </h2>
          </div>
          <button
            onClick={() => goToCategory('reviews')}
            className="text-xs font-bold text-[#0066CC] hover:text-[#071A33] flex items-center gap-1 cursor-pointer transition-colors"
          >
            View Review Hub <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {reviewArticles.slice(0, 2).map(art => (
            <ReviewCard key={art.id} article={art} />
          ))}
        </div>
      </section>

      {/* SECTION J: BUSINESS & MOTIVATION 2-COLUMN SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Blockchain Fortune */}
        <section id="business-section">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
            <h3 className="font-serif-heading text-xl font-bold text-[#071A33] flex items-center gap-2">
              <Coins className="w-4 h-4 text-teal-600" /> Blockchain Fortune
            </h3>
            <button
              onClick={() => goToCategory('business')}
              className="text-xs font-bold text-[#0066CC] hover:underline cursor-pointer"
            >
              View More →
            </button>
          </div>
          <div className="space-y-4">
            {businessArticles.slice(0, 2).map(art => (
              <ArticleCard key={art.id} article={art} variant="horizontal" showExcerpt={false} />
            ))}
          </div>
        </section>

        {/* Motivation */}
        <section id="motivation-section">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
            <h3 className="font-serif-heading text-xl font-bold text-[#071A33] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600" /> Motivation &amp; Mastery
            </h3>
            <button
              onClick={() => goToCategory('motivation')}
              className="text-xs font-bold text-[#0066CC] hover:underline cursor-pointer"
            >
              View More →
            </button>
          </div>
          <div className="space-y-4">
            {motivationArticles.slice(0, 2).map(art => (
              <ArticleCard key={art.id} article={art} variant="horizontal" showExcerpt={false} />
            ))}
          </div>
        </section>
      </div>

      {/* SECTION L: NEWSLETTER SECTION */}
      <NewsletterSection />

      {/* SECTION M: FOOTER ADVERTISEMENT */}
      <AdvertisementSlot placement="footer" />
    </div>
  );
};
