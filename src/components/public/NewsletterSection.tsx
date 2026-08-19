import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const { subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = subscribeNewsletter(email, 'Homepage Section L');
    setStatus(result);
    if (result.success) {
      setTimeout(() => {
        setEmail('');
        setStatus(null);
      }, 3500);
    }
  };

  return (
    <section id="newsletter-section-l" className="my-14">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0A2540] to-[#071A33] p-8 sm:p-12 text-white overflow-hidden shadow-xl border border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#0066CC]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F7931E]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-2xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#F7931E] text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" /> Intelligence Digest
          </div>

          <h2 className="font-serif-heading text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Stay Ahead of the Trends
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Get practical, data-backed insights on investment, AI tools, digital marketing systems, technology breakthroughs, and personal growth delivered directly to your inbox every Thursday.
          </p>

          <form onSubmit={handleSubmit} className="pt-3 max-w-md mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:bg-white/15 focus:border-[#F7931E] focus:ring-1 focus:ring-[#F7931E] backdrop-blur-xs transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#F7931E] hover:bg-[#ff9e30] text-[#071A33] font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer shrink-0"
              >
                Join Free Briefing
              </button>
            </div>

            {status && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  status.success
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-200 border border-rose-500/30'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#F7931E]" /> No Spam Ever
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#F7931E]" /> 1-Click Unsubscribe
              </span>
              <span>•</span>
              <span>45,000+ Readers</span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
