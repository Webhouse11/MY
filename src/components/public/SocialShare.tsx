import React, { useState } from 'react';
import { Share2, Check, Copy, MessageCircle, Send, Smartphone } from 'lucide-react';
import { getArticlePersonalUrl, copyToClipboard } from '../../utils/linkUtils';

interface SocialShareProps {
  title: string;
  url?: string;
  articleSlug?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({ title, url, articleSlug }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (articleSlug ? getArticlePersonalUrl(articleSlug) : (typeof window !== 'undefined' ? window.location.href : ''));
  const encodedTitle = encodeURIComponent(`${title} | ClementTrends`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(shareUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Read "${title}" on ClementTrends:`,
          url: shareUrl
        });
      } catch (err) {
        // User dismissed share dialog
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-4 border-y border-slate-200/80 my-6">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mr-1">
        <Share2 className="w-3.5 h-3.5 text-[#0066CC]" /> Share Post:
      </span>

      {/* WhatsApp */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%0A${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20 transition-colors flex items-center gap-1"
        title="Share on WhatsApp"
      >
        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
      </a>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1"
        title="Share on X"
      >
        <span className="font-bold">𝕏</span> Post
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors flex items-center gap-1"
        title="Share on LinkedIn"
      >
        LinkedIn
      </a>

      {/* Telegram */}
      <a
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 transition-colors flex items-center gap-1"
        title="Share on Telegram"
      >
        <Send className="w-3 h-3" /> Telegram
      </a>

      {/* Native device share if supported */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#0066CC] hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
          title="Share to apps on device"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Device</span>
        </button>
      )}

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 ml-auto cursor-pointer"
        title="Copy Personal Link to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};
