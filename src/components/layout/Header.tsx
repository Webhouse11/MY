import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../brand/Logo';
import {
  Search,
  Menu,
  X,
  TrendingUp,
  Mail,
  ShieldCheck,
  Bookmark,
  ChevronDown,
  Globe,
  Sliders
} from 'lucide-react';
import { CategoryId } from '../../types';

export const Header: React.FC = () => {
  const {
    currentRoute,
    categories,
    articles,
    navigate,
    goHome,
    goToCategory,
    goToArticle,
    goToSearch,
    goToAdmin,
    settings,
    bookmarks,
    isAdminAuthenticated
  } = useApp();

  const publishedArticles = articles.filter(a => a.status === 'published');
  const hotWireArticles = [...publishedArticles].sort((a, b) => {
    if (b.isTrending && !a.isTrending) return 1;
    if (a.isTrending && !b.isTrending) return -1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  const [newsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ success: boolean; message: string } | null>(null);
  const { subscribeNewsletter } = useApp();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchQuery.trim()) {
      goToSearch(quickSearchQuery.trim());
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setQuickSearchQuery('');
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeNewsletter(newsletterEmail, 'Header Modal');
    setNewsletterStatus(res);
    if (res.success) {
      setTimeout(() => {
        setNewsletterModalOpen(false);
        setNewsletterStatus(null);
        setNewsletterEmail('');
      }, 2500);
    }
  };

  const activeCategory = currentRoute.page === 'category' ? currentRoute.categorySlug : undefined;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      {/* Top Intelligence & Breaking Bar */}
      <div className="bg-[#071A33] text-slate-200 text-xs py-1.5 px-4 sm:px-8 border-b border-[#0A2540]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-2xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#F7931E] bg-[#F7931E]/10 px-2 py-0.5 rounded shrink-0">
              <TrendingUp className="w-3 h-3" /> Trends Wire
            </span>
            {hotWireArticles.length > 0 ? (
              <div className="flex items-center gap-2 truncate">
                <button
                  onClick={() => goToArticle(hotWireArticles[0].slug)}
                  className="text-xs text-slate-300 hover:text-white truncate font-medium text-left cursor-pointer transition-colors"
                >
                  <span className="text-[#F7931E] font-bold mr-1.5">[HOT]</span>
                  {hotWireArticles[0].title}
                </button>
                {hotWireArticles.length > 1 && (
                  <span className="text-slate-500 text-[10px] hidden sm:inline font-mono">
                    +{hotWireArticles.length - 1} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-300 truncate font-medium">
                {settings.breakingNewsTicker || 'Insights, Trends & Ideas for a Smarter Future • ClementTrends 2026 Edition'}
              </p>
            )}
          </div>

          {/* Quick utility actions */}
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300 shrink-0 font-medium">
            <button
              onClick={() => navigate({ page: 'advertise' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Advertise
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => navigate({ page: 'about' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => navigate({ page: 'contact' })}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
            {isAdminAuthenticated && (
              <>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => goToAdmin('overview')}
                  className="inline-flex items-center gap-1 text-[#F7931E] hover:text-white transition-colors cursor-pointer font-bold"
                  title="Editor CMS Portal"
                >
                  <ShieldCheck className="w-3 h-3" /> Editor CMS
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div className="flex items-center gap-4">
            <Logo onClick={goHome} size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={goHome}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentRoute.page === 'home'
                  ? 'text-[#0066CC] bg-blue-50/70 font-bold'
                  : 'text-[#172033] hover:text-[#0066CC] hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            {categories.map(cat => {
              const isActive = activeCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => goToCategory(cat.slug)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#0066CC] bg-blue-50/70 font-bold'
                      : 'text-[#172033] hover:text-[#0066CC] hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Search Trigger */}
            <button
              id="header-search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0066CC] hover:bg-slate-100 transition-colors cursor-pointer relative"
              aria-label="Search ClementTrends"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Editor CMS Button (Visible only when authenticated) */}
            {isAdminAuthenticated && (
              <button
                onClick={() => goToAdmin('overview')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-[#071A33] text-[#F7931E] hover:bg-[#0066CC] hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Editor CMS Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F7931E]" />
                <span>Editor CMS</span>
              </button>
            )}

            {/* Newsletter CTA Button */}
            <button
              onClick={() => setNewsletterModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-[#071A33] text-white hover:bg-[#0066CC] transition-colors shadow-2xs cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#F7931E]" />
              <span>Newsletter</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:text-[#0066CC] hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="py-3 px-2 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center max-w-3xl mx-auto">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickSearchQuery}
                onChange={e => setQuickSearchQuery(e.target.value)}
                placeholder="Search investment, AI tools, marketing guides, business analysis..."
                className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-[#071A33] focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1.5 px-3 py-1.5 bg-[#0066CC] text-white rounded-lg text-xs font-bold hover:bg-[#071A33] transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Slide-Out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end">
          <div className="w-5/6 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Mobile Header Top */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Logo
                onClick={() => {
                  goHome();
                  setMobileMenuOpen(false);
                }}
                size="sm"
              />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="my-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={quickSearchQuery}
                  onChange={e => setQuickSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-3 pr-10 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-slate-400 hover:text-[#0066CC]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-1 py-2 font-medium">
              <button
                onClick={() => {
                  goHome();
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  currentRoute.page === 'home'
                    ? 'text-[#0066CC] bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Home
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    goToCategory(cat.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    activeCategory === cat.slug
                      ? 'text-[#0066CC] bg-blue-50'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Additional Company & Trust Links */}
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600 font-medium">
              <button
                onClick={() => {
                  navigate({ page: 'about' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#0066CC]"
              >
                About ClementTrends
              </button>
              <button
                onClick={() => {
                  navigate({ page: 'advertise' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#0066CC]"
              >
                Advertise &amp; Sponsorships
              </button>
              <button
                onClick={() => {
                  navigate({ page: 'contact' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#0066CC]"
              >
                Contact &amp; Editorial Desk
              </button>
              <button
                onClick={() => {
                  navigate({ page: 'legal', legalTab: 'editorial' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-1 hover:text-[#0066CC]"
              >
                Editorial Standards &amp; Trust
              </button>
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    goToAdmin('overview');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 font-bold text-[#0066CC] flex items-center gap-1 mt-2 bg-blue-50/50 px-2 rounded-md"
                >
                  <ShieldCheck className="w-4 h-4 text-[#F7931E]" /> Editor CMS Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscribe Modal */}
      {newsletterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
            <button
              onClick={() => {
                setNewsletterModalOpen(false);
                setNewsletterStatus(null);
              }}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#071A33] text-[#F7931E] flex items-center justify-center mb-4">
              <Mail className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-[#071A33] font-serif-heading mb-1.5">
              Stay Ahead of the Trends
            </h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Join 45,000+ ambitious founders, investors, and professionals receiving our weekly executive digest on Investment, AI, Marketing, and Emerging Tech.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work or Personal Email
                </label>
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
                />
              </div>

              {newsletterStatus && (
                <div
                  className={`p-3 rounded-lg text-xs ${
                    newsletterStatus.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {newsletterStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-sm transition-colors shadow-sm cursor-pointer"
              >
                Join Weekly Intelligence Briefing
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Strict privacy. Zero spam. Unsubscribe in 1 click at any time.
              </p>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
