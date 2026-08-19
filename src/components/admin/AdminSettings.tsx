import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, CheckCircle2, User, Globe, Lock, Shield, Mail, Download, Github, FileCode, HardDrive, Upload, RefreshCw, Trash2 } from 'lucide-react';
import { generateAndDownloadProjectZip } from '../../utils/projectExport';
import { optimizeImageFile } from '../../utils/imageOptimizer';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, articles, ads, comments, subscribers, addMediaItem } = useApp();

  const [siteName, setSiteName] = useState(settings.siteName);
  const [siteTagline, setSiteTagline] = useState(settings.siteTagline);
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [authorBio, setAuthorBio] = useState(settings.authorBio);
  const [authorAvatar, setAuthorAvatar] = useState(settings.authorAvatar);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [adInquiryEmail, setAdInquiryEmail] = useState(settings.adInquiryEmail);
  const [breakingTicker, setBreakingTicker] = useState(settings.breakingTicker || '');
  const [twitter, setTwitter] = useState(settings.socialLinks.twitter);
  const [linkedin, setLinkedin] = useState(settings.socialLinks.linkedin);
  const [whatsapp, setWhatsapp] = useState(settings.socialLinks.whatsapp);
  const [facebook, setFacebook] = useState(settings.socialLinks.facebook);
  const [telegram, setTelegram] = useState(settings.socialLinks.telegram);
  const [adminPin, setAdminPin] = useState(settings.adminPin);

  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAvatar(true);
      const dataUrl = await optimizeImageFile(file, { maxWidth: 600, maxHeight: 600, quality: 0.88 });
      setAuthorAvatar(dataUrl);
      addMediaItem({
        name: `avatar-${file.name}`,
        url: dataUrl,
        type: 'image',
        sizeBytes: Math.round(dataUrl.length * 0.75),
        dimensions: 'Author Avatar'
      });
    } catch (err) {
      console.error('Error uploading avatar:', err);
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      await generateAndDownloadProjectZip({
        articles,
        ads,
        settings,
        comments,
        subscribers
      });
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteName,
      siteTagline,
      authorName,
      authorBio,
      authorAvatar,
      contactEmail,
      adInquiryEmail,
      breakingTicker,
      adminPin,
      socialLinks: {
        twitter,
        linkedin,
        whatsapp,
        facebook,
        telegram
      }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Site &amp; Author Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Brand identity, author profile for Clement, announcement ticker, and CMS security PIN.
          </p>
        </div>

        {saved && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" /> Preferences Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & Editorial Presence */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0066CC]" /> Brand &amp; Announcement Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Platform Name *
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={e => setSiteName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Breaking Intelligence Ticker
              </label>
              <input
                type="text"
                value={breakingTicker}
                onChange={e => setBreakingTicker(e.target.value)}
                placeholder="Alert ticker message on header top..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mission Statement &amp; Tagline
            </label>
            <input
              type="text"
              value={siteTagline}
              onChange={e => setSiteTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {/* Clement - Author Profile */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-[#0066CC]" /> Clement (Editor-in-Chief) Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Author Full Name *
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Author Avatar (Upload from Device or enter URL) *
              </label>
              
              {/* Hidden file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                {authorAvatar ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#0066CC] shadow-xs">
                    <img src={authorAvatar} alt="Author" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                    <User className="w-5 h-5" />
                  </div>
                )}

                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    required
                    value={authorAvatar}
                    onChange={e => setAuthorAvatar(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                  />
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="px-3 py-2 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingAvatar ? 'Saving...' : 'Upload Photo'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Author Biography &amp; Professional Background
            </label>
            <textarea
              rows={3}
              value={authorBio}
              onChange={e => setAuthorBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#0066CC]" /> Communication &amp; Social Channels
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Editorial Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={e => setContactEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Advertising Inquiry Email
              </label>
              <input
                type="email"
                value={adInquiryEmail}
                onChange={e => setAdInquiryEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                𝕏 (Twitter) URL
              </label>
              <input
                type="url"
                value={twitter}
                onChange={e => setTwitter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                WhatsApp Channel URL
              </label>
              <input
                type="url"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>
        </div>

        {/* Security & Access PIN */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="font-serif-heading text-lg font-bold text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-600" /> CMS Security PIN
          </h3>
          <p className="text-xs text-slate-500">
            This numeric or alphanumeric code protects your administrative panel. Default PIN is <strong>1234</strong>.
          </p>

          <div className="max-w-xs">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Access PIN *
            </label>
            <input
              type="text"
              required
              value={adminPin}
              onChange={e => setAdminPin(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-sm focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#F7931E]" /> Save All Settings
          </button>
        </div>
      </form>

      {/* GitHub Export & Source Code Backup (ZIP) */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <h3 className="font-serif-heading text-lg font-bold text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-[#F7931E]" /> Export to GitHub &amp; Download Source Code (ZIP)
            </h3>
            <p className="text-xs text-slate-400">
              Download a complete offline backup of ClementTrends (all TypeScript components, CSS, ads, settings, and articles).
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-5 py-3 rounded-2xl bg-[#0066CC] hover:bg-[#F7931E] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Packaging Project ZIP...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Complete Project (ZIP)</span>
              </>
            )}
          </button>
        </div>

        {exportSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>
              <strong>Project ZIP Downloaded!</strong> Extract the file on your computer and push it to GitHub using the commands below.
            </span>
          </div>
        )}

        {/* Step-by-step instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-[#0066CC]" /> Option A: Push to GitHub with Git
            </h4>
            <p className="text-slate-400 text-[11px]">Run these 5 commands in your extracted project folder:</p>
            <pre className="p-3 rounded-xl bg-black/70 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-white/5">
              git init{'\n'}
              git add .{'\n'}
              git commit -m "Update ClementTrends"{'\n'}
              git branch -M main{'\n'}
              git remote add origin https://github.com/USERNAME/REPO.git{'\n'}
              git push -u origin main --force
            </pre>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-[#F7931E]" /> Option B: Drag &amp; Drop to GitHub Web
            </h4>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
              <li>Create a new repository on <strong className="text-white">github.com/new</strong>.</li>
              <li>Extract the downloaded <strong className="text-white">clementtrends-source-code.zip</strong> file.</li>
              <li>On GitHub, click <strong className="text-white">uploading an existing file</strong>.</li>
              <li>Drag all files into GitHub and click <strong className="text-white">Commit changes</strong>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
