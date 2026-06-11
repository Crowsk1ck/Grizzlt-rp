import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bot,
  Calculator,
  CalendarDays,
  Car,
  Crown,
  Database,
  GalleryHorizontalEnd,
  Medal,
  Newspaper,
  Radio,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { familyName, stats } from '../data/siteData.js';
import { useAuth } from '../lib/auth.jsx';
import { firebaseStatus } from '../lib/firebase.js';

const osStats = [
  ['👥', 'Members', stats[0]?.[0] || '120+', 'Склад родини'],
  ['🟢', 'Discord', 'LIVE', 'Статус синхронізації'],
  ['💰', 'Finance', '$0', 'Банк / контракти'],
  ['📅', 'Events', '3', 'Активності'],
  ['⚔️', 'Wars', 'READY', 'War room'],
  ['🏆', 'Rank', 'VIP', 'Рівень сімʼї'],
];

const modules = [
  { icon: UsersRound, title: 'Members Center', text: 'Склад, ролі, онлайн, профілі учасників.', href: '/roster' },
  { icon: Calculator, title: 'Contracts Hub', text: 'Контракти, прибуток, статистика і топи.', href: '/calculator' },
  { icon: CalendarDays, title: 'Event Calendar', text: 'Збори, тренування, війни, конвої та нагадування.', href: '/calendar' },
  { icon: Swords, title: 'War Room', text: 'Плани, противники, результати та архів конфліктів.', href: '/events' },
  { icon: Database, title: 'Finance Vault', text: 'Банк сімʼї, витрати, премії і звіти.', href: '/business' },
  { icon: GalleryHorizontalEnd, title: 'Media Archive', text: 'Галерея, банери, скріни і моменти сімʼї.', href: '/gallery' },
  { icon: Trophy, title: 'Achievements', text: 'Досягнення, нагороди, XP і прогрес.', href: '/achievements' },
  { icon: ScrollText, title: 'Rules Terminal', text: 'Правила, дисципліна, внутрішній кодекс.', href: '/rules' },
];

const signals = [
  ['BOT', 'Discord bot online'],
  ['SYNC', firebaseStatus.connected ? 'Firebase connected' : 'Firebase fallback mode'],
  ['AUTH', 'Discord OAuth ready'],
  ['NG', 'Server family portal'],
];

export default function Home() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="os-home">
      <section className="os-hero-card">
        <div className="os-hero-copy">
          <p className="eyebrow">Ultimate Feature</p>
          <h1>Grizzly OS</h1>
          <p>
            Внутрішня операційна система {familyName}: склад, контракти, фінанси, події,
            Discord-статус і керування родиною в одному premium GTA RP command center.
          </p>
          <div className="os-hero-actions">
            <Link className="button primary" to="/roster">
              Відкрити систему <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/recruitment">
              Подати заявку
            </Link>
            <Link className="button secondary" to="/download">
              Скачать Windows App
            </Link>
          </div>
        </div>

        <div className="os-identity-card">
          <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
          <span>COMMAND CENTER</span>
          <strong>{user ? user.globalName || user.username : 'Guest Access'}</strong>
          <p>{isAdmin ? 'ADMIN CONTROL ENABLED' : 'FAMILY OS MODE'}</p>
        </div>
      </section>

      <section className="os-stat-grid">
        {osStats.map(([icon, label, value, sub]) => (
          <article key={label}>
            <span>{icon}</span>
            <small>{label}</small>
            <strong>{value}</strong>
            <p>{sub}</p>
          </article>
        ))}
      </section>

      <section className="os-command-grid">
        <div className="os-module-area">
          <div className="os-section-title">
            <div>
              <p className="eyebrow">OS Modules</p>
              <h2>Системні модулі</h2>
            </div>
            <Link to="/database">Database</Link>
          </div>

          <div className="os-module-grid">
            {modules.map(({ icon: Icon, title, text, href }) => (
              <Link className="os-module-tile" to={href} key={title}>
                <span><Icon size={24} /></span>
                <strong>{title}</strong>
                <p>{text}</p>
                <em>OPEN</em>
              </Link>
            ))}
          </div>
        </div>

        <aside className="os-command-panel">
          <div className="os-section-title compact">
            <div>
              <p className="eyebrow">Signal</p>
              <h2>Live system</h2>
            </div>
          </div>
          <div className="os-signal-list">
            {signals.map(([label, text]) => (
              <article key={label}>
                <BadgeCheck size={18} />
                <div>
                  <strong>{label}</strong>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="os-quick-actions-home">
            <Link to="/calculator"><Calculator size={18} /> Add Contract</Link>
            <Link to="/calendar"><CalendarDays size={18} /> Create Event</Link>
            <Link to="/news"><Newspaper size={18} /> Add News</Link>
            <Link to="/profile"><Crown size={18} /> Profile</Link>
          </div>
        </aside>
      </section>

      <section className="os-bottom-widgets">
        <article>
          <BarChart3 size={24} />
          <strong>Analytics Core</strong>
          <p>Підготовлено під live-графіки активності, доходів, контрактів і Discord online.</p>
        </article>
        <article>
          <Bot size={24} />
          <strong>Discord Bot Layer</strong>
          <p>Заявки, welcome, новини, ролі, звіти і майбутні push-повідомлення.</p>
        </article>
        <article>
          <Car size={24} />
          <strong>Future Fleet Garage</strong>
          <p>Місце під автопарк родини, номери, власників і статус машин.</p>
        </article>
        <article>
          <Medal size={24} />
          <strong>Rank Protocol</strong>
          <p>XP, ранги, досягнення і сезонна система Grizzly Family.</p>
        </article>
      </section>
    </div>
  );
}
