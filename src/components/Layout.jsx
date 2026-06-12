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
  Newspaper,
  Radio,
  ScrollText,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Trophy,
  Users,
} from 'lucide-react';
import { useEffect, useMemo } from 'react';
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

const activityItems = [
  ['SYSTEM', 'Grizzly OS запущено'],
  ['DISCORD', 'Синхронізація складу активна'],
  ['FINANCE', 'Модуль контрактів готовий'],
  ['EVENTS', 'Календар очікує нові події'],
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, loading, hasFamilyRole, isAdmin } = useAuth();
  const hasFullMenu = hasFamilyRole || isAdmin;

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

  return (
    <div className="os-layout os-layout-center-nav">
      <div className="os-main">
        <header className="os-topbar os-topbar-center-nav">
          <Link className="os-topbar-brand" to="/" aria-label="Grizzly OS home">
            <span className="os-topbar-logo">
              <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
            </span>
            <span>
              <strong>Grizzly OS</strong>
              <small>{familyName} / NG</small>
            </span>
          </Link>

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

        <nav className="os-center-launcher" aria-label="Grizzly OS Launcher">
          {navGroups.map((group) => (
            <div className="os-launcher-group" key={group.label}>
              <span className="os-launcher-label">{group.label}</span>
              <div className="os-launcher-links">
                {group.items.map(([label, href, Icon]) => (
                  <NavLink key={`${href}-${label}`} to={href} end={href === '/'} title={label}>
                    <Icon size={17} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

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
      </div>
    </div>
  );
}
