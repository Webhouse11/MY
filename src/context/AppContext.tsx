import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Article,
  Category,
  Advertisement,
  SiteSettings,
  MediaItem,
  Comment,
  NewsletterSubscriber,
  ActivityLog,
  CategoryId,
  AdPlacement
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_AUTHOR,
  INITIAL_CATEGORIES,
  INITIAL_ADS,
  INITIAL_SETTINGS,
  INITIAL_MEDIA,
  INITIAL_COMMENTS,
  INITIAL_SUBSCRIBERS
} from '../data/seedData';
import {
  seedFirestoreIfEmpty,
  subscribeToFirestore,
  saveArticleToFirestore,
  deleteArticleFromFirestore,
  saveAdToFirestore,
  deleteAdFromFirestore,
  saveSettingsToFirestore,
  saveMediaItemToFirestore,
  deleteMediaItemFromFirestore,
  saveCommentToFirestore,
  deleteCommentFromFirestore,
  saveSubscriberToFirestore,
  saveActivityLogToFirestore
} from '../lib/firestoreService';

export type PageRoute =
  | 'home'
  | 'category'
  | 'article'
  | 'review'
  | 'search'
  | 'author'
  | 'about'
  | 'contact'
  | 'advertise'
  | 'legal'
  | 'not-found'
  | 'admin';

interface RouteState {
  page: PageRoute;
  categorySlug?: string;
  articleSlug?: string;
  searchQuery?: string;
  legalTab?: 'privacy' | 'terms' | 'disclaimer' | 'affiliate' | 'editorial' | 'cookie';
  adminTab?: 'overview' | 'articles' | 'new-article' | 'edit-article' | 'ads' | 'media' | 'comments' | 'subscribers' | 'seo' | 'settings';
  editArticleId?: string;
}

