export type CategoryId =
  | 'investment'
  | 'digital-marketing'
  | 'ai-tech'
  | 'reviews'
  | 'business'
  | 'motivation';

export interface Category {
  id: CategoryId;
  name: string;
  slug: string;
  description: string;
  color: string;
  subcategories: string[];
}

export type ArticleStatus = 'published' | 'draft' | 'scheduled';

export interface ReviewScore {
  performance: number;
  valueForMoney: number;
  easeOfUse: number;
  features: number;
  support: number;
  overall: number; // e.g. 4.8
}

export interface ReviewDetails {
  productName?: string;
  productLogo?: string;
  rating?: number; // out of 5
  overallScore?: number;
  scores?: ReviewScore;
  pricing?: string;
  affiliateUrl?: string;
  bestFor?: string;
  notIdealFor?: string;
  whatWeLike?: string[];
  whatCouldBeBetter?: string[];
  pros?: string[];
  cons?: string[];
  alternatives?: string[];
  finalVerdict?: string;
  verdict?: string;
}

export interface SEOData {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogImage?: string;
  schemaType?: 'Article' | 'NewsArticle' | 'Review' | 'TechArticle' | string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: CategoryId;
  subcategory?: string;
  tags: string[];
  coverImage: string;
  coverImageCaption?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  status: ArticleStatus;
  readingTimeMinutes: number;
  viewsCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isSponsored?: boolean;
  isAffiliate?: boolean;
  sponsorName?: string;
  reviewDetails?: ReviewDetails;
  seo?: SEOData;
  seoMetadata?: SEOData;
  allowComments?: boolean;
}

export type AdPlacement =
  | 'top_banner'
  | 'homepage_middle'
  | 'article_top'
  | 'article_middle'
  | 'article_bottom'
  | 'sidebar'
  | 'category_middle'
  | 'footer'
  | 'mobile_banner';

export interface Advertisement {
  id: string;
  name?: string;
  title?: string;
  advertiser?: string;
  sponsorName?: string;
  placement: AdPlacement;
  type: 'image_banner' | 'image_link' | 'html_code' | 'sponsored_card' | 'adsense' | 'custom_html' | string;
  imageUrl?: string;
  targetUrl?: string;
  htmlCode?: string;
  altText?: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  impressions: number;
  clicks: number;
  isSponsored?: boolean;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  status: 'approved' | 'pending' | 'spam';
  parentId?: string; // for nested replies
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: 'active' | 'unsubscribed';
  source?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  category: string;
  fileSize: string;
  dimensions: string;
  uploadedAt: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  siteUrl: string;
  contactEmail: string;
  editorialEmail: string;
  adInquiryEmail: string;
  authorName: string;
  authorBio: string;
  authorAvatar: string;
  socialLinks: {
    twitter: string;
    facebook: string;
    linkedin: string;
    whatsapp: string;
    telegram: string;
    youtube: string;
  };
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsoleVerification: string;
  adminPin: string;
  enableComments: boolean;
  enableAdTracking: boolean;
  breakingNewsTicker: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}
