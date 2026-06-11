import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Calculator,
  CalendarDays,
  Contact,
  Crown,
  Database,
  FileText,
  GalleryHorizontalEnd,
  Home,
  LogIn,
  LogOut,
  Medal,
  Menu,
  Newspaper,
  Radio,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { familyName } from '../data/siteData.js';
import { firebaseStatus } from '../lib/firebase.js';
import { useAuth } from '../lib/auth.jsx';

const publicNavItems = [
  ['Command Center', '/', Home],
  ['Про родину', '/about', ShieldCheck],
  ['Правила', '/rules', ScrollText],
  ['Вступ', '/recruitment', Trophy],
  ['Контакти', '/contact', Contact],
];

const familyNavItems = [
  ['Grizzly OS', '/', TerminalSquare],
  ['Про родину', '/about', ShieldCheck],
  ['Склад', '/roster', Users],
  ['Калькулятор', '/calculator', Calculator],
  ['Прогрес', '/progress', BarChart3],
  ['Ранги', '/ranks', Medal],
  ['Правила', '/rules', ScrollText],
  ['Події', '/events', CalendarDays],
  ['Календар', '/calendar', CalendarDays],
  ['Галерея', '/gallery', GalleryHorizontalEnd],
  ['Досягнення', '/achievements', Crown],
  ['Дипломатія', '/diplomacy', Radio],
  ['Бізнес', '/business', Database],
  ['Новини', '/news', Newspaper],
  ['Контакти', '/contact', Contact],
];

const dockItems = [
  ['OS', '/', TerminalSquare],
  ['Members', '/roster', Users],
  ['Contracts', '/calculator', Calculator],
  ['Calendar', '/calendar', CalendarDays],
  ['News', '/news', Newspaper],
];

const activityItems = [
  ['SYSTEM', 'Grizzly OS запущено'],
  ['DISCORD', 'Синхронізація складу активна'],
  ['FINANCE', 'Модуль контрактів готовий'],
  ['EVENTS', 'Календар очікує нові події'],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, loading, hasFamilyRole, isAdmin } = useAuth();
  const hasFullMenu = hasFamilyRole || isAdmin;

  const visibleNavItems = useMemo(() => {
    const items = hasFullMenu ? familyNavItems : publicNavItems;
    if (!isAdmin) return items;
    return [
      ...items,
      ['Database', '/database', Database],
      ['Admin', '/admin', ShieldCheck],
      ['Members Admin', '/admin/members', Users],
      ['Bot Control', '/admin/bot', Bot],
    ];
  }, [hasFullMenu, isAdmin]);

  const pageLabel = visibleNavItems.find(([, href]) => href === location.pathname)?.[0] || 'Workspace';

  return (
    <div className="os-layout">
      <aside className={open ? 'os-sidebar is-open' : 'os-sidebar'}>
        <Link className="os-brand" to="/" onClick={() => setOpen(false)}>
          <span className="os-brand-logo">
            <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
          </span>
          <span>
            <strong>Grizzly OS</strong>
            <small>{familyName} / NG</small>
          </span>
        </Link>

        <div className="os-sidebar-section">
          <span className="os-sidebar-label">Navigation</span>
          <nav className="os-nav">
            {visibleNavItems.map(([label, href, Icon]) => (
              <NavLink key={`${href}-${label}`} to={href} onClick={() => setOpen(false)} end={href === '/'}>
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="os-system-card">
          <span className="os-pulse" />
          <div>
            <strong>SYSTEM ONLINE</strong>
            <small>Firebase: {firebaseStatus.connected ? 'CONNECTED' : 'FALLBACK'}</small>
          </div>
        </div>
      </aside>

      {open && <button className="os-backdrop" type="button" aria-label="Закрити меню" onClick={() => setOpen(false)} />}

      <div className="os-main">
        <header className="os-topbar">
          <button className="os-mobile-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Відкрити меню">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="os-breadcrumb">
            <span>GRIZZLY FAMILY COMMAND CENTER</span>
            <strong>{pageLabel}</strong>
          </div>

          <div className="os-topbar-status">
            <span><Activity size={14} /> LIVE</span>
            <span><Sparkles size={14} /> OS MODE</span>
          </div>

          <div className="os-auth-actions">
            {!loading && !user && (
              <a className="os-auth-button" href="/api/auth/discord/login" title="Увійти через Discord">
                <LogIn size={17} />
                <span>Discord</span>
              </a>
            )}
            {!loading && user && (
              <>
                <Link className="os-auth-user" to="/profile" title={user.globalName || user.username}>
                  <img src={user.avatar} alt={user.username} />
                  <span>{user.globalName || user.username}</span>
                </Link>
                <a className="os-auth-button compact" href="/api/auth/logout" title="Вийти">
                  <LogOut size={17} />
                </a>
              </>
            )}
          </div>
        </header>

        <div className="os-desktop-grid">
          <main className="os-page-frame">
            {children}
          </main>

          <aside className="os-right-panel">
            <section className="os-mini-panel">
              <div className="os-panel-head">
                <span><Bell size={15} /> Live Activity</span>
                <small>REALTIME</small>
              </div>
              <div className="os-activity-list">
                {activityItems.map(([type, text]) => (
                  <article key={`${type}-${text}`}>
                    <strong>{type}</strong>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="os-mini-panel">
              <div className="os-panel-head">
                <span><Bot size={15} /> Bot Status</span>
                <small>{firebaseStatus.connected ? 'SYNC' : 'LOCAL'}</small>
              </div>
              <div className="os-status-lines">
                <span><i /> Discord Bot</span>
                <strong>ONLINE</strong>
              </div>
              <div className="os-status-lines">
                <span><i /> Firestore</span>
                <strong>{firebaseStatus.connected ? 'ACTIVE' : 'OFFLINE'}</strong>
              </div>
            </section>

            <section className="os-mini-panel os-quick-panel">
              <div className="os-panel-head">
                <span><FileText size={15} /> Quick Actions</span>
              </div>
              <Link to="/calculator">+ Контракт</Link>
              <Link to="/calendar">+ Подія</Link>
              <Link to="/news">Новини</Link>
              {isAdmin && <Link to="/admin">Адмінка</Link>}
            </section>
          </aside>
        </div>

        <nav className="os-dock" aria-label="Grizzly OS Dock">
          {dockItems.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} end={href === '/'}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink to="/admin">
              <ShieldCheck size={20} />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
}
