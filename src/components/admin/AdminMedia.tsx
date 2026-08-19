import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import {
  Image as ImageIcon,
  PlusCircle,
  Search,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Upload,
  UploadCloud,
  FolderOpen
} from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { mediaItems, addMediaItem, deleteMediaItem } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [altText, setAltText] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (const file of Array.from(files) as File[]) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const dataUrl = await optimizeImageFile(file, { maxWidth: 1400, quality: 0.85 });
        addMediaItem({
          title: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          fileType: 'image/jpeg'
        });
      } catch (err) {
        console.error('Error optimizing media upload:', err);
      }
    }

    e.target.value = '';
  };

  const filteredMedia = mediaItems.filter(m => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return m.title.toLowerCase().includes(q) || m.altText.toLowerCase().includes(q);
  });

  const handleCopy = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    addMediaItem({
      title: title || 'Media Asset',
      url,
      altText: altText || title || 'Editorial image',
      fileType: 'image/jpeg'
    });

    setTitle('');
    setUrl('');
    setAltText('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#071A33]">
            Editorial Media Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload from device, store high-res screenshots, and copy direct CDN URLs for editorial posts.
          </p>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Image
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-[#F7931E]" /> Add by URL
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Filter media by title or alt description..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredMedia.map(item => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:border-[#0066CC] transition-all flex flex-col"
          >
            <div className="aspect-[16/10] bg-slate-900 overflow-hidden relative">
              <img
                src={item.url}
                alt={item.altText}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => deleteMediaItem(item.id)}
                  className="p-1.5 rounded-lg bg-black/70 text-white hover:text-rose-400 cursor-pointer"
                  title="Delete Media"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h4 className="text-xs font-bold text-[#071A33] truncate" title={item.title}>
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate">
                  Alt: {item.altText}
                </p>
              </div>

              <button
                onClick={() => handleCopy(item)}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  copiedId === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#071A33] hover:text-white'
                }`}
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied Direct URL
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Image URL
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-serif-heading text-xl font-bold text-[#071A33]">
                Add Asset to Media Library
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Asset Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. AI Workflow Diagram 2026"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Upload Image File or Enter URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or click Upload"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                  />
                  <label className="px-3 py-2 bg-[#0066CC] hover:bg-[#0052a3] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            if (dataUrl) {
                              setUrl(dataUrl);
                              if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
                              if (!altText) setAltText(file.name.replace(/\.[^/.]+$/, ''));
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Alt Text &amp; Accessibility Description
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={e => setAltText(e.target.value)}
                  placeholder="Descriptive caption for SEO and screen readers"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              {url && (
                <div className="rounded-xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200">
                  <img
                    src={url}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#071A33] text-white font-bold hover:bg-[#0066CC] cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
