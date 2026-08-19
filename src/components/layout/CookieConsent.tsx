import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { navigate } = useApp();

  useEffect(() => {
    const consent = localStorage.getItem('clementtrends_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('clementtrends_cookie_consent', 'all');
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('clementtrends_cookie_consent', 'essential');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#071A33] text-[#F7931E] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold text-[#071A33]">
            Privacy &amp; Cookie Preferences
          </h4>
        </div>
        <button
          onClick={acceptEssential}
          className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        ClementTrends utilizes necessary cookies and privacy-friendly telemetry to ensure fast reading performance, remember bookmarks, and analyze aggregate reader trends.
      </p>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <button
          onClick={() => navigate({ page: 'legal', legalTab: 'cookie' })}
          className="text-[11px] font-semibold text-slate-500 hover:text-[#0066CC] underline cursor-pointer"
        >
          Cookie Policy
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={acceptEssential}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAll}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#071A33] text-white hover:bg-[#0066CC] transition-colors cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};
