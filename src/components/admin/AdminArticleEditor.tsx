import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Article, CategoryId, ReviewDetails } from '../../types';
import { optimizeImageFile } from '../../utils/imageOptimizer';
import {
  Save,
  ArrowLeft,
  Eye,
  Sparkles,
  Search,
  Tag,
  Star,
  CheckCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  Globe,
  Upload,
  RefreshCw,
  FolderOpen,
  Check,
  X,
  UploadCloud,
  Layers,
  Link as LinkIcon
} from 'lucide-react';

interface AdminArticleEditorProps {
  articleId?: string | null;
  onBack: () => void;
}

const CURATED_IMAGE_PRESETS = [
  {
    name: 'CPEN Crypto Surge & Chart Analysis',
    url: 'https://res.cloudinary.com/dhzouslh1/image/upload/v1787127451/unnamed_hy6jq4.png',
    tag: 'Blockchain Fortune / Crypto'
  },
  {
    name: 'RUTH: The Informant Book Cover',
    url: 'https://res.cloudinary.com/dhzouslh1/image/upload/v1787001520/1780408439687553-0_jfsnd5.jpg',
    tag: 'Book / Motivation'
  },
  {
    name: 'AI & Neural Tech',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1400&q=80',
    tag: 'Artificial Intelligence'
  },
  {
    name: 'Fintech & Trading',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80',
    tag: 'Fintech'
  },
  {
    name: 'Crypto & Blockchain',
    url: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?auto=format&fit=crop&w=1400&q=80',
    tag: 'Crypto'
  },
  {
    name: 'Modern Laptop & Desk',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80',
    tag: 'Tech Hardware'
  },
  {
    name: 'Code & Software Matrix',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=80',
    tag: 'Software'
  },
  {
    name: 'Cloud & Cyber Network',
    url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80',
    tag: 'Cloud & Security'
  },
  {
    name: 'Mobile Smartphone Device',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80',
    tag: 'Gadgets'
  },
  {
    name: 'Business & Startup Venture',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1400&q=80',
    tag: 'Business'
  }
];

