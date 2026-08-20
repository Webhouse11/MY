import React, { useState } from 'react';
import {
  Link2,
  Copy,
  Check,
  Share2,
  QrCode,
  ExternalLink,
  MessageCircle,
  Send,
  Mail,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { getArticlePersonalUrl, copyToClipboard } from '../../utils/linkUtils';

interface ArticlePermalinkCardProps {
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
}

export const ArticlePermalinkCard: React.FC<ArticlePermalinkCardProps> = ({
  title,
  slug,
  excerpt,
  coverImage
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const personalUrl = getArticlePersonalUrl(slug);
  const encodedTitle = encodeURIComponent(`${title} | ClementTrends`);
  const encodedUrl = encodeURIComponent(personalUrl);
  const encodedExcerpt = encodeURIComponent(excerpt || title);

  const handleCopy = async () => {
    const ok = await copyToClipboard(personalUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || `Read "${title}" on ClementTrends:`,
          url: personalUrl
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      handleCopy();
    }
  };

  // Google Chart API / QR Server fallback for instant QR generation without heavy dependencies
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(personalUrl)}&color=071A33&bgcolor=FFFFFF&margin=1`;

  return (
    <div className="my-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 border border-blue-200/80 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0066CC] text-white flex items-center justify-center shadow-xs">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#071A33] flex items-center gap-1.5">
              Personal Post Link &amp; Sharing
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0066CC] text-[10px] font-bold uppercase tracking-wider">
                Direct URL
              </span>
            </h4>
            <p className="text-xs text-slate-500">
              Share this dedicated link with your audience, friends, and social networks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              title="Share via device apps"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#0066CC]" />
              <span className="hidden sm:inline">Device Share</span>
            </button>
          )}

          <button
            onClick={() => setShowQr(!showQr)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
              showQr
                ? 'bg-[#071A33] text-[#F7931E] border-[#071A33]'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Generate QR code for mobile scanning"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
        </div>
      </div>

      {/* Direct Link Input Box */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex-1 px-3 py-1.5 text-xs font-mono text-[#071A33] truncate select-all">
          {personalUrl}
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-emerald-200'
              : 'bg-[#071A33] hover:bg-[#0066CC] text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-[#F7931E]" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* QR Code Expansion Modal/Box */}
      {showQr && (
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs shrink-0">
            <img
              src={qrCodeUrl}
              alt={`QR Code for ${title}`}
              className="w-32 h-32 rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#0066CC] bg-blue-50 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Instant Mobile Scan
            </span>
            <h5 className="font-bold text-[#071A33] text-sm">
              Scan with your phone camera
            </h5>
            <p className="text-xs text-slate-500 max-w-sm">
              Point your smartphone camera at this QR code to instantly open this personal article link on your mobile browser.
            </p>
          </div>
        </div>
      )}

      {/* 1-Click Social Sharing Links */}
      <div className="pt-2 flex flex-wrap items-center gap-2 border-t border-blue-100">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
          Share to:
        </span>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share to WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>WhatsApp</span>
        </a>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-black text-white transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share to X"
        >
          <span className="font-bold">𝕏</span>
          <span>Post</span>
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25 text-[#0A66C2] transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share to LinkedIn"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>LinkedIn</span>
        </a>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#1877F2] transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share to Facebook"
        >
          <span className="font-bold">f</span>
          <span>Facebook</span>
        </a>

        {/* Telegram */}
        <a
          href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#0088cc]/15 hover:bg-[#0088cc]/25 text-[#0088cc] transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share to Telegram"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Telegram</span>
        </a>

        {/* Email */}
        <a
          href={`mailto:?subject=${encodedTitle}&body=I thought you might find this insightful:%0A%0A${encodedExcerpt}%0A%0ARead the full article here: ${encodedUrl}`}
          className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          title="Share via Email"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email</span>
        </a>
      </div>
    </div>
  );
};
