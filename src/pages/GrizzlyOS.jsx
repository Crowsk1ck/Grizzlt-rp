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
  Command,
  FilePlus2,
  GalleryHorizontalEnd,
  LayoutDashboard,
  Medal,
  MonitorDot,
  Newspaper,
  Plus,
  Radio,
  Shield,
  Swords,
  TerminalSquare,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { db, firebaseStatus } from '../lib/firebase.js';
import '../styles/grizzly-os.css';

const fallbackActivity = [
  'Maryana додала контракт',
  'Andrii створив подію',
  'Zim отримав нагороду',
  'Ghost був прийнятий у сімʼю',
];

const osWindows = [
  {
    title: 'Finance Window',
    icon: WalletCards,
    text: 'Банк сімʼї, контракти, внески та фінансові звіти.',
    href: '/calculator',
  },
  {
    title: 'Members Window',
    icon: Users,
    text: 'Живий склад Discord, ролі, онлайн і профілі учасників.',
    href: '/roster',
  },
  {
    title: 'Events Window',
    icon: CalendarDays,
    text: 'Календар зборів, тренувань, конвоїв і RP-сцен.',
    href: '/events',
  },
  {
    title: 'Activity Window',
    icon: Activity,
    text: 'Останні дії адміністрації, системи та учасників.',
    href: '/progress',
  },
  {
    title: 'Notifications Window',
    icon: Bell,
    text: 'Заявки, статус бота, новини і важливі сигнали.',
    href: '/admin',
  },
];