export const AdminArticleEditor: React.FC<AdminArticleEditorProps> = ({
  articleId,
  onBack
}) => {
  const { articles, categories, settings, addArticle, updateArticle, mediaItems, addMediaItem } = useApp();

  const existingArticle = articles.find(a => a.id === articleId);

  // Form State
  const [title, setTitle] = useState(existingArticle?.title || '');
  const [slug, setSlug] = useState(existingArticle?.slug || '');
  const [category, setCategory] = useState<CategoryId>(existingArticle?.category || 'investment');
  const [subcategory, setSubcategory] = useState(existingArticle?.subcategory || '');
  const [excerpt, setExcerpt] = useState(existingArticle?.excerpt || '');
  const [content, setContent] = useState(existingArticle?.content || '');
  const [coverImage, setCoverImage] = useState(existingArticle?.coverImage || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1400&q=80');
  const [coverImageCaption, setCoverImageCaption] = useState(existingArticle?.coverImageCaption || '');
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(existingArticle?.readingTimeMinutes || 5);
  const [tagsInput, setTagsInput] = useState(existingArticle?.tags.join(', ') || '');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>(existingArticle?.status || 'published');
  const [isFeatured, setIsFeatured] = useState(existingArticle !== undefined ? existingArticle.isFeatured : true);
  const [isTrending, setIsTrending] = useState(existingArticle !== undefined ? existingArticle.isTrending : true);
  const [isSponsored, setIsSponsored] = useState(existingArticle?.isSponsored || false);
  const [isAffiliate, setIsAffiliate] = useState(existingArticle?.isAffiliate || false);

  // Image Upload & Replacement Controls
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // SEO State
  const [focusKeyword, setFocusKeyword] = useState(existingArticle?.seoMetadata?.focusKeyword || '');
  const [metaTitle, setMetaTitle] = useState(existingArticle?.seoMetadata?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(existingArticle?.seoMetadata?.metaDescription || '');
  const [schemaType, setSchemaType] = useState<any>(existingArticle?.seoMetadata?.schemaType || 'Article');

  // Review Engine State
  const [enableReview, setEnableReview] = useState(!!existingArticle?.reviewDetails || category === 'reviews');
  const [reviewScore, setReviewScore] = useState(existingArticle?.reviewDetails?.overallScore || 9.0);
  const [reviewBestFor, setReviewBestFor] = useState(existingArticle?.reviewDetails?.bestFor || '');
  const [reviewNotIdealFor, setReviewNotIdealFor] = useState(existingArticle?.reviewDetails?.notIdealFor || '');
  const [reviewPricing, setReviewPricing] = useState(existingArticle?.reviewDetails?.pricing || '');
  const [reviewAffiliateUrl, setReviewAffiliateUrl] = useState(existingArticle?.reviewDetails?.affiliateUrl || '');
  const [reviewVerdict, setReviewVerdict] = useState(existingArticle?.reviewDetails?.verdict || '');
  const [prosList, setProsList] = useState<string[]>(
    existingArticle?.reviewDetails?.pros || ['High performance speed', 'Clean user interface']
  );
  const [consList, setConsList] = useState<string[]>(
    existingArticle?.reviewDetails?.cons || ['Requires modern browser setup']
  );

  const [activeTab, setActiveTab] = useState<'content' | 'review' | 'seo' | 'preview'>('content');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Keep track of loaded article ID to prevent re-renders from clobbering active form edits
  const loadedArticleIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (articleId && articleId !== loadedArticleIdRef.current) {
      const art = articles.find(a => a.id === articleId);
      if (art) {
        loadedArticleIdRef.current = articleId;
        setTitle(art.title);
        setSlug(art.slug);
        setCategory(art.category);
        setSubcategory(art.subcategory || '');
        setExcerpt(art.excerpt);
        setContent(art.content);
        setCoverImage(art.coverImage || '');
        setCoverImageCaption(art.coverImageCaption || '');
        setReadingTimeMinutes(art.readingTimeMinutes);
        setTagsInput(art.tags.join(', '));
        setStatus(art.status);
        setIsFeatured(art.isFeatured !== undefined ? art.isFeatured : true);
        setIsTrending(art.isTrending !== undefined ? art.isTrending : true);
        setIsSponsored(art.isSponsored || false);
        setIsAffiliate(art.isAffiliate || false);
        setFocusKeyword(art.seoMetadata?.focusKeyword || '');
        setMetaTitle(art.seoMetadata?.metaTitle || '');
        setMetaDescription(art.seoMetadata?.metaDescription || '');
        setSchemaType(art.seoMetadata?.schemaType || 'Article');
        setEnableReview(!!art.reviewDetails || art.category === 'reviews');
        if (art.reviewDetails) {
          setReviewScore(art.reviewDetails.overallScore || 9.0);
          setReviewBestFor(art.reviewDetails.bestFor || '');
          setReviewNotIdealFor(art.reviewDetails.notIdealFor || '');
          setReviewPricing(art.reviewDetails.pricing || '');
          setReviewAffiliateUrl(art.reviewDetails.affiliateUrl || '');
          setReviewVerdict(art.reviewDetails.verdict || '');
          if (art.reviewDetails.pros && art.reviewDetails.pros.length > 0) {
            setProsList(art.reviewDetails.pros);
          }
          if (art.reviewDetails.cons && art.reviewDetails.cons.length > 0) {
            setConsList(art.reviewDetails.cons);
          }
        }
      }
    }
  }, [articleId, articles]);

  // Auto-generate slug when title changes for new articles
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!existingArticle) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
      setMetaTitle(`${val} | ClementTrends`);
    }
  };

  // Auto-calculate reading time based on content word count
  useEffect(() => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const calcMinutes = Math.max(1, Math.ceil(wordCount / 200));
    setReadingTimeMinutes(calcMinutes);
  }, [content]);

  const selectedCategoryObj = categories.find(c => c.id === category);

  const handleAddPro = () => setProsList([...prosList, '']);
  const handleRemovePro = (index: number) => setProsList(prosList.filter((_, i) => i !== index));
  const handleProChange = (index: number, val: string) => {
    const next = [...prosList];
    next[index] = val;
    setProsList(next);
  };

  const handleAddCon = () => setConsList([...consList, '']);
  const handleRemoveCon = (index: number) => setConsList(consList.filter((_, i) => i !== index));
  const handleConChange = (index: number, val: string) => {
    const next = [...consList];
    next[index] = val;
    setConsList(next);
  };

  // Handle local image file upload for cover
  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP, SVG, GIF)');
      return;
    }

    try {
      setIsUploading(true);
      const dataUrl = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.80 });
      setCoverImage(dataUrl);
      setCoverImageCaption(`Photo: ${file.name.replace(/\.[^/.]+$/, '')}`);
      // Also automatically index into Media Library
      addMediaItem({
        name: file.name,
        url: dataUrl,
        type: 'image',
        sizeBytes: Math.round(dataUrl.length * 0.75),
        dimensions: 'Optimized Web Image'
      });
      setUploadMessage('Image uploaded! Click Save to apply permanently.');
      setTimeout(() => setUploadMessage(null), 4000);
    } catch (err) {
      console.error('Image processing error:', err);
      alert('Failed to process image file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Handle inline markdown body image upload
  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await optimizeImageFile(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.80 });
      // Add to media library
      addMediaItem({
        name: file.name,
        url: dataUrl,
        type: 'image',
        sizeBytes: Math.round(dataUrl.length * 0.75),
        dimensions: 'Article Inline Photo'
      });
      // Insert markdown image
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const markdownImg = `\n\n![${cleanName}](${dataUrl})\n*Photo: ${cleanName}*\n\n`;
      setContent(prev => prev + markdownImg);
      setUploadMessage('Image inserted into article text!');
      setTimeout(() => setUploadMessage(null), 3500);
    } catch (err) {
      console.error('Failed to process inline image:', err);
      alert('Failed to process image file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('Please provide a Title and URL Slug before saving.');
      return;
    }

    try {
      setIsSaving(true);
      const tagsArray = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      let reviewDetailsData: ReviewDetails | undefined = undefined;
      if (enableReview) {
        reviewDetailsData = {
          overallScore: reviewScore,
          pros: prosList.filter(Boolean),
          cons: consList.filter(Boolean),
          bestFor: reviewBestFor,
          notIdealFor: reviewNotIdealFor,
          pricing: reviewPricing,
          affiliateUrl: reviewAffiliateUrl,
          verdict: reviewVerdict
        };
      }

      const payload: Partial<Article> = {
        title: title.trim(),
        slug: slug.trim(),
        category,
        subcategory: subcategory || selectedCategoryObj?.subcategories[0] || '',
        excerpt: excerpt.trim(),
        content,
        coverImage: coverImage.trim(),
        coverImageCaption: coverImageCaption.trim(),
        readingTimeMinutes,
        tags: tagsArray,
        status,
        isFeatured,
        isTrending,
        isSponsored,
        isAffiliate: isAffiliate || enableReview,
        reviewDetails: reviewDetailsData,
        seoMetadata: {
          metaTitle: metaTitle.trim() || title.trim(),
          metaDescription: metaDescription.trim() || excerpt.trim(),
          focusKeyword: focusKeyword.trim(),
          schemaType
        },
        author: {
          id: 'clement',
          name: settings.authorName,
          avatar: settings.authorAvatar,
          role: 'Editor-in-Chief',
          bio: settings.authorBio
        }
      };

      if (existingArticle) {
        updateArticle(existingArticle.id, payload);
      } else {
        addArticle(payload as any);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onBack();
      }, 1200);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-serif-heading text-2xl font-bold text-[#071A33]">
              {existingArticle ? 'Edit Article & Metadata' : 'Create Intelligence Article'}
            </h1>
            <p className="text-xs text-slate-500">
              Compose editorial content with automatic slug generation, SEO schema, and review benchmarks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Changes Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0066CC] disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 text-[#F7931E] animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-[#F7931E]" />
            )}
            <span>
              {isSaving
                ? 'Saving...'
                : existingArticle
                ? 'Update Article'
                : 'Publish to Feed'}
            </span>
          </button>
        </div>
      </div>

      {/* Editor Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('content')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
            activeTab === 'content'
              ? 'bg-[#071A33] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Article Prose &amp; Layout
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'review'
              ? 'bg-[#0066CC] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Star className="w-3.5 h-3.5" /> 2. Product Review Engine
        </button>

        <button
          onClick={() => setActiveTab('seo')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'seo'
              ? 'bg-[#071A33] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Search className="w-3.5 h-3.5" /> 3. SEO &amp; Rich Schema
        </button>

        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> 4. Live Reader Preview
        </button>
      </div>

      {/* TAB 1: MAIN PROSE & LAYOUT */}
      {activeTab === 'content' && (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Body (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Title */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Article Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="e.g. The Strategic Playbook for African Tech Scale-ups in 2026"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base font-bold text-[#071A33] focus:bg-white focus:outline-none focus:border-[#0066CC]"
                />
              </div>

              {/* Slug & Personal Link Generator */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">
                  Canonical URL Slug &amp; Generated Personal Link
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="article-url-slug"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-[#0066CC]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (slug) {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/?article=${slug}` : `https://clementtrends.com.ng/?article=${slug}`;
                        navigator.clipboard.writeText(url);
                        alert('Personal Post Link copied to clipboard!\n\n' + url);
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                    title="Copy direct post link"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-[#0066CC]" />
                    <span>Copy Post Link</span>
                  </button>
                </div>
                {slug && (
                  <p className="text-[11px] font-mono text-[#0066CC] flex items-center gap-1">
                    <span className="text-slate-400">Generated URL:</span>
                    <span>{typeof window !== 'undefined' ? window.location.origin : 'https://clementtrends.com.ng'}/?article={slug}</span>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Executive Excerpt / Lead Summary *
                </label>
                <textarea
                  rows={3}
                  required
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="A concise 2-3 sentence overview that hooks readers and outlines strategic takeaways..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>

            {/* Markdown Content Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Article Content (Markdown &amp; Editorial Prose) *
                </label>
                <span className="text-xs text-slate-400">
                  Est. {readingTimeMinutes} min read ({content.trim().split(/\s+/).filter(Boolean).length} words)
                </span>
              </div>

              {/* Quick Markdown Helpers */}
              <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => setContent(prev => prev + '\n\n## Subheading Title\n')}
                  className="px-2 py-1 bg-white rounded font-bold hover:bg-slate-200 cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => setContent(prev => prev + '\n\n### Sub-section Title\n')}
                  className="px-2 py-1 bg-white rounded font-bold hover:bg-slate-200 cursor-pointer"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => setContent(prev => prev + '\n\n> "Notable insight or expert quote goes here."\n')}
                  className="px-2 py-1 bg-white rounded italic hover:bg-slate-200 cursor-pointer"
                >
                  Quote
                </button>
                <button
                  type="button"
                  onClick={() => setContent(prev => prev + '\n* Bullet point 1\n* Bullet point 2\n')}
                  className="px-2 py-1 bg-white rounded hover:bg-slate-200 cursor-pointer"
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => setContent(prev => prev + '\n| Feature | Benchmark A | Benchmark B |\n|---|---|---|\n| Metric | High | Very High |\n')}
                  className="px-2 py-1 bg-white rounded hover:bg-slate-200 cursor-pointer"
                >
                  Table
                </button>
              </div>

              <textarea
                rows={18}
                required
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Write your in-depth editorial analysis using Markdown headings (##), lists (*), and blockquotes (>)..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          {/* Publishing Sidebar Controls (4 cols on lg) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status & Category */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] pb-2 border-b border-slate-100">
                Publishing Parameters
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0066CC]"
                >
                  <option value="published">Published (Live on Feed)</option>
                  <option value="draft">Draft (Private)</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Category Vertical *
                </label>
                <select
                  value={category}
                  onChange={e => {
                    const newCat = e.target.value as CategoryId;
                    setCategory(newCat);
                    const catObj = categories.find(c => c.id === newCat);
                    if (catObj && catObj.subcategories.length > 0) {
                      setSubcategory(catObj.subcategories[0]);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#0066CC]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategoryObj && selectedCategoryObj.subcategories.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sub-topic Vertical
                  </label>
                  <select
                    value={subcategory}
                    onChange={e => setSubcategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#0066CC]"
                  >
                    {selectedCategoryObj.subcategories.map(sub => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Badges Toggles */}
              <div className="pt-2 space-y-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded text-[#0066CC]"
                  />
                  <span>Lead Hero Featured Article</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={e => setIsTrending(e.target.checked)}
                    className="rounded text-[#0066CC]"
                  />
                  <span>Trending Now Ticker / Carousel</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={e => setIsSponsored(e.target.checked)}
                    className="rounded text-[#0066CC]"
                  />
                  <span>Sponsored Commercial Content</span>
                </label>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#0066CC]" /> Featured Cover Image
                </h3>
                {uploadMessage && (
                  <span className="text-[11px] text-emerald-600 font-semibold animate-pulse">
                    {uploadMessage}
                  </span>
                )}
              </div>

              {/* Hidden File Input for local file upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverFileUpload}
                className="hidden"
              />

              {/* Current Image Preview & Quick Replace Controls */}
              {coverImage ? (
                <div className="space-y-3">
                  <div className="relative group rounded-2xl overflow-hidden aspect-[16/9] border border-slate-200 bg-slate-900 shadow-inner">
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay Action Buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3 flex-wrap">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-white text-[#071A33] text-xs font-bold shadow-lg hover:bg-[#0066CC] hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Upload New</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowMediaLibrary(true)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-bold shadow-lg hover:bg-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Media Library</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage('');
                          setCoverImageCaption('');
                          setUploadMessage('Image removed! Remember to click Save.');
                          setTimeout(() => setUploadMessage(null), 3500);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Primary Upload & Action Buttons Bar */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full py-2.5 px-2 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="truncate">{isUploading ? 'Uploading...' : 'Upload New'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className="w-full py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#071A33] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" />
                      <span className="truncate">Presets</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage('');
                        setCoverImageCaption('');
                        setUploadMessage('Image removed! Remember to click Save.');
                        setTimeout(() => setUploadMessage(null), 3500);
                      }}
                      className="w-full py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="truncate">Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty State Upload Box & Selectors */
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-[#0066CC] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-blue-50/50 space-y-2"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 text-[#0066CC] flex items-center justify-center">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-[#071A33]">Click to Upload Cover Image</p>
                    <p className="text-[11px] text-slate-400">Supports JPEG, PNG, WebP from your device</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMediaLibrary(true)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-[#0066CC]" />
                      <span>Media Library</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPresets(!showPresets)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F7931E]" />
                      <span>Curated Presets</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Curated Tech Presets Drawer */}
              {showPresets && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Curated Tech Photos
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPresets(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setCoverImage(preset.url);
                          setCoverImageCaption(`Photo: Unsplash / ${preset.tag}`);
                          setShowPresets(false);
                          setUploadMessage('Preset image selected! Click Save to apply.');
                          setTimeout(() => setUploadMessage(null), 3500);
                        }}
                        className="group relative rounded-xl overflow-hidden aspect-video border border-slate-200 hover:border-[#0066CC] cursor-pointer"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-end p-1.5">
                          <span className="text-[10px] font-bold text-white leading-tight drop-shadow-md">
                            {preset.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct URL Input Accordion */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span>Image Web Link (URL or Data)</span>
                  <button
                    type="button"
                    onClick={() => setShowMediaLibrary(true)}
                    className="text-[#0066CC] hover:underline font-semibold text-[11px] cursor-pointer flex items-center gap-1"
                  >
                    <FolderOpen className="w-3 h-3" /> Browse Library
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or data:image/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0066CC]"
                  />
                  {coverImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage('');
                        setCoverImageCaption('');
                        setUploadMessage('Image removed! Remember to click Save.');
                        setTimeout(() => setUploadMessage(null), 3500);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title="Clear image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Cover Image Caption &amp; Attribution
                </label>
                <input
                  type="text"
                  value={coverImageCaption}
                  onChange={e => setCoverImageCaption(e.target.value)}
                  placeholder="Photo: Editorial desk"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#071A33] pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-[#0066CC]" /> Topic Tags
              </h3>

              <input
                type="text"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                placeholder="Comma separated: AI, Startups, SEO, Tools"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#0066CC]"
              />
              <p className="text-[11px] text-slate-400">
                Separate tags with commas to enable search indexing and related article queries.
              </p>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: PRODUCT REVIEW ENGINE */}
      {activeTab === 'review' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="font-serif-heading text-xl font-bold text-[#071A33]">
                Product Review Engine &amp; Rating Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Configure structured benchmarks, overall score, pros/cons breakdown, and commercial affiliate call-to-actions.
              </p>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-[#071A33] cursor-pointer">
              <input
                type="checkbox"
                checked={enableReview}
                onChange={e => setEnableReview(e.target.checked)}
                className="rounded text-[#0066CC] w-4 h-4"
              />
              <span>Enable Structured Review Box</span>
            </label>
          </div>

          {enableReview ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Overall Editorial Score (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={reviewScore}
                    onChange={e => setReviewScore(parseFloat(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#071A33] focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Starting Pricing Tier
                  </label>
                  <input
                    type="text"
                    value={reviewPricing}
                    onChange={e => setReviewPricing(e.target.value)}
                    placeholder="e.g. Free Tier, $20/mo Pro"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct / Affiliate Link URL
                  </label>
                  <input
                    type="url"
                    value={reviewAffiliateUrl}
                    onChange={e => setReviewAffiliateUrl(e.target.value)}
                    placeholder="https://affiliate.service.com/ref"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Best For (Ideal User Profile)
                  </label>
                  <input
                    type="text"
                    value={reviewBestFor}
                    onChange={e => setReviewBestFor(e.target.value)}
                    placeholder="e.g. Full-stack engineers, bootstrapping founders"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Not Ideal For (Edge Cases)
                  </label>
                  <input
                    type="text"
                    value={reviewNotIdealFor}
                    onChange={e => setReviewNotIdealFor(e.target.value)}
                    placeholder="e.g. Non-technical marketers, offline teams"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
                  />
                </div>
              </div>

              {/* Pros & Cons Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                {/* Pros */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Key Strengths (Pros)
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddPro}
                      className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Pro
                    </button>
                  </div>
                  {prosList.map((pro, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pro}
                        onChange={e => handleProChange(pIdx, e.target.value)}
                        placeholder="Strength description..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePro(pIdx)}
                        className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Cons */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700">
                      Limitations &amp; Drawbacks (Cons)
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddCon}
                      className="text-xs font-bold text-rose-700 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Con
                    </button>
                  </div>
                  {consList.map((con, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={con}
                        onChange={e => handleConChange(cIdx, e.target.value)}
                        placeholder="Drawback description..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-rose-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveCon(cIdx)}
                        className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Editorial Verdict */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Final Editorial Verdict Summary
                </label>
                <textarea
                  rows={3}
                  value={reviewVerdict}
                  onChange={e => setReviewVerdict(e.target.value)}
                  placeholder="Definitive concluding judgment on the product..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-[#0066CC]"
                />
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50 text-slate-500 text-xs space-y-2">
              <p>Review benchmarks are disabled for standard editorial articles.</p>
              <p>Check the box above to activate the structured testing matrix for software or products.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEO & SCHEMA */}
      {activeTab === 'seo' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 max-w-4xl mx-auto">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="font-serif-heading text-xl font-bold text-[#071A33]">
              Search Engine Optimization &amp; Structured JSON-LD Data
            </h2>
            <p className="text-xs text-slate-500">
              Ensure high ranking on Google Search and optimal social card rendering on 𝕏, Facebook, and LinkedIn.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={e => setFocusKeyword(e.target.value)}
                placeholder="e.g. AI code editor, treasury bills Nigeria"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta SEO Title (Appears in Google Results)
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={e => setMetaTitle(e.target.value)}
                placeholder="SEO Title | ClementTrends"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {metaTitle.length}/60 recommended characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Description (Search Snippet)
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={e => setMetaDescription(e.target.value)}
                placeholder="Compelling meta description explaining the article..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                {metaDescription.length}/160 recommended characters
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                JSON-LD Schema Type
              </label>
              <select
                value={schemaType}
                onChange={e => setSchemaType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-[#0066CC]"
              >
                <option value="Article">Article</option>
                <option value="NewsArticle">NewsArticle</option>
                <option value="TechArticle">TechArticle</option>
                <option value="Review">Product Review</option>
              </select>
            </div>

            {/* Google SERP Preview Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Google Search Snippet Simulation
              </span>
              <p className="text-[#0066CC] font-bold text-base hover:underline cursor-pointer">
                {metaTitle || title || 'Untitled Article'}
              </p>
              <p className="text-emerald-700 text-xs">
                https://clementtrends.com.ng › article › {slug || 'sample-slug'}
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                {metaDescription || excerpt || 'Article description snippet will render here...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LIVE READER PREVIEW */}
      {activeTab === 'preview' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
            <span className="font-bold text-[#071A33]">Live Reader Rendering Preview</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0066CC] text-white font-bold uppercase text-[10px]">
              {category}
            </span>
          </div>

          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#071A33]">
            {title || 'Article Headline'}
          </h1>
          <p className="text-slate-600 text-base">{excerpt || 'Executive excerpt preview...'}</p>

          {coverImage && (
            <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-slate-900 border border-slate-200">
              <img
                src={coverImage}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="article-prose pt-4 whitespace-pre-wrap font-editorial-body text-slate-800 leading-relaxed">
            {content || 'Article markdown body will render here.'}
          </div>
        </div>
      )}

      {/* Persistent Bottom Save Bar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm mt-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Cancel / Back
          </button>
          <span className="text-xs text-slate-400">
            {existingArticle ? 'Editing existing article' : 'Composing new article'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Changes Saved Successfully!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 rounded-xl bg-[#071A33] hover:bg-[#0066CC] disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 text-[#F7931E] animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-[#F7931E]" />
            )}
            <span>
              {isSaving
                ? 'Saving Changes...'
                : existingArticle
                ? 'Save & Update Article'
                : 'Publish Article'}
            </span>
          </button>
        </div>
      </div>

      {/* Media Library Selection Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066CC] flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#071A33] text-sm">Media Library Assets</h3>
                  <p className="text-[11px] text-slate-400">Click any image to set as post cover or upload a new asset</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Upload action inside modal */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-[#0066CC] hover:bg-[#0052a3] text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New File to Library</span>
              </button>
              <span className="text-xs text-slate-400">
                {mediaItems.length} media item{mediaItems.length === 1 ? '' : 's'} available
              </span>
            </div>

            {/* Grid of media items */}
            <div className="flex-1 overflow-y-auto pr-1">
              {mediaItems.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FolderOpen className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No media uploaded yet</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#0066CC] font-bold underline cursor-pointer"
                  >
                    Upload your first image now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setCoverImage(item.url);
                        setCoverImageCaption(`Photo: ${item.name}`);
                        setShowMediaLibrary(false);
                      }}
                      className="group relative rounded-xl overflow-hidden aspect-video border border-slate-200 hover:border-[#0066CC] cursor-pointer bg-slate-100 hover:shadow-md transition-all"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <span className="self-end bg-[#0066CC] text-white p-1 rounded-md text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                        <p className="text-[11px] font-bold text-white truncate drop-shadow">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaLibrary(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
