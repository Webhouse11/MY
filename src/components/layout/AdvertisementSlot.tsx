import React, { useEffect } from 'react';
import { AdPlacement } from '../../types';
import { useApp } from '../../context/AppContext';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdvertisementSlotProps {
  placement: AdPlacement;
  className?: string;
  variant?: 'standard' | 'compact' | 'sidebar' | 'leaderboard';
}

export const AdvertisementSlot: React.FC<AdvertisementSlotProps> = ({
  placement,
  className = '',
  variant = 'standard'
}) => {
  const { getAdForPlacement, recordAdImpression, recordAdClick, navigate } = useApp();
  const ad = getAdForPlacement(placement);

  useEffect(() => {
    if (ad) {
      recordAdImpression(ad.id);
    }
  }, [ad?.id]);

  const handleAdClick = (e: React.MouseEvent) => {
    if (!ad) return;
    recordAdClick(ad.id);
    if (ad.targetUrl) {
      if (ad.targetUrl.startsWith('http') && !ad.targetUrl.includes(window.location.hostname)) {
        window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
      } else if (ad.targetUrl.includes('/advertise')) {
        e.preventDefault();
        navigate({ page: 'advertise' });
      }
    }
  };

  // If there's an active ad
  if (ad && ad.isActive) {
    return (
      <aside
        id={`ad-slot-${placement}`}
        aria-label="Advertisement"
        className={`w-full my-6 bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden shadow-md relative group transition-all duration-200 hover:border-[#F7931E]/60 ${className}`}
      >
        {/* Sponsored Label */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400 font-medium tracking-wide uppercase">
          <span className="flex items-center gap-1.5 font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" />
            Sponsored Promotion
          </span>
          <span className="text-slate-400 font-mono text-[10px]">{ad.advertiser}</span>
        </div>

        {/* Content based on type */}
        {ad.type === 'html_code' && ad.htmlCode ? (
          <div
            onClick={() => recordAdClick(ad.id)}
            className="p-3 sm:p-4 flex items-center justify-center bg-slate-950/40 min-h-[90px] overflow-hidden"
          >
            <div className="w-full flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.01]">
              <a
                href={ad.targetUrl || 'https://aitimart.cc/new-account/?code=6104337041469743'}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center w-full max-w-full overflow-hidden"
              >
                <img
                  src={ad.imageUrl || 'https://aitimart.cc/images/gif/728.1.en.gif'}
                  alt={ad.altText || 'Aitimart Investment'}
                  referrerPolicy="no-referrer"
                  className="mx-auto max-w-full h-auto rounded-lg shadow-sm object-contain"
                  style={{
                    maxHeight: variant === 'sidebar' ? '300px' : variant === 'leaderboard' ? '120px' : '180px'
                  }}
                  loading="lazy"
                />
              </a>
            </div>
          </div>
        ) : ad.type === 'image_link' && ad.imageUrl ? (
          <a
            href={ad.targetUrl || '#'}
            onClick={handleAdClick}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative overflow-hidden"
          >
            <img
              src={ad.imageUrl}
              alt={ad.altText || ad.name}
              referrerPolicy="no-referrer"
              className="w-full object-contain max-h-[160px] md:max-h-[220px] transition-transform duration-300 group-hover:scale-[1.01]"
              loading="lazy"
            />
            {ad.altText && (
              <div className="p-3 bg-slate-900 flex items-center justify-between gap-2 border-t border-slate-800">
                <span className="text-sm font-semibold text-slate-100 line-clamp-1">
                  {ad.altText}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F7931E] shrink-0">
                  Visit Platform <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            )}
          </a>
        ) : null}
      </aside>
    );
  }

  // Fallback "Advertise With Us" placeholder container
  return (
    <div
      id={`ad-placeholder-${placement}`}
      className={`w-full my-6 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left transition-colors hover:border-[#0066CC]/50 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#071A33]/5 text-[#0066CC] flex items-center justify-center font-bold text-xs">
          AD
        </div>
        <div>
          <p className="text-xs font-bold text-[#071A33] uppercase tracking-wider">
            Sponsor Placement • {placement.replace('_', ' ')}
          </p>
          <p className="text-xs text-slate-500">
            Reach 150,000+ ambitious African and global professionals &amp; tech leaders.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate({ page: 'advertise' })}
        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-white text-[#071A33] border border-slate-200 hover:border-[#0066CC] hover:text-[#0066CC] transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
      >
        Advertise With Us →
      </button>
    </div>
  );
};
