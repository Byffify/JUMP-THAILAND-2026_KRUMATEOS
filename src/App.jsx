import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ModalProvider } from './context/ModalContext.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import AppLayout from './layouts/AppLayout.jsx';
import AuthView from './layouts/AuthView.jsx';
import Placeholder from './pages/Placeholder.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import GeneratorPage from './pages/GeneratorPage.jsx';
import ContentViewPage from './pages/ContentViewPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Shell() {
  const { user } = useApp();
  return (
    <HashRouter>
      <ScrollToTop />
      {!user ? <AuthView /> : (
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generator" element={<GeneratorPage />} />
            <Route path="/generator/:type" element={<GeneratorPage />} />
            <Route path="/content/:id" element={<ContentViewPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/assistant" element={<Placeholder />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      )}
    </HashRouter>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <ModalProvider>
          <AppProvider>
            <Shell />
          </AppProvider>
        </ModalProvider>
      </ToastProvider>
    </I18nProvider>
  );
}
