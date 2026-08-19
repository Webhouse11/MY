import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, CheckCircle2, Globe, TrendingUp, Users, Eye, BarChart, Send, ShieldCheck } from 'lucide-react';

export const AdvertisePage: React.FC = () => {
  const { settings } = useApp();
  const [inquiry, setInquiry] = useState({
    companyName: '',
    contactName: '',
    email: '',
    campaignType: 'Sponsored Editorial + Social Distribution',
    budgetRange: '$1,000 – $2,500',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-[#D97706] inline-block">
          Partnerships &amp; Media Kit
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-5xl font-bold text-[#071A33]">
          Reach the Next Generation of Global Leaders &amp; Operators
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Position your brand in front of 150,000+ monthly executives, tech founders, software engineers, and high-net-worth investors across Nigeria, Africa, the UK, the US, and Canada.
        </p>
      </div>

      {/* Audience Demographics Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <p className="text-3xl font-extrabold text-[#071A33] font-serif">150K+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#0066CC]">Monthly Unique Readers</p>
          <p className="text-[11px] text-slate-400">High-intent decision makers</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <p className="text-3xl font-extrabold text-[#071A33] font-serif">45K+</p>
          <p className="text-xs font-bold uppercase tracking-wider text-[#F7931E]">Newsletter Subscribers</p>
          <p className="text-[11px] text-slate-400">42.8% Average Open Rate</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <p className="text-3xl font-extrabold text-[#071A33] font-serif">58%</p>
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Nigeria &amp; West Africa</p>
          <p className="text-[11px] text-slate-400">Emerging tech &amp; financial leaders</p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-center space-y-1">
          <p className="text-3xl font-extrabold text-[#071A33] font-serif">42%</p>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">UK, US &amp; Global</p>
          <p className="text-[11px] text-slate-400">Diaspora &amp; International enterprise</p>
        </div>
      </div>

      {/* Advertising Formats & Rate Card */}
      <div className="mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Sponsorship &amp; Campaign Formats
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Select standard high-impact display packages or custom co-branded investigative deep dives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Package 1 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Display Network
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-[#071A33]">
                Header &amp; In-Feed Display
              </h3>
              <p className="text-2xl font-bold text-[#071A33] my-2">$500 <span className="text-xs font-normal text-slate-400">/ month</span></p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Guaranteed high-visibility banner placement across our Top Leaderboard, In-Article slots, and Category archives.
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Top Leaderboard Banner (1200x250)</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Desktop Sidebar Sticky Container</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Mobile Responsive Delivery</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Transparent Real-Time CTR Analytics</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setInquiry({ ...inquiry, campaignType: 'Header & In-Feed Display' });
                document.getElementById('ad-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#071A33] hover:text-white text-[#071A33] font-bold text-xs transition-colors cursor-pointer"
            >
              Select Package
            </button>
          </div>

          {/* Package 2 (Featured) */}
          <div className="p-6 rounded-3xl bg-[#071A33] text-white shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden border-2 border-[#F7931E]">
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#F7931E] text-[#071A33] text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F7931E] block mb-1">
                Thought Leadership
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-white">
                Sponsored Deep-Dive &amp; Review
              </h3>
              <p className="text-2xl font-bold text-white my-2">$1,200 <span className="text-xs font-normal text-slate-300">/ piece</span></p>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                A dedicated, 2,500-word investigative analysis or rigorous software review authored with full journalistic standards and perpetual SEO authority.
              </p>

              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#F7931E]" /> Full Investigative Editorial Article</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#F7931E]" /> Featured on Homepage Hero &amp; Trending for 14 Days</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#F7931E]" /> Dedicated Newsletter Blast to 45K+ Subscribers</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#F7931E]" /> Social Promotion across 𝕏, LinkedIn &amp; WhatsApp</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setInquiry({ ...inquiry, campaignType: 'Sponsored Deep-Dive & Review' });
                document.getElementById('ad-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-[#F7931E] hover:bg-[#ff9e30] text-[#071A33] font-bold text-xs transition-colors cursor-pointer"
            >
              Book Sponsored Story
            </button>
          </div>

          {/* Package 3 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Direct Audience
              </span>
              <h3 className="font-serif-heading text-xl font-bold text-[#071A33]">
                Newsletter Takeover
              </h3>
              <p className="text-2xl font-bold text-[#071A33] my-2">$750 <span className="text-xs font-normal text-slate-400">/ 2 editions</span></p>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Sole presenting sponsor of our weekly executive briefing sent to founders, investors, and technical directors.
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Exclusive Header Logo &amp; Presenting Line</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 150-word Native Sponsor Paragraph + CTA</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 45,000+ Verified Opt-In Subscribers</li>
                <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Comprehensive Post-Campaign Click Report</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setInquiry({ ...inquiry, campaignType: 'Newsletter Takeover' });
                document.getElementById('ad-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#071A33] hover:text-white text-[#071A33] font-bold text-xs transition-colors cursor-pointer"
            >
              Select Package
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Inquiry Form */}
      <div id="ad-inquiry-form" className="max-w-2xl mx-auto p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <h3 className="font-serif-heading text-xl font-bold text-[#071A33] mb-1">
          Initiate a Media Campaign
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Submit your requirements and our partnership coordinator will supply a custom proposal and insertion order.
        </p>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Campaign proposal received! Our commercial desk will reach out to <strong>{inquiry.email}</strong> within 24 hours.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Brand or Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquiry.companyName}
                  onChange={e => setInquiry({ ...inquiry, companyName: e.target.value })}
                  placeholder="e.g. Apex Pay Africa"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={inquiry.contactName}
                  onChange={e => setInquiry({ ...inquiry, contactName: e.target.value })}
                  placeholder="e.g. Cynthia Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={inquiry.email}
                  onChange={e => setInquiry({ ...inquiry, email: e.target.value })}
                  placeholder="cynthia@apexpay.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campaign Format *
                </label>
                <select
                  value={inquiry.campaignType}
                  onChange={e => setInquiry({ ...inquiry, campaignType: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC]"
                >
                  <option value="Header & In-Feed Display">Header &amp; In-Feed Display ($500/mo)</option>
                  <option value="Sponsored Deep-Dive & Review">Sponsored Deep-Dive &amp; Review ($1,200)</option>
                  <option value="Newsletter Takeover">Newsletter Takeover ($750)</option>
                  <option value="Multi-Channel Quarterly Sponsorship">Multi-Channel Quarterly Sponsorship ($3,000+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Campaign Objectives &amp; Timeline
              </label>
              <textarea
                rows={3}
                value={inquiry.notes}
                onChange={e => setInquiry({ ...inquiry, notes: e.target.value })}
                placeholder="Target launch date, audience objectives, product link, or special requirements..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#F7931E]" /> Request Media Kit &amp; Insertion Schedule
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
