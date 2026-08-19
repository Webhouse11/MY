import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, ShieldCheck, CheckCircle2, User } from 'lucide-react';

interface CommentsSectionProps {
  articleId: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ articleId }) => {
  const { comments, addComment } = useApp();
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Filter approved comments for this article
  const approvedComments = comments.filter(
    c => c.articleId === articleId && c.status === 'approved'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) return;

    addComment(articleId, authorName.trim(), authorEmail.trim(), content.trim());
    setSubmitted(true);
    setAuthorName('');
    setAuthorEmail('');
    setContent('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="article-comments-section" className="my-10 pt-8 border-t border-slate-200">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="font-serif-heading text-xl font-bold text-[#071A33] flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#0066CC]" /> Reader Discussion ({approvedComments.length})
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          Moderated for respectful &amp; thoughtful discourse
        </span>
      </div>

      {/* Comment submission form */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs mb-8">
        <h4 className="text-sm font-bold text-[#071A33] mb-1">
          Join the Intelligence Exchange
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Your email address will not be published. Required fields are marked *
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Thank you! Your perspective has been submitted and will appear shortly following editorial review.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  placeholder="e.g. Samuel Adeyemi"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address * (Private)
                </label>
                <input
                  type="email"
                  required
                  value={authorEmail}
                  onChange={e => setAuthorEmail(e.target.value)}
                  placeholder="samuel@domain.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Comment or Feedback *
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Share your thoughts, experiences, or questions regarding this analysis..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Submit Comment
            </button>
          </form>
        )}
      </div>

      {/* Approved Comments List */}
      <div className="space-y-4">
        {approvedComments.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-xs text-slate-500">
            Be the first to share an insightful response to this article.
          </div>
        ) : (
          approvedComments.map(comment => {
            const commentDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#071A33]/10 text-[#0066CC] flex items-center justify-center font-bold text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#071A33]">{comment.authorName}</h5>
                      <span className="text-[10px] text-slate-400">{commentDate}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Reader
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9">
                  {comment.content}
                </p>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
