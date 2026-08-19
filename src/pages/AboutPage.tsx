import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from '../components/brand/Logo';
import { ShieldCheck, Target, Globe, Award, Sparkles, ArrowRight, BookOpen, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { goHome, navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section with Official Brand Emblem Presentation */}
      <div className="text-center space-y-6 mb-16">
        <div className="flex justify-center">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm inline-block">
            <Logo size="xl" showTagline={true} showBadge={true} onClick={goHome} />
          </div>
        </div>

        <div className="space-y-3">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0066CC] inline-block">
            Our Editorial Mission
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#071A33] tracking-tight">
            Insights, Trends &amp; Ideas for a Smarter Future
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            ClementTrends is a premium digital media and business intelligence platform established to deliver trustworthy, actionable, and rigorously researched knowledge to modern builders, investors, and professionals across Nigeria, Africa, and the global English-speaking community.
          </p>
        </div>
      </div>

      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#071A33] text-[#F7931E] flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33]">
            Uncompromising Trust
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every analysis, investment breakdown, and software benchmark undergoes rigorous scrutiny. We reject speculative hype and unverified get-rich-quick claims.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#0066CC] text-white flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33]">
            Practical Actionability
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We don't publish passive commentary. Our articles provide step-by-step mental models, spreadsheets, frameworks, and tactical blueprints that readers can deploy immediately.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F7931E] text-[#071A33] flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33]">
            Pan-African to Global
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Bridging local realities with international standards. We examine macro shifts in Nigeria, the UK, the US, and Canada to offer truly universal strategic value.
          </p>
        </div>
      </div>

      {/* Coverage Pillars */}
      <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white mb-16 space-y-8">
        <div>
          <span className="text-xs font-bold text-[#F7931E] uppercase tracking-wider block mb-2">
            Coverage Pillars
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold">
            Six Verticals Engineered for Modern Operators
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-300">
          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">⛓️ Blockchain News</h4>
            <p>Cryptocurrency intelligence, DeFi protocols, Web3 innovations, and digital asset markets.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">🚀 Digital Marketing</h4>
            <p>High-converting SEO, email automation, organic growth funnels, and customer acquisition.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">🤖 AI &amp; Technology</h4>
            <p>Frontier generative models, prompt architecture, workflow automation, and SaaS.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">⭐ Product Reviews</h4>
            <p>Rigorous, unbiased software benchmarks with clear pros, cons, and transparent verdicts.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">💼 Business &amp; Economy</h4>
            <p>Unit economics, bootstrapping vs venture capital, and emerging market entrepreneurship.</p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="font-bold text-white text-sm">⚡ Motivation &amp; Mastery</h4>
            <p>Disciplined execution systems, mental models, and personal resilience habits.</p>
          </div>
        </div>
      </div>

      {/* Editorial Standards CTA */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4">
        <h3 className="font-serif-heading text-2xl font-bold text-[#071A33]">
          Dedicated to International Standards of Publishing
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Learn more about our editorial corrections policy, fact-checking workflows, commercial transparency guidelines, and privacy safeguards.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate({ page: 'legal', legalTab: 'editorial' })}
            className="px-5 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Read Editorial Policy
          </button>
          <button
            onClick={() => navigate({ page: 'contact' })}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
          >
            Contact Editorial Desk
          </button>
        </div>
      </div>
    </div>
  );
};