const dockItems = [
  ['Dashboard', '/grizzly-os', LayoutDashboard],
  ['Members', '/roster', Users],
  ['Contracts', '/calculator', FilePlus2],
  ['Finance', '/calculator', WalletCards],
  ['Calendar', '/events', CalendarDays],
  ['Wars', '/events', Swords],
  ['Gallery', '/gallery', GalleryHorizontalEnd],
  ['Admin', '/admin', Shield],
];

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  const { user, isAdmin, member, hasFamilyRole } = useAuth();
  const [members, setMembers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [wars, setWars] = useState([]);
  const [applications, setApplications] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [familyStats, setFamilyStats] = useState({});
  const [botStatus, setBotStatus] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!db) return undefined;

    const cleanups = [];
    const safeSnapshot = (name, ref, setter) => {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          const rows = snapshot.docs.map((snapshotDoc) => ({ id: snapshotDoc.id, ...snapshotDoc.data() }));
          setter(rows);
        },
        () => setErrors((current) => (current.includes(name) ? current : [...current, name])),
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
      .catch(() => setErrors((current) => (current.includes('stats/family') ? current : [...current, 'stats/family'])));

    getDoc(doc(db, 'bot_status', 'main'))
      .then((snapshot) => {
        if (snapshot.exists()) setBotStatus(snapshot.data());
      })
      .catch(() => setErrors((current) => (current.includes('bot_status/main') ? current : [...current, 'bot_status/main'])));

    return () => cleanups.forEach((cleanup) => cleanup());
  }, []);

  const osStats = useMemo(() => {
    const online = members.filter((item) => item.online || item.status === 'online').length;
    const today = todayKey();
    const month = currentMonthPrefix();
    const eventsToday = events.filter((item) => getEventDate(item.date || item.createdAt) === today).length;
    const warsThisMonth = wars.filter((item) => getEventDate(item.date || item.createdAt).startsWith(month)).length;
    const topMember = familyStats.topMember || members.find((item) => item.contracts || item.score)?.nickname || members[0]?.nickname || 'Немає даних';
    const bank = familyStats.bank || familyStats.familyBank || contracts.reduce((sum, item) => sum + Number(item.amount || item.total || 0), 0);

    return [
      { label: 'Учасників', value: members.length || familyStats.members || 0, icon: Users },
      { label: 'Онлайн', value: online || familyStats.online || 0, icon: CircleDot, tone: 'green' },
      { label: 'Банк сімʼї', value: money(bank), icon: BadgeDollarSign, wide: true },
      { label: 'Контрактів', value: contracts.length || familyStats.contracts || 0, icon: FilePlus2 },
      { label: 'Подій сьогодні', value: eventsToday, icon: CalendarDays },
      { label: 'Війн цього місяця', value: warsThisMonth, icon: Swords },
      { label: 'ТОП учасник', value: topMember, icon: Medal, wide: true },
      { label: 'Активні попередження', value: warnings.length || familyStats.warnings || 0, icon: AlertTriangle, tone: 'warn' },
    ];
  }, [members, contracts, events, wars, warnings, familyStats]);

  const notifications = useMemo(() => {
    const next = [];
    if (applications.length > 0) next.push({ title: 'Нова заявка', text: `${applications.length} заявок у системі`, icon: Users });
    if (events.length > 0) next.push({ title: 'Нова подія', text: `${events.length} подій у календарі`, icon: CalendarDays });
    next.push({ title: 'Звіт сформовано', text: 'Фінансовий модуль готовий до перевірки', icon: FilePlus2 });
    next.push({
      title: 'Discord bot online',
      text: botStatus?.online === false ? 'Бот не відповідає' : 'Система Discord активна',
      icon: Bot,
      online: botStatus?.online !== false,
    });
    return next.slice(0, 4);
  }, [applications, events, botStatus]);

  const visibleQuickActions = [
    ['Додати контракт', '/calculator', Plus, true],
    ['Створити подію', '/events', Plus, true],
    ['Додати новину', '/admin', Newspaper, true],
    ['Відкрити адмінку', '/admin', Shield, true],
    ['Сформувати звіт', '/calculator', TerminalSquare, true],
  ].filter(([, , , adminOnly]) => !adminOnly || isAdmin);

  const activity = activityLogs.length > 0 ? activityLogs.map(logText) : fallbackActivity;
  const roleLabel = isAdmin ? 'Admin' : hasFamilyRole ? 'Family member' : 'Guest';

  return (
    <section className="grizzly-os-page">
      <div className="os-orb os-orb-one" />
      <div className="os-orb os-orb-two" />

      <aside className="os-sidebar">
        <div className="os-logo">
          <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
          <div>
            <strong>GRIZZLY</strong>
            <span>OPERATING SYSTEM</span>
          </div>
        </div>

        <nav className="os-sidebar-nav">
          {dockItems.slice(0, 6).map(([label, href, Icon]) => (
            <Link key={label} to={href}>
              <Icon size={17} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="os-system-card">
          <MonitorDot size={22} />
          <span>System</span>
          <strong>{firebaseStatus.connected ? 'ONLINE' : 'LOCAL MODE'}</strong>
          {errors.length > 0 && <small>{errors.length} fallback modules</small>}
        </div>
      </aside>

      <div className="os-main">
        <header className="os-topbar">
          <div>
            <p>Grizzly OS</p>
            <h1>Family Command Center</h1>
          </div>
          <div className="os-topbar-status">
            <span><Users size={15} /> {user?.globalName || user?.username || 'Guest'}</span>
            <span><Shield size={15} /> {roleLabel}</span>
            <span><Radio size={15} /> {osStats[1].value} online</span>
            <span>{new Date().toLocaleDateString('uk-UA')}</span>
            <strong><CheckCircle2 size={16} /> ONLINE</strong>
          </div>
        </header>

        <div className="os-content-grid">
          <main className="os-center">
            <section className="os-hero-window">
              <div>
                <p className="os-kicker">Internal GTA RP desktop</p>
                <h2>Керування родиною в одному режимі</h2>
                <p>Live-статистика, модулі, швидкі дії, події, фінанси, Discord-активність і адмінські переходи у стилі внутрішньої операційної системи Grizzly Family.</p>
              </div>
              <Command size={54} />
            </section>

            <section className="os-widget-grid">
              {osStats.map(({ label, value, icon: Icon, wide, tone }) => (
                <article className={`os-widget ${wide ? 'wide' : ''} ${tone || ''}`} key={label}>
                  <Icon size={24} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </section>

            <section className="os-window-grid">
              {osWindows.map(({ title, icon: Icon, text, href }) => (
                <article className="os-window" key={title}>
                  <div className="os-window-title">
                    <span><Icon size={16} /> {title}</span>
                    <button type="button" aria-label={`Закрити ${title}`}><X size={14} /></button>
                  </div>
                  <p>{text}</p>
                  <Link to={href}>Open <ChevronRight size={15} /></Link>
                </article>
              ))}
            </section>

            <section className="os-quick-actions">
              <div>
                <p className="os-kicker">Quick actions</p>
                <h2>Швидкі дії</h2>
              </div>
              <div>
                {visibleQuickActions.map(([label, href, Icon]) => (
                  <Link key={label} to={href}>
                    <Icon size={17} />
                    <span>{label}</span>
                  </Link>
                ))}
                {!isAdmin && <p className="os-muted">Адмінські дії доступні тільки штабу.</p>}
              </div>
            </section>
          </main>

          <aside className="os-right-rail">
            <section className="os-panel">
              <div className="os-panel-head">
                <p className="os-kicker">Live activity</p>
                <Activity size={20} />
              </div>
              <h2>Останні дії</h2>
              <div className="os-feed">
                {activity.map((item, index) => (
                  <article key={`${item}-${index}`}>
                    <span />
                    <p>{item}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="os-panel">
              <div className="os-panel-head">
                <p className="os-kicker">Notifications</p>
                <Bell size={20} />
              </div>
              <h2>Центр повідомлень</h2>
              <div className="os-notifications">
                {notifications.map(({ title, text, icon: Icon, online }) => (
                  <article key={title} className={online === false ? 'offline' : ''}>
                    <Icon size={18} />
                    <div>
                      <strong>{title}</strong>
                      <span>{text}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <nav className="os-dock">
          {dockItems.map(([label, href, Icon]) => (
            <Link key={label} to={href} title={label}>
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
