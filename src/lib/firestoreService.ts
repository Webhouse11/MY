import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Article,
  Advertisement,
  SiteSettings,
  MediaItem,
  Comment,
  NewsletterSubscriber,
  ActivityLog
} from '../types';
import {
  INITIAL_ARTICLES,
  INITIAL_ADS,
  INITIAL_SETTINGS,
  INITIAL_MEDIA,
  INITIAL_COMMENTS,
  INITIAL_SUBSCRIBERS
} from '../data/seedData';

// Firestore collection references
const COLLECTIONS = {
  ARTICLES: 'articles',
  ADS: 'advertisements',
  SETTINGS: 'settings',
  MEDIA: 'media',
  COMMENTS: 'comments',
  SUBSCRIBERS: 'subscribers',
  LOGS: 'activity_logs'
};

// Seed initial database content if collections are empty
export async function seedFirestoreIfEmpty() {
  try {
    // 1. Articles - only add seed articles that do not exist at all in Firestore
    const artSnap = await getDocs(collection(db, COLLECTIONS.ARTICLES));
    const existingDocIds = new Set(artSnap.docs.map(d => d.id));
    const batch = writeBatch(db);
    let hasArtBatch = false;

    for (const art of INITIAL_ARTICLES) {
      if (!existingDocIds.has(art.id)) {
        const ref = doc(db, COLLECTIONS.ARTICLES, art.id);
        batch.set(ref, art);
        hasArtBatch = true;
      }
    }
    if (hasArtBatch) {
      await batch.commit();
    }

    // 2. Ads - only add missing ads, never overwrite existing user customizations
    const adsSnap = await getDocs(collection(db, COLLECTIONS.ADS));
    const existingAdIds = new Set(adsSnap.docs.map(d => d.id));
    const adsBatch = writeBatch(db);
    let hasAdsBatch = false;

    for (const ad of INITIAL_ADS) {
      if (!existingAdIds.has(ad.id)) {
        const ref = doc(db, COLLECTIONS.ADS, ad.id);
        adsBatch.set(ref, ad);
        hasAdsBatch = true;
      }
    }
    if (hasAdsBatch) {
      await adsBatch.commit();
    }

    // 3. Settings
    const setRef = doc(db, COLLECTIONS.SETTINGS, 'general');
    const setSnap = await getDocs(collection(db, COLLECTIONS.SETTINGS));
    if (setSnap.empty) {
      await setDoc(setRef, INITIAL_SETTINGS);
    }

    // 4. Media
    const medSnap = await getDocs(collection(db, COLLECTIONS.MEDIA));
    if (medSnap.empty) {
      const batch = writeBatch(db);
      for (const item of INITIAL_MEDIA) {
        const ref = doc(db, COLLECTIONS.MEDIA, item.id);
        batch.set(ref, item);
      }
      await batch.commit();
    }

    // 5. Comments
    const commSnap = await getDocs(collection(db, COLLECTIONS.COMMENTS));
    if (commSnap.empty) {
      const batch = writeBatch(db);
      for (const comment of INITIAL_COMMENTS) {
        const ref = doc(db, COLLECTIONS.COMMENTS, comment.id);
        batch.set(ref, comment);
      }
      await batch.commit();
    }

    // 6. Subscribers
    const subSnap = await getDocs(collection(db, COLLECTIONS.SUBSCRIBERS));
    if (subSnap.empty) {
      const batch = writeBatch(db);
      for (const sub of INITIAL_SUBSCRIBERS) {
        const ref = doc(db, COLLECTIONS.SUBSCRIBERS, sub.id);
        batch.set(ref, sub);
      }
      await batch.commit();
    }
  } catch (error) {
    console.warn('Firestore initial seeding error or offline fallback:', error);
  }
}

// Helper: Deep-clean undefined and invalid values before sending to Firestore
function sanitizeForFirestore<T>(data: T): T {
  if (data === null || data === undefined) {
    return null as any;
  }
  if (Array.isArray(data)) {
    return data.map(item => sanitizeForFirestore(item)).filter(item => item !== undefined) as any;
  }
  if (typeof data === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        cleanObj[key] = sanitizeForFirestore(value);
      }
    }
    return cleanObj as T;
  }
  return data;
}

// 1. Articles CRUD
export async function saveArticleToFirestore(article: Article) {
  try {
    const ref = doc(db, COLLECTIONS.ARTICLES, article.id);
    const cleanData = sanitizeForFirestore(article);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving article to Firestore:', e);
  }
}

export async function deleteArticleFromFirestore(id: string) {
  try {
    const ref = doc(db, COLLECTIONS.ARTICLES, id);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting article from Firestore:', e);
  }
}

// 2. Ads CRUD
export async function saveAdToFirestore(ad: Advertisement) {
  try {
    const ref = doc(db, COLLECTIONS.ADS, ad.id);
    const cleanData = sanitizeForFirestore(ad);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving ad to Firestore:', e);
  }
}

