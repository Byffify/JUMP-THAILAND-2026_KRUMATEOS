import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useI18n } from '../context/I18nContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import fullLogo from '../assets/full-logo.png';

const NAV_ITEMS = [
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/generator', key: 'nav.generator' },
  { to: '/library', key: 'nav.library' },
  { to: '/assistant', key: 'nav.assistant' },
  { to: '/support', key: 'support.link' },
];

export default function AppLayout() {
  const { lang, setLangL, t } = useI18n();
  const { user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 'nav-link' + (isActive ? ' text-primary font-medium' : '');
  const mobileLinkClass = ({ isActive }) => 'nav-link block py-2' + (isActive ? ' text-primary font-medium' : '');
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 bg-cream/90 backdrop-blur border-b border-line">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
              <img src={fullLogo} alt="KruMate" className="h-8 w-auto" />
            </Link>
            <nav id="main-nav" className="hidden md:flex items-center gap-1 text-sm">
              {NAV_ITEMS.map(item => (
                <NavLink key={item.to} to={item.to} className={navLinkClass}>
                  {t(item.key)}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="lang-switch" role="group" aria-label="Language">
              <button
                data-lang="en"
                className={'lang-btn' + (lang === 'en' ? ' lang-btn-active' : '')}
                aria-pressed={lang === 'en'}
                onClick={() => setLangL('en')}
              >
                EN
              </button>
              <button
                data-lang="th"
                className={'lang-btn' + (lang === 'th' ? ' lang-btn-active' : '')}
                aria-pressed={lang === 'th'}
                onClick={() => setLangL('th')}
              >
                ไทย
              </button>
            </div>
            <button
              id="menu-toggle"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-soft text-2xl"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(o => !o)}
            >
              ☰
            </button>
            <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-line">
              <div
                className="w-9 h-9 rounded-full bg-primary/20 text-primary-dark flex items-center justify-center font-semibold uppercase"
                id="profile-avatar"
              >
                {user.initial || 'K'}
              </div>
              <div className="leading-tight hidden lg:block">
                <p className="text-sm font-medium" id="profile-name">{user.name}</p>
                <p className="text-xs text-muted" id="profile-subject">{user.subject}</p>
              </div>
              <button
                id="logout-btn"
                className="btn btn-ghost text-sm px-2.5"
                title={t('app.logout')}
                aria-label={t('app.logout')}
                onClick={logout}
              >
                ⏻
              </button>
            </div>
          </div>
        </div>
        <nav
          id="mobile-nav"
          className={'md:hidden border-t border-line bg-white px-4 py-2 text-sm' + (mobileOpen ? '' : ' hidden')}
        >
          {NAV_ITEMS.map(item => (
            <NavLink key={item.to} to={item.to} className={mobileLinkClass} onClick={closeMobile}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted">
          <p>
            <span className="font-medium text-dark">{t('footer.note')}</span>
          </p>
          <p>{t('footer.tag')}</p>
        </div>
        <div id="print-root" className="print-only"></div>
      </footer>
    </div>
  );
}
