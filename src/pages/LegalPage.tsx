import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, FileText, AlertCircle, Sparkles, Cookie, Lock, ArrowLeft } from 'lucide-react';

type TabKey = 'editorial' | 'affiliate' | 'disclaimer' | 'privacy' | 'terms' | 'cookie';

export const LegalPage: React.FC = () => {
  const { currentRoute, goHome } = useApp();
  const [activeTab, setActiveTab] = useState<TabKey>(
    (currentRoute.legalTab as TabKey) || 'editorial'
  );

  useEffect(() => {
    if (currentRoute.legalTab) {
      setActiveTab(currentRoute.legalTab as TabKey);
    }
  }, [currentRoute.legalTab]);

  const tabs: { key: TabKey; title: string; icon: any }[] = [
    { key: 'editorial', title: 'Editorial Policy', icon: ShieldCheck },
    { key: 'affiliate', title: 'Affiliate Disclosure', icon: Sparkles },
    { key: 'disclaimer', title: 'Investment Disclaimer', icon: AlertCircle },
    { key: 'privacy', title: 'Privacy Policy', icon: Lock },
    { key: 'terms', title: 'Terms & Conditions', icon: FileText },
    { key: 'cookie', title: 'Cookie Policy', icon: Cookie }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button
          onClick={goHome}
          className="hover:text-[#0066CC] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Home
        </button>
        <span>/</span>
        <span className="text-[#071A33] font-bold">Trust &amp; Legal Center</span>
      </div>

      <div className="text-center space-y-3 mb-10">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0066CC] inline-block">
          Governance &amp; Transparency
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
          Trust &amp; Legal Framework
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          ClementTrends operates with strict adherence to journalistic integrity, data protection regulations (GDPR / NDPR), and commercial clarity.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 mb-10 max-w-4xl mx-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#071A33] shadow-xs'
                  : 'text-slate-600 hover:text-[#071A33] hover:bg-white/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0066CC]' : 'text-slate-400'}`} />
              <span>{tab.title}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Container */}
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-xs prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base">
        {/* 1. EDITORIAL POLICY */}
        {activeTab === 'editorial' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              ClementTrends Editorial Policy &amp; Code of Ethics
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <h3 className="text-lg font-bold text-[#071A33]">1. Commitment to Journalistic Accuracy</h3>
            <p>
              At ClementTrends, our foundational mandate is delivering reliable, verified, and high-signal knowledge. Every market analysis, software review, and strategic guide is authored based on first-principles research, primary data verification, and empirical testing.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">2. Commercial Independence</h3>
            <p>
              Our editorial desks operate with total autonomy from our commercial and advertising partners. Advertisers, sponsors, and affiliate partners have zero editorial veto or prior-review authority over our testing verdicts, ratings, or critiques.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">3. Corrections and Updates Policy</h3>
            <p>
              When substantive errors or outdated technological facts are brought to our attention, we promptly issue transparent corrections citing the date and nature of the amendment at the top of the article.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">4. AI Ethics and Disclosure</h3>
            <p>
              While generative AI tools may be used to assist in data ingestion and syntax formatting, all analyses and final conclusions are curated and validated by human editorial oversight under the leadership of Clement.
            </p>
          </div>
        )}

        {/* 2. AFFILIATE DISCLOSURE */}
        {activeTab === 'affiliate' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              Affiliate Relationships &amp; Commercial Disclosure
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <p>
              In compliance with Federal Trade Commission (FTC) guidelines and international advertising transparency standards, ClementTrends hereby discloses that certain outbound links featured within our articles, product reviews, and resource directories may constitute affiliate links.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">How Affiliate Links Function</h3>
            <p>
              When you click on an affiliate partner link (e.g., software hosting, AI developer tools, financial account onboarding) and proceed to register or purchase a paid subscription, ClementTrends may receive a modest referral commission at <strong>zero additional cost to you</strong>.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">Our Unbiased Testing Pledge</h3>
            <p>
              We never recommend tools or services solely for affiliate revenue. We routinely assign critical ratings and expose product flaws regardless of compensation structures. Our readers' trust is our paramount asset.
            </p>
          </div>
        )}

        {/* 3. INVESTMENT DISCLAIMER */}
        {activeTab === 'disclaimer' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              Financial &amp; Investment Disclaimer
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
              <strong>CRITICAL NOTICE:</strong> No content published on https://clementtrends.com.ng constitutes personalized financial, investment, legal, accounting, or tax advice.
            </div>

            <p>
              All articles covering equities, fixed income securities, Treasury Bills, emerging market currencies, real estate syndications, and digital assets are provided strictly for general macroeconomic education and informational context.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">Risk of Capital Loss</h3>
            <p>
              Financial markets are subject to volatility, macro shocks, currency depreciation, and interest rate fluctuations. Historical performance is never a guarantee of future returns. You should never allocate capital that you cannot afford to lose without prior consultation with a licensed financial advisor.
            </p>
          </div>
        )}

        {/* 4. PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              Privacy Policy (NDPR &amp; GDPR Compliant)
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <p>
              ClementTrends respects your personal autonomy and digital privacy. This document explains what limited information we collect and how we safeguard your data.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">1. Information We Collect</h3>
            <ul>
              <li><strong>Newsletter Subscription:</strong> Your email address when you voluntarily opt into our weekly briefing.</li>
              <li><strong>Reader Comments:</strong> Your name and email address provided during discussion submission.</li>
              <li><strong>Aggregate Analytics:</strong> Anonymous telemetry (page views, browser type, geographic region) to improve site performance.</li>
            </ul>

            <h3 className="text-lg font-bold text-[#071A33]">2. Zero Sale of Personal Data</h3>
            <p>
              We will never sell, rent, monetize, or transfer your email address or personal identity to third-party data brokers.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">3. Right to Erasure</h3>
            <p>
              You may request immediate deletion of your email address and commenting history at any time by contacting <a href="mailto:contact@clementtrends.com.ng" className="text-[#0066CC]">contact@clementtrends.com.ng</a> or clicking Unsubscribe in any email newsletter.
            </p>
          </div>
        )}

        {/* 5. TERMS & CONDITIONS */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              Terms of Service &amp; Intellectual Property
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <p>
              By accessing and reading ClementTrends (https://clementtrends.com.ng), you agree to comply with and be bound by these Terms of Service.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">Intellectual Property Protection</h3>
            <p>
              All original editorial text, custom comparison charts, logo marks, and branding belong exclusively to ClementTrends. You may cite short excerpts with clear canonical attribution and backlink to the original article. Automated scraping or full republication without written permission is strictly prohibited.
            </p>
          </div>
        )}

        {/* 6. COOKIE POLICY */}
        {activeTab === 'cookie' && (
          <div className="space-y-6">
            <h2 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              Cookie Policy
            </h2>
            <p className="text-xs text-slate-400">Last Revised: August 2026</p>

            <p>
              Cookies are small text files placed on your device to enhance navigation, store reading bookmarks, and measure aggregate site speed.
            </p>

            <h3 className="text-lg font-bold text-[#071A33]">Types of Cookies We Use</h3>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for user preferences, article bookmarking, and security.</li>
              <li><strong>Analytics Cookies:</strong> Privacy-friendly aggregate metrics (Google Analytics) to optimize article delivery speed.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
