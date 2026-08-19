import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Advertisement, AdPlacement } from '../../types';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import {
  Megaphone,
  PlusCircle,
  BarChart2,
  Trash2,
  Edit,
  ExternalLink,
  Eye,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Upload,
  RefreshCw,
  UploadCloud,
  ImageIcon
} from 'lucide-react';

export const AdminAds: React.FC = () => {
  const { ads, addAd, updateAd, deleteAd, addMediaItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const adFileInputRef = useRef<HTMLInputElement>(null);

  // Form
  const [title, setTitle] = useState('');
  const [placement, setPlacement] = useState<AdPlacement>('top_banner');
  const [type, setType] = useState<'image_banner' | 'custom_html' | 'adsense'>('image_banner');
  const [imageUrl, setImageUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [htmlCode, setHtmlCode] = useState('');
  const [altText, setAltText] = useState('');
  const [sponsorName, setSponsorName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const handleAdImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 800, quality: 0.85 });
      setImageUrl(dataUrl);
      addMediaItem({
        name: file.name,
        url: dataUrl,
        type: 'image',
        sizeBytes: Math.round(dataUrl.length * 0.75),
        dimensions: 'Ad Banner'
      });
    } catch (err) {
      console.error('Error optimizing ad creative:', err);
    } finally {
      e.target.value = '';
    }
  };

  const handleOpenNew = () => {
    setEditingAdId(null);
    setTitle('');
    setPlacement('top_banner');
    setType('image_banner');
    setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80');
    setTargetUrl('https://clementtrends.com.ng/advertise');
    setHtmlCode('');
    setAltText('Sponsor Banner');
    setSponsorName('Partner Brand');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEdit = (ad: Advertisement) => {
    setEditingAdId(ad.id);
    setTitle(ad.title || ad.name || '');
    setPlacement(ad.placement);
    setType((ad.type as any) || 'image_banner');
    setImageUrl(ad.imageUrl || '');
    setTargetUrl(ad.targetUrl || '');
    setHtmlCode(ad.htmlCode || '');
    setAltText(ad.altText || '');
    setSponsorName(ad.sponsorName || ad.advertiser || '');
    setIsActive(ad.isActive);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Partial<Advertisement> = {
      title,
      name: title,
      placement,
      type,
      imageUrl,
      targetUrl,
      htmlCode,
      altText,
      sponsorName,
      advertiser: sponsorName,
      isActive
    };

    if (editingAdId) {
      updateAd(editingAdId, payload);
    } else {
      addAd(payload as any);
    }
    setShowModal(false);
  };

  const totalImpressions = ads.reduce((acc, a) => acc + a.impressions, 0);
  const totalClicks = ads.reduce((acc, a) => acc + a.clicks, 0);
  const avgCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const placementLabels: Record<AdPlacement, string> = {
    top_banner: 'Top Banner Leaderboard',
    homepage_middle: 'Homepage Mid-Feed',
    article_top: 'Article Top Banner',
    article_middle: 'Article Mid-Prose',
    article_bottom: 'Article Bottom',
    sidebar: 'Desktop Sidebar Sticky',
    category_middle: 'Category Mid-Archive',
    footer: 'Above Footer Banner',
    mobile_banner: 'Mobile Bottom Banner'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Monetization &amp; Advertisement Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Control banner placements, track impressions, calculate CTR metrics, and embed Google AdSense/custom HTML code.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#F7931E]" /> Add Ad Campaign
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Ad Impressions</span>
          <p className="text-2xl font-bold text-[#071A33] font-serif">{totalImpressions.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Delivered across all placements</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0066CC]">Total Link Clicks</span>
          <p className="text-2xl font-bold text-[#0066CC] font-serif">{totalClicks.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400">Direct referral traffic generated</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Average Click-Through Rate</span>
          <p className="text-2xl font-bold text-emerald-600 font-serif">{avgCTR}%</p>
          <p className="text-[11px] text-slate-400">Industry benchmark: 0.35% – 1.2%</p>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4">Campaign Title &amp; Sponsor</th>
                <th className="p-4">Placement Slot</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Impressions</th>
                <th className="p-4">Clicks (CTR)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {ads.map(ad => {
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';

                return (
                  <tr key={ad.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-[#071A33] text-sm">{ad.title}</div>
                      <div className="text-[11px] text-slate-400">Sponsor: {ad.sponsorName || 'Direct Advertiser'}</div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                        {placementLabels[ad.placement] || ad.placement}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap capitalize text-slate-600 font-medium">
                      {ad.type.replace('_', ' ')}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <button
                        onClick={() => updateAd(ad.id, { isActive: !ad.isActive })}
                        className="cursor-pointer"
                        title="Toggle Active Status"
                      >
                        {ad.isActive ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500">
                            Paused
                          </span>
                        )}
                      </button>
                    </td>

                    <td className="p-4 whitespace-nowrap font-bold text-slate-700">
                      {ad.impressions.toLocaleString()}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-bold text-[#071A33]">{ad.clicks.toLocaleString()}</span>{' '}
                      <span className="text-[11px] text-slate-400">({ctr}%)</span>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(ad)}
                          className="p-1.5 text-slate-500 hover:text-[#0066CC] hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Edit Ad"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAd(ad.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete Ad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / New Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif-heading text-xl font-bold text-[#071A33]">
                {editingAdId ? 'Edit Advertisement Campaign' : 'Create New Ad Placement'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Master Fintech Growth 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Slot Placement *
                  </label>
                  <select
                    value={placement}
                    onChange={e => setPlacement(e.target.value as AdPlacement)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                  >
                    <option value="top_banner">Top Banner (Leaderboard)</option>
                    <option value="homepage_middle">Homepage Mid-Feed</option>
                    <option value="article_top">Article Top</option>
                    <option value="article_middle">Article Mid-Prose</option>
                    <option value="article_bottom">Article Bottom</option>
                    <option value="sidebar">Desktop Sticky Sidebar</option>
                    <option value="category_middle">Category Mid-Archive</option>
                    <option value="footer">Above Footer Banner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ad Format *
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                  >
                    <option value="image_banner">Direct Image Banner</option>
                    <option value="adsense">Google AdSense / Script</option>
                    <option value="custom_html">Custom HTML / iFrame</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sponsor Brand Name
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  placeholder="e.g. Apex Pay Africa"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              {type === 'image_banner' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700">
                        Banner Image *
                      </label>
                      <button
                        type="button"
                        onClick={() => adFileInputRef.current?.click()}
                        className="text-xs font-bold text-[#0066CC] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload File</span>
                      </button>
                    </div>

                    <input
                      ref={adFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAdImageUpload}
                      className="hidden"
                    />

                    {/* Preview + Replace */}
                    {imageUrl && (
                      <div className="relative group rounded-xl overflow-hidden aspect-[21/9] bg-slate-900 border border-slate-200">
                        <img
                          src={imageUrl}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => adFileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white text-[#071A33] text-xs font-bold shadow hover:bg-[#0066CC] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Replace Banner</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        placeholder="https://... or click Upload button"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                      />
                      <button
                        type="button"
                        onClick={() => adFileInputRef.current?.click()}
                        className="px-3 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold hover:bg-[#0052a3] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Destination Target URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={targetUrl}
                      onChange={e => setTargetUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Alt Description
                    </label>
                    <input
                      type="text"
                      value={altText}
                      onChange={e => setAltText(e.target.value)}
                      placeholder="e.g. Fintech course banner"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    AdSense Script / Custom HTML Code *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={htmlCode}
                    onChange={e => setHtmlCode(e.target.value)}
                    placeholder="<script async src='...'></script>"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs focus:outline-none focus:border-[#0066CC]"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded text-[#0066CC]"
                  />
                  <span>Active &amp; Delivering Impressions</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#071A33] text-white font-bold hover:bg-[#0066CC] cursor-pointer"
                  >
                    Save Campaign
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