export async function deleteAdFromFirestore(id: string) {
  try {
    const ref = doc(db, COLLECTIONS.ADS, id);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting ad from Firestore:', e);
  }
}

// 3. Settings CRUD
export async function saveSettingsToFirestore(settings: SiteSettings) {
  try {
    const ref = doc(db, COLLECTIONS.SETTINGS, 'general');
    const cleanData = sanitizeForFirestore(settings);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving settings to Firestore:', e);
  }
}

// 4. Media CRUD
export async function saveMediaItemToFirestore(item: MediaItem) {
  try {
    const ref = doc(db, COLLECTIONS.MEDIA, item.id);
    const cleanData = sanitizeForFirestore(item);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving media item to Firestore:', e);
  }
}

export async function deleteMediaItemFromFirestore(id: string) {
  try {
    const ref = doc(db, COLLECTIONS.MEDIA, id);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting media from Firestore:', e);
  }
}

// 5. Comments CRUD
export async function saveCommentToFirestore(comment: Comment) {
  try {
    const ref = doc(db, COLLECTIONS.COMMENTS, comment.id);
    const cleanData = sanitizeForFirestore(comment);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving comment to Firestore:', e);
  }
}

export async function deleteCommentFromFirestore(id: string) {
  try {
    const ref = doc(db, COLLECTIONS.COMMENTS, id);
    await deleteDoc(ref);
  } catch (e) {
    console.error('Error deleting comment from Firestore:', e);
  }
}

// 6. Subscribers CRUD
export async function saveSubscriberToFirestore(sub: NewsletterSubscriber) {
  try {
    const ref = doc(db, COLLECTIONS.SUBSCRIBERS, sub.id);
    const cleanData = sanitizeForFirestore(sub);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving subscriber to Firestore:', e);
  }
}

// 7. Activity Logs
export async function saveActivityLogToFirestore(log: ActivityLog) {
  try {
    const ref = doc(db, COLLECTIONS.LOGS, log.id);
    const cleanData = sanitizeForFirestore(log);
    await setDoc(ref, cleanData);
  } catch (e) {
    console.error('Error saving activity log to Firestore:', e);
  }
}

// Real-time Firestore Listeners
export function subscribeToFirestore(callbacks: {
  onArticles: (articles: Article[]) => void;
  onAds: (ads: Advertisement[]) => void;
  onSettings: (settings: SiteSettings) => void;
  onMedia: (media: MediaItem[]) => void;
  onComments: (comments: Comment[]) => void;
  onSubscribers: (subs: NewsletterSubscriber[]) => void;
  onLogs: (logs: ActivityLog[]) => void;
}) {
  const unsubArticles = onSnapshot(
    collection(db, COLLECTIONS.ARTICLES),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Article);
        // Sort newest published first
        list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        callbacks.onArticles(list);
      }
    },
    err => console.warn('Articles firestore listener notice:', err)
  );

  const unsubAds = onSnapshot(
    collection(db, COLLECTIONS.ADS),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Advertisement);
        callbacks.onAds(list);
      }
    },
    err => console.warn('Ads firestore listener notice:', err)
  );

  const unsubSettings = onSnapshot(
    collection(db, COLLECTIONS.SETTINGS),
    snapshot => {
      if (!snapshot.empty) {
        const general = snapshot.docs.find(d => d.id === 'general')?.data() as SiteSettings;
        if (general) callbacks.onSettings(general);
      }
    },
    err => console.warn('Settings firestore listener notice:', err)
  );

  const unsubMedia = onSnapshot(
    collection(db, COLLECTIONS.MEDIA),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as MediaItem);
        list.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        callbacks.onMedia(list);
      }
    },
    err => console.warn('Media firestore listener notice:', err)
  );

  const unsubComments = onSnapshot(
    collection(db, COLLECTIONS.COMMENTS),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as Comment);
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callbacks.onComments(list);
      }
    },
    err => console.warn('Comments firestore listener notice:', err)
  );

  const unsubSubscribers = onSnapshot(
    collection(db, COLLECTIONS.SUBSCRIBERS),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as NewsletterSubscriber);
        list.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
        callbacks.onSubscribers(list);
      }
    },
    err => console.warn('Subscribers firestore listener notice:', err)
  );

  const unsubLogs = onSnapshot(
    collection(db, COLLECTIONS.LOGS),
    snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(d => d.data() as ActivityLog);
        list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        callbacks.onLogs(list.slice(0, 50));
      }
    },
    err => console.warn('Logs firestore listener notice:', err)
  );

  return () => {
    unsubArticles();
    unsubAds();
    unsubSettings();
    unsubMedia();
    unsubComments();
    unsubSubscribers();
    unsubLogs();
  };
}
