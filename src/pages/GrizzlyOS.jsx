import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  FilePlus2,
  GalleryHorizontalEnd,
  GraduationCap,
  Landmark,
  Medal,
  Newspaper,
  Plus,
  Radio,
  Shield,
  Swords,
  TerminalSquare,
  Trophy,
  Users,
  Warehouse,
  WalletCards,
} from 'lucide-react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { db, firebaseStatus } from '../lib/firebase.js';

const fallbackActivity = [
  'Maryana додала контракт',
  'Andrii створив подію',
  'Zim отримав нагороду',
  'Ghost прийнятий у сімʼю',
];

const fallbackEvents = [
  'Збір K2 — 20:00',
  'Війна з RM — 21:00',
  'Тренування — 19:30',
];

const appTiles = [
  ['Members Center', 'Живий Discord склад, ролі та онлайн.', '/roster', Users],
  ['Contracts Hub', 'Контракти, звіти та ручний довідник.', '/calculator', FilePlus2],
  ['Finance Vault', 'Банк сімʼї, частки та прибуток.', '/calculator', WalletCards],
  ['Event Calendar', 'Збори, тренування, конвої та RP-сцени.', '/events', CalendarDays],
  ['War Room', 'Війни, рейди та бойові активності.', '/events', Swords],
  ['Gallery Archive', 'Медіа, фото та сімейні моменти.', '/gallery', GalleryHorizontalEnd],
  ['Admin Control', 'Заявки, рішення та системні дії.', '/admin', Shield],
  ['Achievements', 'Досягнення, прогрес і статус родини.', '/achievements', Trophy],
  ['Fleet Garage', 'Авто, колони та сімейний супровід.', '/business', Warehouse],
  ['Academy', 'Правила, вступ і навчання кандидатів.', '/rules', GraduationCap],
];

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function currentMonthPrefix(date = new Date()) {
  return todayKey(date).slice(0, 7);
}

function money(value) {
  return `$ ${Math.round(Number(value || 0)).toLocaleString('uk-UA')}`;
}

function getEventDate(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.toDate) return todayKey(value.toDate());
  return '';
}

function logText(item) {
  return item.message || item.text || item.title || item.action || item.description || 'Системна дія Grizzly OS';
}

