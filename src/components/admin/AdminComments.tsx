import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Comment } from '../../types';
import {
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  User,
  Filter
} from 'lucide-react';

export const AdminComments: React.FC = () => {
  const { comments, articles, updateCommentStatus, deleteComment, goToArticle } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredComments = comments.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Reader Discussion &amp; Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit reader perspectives, prevent spam bots, and approve high-value feedback.
          </p>
        </div>

        {/* Filter */}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0066CC]"
        >
          <option value="all">All Comments ({comments.length})</option>
          <option value="pending">Pending Review ({comments.filter(c => c.status === 'pending').length})</option>
          <option value="approved">Approved ({comments.filter(c => c.status === 'approved').length})</option>
          <option value="spam">Spam ({comments.filter(c => c.status === 'spam').length})</option>
        </select>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
            No comments found matching the current moderation filter.
          </div>
        ) : (
          filteredComments.map(comment => {
            const article = articles.find(a => a.id === comment.articleId);

            return (
              <div
                key={comment.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-[#0066CC] flex items-center justify-center font-bold text-xs">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-bold text-[#071A33] text-xs sm:text-sm">{comment.authorName}</span>
                      <span className="text-[11px] text-slate-400 ml-2">&lt;{comment.authorEmail}&gt;</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        comment.status === 'approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : comment.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {comment.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {article && (
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <span>On Article:</span>
                    <button
                      onClick={() => goToArticle(article.slug)}
                      className="font-bold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {article.title} <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {comment.content}
                </p>

                {/* Moderation Controls */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve &amp; Publish
                    </button>
                  )}

                  {comment.status !== 'spam' && (
                    <button
                      onClick={() => updateCommentStatus(comment.id, 'spam')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Mark as Spam
                    </button>
                  )}

                  <button
                    onClick={() => deleteComment(comment.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
