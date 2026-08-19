import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CookieConsent } from './components/layout/CookieConsent';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { AuthorPage } from './pages/AuthorPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdvertisePage } from './pages/AdvertisePage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLayout } from './components/admin/AdminLayout';

const AppContent: React.FC = () => {
  const { currentRoute, navigate } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [currentRoute.page, currentRoute.categorySlug, currentRoute.articleSlug]);

  if (currentRoute.page === 'admin') {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#0066CC] selection:text-white">
      {/* Global Magazine Header */}
      <Header />

      {/* Main Page Routing Switcher */}
      <main className="flex-1">
        {currentRoute.page === 'home' && <HomePage />}
        {currentRoute.page === 'category' && <CategoryPage />}
        {currentRoute.page === 'article' && <ArticlePage />}
        {currentRoute.page === 'search' && <SearchPage />}
        {currentRoute.page === 'author' && <AuthorPage />}
        {currentRoute.page === 'about' && <AboutPage />}
        {currentRoute.page === 'contact' && <ContactPage />}
        {currentRoute.page === 'advertise' && <AdvertisePage />}
        {currentRoute.page === 'legal' && <LegalPage />}
        {currentRoute.page === '404' && <NotFoundPage />}
      </main>

      {/* Comprehensive Editorial Footer */}
      <Footer />

      {/* GDPR / NDPR Cookie & Privacy Banner */}
      <CookieConsent />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