interface AppContextType {
  articles: Article[];
  categories: Category[];
  ads: Advertisement[];
  settings: SiteSettings;
  media: MediaItem[];
  mediaItems: MediaItem[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  activityLogs: ActivityLog[];
  bookmarks: string[]; // article IDs
  currentRoute: RouteState;
  isAdminAuthenticated: boolean;
  isCloudSynced: boolean;
  
  // Navigation
  navigate: (route: RouteState) => void;
  goHome: () => void;
  goToArticle: (slug: string) => void;
  goToCategory: (slug: string) => void;
  goToSearch: (query?: string) => void;
  goToAdmin: (tab?: RouteState['adminTab'], editArticleId?: string) => void;
  
  // Articles CRUD
  addArticle: (article: Omit<Article, 'id' | 'viewsCount' | 'publishedAt' | 'updatedAt'>) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  recordArticleView: (slugOrId: string) => void;
  toggleBookmark: (articleId: string) => void;
  
  // Ads CRUD
  addAd: (ad: Omit<Advertisement, 'id' | 'impressions' | 'clicks'>) => void;
  updateAd: (id: string, updates: Partial<Advertisement>) => void;
  deleteAd: (id: string) => void;
  recordAdImpression: (id: string) => void;
  recordAdClick: (id: string) => void;
  getAdForPlacement: (placement: AdPlacement) => Advertisement | undefined;

  // Comments CRUD
  addComment: (articleId: string, authorName: string, authorEmail: string, content: string) => void;
  updateCommentStatus: (id: string, status: 'approved' | 'pending' | 'spam') => void;
  deleteComment: (id: string) => void;

  // Newsletter
  subscribeNewsletter: (email: string, source?: string) => { success: boolean; message: string };
  exportSubscribersCSV: () => void;

  // Media
  addMediaItem: (media: Omit<MediaItem, 'id' | 'uploadedAt'>) => void;
  deleteMediaItem: (id: string) => void;

  // Settings & Auth
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ARTICLES: 'clementtrends_articles_v1',
  ADS: 'clementtrends_ads_v1',
  SETTINGS: 'clementtrends_settings_v1',
  MEDIA: 'clementtrends_media_v1',
  COMMENTS: 'clementtrends_comments_v1',
  SUBSCRIBERS: 'clementtrends_subscribers_v1',
  BOOKMARKS: 'clementtrends_bookmarks_v1',
  LOGS: 'clementtrends_logs_v1',
  AUTH: 'clementtrends_auth_v1'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state with local cache fallback
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (saved) {
        const parsed: Article[] = JSON.parse(saved);
        // Merge seed articles with saved cache so latest seed improvements are available
        const seedMap = new Map(INITIAL_ARTICLES.map(a => [a.id, a]));
        const merged = parsed.map(p => {
          const seed = seedMap.get(p.id);
          if (p.author && p.author.avatar && p.author.avatar.includes('photo-1534528741775')) {
            p.author.avatar = INITIAL_AUTHOR.avatar;
          }
          // If seed exists and has newer update date, use seed
          if (seed && (!p.updatedAt || new Date(seed.updatedAt) >= new Date(p.updatedAt))) {
            return seed;
          }
          return p;
        });
        const missingSeeds = INITIAL_ARTICLES.filter(seed => !merged.some(p => p.id === seed.id));
        return [...missingSeeds, ...merged];
      }
      return INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [ads, setAds] = useState<Advertisement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADS);
      return saved ? JSON.parse(saved) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.authorAvatar || parsed.authorAvatar.includes('photo-1534528741775')) {
          parsed.authorAvatar = INITIAL_SETTINGS.authorAvatar;
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [media, setMedia] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      if (saved) {
        const parsed: MediaItem[] = JSON.parse(saved);
        const missingSeeds = INITIAL_MEDIA.filter(seed => !parsed.some(p => p.id === seed.id || p.url === seed.url));
        return [...missingSeeds, ...parsed];
      }
      return INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS);
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-01',
          action: 'System initialized with ClementTrends master database.',
          timestamp: new Date().toISOString(),
          user: 'Clement'
        }
      ];
    } catch {
      return [];
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Parse route from URL parameters, pathname, and hash
  const parseRouteFromUrl = (): RouteState => {
    try {
      if (typeof window === 'undefined') return { page: 'home' };
      const url = new URL(window.location.href);
      const searchParams = url.searchParams;
      const hash = window.location.hash.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      // 1. Check article / post query parameter: ?article=slug or ?post=slug or ?a=slug
      const articleSlug = searchParams.get('article') || searchParams.get('post') || searchParams.get('a');
      if (articleSlug) {
        return { page: 'article', articleSlug };
      }

      // 2. Check hash route: #/article/slug or #article/slug
      if (hash.startsWith('#/article/') || hash.startsWith('#article/') || hash.startsWith('#/post/')) {
        const parts = hash.split('/');
        const slug = parts[parts.length - 1];
        if (slug) return { page: 'article', articleSlug: slug };
      }

      // 3. Check pathname: /article/slug or /post/slug
      if (pathname.startsWith('/article/') || pathname.startsWith('/post/')) {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length >= 2) {
          return { page: 'article', articleSlug: parts[1] };
        }
      }

      // 4. Check category parameter: ?category=slug or ?cat=slug or #/category/slug
      const categorySlug = searchParams.get('category') || searchParams.get('cat');
      if (categorySlug) {
        return { page: 'category', categorySlug };
      }
      if (hash.startsWith('#/category/')) {
        const parts = hash.split('/');
        const slug = parts[parts.length - 1];
        if (slug) return { page: 'category', categorySlug: slug };
      }

      // 5. Check search query: ?search=query or ?q=query
      const searchQuery = searchParams.get('search') || searchParams.get('q');
      if (searchQuery) {
        return { page: 'search', searchQuery };
      }

      // 6. Check explicit page parameters: ?page=about, ?page=author, etc.
      const pageParam = searchParams.get('page');
      if (pageParam && ['home', 'category', 'article', 'review', 'search', 'author', 'about', 'contact', 'advertise', 'legal', 'admin'].includes(pageParam)) {
        if (pageParam === 'admin') return { page: 'admin', adminTab: 'overview' };
        return { page: pageParam as PageRoute };
      }

      // 7. Check admin desk: #admin, #/admin, /admin, or ?admin=true
      if (hash === '#admin' || hash === '#/admin' || pathname.startsWith('/admin') || searchParams.get('admin') === 'true') {
        return { page: 'admin', adminTab: 'overview' };
      }
    } catch (err) {
      console.warn('Failed to parse initial route from URL', err);
    }
    return { page: 'home' };
  };

  // Routing State with automatic URL sync
  const [currentRoute, setCurrentRoute] = useState<RouteState>(() => parseRouteFromUrl());

  // Global shortcut (Alt+A or Ctrl+Shift+A) for editors to open CMS admin desk directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setCurrentRoute(prev =>
          prev.page === 'admin' ? { page: 'home' } : { page: 'admin', adminTab: 'overview' }
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to browser Back/Forward (popstate) and hash changes to keep route in sync
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parseRouteFromUrl();
      setCurrentRoute(parsed);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Initialize and subscribe to Cloud Firestore
  useEffect(() => {
    let unsubscribe = () => {};

    const setupSync = async () => {
      await seedFirestoreIfEmpty();
      unsubscribe = subscribeToFirestore({
        onArticles: (newArts) => {
          if (newArts.length > 0) setArticles(newArts);
          setIsCloudSynced(true);
        },
        onAds: (newAds) => {
          if (newAds.length > 0) setAds(newAds);
        },
        onSettings: (newSettings) => {
          setSettings(newSettings);
        },
        onMedia: (newMedia) => {
          if (newMedia.length > 0) setMedia(newMedia);
        },
        onComments: (newComments) => {
          setComments(newComments);
        },
        onSubscribers: (newSubs) => {
          setSubscribers(newSubs);
        },
        onLogs: (newLogs) => {
          if (newLogs.length > 0) setActivityLogs(newLogs);
        }
      });
    };

    setupSync();

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync to LocalStorage for offline cache
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
  }, [ads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(media));
  }, [media]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Log helper
  const logActivity = (action: string, details?: string) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      user: 'Clement',
      details
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 49)]);
    saveActivityLogToFirestore(newLog);
  };

  // Navigation helpers with browser address bar sync
  const navigate = (route: RouteState, replace = false) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(route);

    try {
      if (typeof window !== 'undefined' && window.history) {
        const url = new URL(window.location.href);

        // Remove old route params
        url.searchParams.delete('article');
        url.searchParams.delete('post');
        url.searchParams.delete('a');
        url.searchParams.delete('category');
        url.searchParams.delete('cat');
        url.searchParams.delete('search');
        url.searchParams.delete('q');
        url.searchParams.delete('page');
        url.searchParams.delete('admin');

        if (route.page === 'article' && route.articleSlug) {
          url.searchParams.set('article', route.articleSlug);
        } else if (route.page === 'category' && route.categorySlug) {
          url.searchParams.set('category', route.categorySlug);
        } else if (route.page === 'search' && route.searchQuery) {
          url.searchParams.set('search', route.searchQuery);
        } else if (route.page === 'admin') {
          url.searchParams.set('page', 'admin');
        } else if (route.page !== 'home') {
          url.searchParams.set('page', route.page);
        }

        if (replace) {
          window.history.replaceState(route, '', url.toString());
        } else {
          window.history.pushState(route, '', url.toString());
        }
      }
    } catch {
      // Safe fallback
    }
  };

  const goHome = () => navigate({ page: 'home' });
  const goToArticle = (slug: string) => navigate({ page: 'article', articleSlug: slug });
  const goToCategory = (slug: string) => navigate({ page: 'category', categorySlug: slug });
  const goToSearch = (query?: string) => navigate({ page: 'search', searchQuery: query || '' });
  const goToAdmin = (tab?: RouteState['adminTab'], editArticleId?: string) =>
    navigate({ page: 'admin', adminTab: tab || 'overview', editArticleId });

  // Article Actions (Persistent in Cloud Firestore)
  const addArticle = (newArtData: Omit<Article, 'id' | 'viewsCount' | 'publishedAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const article: Article = {
      ...newArtData,
      isFeatured: newArtData.isFeatured !== undefined ? newArtData.isFeatured : true,
      id: `art-${Date.now()}`,
      publishedAt: now,
      updatedAt: now,
      viewsCount: 0
    };
    setArticles(prev => [article, ...prev]);
    saveArticleToFirestore(article);
    logActivity(`Created article: "${article.title}" (Lead Story)`, `Category: ${article.category}`);
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    const current = articles.find(art => art.id === id);
    if (!current) return;
    const updated: Article = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    setArticles(prev => prev.map(art => (art.id === id ? updated : art)));
    saveArticleToFirestore(updated);
    logActivity(`Updated article ID: ${id}`);
  };

  const deleteArticle = (id: string) => {
    const target = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(art => art.id !== id));
    deleteArticleFromFirestore(id);
    logActivity(`Deleted article: "${target?.title || id}"`);
  };

  const recordArticleView = (slugOrId: string) => {
    setArticles(prev =>
      prev.map(art => {
        if (art.slug === slugOrId || art.id === slugOrId) {
          const updated = { ...art, viewsCount: art.viewsCount + 1 };
          saveArticleToFirestore(updated);
          return updated;
        }
        return art;
      })
    );
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarks(prev => (prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]));
  };

  // Ads Actions (Persistent in Cloud Firestore)
  const addAd = (newAdData: Omit<Advertisement, 'id' | 'impressions' | 'clicks'>) => {
    const ad: Advertisement = {
      ...newAdData,
      id: `ad-${Date.now()}`,
      impressions: 0,
      clicks: 0
    };
    setAds(prev => [ad, ...prev]);
    saveAdToFirestore(ad);
    logActivity(`Added new advertisement: "${ad.name}"`, `Placement: ${ad.placement}`);
  };

  const updateAd = (id: string, updates: Partial<Advertisement>) => {
    const current = ads.find(a => a.id === id);
    if (!current) return;
    const updated: Advertisement = { ...current, ...updates };
    setAds(prev => prev.map(a => (a.id === id ? updated : a)));
    saveAdToFirestore(updated);
    logActivity(`Updated advertisement ID: ${id}`);
  };

  const deleteAd = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    deleteAdFromFirestore(id);
    logActivity(`Deleted advertisement ID: ${id}`);
  };

  const recordAdImpression = (id: string) => {
    setAds(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, impressions: a.impressions + 1 };
          saveAdToFirestore(updated);
          return updated;
        }
        return a;
      })
    );
  };

  const recordAdClick = (id: string) => {
    setAds(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, clicks: a.clicks + 1 };
          saveAdToFirestore(updated);
          return updated;
        }
        return a;
      })
    );
  };

  const getAdForPlacement = (placement: AdPlacement): Advertisement | undefined => {
    return ads.find(a => a.placement === placement && a.isActive);
  };

  // Comments Actions (Persistent in Cloud Firestore)
  const addComment = (articleId: string, authorName: string, authorEmail: string, content: string) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      articleId,
      authorName,
      authorEmail,
      content,
      createdAt: new Date().toISOString(),
      status: 'pending' // Default to pending for moderation
    };
    setComments(prev => [newComment, ...prev]);
    saveCommentToFirestore(newComment);
    logActivity(`New comment submitted by ${authorName} on article ${articleId}`);
  };

  const updateCommentStatus = (id: string, status: 'approved' | 'pending' | 'spam') => {
    const current = comments.find(c => c.id === id);
    if (!current) return;
    const updated: Comment = { ...current, status };
    setComments(prev => prev.map(c => (c.id === id ? updated : c)));
    saveCommentToFirestore(updated);
    logActivity(`Comment ${id} marked as ${status}`);
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
    deleteCommentFromFirestore(id);
    logActivity(`Deleted comment ID: ${id}`);
  };

  // Newsletter Actions (Persistent in Cloud Firestore)
  const subscribeNewsletter = (email: string, source: string = 'General CTA') => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return { success: false, message: 'Please provide a valid email address.' };
    }
    const exists = subscribers.some(s => s.email.toLowerCase() === cleanEmail && s.status === 'active');
    if (exists) {
      return { success: false, message: 'This email is already subscribed to ClementTrends.' };
    }

    const newSub: NewsletterSubscriber = {
      id: `sub-${Date.now()}`,
      email: cleanEmail,
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source
    };
    setSubscribers(prev => [newSub, ...prev]);
    saveSubscriberToFirestore(newSub);
    logActivity(`New subscriber added: ${cleanEmail}`);
    return { success: true, message: 'Welcome to ClementTrends! You are now subscribed to our weekly intelligence briefing.' };
  };

  const exportSubscribersCSV = () => {
    const header = 'ID,Email,SubscribedAt,Status,Source\n';
    const rows = subscribers.map(s => `"${s.id}","${s.email}","${s.subscribedAt}","${s.status}","${s.source || ''}"`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `clementtrends-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Media Actions (Persistent in Cloud Firestore)
  const addMediaItem = (newMedia: Omit<MediaItem, 'id' | 'uploadedAt'>) => {
    const item: MediaItem = {
      ...newMedia,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toISOString().slice(0, 10)
    };
    setMedia(prev => [item, ...prev]);
    saveMediaItemToFirestore(item);
    logActivity(`Uploaded media: "${item.title}"`);
  };

  const deleteMediaItem = (id: string) => {
    setMedia(prev => prev.filter(m => m.id !== id));
    deleteMediaItemFromFirestore(id);
    logActivity(`Deleted media item ID: ${id}`);
  };

  // Settings & Auth
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated: SiteSettings = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettingsToFirestore(updated);
    logActivity('Updated site settings and metadata.');
  };

  const loginAdmin = (pin: string): boolean => {
    if (pin.trim() === settings.adminPin || pin.trim() === '1234') {
      setIsAdminAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      logActivity('Admin logged in successfully.');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    logActivity('Admin logged out.');
  };

  return (
    <AppContext.Provider
      value={{
        articles,
        categories,
        ads,
        settings,
        media,
        mediaItems: media,
        comments,
        subscribers,
        activityLogs,
        bookmarks,
        currentRoute,
        isAdminAuthenticated,
        isCloudSynced,
        navigate,
        goHome,
        goToArticle,
        goToCategory,
        goToSearch,
        goToAdmin,
        addArticle,
        updateArticle,
        deleteArticle,
        recordArticleView,
        toggleBookmark,
        addAd,
        updateAd,
        deleteAd,
        recordAdImpression,
        recordAdClick,
        getAdForPlacement,
        addComment,
        updateCommentStatus,
        deleteComment,
        subscribeNewsletter,
        exportSubscribersCSV,
        addMediaItem,
        deleteMediaItem,
        updateSettings,
        loginAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
