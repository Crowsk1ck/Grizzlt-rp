import {
  BarChart3,
  Calculator,
  CalendarDays,
  Contact,
  GalleryHorizontalEnd,
  Home,
  LogIn,
  LogOut,
  Medal,
  Menu,
  MonitorDot,
  ScrollText,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { familyName } from '../data/siteData.js';
import { useAuth } from '../lib/auth.jsx';
import '../styles/grizzly-os.css';

const publicNavItems = [
  ['Grizzly OS', '/', MonitorDot],
  ['Головна', '/home', Home],
  ['Про родину', '/about', ShieldCheck],
  ['Правила', '/rules', ScrollText],
  ['Вступ', '/recruitment', Trophy],
];

const familyNavItems = [
  ['Grizzly OS', '/', MonitorDot],
  ['Головна', '/home', Home],
  ['Про родину', '/about', ShieldCheck],
  ['Склад', '/roster', Users],
  ['Контракти', '/calculator', Calculator],
  ['Прогрес', '/progress', BarChart3],
  ['Ранги', '/ranks', Medal],
  ['Правила', '/rules', ScrollText],
  ['Події', '/events', CalendarDays],
  ['Галерея', '/gallery', GalleryHorizontalEnd],
  ['Контакти', '/contact', Contact],
];

const dockItems = [
  ['OS', '/', MonitorDot],
  ['Members', '/roster', Users],
  ['Contracts', '/calculator', Calculator],
  ['Calendar', '/events', CalendarDays],
  ['Ranks', '/ranks', Medal],
  ['Admin', '/admin', ShieldCheck],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, loading, hasFamilyRole, isAdmin } = useAuth();
  const hasFullMenu = hasFamilyRole || isAdmin;
  const visibleNavItems = hasFullMenu ? familyNavItems : publicNavItems;
  const roleLabel = isAdmin ? 'ADMIN' : hasFamilyRole ? 'FAMILY' : 'GUEST';

  return (
    <div className="app-shell grizzly-site-os">
      <div className="site-os-bg" />

      <header className="site-header os-site-sidebar">
        <Link className="brand os-brand" to="/grizzly-os" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
          </span>
          <span>
            <strong>{familyName}</strong>
            <small>GRIZZLY OS</small>
          </span>
        </Link>

        <button className="icon-button nav-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Відкрити меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={open ? 'nav os-nav is-open' : 'nav os-nav'}>
          {visibleNavItems.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} onClick={() => setOpen(false)}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="os-sidebar-status">
          <span>System Online</span>
          <span>Discord Sync Active</span>
          <span>Bot Online</span>
        </div>

        <div className="auth-actions os-auth-actions">
          {!loading && !user && (
            <a className="auth-button" href="/api/auth/discord/login" title="Увійти через Discord">
              <LogIn size={17} />
              <span>Discord</span>
            </a>
          )}
          {!loading && user && (
            <>
              <Link className="auth-user" to="/profile" title={user.globalName || user.username}>
                <img src={user.avatar} alt={user.username} />
              </Link>
              <a className="auth-button compact" href="/api/auth/logout" title="Вийти">
                <LogOut size={17} />
              </a>
            </>
          )}
        </div>
      </header>

      <div className="os-route-shell">
        <div className="os-route-topbar">
          <div>
            <span>GRIZZLY OS</span>
            <strong>Family Command Center</strong>
          </div>
          <div>
            <span>{user?.globalName || user?.username || 'Guest'}</span>
            <span>{roleLabel}</span>
            <span>{new Date().toLocaleDateString('uk-UA')}</span>
            <strong>ONLINE</strong>
          </div>
        </div>

        <main className="os-route-main">{children}</main>
      </div>

      <nav className="os-global-dock">
        {dockItems.map(([label, href, Icon]) => (
          <Link key={label} to={href} title={label}>
            <Icon size={19} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
