import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Globe, Clock, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, goHome } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setSubmitted(false);
    }, 6000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center space-y-3 mb-12">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-[#0066CC] inline-block">
          Get In Touch
        </span>
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
          Contact &amp; Editorial Desk
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Have an investigative news tip, editorial inquiry, correction request, or partnership proposal? Reach out to the ClementTrends editorial team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-3 border-b border-slate-100">
              Direct Contact Channels
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066CC] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#071A33] block">General &amp; News Tips</span>
                  <a href={`mailto:${settings.contactEmail}`} className="text-[#0066CC] hover:underline">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#071A33] block">Advertising &amp; Sponsorships</span>
                  <a href={`mailto:${settings.adInquiryEmail}`} className="text-[#0066CC] hover:underline">
                    {settings.adInquiryEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-[#071A33] block">Response SLA</span>
                  <p className="text-slate-500">Our editorial desk responds to all verified inquiries within 24–48 business hours.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#071A33] text-white shadow-md text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#F7931E] font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Whistleblower &amp; Confidential Tips
            </div>
            <p className="text-slate-300 leading-relaxed">
              If you have proprietary leaks or tips regarding tech malpractice, fintech exploits, or financial fraud, please request PGP encrypted communication in your subject line.
            </p>
          </div>
        </div>

        {/* Contact Form (7 cols on lg) */}
        <div className="lg:col-span-7">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
            <h3 className="font-serif-heading text-xl font-bold text-[#071A33] mb-1">
              Send an Editorial Message
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below. All fields marked with an asterisk (*) are required.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Message Received Successfully
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Thank you, <strong>{formData.name || 'Friend'}</strong>. Your correspondence has been routed to the ClementTrends desk. We will review your message shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Oluwaseun Davies"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seun@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Inquiry Subject *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Editorial News Tip">Editorial News Tip / Story Idea</option>
                    <option value="Advertising & Sponsorship">Advertising &amp; Sponsorship</option>
                    <option value="Product Review Request">Product Review &amp; Benchmark Request</option>
                    <option value="Correction or Clarification">Correction or Clarification</option>
                    <option value="Legal or Privacy Notice">Legal or Privacy Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Detailed Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide full context, supporting references, or details regarding your inquiry..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:bg-white focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4 text-[#F7931E]" /> Transmit Message to Desk
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
