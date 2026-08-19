import React from 'react';
import { useApp } from '../../context/AppContext';
import { User, Globe, ArrowRight, ShieldCheck, BookOpen } from 'lucide-react';

interface AuthorCardProps {
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  showFullBio?: boolean;
}

export const AuthorCard: React.FC<AuthorCardProps> = ({ author, showFullBio = true }) => {
  const { navigate, articles, settings } = useApp();

  const authorAvatar = (author.avatar && !author.avatar.includes('photo-1534528741775'))
    ? author.avatar
    : (settings.authorAvatar || 'https://res.cloudinary.com/dhzouslh1/image/upload/v1787058447/681239616_960194553518462_5873236656219850661_n_wyww4k.jpg');

  const authorName = author.name || settings.authorName;
  const authorBio = author.bio || settings.authorBio;
  const authorRole = author.role || 'Founder, Author & Editor-in-Chief';

  const authorArticlesCount = articles.filter(
    a => a.author.name.toLowerCase() === authorName.toLowerCase() && a.status === 'published'
  ).length;

  return (
    <div className="my-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row gap-5 sm:gap-6 items-start">
      <img
        src={authorAvatar}
        alt={authorName}
        referrerPolicy="no-referrer"
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-blue-50 shadow-sm shrink-0"
      />

      <div className="flex-1 space-y-2.5 w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-serif-heading text-lg sm:text-xl font-bold text-[#071A33]">
                Written by {authorName}
              </h4>
              <ShieldCheck className="w-4 h-4 text-[#0066CC]" title="Verified Editor & Author" />
            </div>
            <p className="text-xs font-semibold text-[#0066CC] mt-0.5">{authorRole}</p>
          </div>

          <span className="text-xs text-slate-500 font-medium px-3 py-1 rounded-full bg-slate-100">
            {authorArticlesCount} Published Articles
          </span>
        </div>

        {showFullBio && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {authorBio}
          </p>
        )}

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={() => navigate({ page: 'author' })}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#071A33] hover:text-[#0066CC] transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#0066CC]" /> View Full Author Profile &amp; All Articles <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
