import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminOverview } from './AdminOverview';
import { AdminArticles } from './AdminArticles';
import { AdminArticleEditor } from './AdminArticleEditor';
import { AdminAds } from './AdminAds';
import { AdminMedia } from './AdminMedia';
import { AdminComments } from './AdminComments';
import { AdminSubscribers } from './AdminSubscribers';
import { AdminSEO } from './AdminSEO';
import { AdminSettings } from './AdminSettings';
import { Logo } from '../brand/Logo';
import { generateAndDownloadProjectZip } from '../../utils/projectExport';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Megaphone,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Search,
  Settings,
  ExternalLink,
  Lock,
  Unlock,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  Edit,
  Download,
  Github
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const {
    currentRoute,
    navigate,
    goHome,
    settings,
    articles,
    ads,
    comments,
    subscribers,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin
  } = useApp();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'articles' | 'editor' | 'ads' | 'media' | 'comments' | 'subscribers' | 'seo' | 'settings'
  >('overview');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Sync route changes into tab/editor
  useEffect(() => {
    if (currentRoute.page === 'admin') {
      if (currentRoute.editArticleId) {
        setEditingArticleId(currentRoute.editArticleId);
        setActiveTab('editor');
      } else if (currentRoute.adminTab === 'new-article') {
        setEditingArticleId(null);
        setActiveTab('editor');
      } else if (currentRoute.adminTab === 'edit-article') {
        setActiveTab('editor');
      } else if (currentRoute.adminTab) {
        setActiveTab(currentRoute.adminTab as any);
      }
    }
  }, [currentRoute]);

  const pendingCommentsCount = comments.filter(c => c.status === 'pending').length;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(enteredPin);
    if (success) {
      setPinError(false);
      setEnteredPin('');
    } else {
      setPinError(true);
    }
  };

  const handleNewArticle = () => {
    setEditingArticleId(null);
    setActiveTab('editor');
    setMobileSidebarOpen(false);
  };

  const handleEditArticle = (id: string) => {
    setEditingArticleId(id);
    setActiveTab('editor');
    setMobileSidebarOpen(false);
  };

  // LOCKED AUTH SCREEN
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#071A33] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6 text-center animate-fade-in">
          <div className="flex justify-center">
            <Logo size="lg" showTagline={true} onClick={goHome} />
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-100">
            <h2 className="font-serif-heading text-xl font-bold text-[#071A33]">
              CMS Editorial Desk
            </h2>
            <p className="text-xs text-slate-500">
              Enter editorial security PIN to manage publications, ads, and settings.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                required
                autoFocus
                value={enteredPin}
                onChange={e => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter Access PIN"
                className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20"
              />
              {pinError && (
                <p className="text-xs font-bold text-rose-600 mt-2">
                  Incorrect PIN. Please try again or check your settings.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#071A33] hover:bg-[#0066CC] text-white font-bold text-xs transition-colors shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4 text-[#F7931E]" /> Unlock Editorial Console
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Default Demo PIN: <strong>1234</strong></span>
            <button
              onClick={goHome}
              className="text-[#0066CC] hover:underline font-semibold cursor-pointer"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems: { id: any; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'articles', label: 'Article Publications', icon: FileText },
    { id: 'ads', label: 'Ad Monetization', icon: Megaphone },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'comments', label: 'Reader Comments', icon: MessageSquare, badge: pendingCommentsCount },
    { id: 'subscribers', label: 'Email Subscribers', icon: Users, badge: subscribers.length },
    { id: 'seo', label: 'SEO & Sitemaps', icon: Search },
    { id: 'settings', label: 'Site & Author Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="bg-[#071A33] text-white sticky top-0 z-40 px-4 sm:px-6 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-xl cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <Logo variant="dark" />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#F7931E] text-[#071A33] text-[10px] font-bold uppercase tracking-wider">
            Admin CMS
          </span>
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud Database Active</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl bg-[#0066CC] hover:bg-[#F7931E] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
            title="Download complete source code and database backup as a ZIP file"
          >
            {isExporting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-3.5 h-3.5 text-[#F7931E]" />
            )}
            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Export ZIP'}</span>
          </button>

          <button
            onClick={goHome}
            className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex items-center gap-1 text-xs"
            title="Lock Console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace (Sidebar + Body) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between transform transition-transform duration-200 md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 top-14' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Quick Action Button */}
            <button
              onClick={handleNewArticle}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#0066CC] hover:bg-[#071A33] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#F7931E]" />
              <span>Create New Article</span>
            </button>

            {/* Navigation Tabs */}
            <nav className="space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#071A33] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-[#071A33]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#F7931E]' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? 'bg-[#F7931E] text-[#071A33]'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Author Badge Bottom */}
          <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <img
              src={settings.authorAvatar}
              alt={settings.authorName}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#071A33] truncate">{settings.authorName}</p>
              <p className="text-[10px] text-slate-400 truncate">Editor-in-Chief</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
          {activeTab === 'overview' && (
            <AdminOverview
              onNavigateTab={tab => setActiveTab(tab)}
              onNewArticle={handleNewArticle}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeTab === 'articles' && (
            <AdminArticles
              onNewArticle={handleNewArticle}
              onEditArticle={handleEditArticle}
            />
          )}

          {activeTab === 'editor' && (
            <AdminArticleEditor
              articleId={editingArticleId}
              onBack={() => {
                setActiveTab('articles');
                setEditingArticleId(null);
              }}
            />
          )}

          {activeTab === 'ads' && <AdminAds />}
          {activeTab === 'media' && <AdminMedia />}
          {activeTab === 'comments' && <AdminComments />}
          {activeTab === 'subscribers' && <AdminSubscribers />}
          {activeTab === 'seo' && <AdminSEO />}
          {activeTab === 'settings' && <AdminSettings />}
        </main>
      </div>
    </div>
  );
};
