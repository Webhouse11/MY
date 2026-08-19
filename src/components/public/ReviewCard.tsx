import React from 'react';
import { Article } from '../../types';
import { useApp } from '../../context/AppContext';
import { Star, CheckCircle2, XCircle, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

interface ReviewCardProps {
  article: Article;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ article }) => {
  const { goToArticle } = useApp();
  const review = article.reviewDetails;

  if (!review) return null;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-0.5 text-[#F7931E]">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'fill-[#F7931E]'
                : i === fullStars && hasHalf
                ? 'fill-[#F7931E]/50'
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-2 font-bold text-sm text-[#071A33]">
          {review.rating.toFixed(1)}/5.0
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs hover:border-[#0066CC]/40 transition-all duration-200">
      {/* Top Header Strip */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {review.productLogo && (
            <img
              src={review.productLogo}
              alt={review.productName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC] bg-blue-50 px-2 py-0.5 rounded">
                Verified Benchmark
              </span>
              <span className="text-xs text-slate-400 font-medium">Pricing: {review.pricing}</span>
            </div>
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] mt-0.5">
              {review.productName}
            </h3>
          </div>
        </div>

        <div className="shrink-0">
          {renderStars(review.rating)}
        </div>
      </div>

      {/* Review Body */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Best For / Not For Pill */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-[#071A33] block mb-1">🎯 Best For:</span>
            <p className="text-slate-600 leading-relaxed">{review.bestFor}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="font-bold text-slate-700 block mb-1">⚠️ Not Ideal For:</span>
            <p className="text-slate-600 leading-relaxed">{review.notIdealFor}</p>
          </div>
        </div>

        {/* Pros and Cons Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* What we like */}
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> What We Like
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {review.whatWeLike.slice(0, 3).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What could be better */}
          <div>
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-rose-500" /> What Could Be Better
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {review.whatCouldBeBetter.slice(0, 2).map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="p-3.5 rounded-xl bg-[#071A33]/5 border border-[#071A33]/10 text-xs">
          <span className="font-bold text-[#071A33] block mb-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F7931E]" /> Final Editorial Verdict:
          </span>
          <p className="text-slate-700 leading-relaxed italic">
            "{review.finalVerdict}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => goToArticle(article.slug)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-[#071A33] text-white hover:bg-[#0066CC] transition-colors cursor-pointer text-center"
          >
            Read In-Depth Review &amp; Benchmarks
          </button>

          {review.affiliateUrl && (
            <a
              href={review.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#F7931E]/10 text-[#071A33] hover:bg-[#F7931E]/20 border border-[#F7931E]/30 transition-colors"
            >
              Visit Official Partner Website <ExternalLink className="w-3 h-3 text-[#071A33]" />
            </a>
          )}
        </div>

        {/* Transparent Disclosure */}
        <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Independent review. May contain affiliate links which support our investigative desk at no cost to you.</span>
        </div>
      </div>
    </div>
  );
};