export default function GrizzlyOS() {
  const { user, isAdmin, hasFamilyRole } = useAuth();
  const [members, setMembers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [wars, setWars] = useState([]);
  const [applications, setApplications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [familyStats, setFamilyStats] = useState({});
  const [botStatus, setBotStatus] = useState(null);
  const [fallbackModules, setFallbackModules] = useState([]);

  useEffect(() => {
    if (!db) return undefined;

    const cleanups = [];
    const safeSnapshot = (name, ref, setter) => {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          setter(snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() })));
        },
        () => setFallbackModules((current) => (current.includes(name) ? current : [...current, name])),
      );
      cleanups.push(unsubscribe);
    };

    safeSnapshot('discord_members', collection(db, 'discord_members'), setMembers);
    safeSnapshot('contracts', collection(db, 'contracts'), setContracts);
    safeSnapshot('events', collection(db, 'events'), setEvents);
    safeSnapshot('family_wars', collection(db, 'family_wars'), setWars);
    safeSnapshot('applications', collection(db, 'applications'), setApplications);
    safeSnapshot('member_warnings', collection(db, 'member_warnings'), setWarnings);
    safeSnapshot('activity_logs', query(collection(db, 'activity_logs'), orderBy('createdAt', 'desc'), limit(8)), setActivityLogs);

    getDoc(doc(db, 'stats', 'family'))
      .then((snapshot) => {
        if (snapshot.exists()) setFamilyStats(snapshot.data());
      })
      .catch(() => setFallbackModules((current) => (current.includes('stats/family') ? current : [...current, 'stats/family'])));

    getDoc(doc(db, 'bot_status', 'main'))
      .then((snapshot) => {
        if (snapshot.exists()) setBotStatus(snapshot.data());
      })
      .catch(() => setFallbackModules((current) => (current.includes('bot_status/main') ? current : [...current, 'bot_status/main'])));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const roleLabel = isAdmin ? 'Admin' : hasFamilyRole ? 'Family' : 'Guest';
  const online = members.filter((item) => item.online || item.status === 'online').length;
  const today = todayKey();
  const month = currentMonthPrefix();
  const eventsToday = events.filter((item) => getEventDate(item.date || item.createdAt) === today).length;
  const warsThisMonth = wars.filter((item) => getEventDate(item.date || item.createdAt).startsWith(month)).length;
  const bank = familyStats.bank || familyStats.familyBank || contracts.reduce((sum, item) => sum + Number(item.amount || item.total || 0), 0);
  const topMember = familyStats.topMember || members.find((item) => item.contracts || item.score)?.nickname || members[0]?.nickname || 'No data';

  const stats = [
    ['Members', members.length || familyStats.members || 0, 'registered in OS', Users],
    ['Online', online || familyStats.online || 0, 'Discord sync active', CircleDot, 'green'],
    ['Family Bank', money(bank), 'finance vault', BadgeDollarSign, 'orange'],
    ['Contracts', contracts.length || familyStats.contracts || 0, 'total records', FilePlus2],
    ['Events Today', eventsToday, 'scheduled today', CalendarDays],
    ['Wars This Month', warsThisMonth, 'war room log', Swords, 'red'],
    ['Top Member', topMember, 'current leader', Medal, 'wide'],
    ['Warnings', warnings.length || familyStats.warnings || 0, 'active alerts', AlertTriangle, 'warn'],
  ];

  const activity = activityLogs.length > 0 ? activityLogs.map(logText) : fallbackActivity;
  const upcomingEvents = events
    .filter((item) => getEventDate(item.date || item.createdAt) >= today)
    .slice(0, 3)
    .map((item) => `${item.title || 'Подія'} — ${item.time || '00:00'}`);
  const notifications = [
    applications.length ? `Нова заявка: ${applications.length}` : 'Нова заявка',
    events.length ? `Нова подія: ${events.length}` : 'Нова подія',
    'Звіт сформовано',
    botStatus?.online === false ? 'Discord Bot Offline' : 'Discord Bot Online',
  ];

  const quickActions = [
    ['Add Contract', '/calculator', Plus, true],
    ['Create Event', '/events', CalendarDays, true],
    ['Add News', '/admin', Newspaper, true],
    ['Open Admin', '/admin', Shield, true],
    ['Generate Report', '/calculator', TerminalSquare, true],
  ].filter(([, , , adminOnly]) => !adminOnly || isAdmin);

  return (
    <section className="grizzly-command-page">
      <div className="command-grid">
        <main className="command-main">
          <section className="command-hero">
            <div className="command-hero-copy">
              <span>GRIZZLY OS v2.0</span>
              <h1>Family Command Center</h1>
              <p>Внутрішня система керування родиною, контрактами, фінансами, подіями та війнами в одному режимі.</p>
            </div>
            <div className="command-hero-status">
              <strong>ONLINE</strong>
              <span>Discord: {online || familyStats.online || 0} online</span>
              <span>Date: {new Date().toLocaleDateString('uk-UA')}</span>
              <span>Role: {roleLabel}</span>
              <small>{firebaseStatus.connected ? 'Firebase linked' : 'Local fallback'}</small>
            </div>
          </section>

          <section className="command-stats">
            {stats.map(([label, value, subtitle, Icon, tone]) => (
              <article className={`command-stat ${tone || ''}`} key={label}>
                <Icon size={23} />
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{subtitle}</small>
              </article>
            ))}
          </section>

          <section className="command-section-head">
            <div>
              <span>OS Modules</span>
              <h2>Family apps</h2>
            </div>
            <p>{fallbackModules.length > 0 ? `${fallbackModules.length} modules on fallback` : 'All systems ready'}</p>
          </section>

          <section className="command-app-grid">
            {appTiles.map(([title, text, href, Icon]) => (
              <article className="command-app-tile" key={title}>
                <Icon size={24} />
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={href}>Open <ChevronRight size={15} /></Link>
              </article>
            ))}
          </section>

          <section className="command-lower-grid">
            <div className="command-panel finance-preview">
              <div>
                <span>Finance Preview</span>
                <h2>{money(bank)}</h2>
              </div>
              <p>Контракти: {contracts.length || 0} · Попередження: {warnings.length || 0}</p>
              <Link to="/calculator">Open vault <ChevronRight size={15} /></Link>
            </div>

            <div className="command-panel quick-actions">
              <div>
                <span>Quick Actions</span>
                <h2>Fast commands</h2>
              </div>
              <div>
                {quickActions.map(([label, href, Icon]) => (
                  <Link key={label} to={href}><Icon size={16} /> {label}</Link>
                ))}
                {!isAdmin && <p>Admin commands hidden for guests.</p>}
              </div>
            </div>
          </section>
        </main>

        <aside className="command-right-panel">
          <div className="command-panel live-panel">
            <div className="panel-title">
              <span>Live Activity</span>
              <Activity size={18} />
            </div>
            {activity.map((item, index) => (
              <article key={`${item}-${index}`}>
                <i />
                <p>{item}</p>
              </article>
            ))}
          </div>

          <div className="command-panel">
            <div className="panel-title">
              <span>Notifications</span>
              <Bell size={18} />
            </div>
            {notifications.map((item) => (
              <article className="mini-row" key={item}>
                <CheckCircle2 size={16} />
                <p>{item}</p>
              </article>
            ))}
          </div>

          <div className="command-panel">
            <div className="panel-title">
              <span>Upcoming Events</span>
              <CalendarDays size={18} />
            </div>
            {(upcomingEvents.length > 0 ? upcomingEvents : fallbackEvents).map((item) => (
              <article className="mini-row" key={item}>
                <Radio size={16} />
                <p>{item}</p>
              </article>
            ))}
          </div>

          <div className="command-panel bot-panel">
            <div className="panel-title">
              <span>Bot Status</span>
              <Bot size={18} />
            </div>
            <strong>{botStatus?.online === false ? 'OFFLINE' : 'ONLINE'}</strong>
            <p>Discord automation, role sync and notifications.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
