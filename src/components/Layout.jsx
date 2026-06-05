import { LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { familyName, navItems } from '../data/siteData.js';
import { useAuth } from '../lib/auth.jsx';

export default function Layout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, loading, hasFamilyRole } = useAuth();
  const visibleNavItems = navItems.filter(([, href]) => !(hasFamilyRole && href === '/recruitment'));

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
          {visibleNavItems.map(([label, href]) => (
            <NavLink key={href} to={href} onClick={() => setOpen(false)}>
              {label}
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
          {!hasFamilyRole && <Link to="/recruitment">Заявка</Link>}
          <Link to="/rules">Устав</Link>
          <Link to="/admin">Адмінка</Link>
        </div>
      </footer>
    </div>
  );
}
