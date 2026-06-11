import {
  BarChart3,
  Calculator,
  CalendarDays,
  Contact,
  Home,
  LogIn,
  LogOut,
  Medal,
  Menu,
  ScrollText,
  ShieldCheck,
  MonitorCog,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { familyName } from '../data/siteData.js';
import { useAuth } from '../lib/auth.jsx';

const publicNavItems = [
  ['Головна', '/', Home],
  ['Про родину', '/about', ShieldCheck],
  ['Правила', '/rules', ScrollText],
  ['Вступ', '/recruitment', Trophy],
];

const familyNavItems = [
  ['Головна', '/', Home],
  ['Про родину', '/about', ShieldCheck],
  ['Grizzly OS', '/grizzly-os', MonitorCog],
  ['Склад родини', '/roster', Users],
  ['Калькулятор', '/calculator', Calculator],
  ['Прогрес', '/progress', BarChart3],
  ['Ранги', '/ranks', Medal],
  ['Правила', '/rules', ScrollText],
  ['Події', '/events', CalendarDays],
  ['Контакти', '/contact', Contact],
];

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, loading, hasFamilyRole, isAdmin } = useAuth();
  const hasFullMenu = hasFamilyRole || isAdmin;
  const visibleNavItems = hasFullMenu ? familyNavItems : publicNavItems;

  if (location.pathname === '/grizzly-os') {
    return children;
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link className="brand" to="/" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
          </span>
          <span>
            <strong>{familyName}</strong>
            <small>GTA 5 RP Family</small>
          </span>
        </Link>

        <button className="icon-button nav-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Відкрити меню">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={open ? 'nav is-open' : 'nav'}>
          {visibleNavItems.map(([label, href, Icon]) => (
            <NavLink key={href} to={href} onClick={() => setOpen(false)}>
              <Icon size={16} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="auth-actions">
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

      <main>{children}</main>

      <footer className="footer">
        <div>
          <strong>{familyName}</strong>
          <p>© 2026 Grizzly Family | NG</p>
        </div>
        <div className="footer-links">
          {!hasFullMenu && <Link to="/recruitment">Заявка</Link>}
          <Link to="/rules">Правила</Link>
          {isAdmin && <Link to="/admin">Адмінка</Link>}
        </div>
      </footer>
    </div>
  );
}
