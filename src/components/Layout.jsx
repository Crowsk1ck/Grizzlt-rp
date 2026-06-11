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
  Download,
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
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { familyName } from '../data/siteData.js';
import { firebaseStatus } from '../lib/firebase.js';
import { useAuth } from '../lib/auth.jsx';

const publicNavGroups = [
  {
    label: 'Public',
    items: [
      ['Command Center', '/', Home],
      ['Про родину', '/about', ShieldCheck],
      ['Правила', '/rules', ScrollText],
      ['Вступ', '/recruitment', Trophy],
      ['Контакти', '/contact', Contact],
      ['Desktop App', '/download', Download],
    ],
  },
];

const familyNavGroups = [
  {
    label: 'Core',
    items: [
      ['Grizzly OS', '/', TerminalSquare],
      ['Про родину', '/about', ShieldCheck],
      ['Склад', '/roster', Users],
      ['Калькулятор', '/calculator', Calculator],
      ['Прогрес', '/progress', BarChart3],
      ['Ранги', '/ranks', Medal],
      ['Правила', '/rules', ScrollText],
    ],
  },
  {
    label: 'RP System',
    items: [
      ['Події', '/events', CalendarDays],
      ['Календар', '/calendar', CalendarDays],
      ['Галерея', '/gallery', GalleryHorizontalEnd],
      ['Досягнення', '/achievements', Crown],
      ['Дипломатія', '/diplomacy', Radio],
      ['Бізнес', '/business', Database],
      ['Новини', '/news', Newspaper],
      ['Контакти', '/contact', Contact],
      ['Desktop App', '/download', Download],
    ],
  },
];

const adminGroup = {
  label: 'Admin',
  items: [
    ['Database', '/database', Database],
    ['Admin', '/admin', ShieldCheck],
    ['Members Admin', '/admin/members', Users],
    ['Bot Control', '/admin/bot', Bot],
  ],
};

const dockItems = [
  ['OS', '/', TerminalSquare],
  ['Members', '/roster', Users],
  ['Contracts', '/calculator', Calculator],
  ['Calendar', '/calendar', CalendarDays],
  ['News', '/news', Newspaper],
  ['App', '/download', Download],
];

const activityItems = [
  ['SYSTEM', 'Grizzly OS запущено'],
  ['DISCORD', 'Синхронізація складу активна'],
  ['FINANCE', 'Модуль контрактів готовий'],
  ['EVENTS', 'Календар очікує нові події'],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('grizzly-sidebar-collapsed') === 'true';
  });
  const location = useLocation();
  const { user, loading, hasFamilyRole, isAdmin } = useAuth();
  const hasFullMenu = hasFamilyRole || isAdmin;
  const showDock = location.pathname === '/' || location.pathname === '/grizzly-os';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.body.classList.toggle('electron-app', Boolean(window.grizzlyDesktop?.isDesktop));
  }, []);

  const navGroups = useMemo(() => {
    const groups = hasFullMenu ? familyNavGroups : publicNavGroups;
    if (!isAdmin) return groups;
    return [...groups, adminGroup];
  }, [hasFullMenu, isAdmin]);

  const flatNavItems = useMemo(() => navGroups.flatMap((group) => group.items), [navGroups]);
  const pageLabel = flatNavItems.find(([, href]) => href === location.pathname)?.[0] || 'Workspace';

  const toggleSidebar = () => {
    setSidebarCollapsed((value) => {
      const next = !value;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('grizzly-sidebar-collapsed', String(next));
      }
      return next;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'b') {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const layoutClassName = [
    'os-layout',
    showDock ? 'has-dock' : '',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ');

  const sidebarClassName = [
    'os-sidebar',
    open ? 'is-open' : '',
    sidebarCollapsed ? 'is-collapsed' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClassName}>
      <aside className={sidebarClassName}>
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
          <nav className="os-nav">
            {navGroups.map((group) => (
              <div className="os-nav-group" key={group.label}>
                <span className="os-sidebar-label">{group.label}</span>
                {group.items.map(([label, href, Icon]) => (
                  <NavLink key={`${href}-${label}`} to={href} onClick={() => setOpen(false)} end={href === '/'} title={label}>
                    <Icon size={16} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
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

          <button
            className="os-sidebar-toggle"
            type="button"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Показати ліву панель' : 'Сховати ліву панель'}
            title="Ctrl + B — сховати/показати меню"
          >
            <Menu size={18} />
            <span>Ctrl+B</span>
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
              <Link to="/download">Скачати App</Link>
              {isAdmin && <Link to="/admin">Адмінка</Link>}
            </section>
          </aside>
        </div>

        {showDock && (
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
        )}
      </div>
    </div>
  );
}
