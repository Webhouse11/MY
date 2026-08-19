import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import {
  Mail,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  Sparkles,
  Lock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { categories, navigate, goToCategory, settings, subscribeNewsletter, goToAdmin, isAdminAuthenticated } = useApp();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerStatus, setFooterStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleFooterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(footerEmail, 'Footer Form');
    setFooterStatus(res);
    if (res.success) {
      setTimeout(() => {
        setFooterEmail('');
        setFooterStatus(null);
      }, 3000);
    }
  };

  return (
    <footer className="bg-[#071A33] text-slate-300 pt-16 pb-12 border-t border-[#0A2540] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Tier: Brand, Newsletter, Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="white" size="lg" showTagline={true} />
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              ClementTrends is an independent digital publication delivering rigorous insights, data-backed analysis, and actionable frameworks across investment, artificial intelligence, digital marketing, product reviews, and business strategy.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 font-mono text-[11px] text-slate-300">
                <Globe className="w-3.5 h-3.5 text-[#F7931E]" /> clementtrends.com.ng
              </span>
              <span>•</span>
              <span className="text-slate-400">Lagos &amp; Global Desk</span>
            </div>

            {/* Newsletter Inline Box */}
            <div className="pt-4 max-w-md">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Stay Ahead of the Trends
              </p>
              <form onSubmit={handleFooterSubscribe} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={footerEmail}
                    onChange={e => setFooterEmail(e.target.value)}
                    placeholder="Your work or personal email"
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-800/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#F7931E] hover:bg-[#ff9e30] text-[#071A33] font-bold text-xs rounded-lg transition-colors shrink-0 shadow-xs cursor-pointer"
                  >
                    Subscribe
                  </button>
                </div>
                {footerStatus && (
                  <p className={`text-xs ${footerStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {footerStatus.message}
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#0066CC]">
              Core Coverage
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => goToCategory(cat.slug)}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Publication & Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#0066CC]">
              Publication
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ page: 'about' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'author' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Author Profile (Clement)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'advertise' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Advertise With Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'contact' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact &amp; News Tips
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'search' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Search Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#0066CC]">
              Trust &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'editorial' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  Editorial Policy <ShieldCheck className="w-3 h-3 text-emerald-400" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'affiliate' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'disclaimer' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Financial Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'privacy' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'terms' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate({ page: 'legal', legalTab: 'cookie' })}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Tier: Copyright & Information */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p>
              © {new Date().getFullYear()} <strong className="text-slate-300">ClementTrends</strong>. All rights reserved.
            </p>
            <p className="mt-1 text-[11px] text-slate-600">
              Disclaimer: Content published on ClementTrends is for informational and educational purposes only and does not constitute financial, legal, or investment advice.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {isAdminAuthenticated ? (
              <button
                onClick={() => goToAdmin('overview')}
                className="inline-flex items-center gap-1 text-[#F7931E] hover:underline transition-colors cursor-pointer text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Editor CMS
              </button>
            ) : (
              <span
                onDoubleClick={() => goToAdmin('overview')}
                className="text-slate-600 hover:text-slate-500 transition-colors cursor-default select-none text-[11px]"
                title="ClementTrends Media"
              >
                RC-482910
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
