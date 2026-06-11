import {
  Activity,
  BadgeCheck,
  Banknote,
  Bell,
  Bot,
  CalendarDays,
  Car,
  ChevronRight,
  ClipboardList,
  FileText,
  Gauge,
  GraduationCap,
  Image,
  Lock,
  Medal,
  Newspaper,
  Plus,
  Radio,
  ScrollText,
  Shield,
  ShieldAlert,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useAuth } from '../lib/auth.jsx';
import { db } from '../lib/firebase.js';
import './grizzly-os.css';

const moneyFormatter = new Intl.NumberFormat('en-US');

const fallbackActivity = [
  { id: 'fallback-1', title: 'Maryana додала контракт', text: 'Система очікує live дані Firestore', tone: 'pink', time: 'live' },
  { id: 'fallback-2', title: 'Andrii створив подію', text: 'Календар підключений до Grizzly OS', tone: 'blue', time: 'live' },
  { id: 'fallback-3', title: 'Zim отримав нагороду', text: 'XP та досягнення готові до інтеграції', tone: 'orange', time: 'live' },
  { id: 'fallback-4', title: 'Ghost був прийнятий у сімʼю', text: 'Заявки синхронізуються через Discord', tone: 'green', time: 'live' },
];

const fallbackEvents = [
  { id: 'event-1', title: 'Збір K2', date: 'сьогодні', time: '20:00', type: 'meeting' },
  { id: 'event-2', title: 'Війна з RM', date: 'сьогодні', time: '21:00', type: 'war' },
  { id: 'event-3', title: 'Тренування', date: 'завтра', time: '19:30', type: 'training' },
];

const moduleTiles = [
  { title: 'Members Center', description: 'Склад, ролі, онлайн та профілі родини', href: '/roster', icon: Users, tone: 'pink' },
  { title: 'Contracts Hub', description: 'Контракти, дохід та історія заробітку', href: '/calculator', icon: ClipboardList, tone: 'violet' },
  { title: 'Finance Vault', description: 'Банк сімʼї, транзакції та фінансова аналітика', href: '/calculator', icon: Banknote, tone: 'green' },
  { title: 'Event Calendar', description: 'Збори, тренування, сходки та нагадування', href: '/calendar', icon: CalendarDays, tone: 'blue' },
  { title: 'War Room', description: 'Війни, результати, вороги та стратегія', href: '/events', icon: Swords, tone: 'red' },
  { title: 'Gallery Archive', description: 'Скріншоти, фото, історія та медіа родини', href: '/gallery', icon: Image, tone: 'purple' },
  { title: 'Admin Control', description: 'Заявки, новини, бот та керування системою', href: '/admin', icon: Lock, tone: 'orange', adminOnly: true },
  { title: 'Achievements', description: 'Нагороди, бейджі, XP та сезонний прогрес', href: '/achievements', icon: Trophy, tone: 'gold' },
  { title: 'Fleet Garage', description: 'Автопарк, номери, власники та статус машин', href: '/business', icon: Car, tone: 'cyan' },
  { title: 'Academy', description: 'Навчання новачків, правила та інструкції', href: '/rules', icon: GraduationCap, tone: 'pink' },
];

const quickActions = [
  { label: '+ Додати контракт', href: '/calculator', tone: 'pink', adminOnly: false },
  { label: '+ Створити подію', href: '/calendar', tone: 'violet', adminOnly: false },
  { label: '+ Додати новину', href: '/admin', tone: 'blue', adminOnly: true },
  { label: 'Сформувати звіт', href: '/calculator', tone: 'green', adminOnly: true },
  { label: 'Відкрити адмінку', href: '/admin', tone: 'orange', adminOnly: true },
];

const osNav = [
  { label: 'Dashboard', href: '/grizzly-os', icon: Gauge },
  { label: 'Members', href: '/roster', icon: Users },
  { label: 'Contracts', href: '/calculator', icon: ClipboardList },
  { label: 'Finance', href: '/calculator', icon: Banknote },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'Wars', href: '/events', icon: Swords },
  { label: 'Gallery', href: '/gallery', icon: Image },
  { label: 'Admin', href: '/admin', icon: Shield },
];

function dateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateMonthKey(date = new Date()) {
  return dateKey(date).slice(0, 7);
}

function formatMoney(value) {
  const amount = Number(value || 0);
  return `$${moneyFormatter.format(Number.isFinite(amount) ? Math.round(amount) : 0)}`;
}

function firestoreDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function timeAgo(value) {
  const date = firestoreDate(value);
  if (!date) return 'live';
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'щойно';
  if (minutes < 60) return `${minutes} хв тому`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} год тому`;
  const days = Math.floor(hours / 24);
  return `${days} дн тому`;
}

function pickNumber(data, keys) {
  for (const key of keys) {
    const value = Number(data?.[key]);
    if (Number.isFinite(value)) return value;
  }
  return 0;
}

function normalizeMember(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  return {
    id: documentSnapshot.id,
    name: data.nickname || data.globalName || data.username || 'Unknown',
    avatar: data.avatar || data.photoURL || '',
    role: data.rank || data.roleName || data.role || 'Member',
    online: Boolean(data.online),
    xp: pickNumber(data, ['xp', 'experience']),
    income: pickNumber(data, ['income', 'money', 'totalIncome', 'earned']),
    contracts: pickNumber(data, ['contracts', 'contractCount', 'contractsCount']),
    bot: Boolean(data.bot),
  };
}

function normalizeContract(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  return {
    id: documentSnapshot.id,
    title: data.name || data.title || data.contractName || 'Контракт',
    amount: pickNumber(data, ['amount', 'income', 'total', 'sum']),
    players: Array.isArray(data.players) ? data.players : [],
    createdAt: data.createdAt || data.date || null,
    date: data.date || '',
    createdBy: data.createdBy || null,
  };
}

function normalizeEvent(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  return {
    id: documentSnapshot.id,
    title: data.title || 'Подія',
    type: data.type || 'other',
    date: data.date || '',
    time: data.time || '',
    location: data.location || '',
    createdAt: data.createdAt || data.date || null,
  };
}

function normalizeActivity(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  return {
    id: documentSnapshot.id,
    title: data.title || data.action || data.message || 'Активність системи',
    text: data.text || data.description || data.details || 'Grizzly OS live event',
    time: timeAgo(data.createdAt || data.timestamp || data.date),
    tone: data.tone || data.type || 'pink',
  };
}

function normalizeApplication(documentSnapshot) {
  const data = documentSnapshot.data() || {};
  return {
    id: documentSnapshot.id,
    title: data.nickname || data.discordUser?.username || 'Нова заявка',
    status: data.status || 'new',
    createdAt: data.createdAt || null,
  };
}

function useCollectionData(collectionName, normalizer, options = {}) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!db) {
      setReady(true);
      return undefined;
    }

    let target = collection(db, collectionName);
    if (options.orderBy) {
      target = query(target, orderBy(options.orderBy, options.direction || 'desc'), limit(options.limit || 50));
    }

    const unsubscribe = onSnapshot(
      target,
      (snapshot) => {
        setItems(snapshot.docs.map(normalizer));
        setReady(true);
      },
      () => {
        setItems([]);
        setReady(true);
      },
    );

    return unsubscribe;
  }, [collectionName, normalizer, options.orderBy, options.direction, options.limit]);

  return [items, ready];
}

export default function GrizzlyOS() {
  const { user, isAdmin, member } = useAuth();
  const today = dateKey();
  const currentMonth = dateMonthKey();

  const [members] = useCollectionData('discord_members', normalizeMember);
  const [contracts] = useCollectionData('calculator_contracts', normalizeContract, { orderBy: 'createdAt', limit: 80 });
  const [events] = useCollectionData('events', normalizeEvent, { orderBy: 'date', direction: 'asc', limit: 80 });
  const [wars] = useCollectionData('family_wars', normalizeEvent, { orderBy: 'date', direction: 'desc', limit: 50 });
  const [applications] = useCollectionData('applications', normalizeApplication, { orderBy: 'createdAt', limit: 30 });
  const [activityLogs] = useCollectionData('activity_logs', normalizeActivity, { orderBy: 'createdAt', limit: 12 });

  const [familyStats, setFamilyStats] = useState({ bank: 0, income: 0, expenses: 0 });
  const [botStatus, setBotStatus] = useState(null);

  useEffect(() => {
    if (!db) return undefined;

    const unsubscribe = onSnapshot(
      doc(db, 'stats', 'family'),
      (snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : {};
        setFamilyStats({
          bank: pickNumber(data, ['bank', 'balance', 'familyBank', 'totalBank']),
          income: pickNumber(data, ['income', 'totalIncome', 'gross']),
          expenses: pickNumber(data, ['expenses', 'totalExpenses']),
        });
      },
      () => setFamilyStats({ bank: 0, income: 0, expenses: 0 }),
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!db) return undefined;

    const unsubscribe = onSnapshot(
      doc(db, 'bot_status', 'main'),
      (snapshot) => {
        setBotStatus(snapshot.exists() ? snapshot.data() : null);
      },
      () => setBotStatus(null),
    );

    return unsubscribe;
  }, []);

  const realMembers = useMemo(() => members.filter((item) => !item.bot), [members]);
  const onlineCount = useMemo(() => realMembers.filter((item) => item.online).length, [realMembers]);
  const topMembers = useMemo(() => {
    return [...realMembers]
      .sort((a, b) => (b.income + b.xp + b.contracts * 1000) - (a.income + a.xp + a.contracts * 1000))
      .slice(0, 5);
  }, [realMembers]);

  const totalContractIncome = useMemo(() => contracts.reduce((sum, contract) => sum + contract.amount, 0), [contracts]);
  const todayEvents = useMemo(() => events.filter((event) => event.date === today), [events, today]);
  const upcomingEvents = useMemo(() => {
    const list = events.filter((event) => !event.date || event.date >= today).slice(0, 5);
    return list.length ? list : fallbackEvents;
  }, [events, today]);
  const warsThisMonth = useMemo(() => wars.filter((war) => String(war.date || '').startsWith(currentMonth)).length, [wars, currentMonth]);
  const activeWarnings = useMemo(() => applications.filter((item) => item.status === 'new' || item.status === 'interview').length, [applications]);
  const activity = activityLogs.length ? activityLogs : fallbackActivity;
  const roleName = isAdmin ? 'Administrator' : member?.rank || member?.role || 'Member';
  const bankValue = familyStats.bank || Math.round(totalContractIncome * 0.1);
  const systemOnline = !db || botStatus?.online !== false;

  const statCards = [
    { label: 'Members', value: realMembers.length, subtitle: '+ склад родини', icon: Users, tone: 'pink' },
    { label: 'Online', value: onlineCount, subtitle: 'Discord active', icon: Radio, tone: 'green' },
    { label: 'Family Bank', value: formatMoney(bankValue), subtitle: `${formatMoney(familyStats.income || totalContractIncome)} оборот`, icon: Banknote, tone: 'orange' },
    { label: 'Contracts', value: contracts.length, subtitle: 'активна історія', icon: ClipboardList, tone: 'violet' },
    { label: 'Events Today', value: todayEvents.length, subtitle: 'подій сьогодні', icon: CalendarDays, tone: 'blue' },
    { label: 'Wars This Month', value: warsThisMonth, subtitle: 'цього місяця', icon: Swords, tone: 'red' },
    { label: 'Top Member', value: topMembers[0]?.name || '—', subtitle: topMembers[0] ? `${topMembers[0].xp} XP` : 'очікує дані', icon: Medal, tone: 'gold' },
    { label: 'Warnings', value: activeWarnings, subtitle: 'заявки / увага', icon: ShieldAlert, tone: 'pink' },
  ];

  const visibleModules = moduleTiles.filter((tile) => !tile.adminOnly || isAdmin);
  const visibleActions = quickActions.filter((action) => !action.adminOnly || isAdmin);

  return (
    <div className="grizzly-os-page">
      <aside className="gos-sidebar">
        <Link className="gos-brand" to="/grizzly-os">
          <img src="/assets/grizzly-logo.png" alt="Grizzly OS" />
          <span>
            <strong>GRIZZLY OS</strong>
            <small>Family System</small>
          </span>
        </Link>

        <nav className="gos-nav">
          {osNav.map(({ label, href, icon: Icon }) => (
            <Link key={href} to={href} className={href === '/grizzly-os' ? 'active' : ''}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="gos-system-card">
          <span className="gos-chip green"><span />SYSTEM</span>
          <strong>{systemOnline ? 'ONLINE' : 'OFFLINE'}</strong>
          <p>Discord Sync Active</p>
          <p>Bot {botStatus?.online === false ? 'Offline' : 'Online'}</p>
        </div>

        <a className="gos-discord" href="https://discord.com" target="_blank" rel="noreferrer">
          <Bot size={18} />
          <span>Join Discord</span>
          <ChevronRight size={16} />
        </a>
      </aside>

      <main className="gos-main">
        <section className="gos-hero">
          <div className="gos-hero-copy">
            <span className="gos-kicker"><Sparkles size={16} /> GRIZZLY OS v2.0</span>
            <h1>Family Command Center</h1>
            <p>Керування родиною, контрактами, фінансами, подіями, війнами та Discord-активністю в одному преміум режимі.</p>
          </div>

          <div className="gos-hero-status">
            <div className="gos-user-mini">
              {user?.avatar ? <img src={user.avatar} alt={user.username} /> : <div className="gos-avatar-fallback"><Users size={20} /></div>}
              <span>
                <strong>{user?.globalName || user?.username || 'Guest'}</strong>
                <small>{roleName}</small>
              </span>
            </div>
            <div className="gos-status-line"><span className="pulse" /> System Online</div>
            <div className="gos-status-grid">
              <span>Discord: <b>{onlineCount}</b></span>
              <span>Date: <b>{new Date().toLocaleDateString('uk-UA')}</b></span>
              <span>Role: <b>{roleName}</b></span>
            </div>
          </div>
        </section>

        <section className="gos-stats-grid">
          {statCards.map(({ label, value, subtitle, icon: Icon, tone }) => (
            <article className={`gos-stat-card tone-${tone}`} key={label}>
              <div className="gos-stat-icon"><Icon size={22} /></div>
              <span>{label}</span>
              <strong>{value}</strong>
              <small>{subtitle}</small>
            </article>
          ))}
        </section>

        <section className="gos-section">
          <div className="gos-section-head">
            <span>OS Modules</span>
            <small>Основні застосунки внутрішньої системи</small>
          </div>
          <div className="gos-modules-grid">
            {visibleModules.map(({ title, description, href, icon: Icon, tone }) => (
              <Link className={`gos-module tone-${tone}`} to={href} key={title}>
                <Icon size={30} />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
                <em>Open <ChevronRight size={14} /></em>
              </Link>
            ))}
          </div>
        </section>

        <section className="gos-section">
          <div className="gos-section-head">
            <span>Quick Actions</span>
            <small>Швидкі переходи для роботи сімʼї</small>
          </div>
          <div className="gos-actions">
            {visibleActions.map(({ label, href, tone }) => (
              <Link className={`gos-action tone-${tone}`} to={href} key={label}>
                <Plus size={17} />
                {label}
              </Link>
            ))}
          </div>
        </section>

        <section className="gos-bottom-grid">
          <article className="gos-chart-panel">
            <div className="gos-section-head compact">
              <span>Family Bank Overview</span>
              <small>Баланс і оборот родини</small>
            </div>
            <div className="gos-money-row">
              <strong>{formatMoney(bankValue)}</strong>
              <span>Family Bank</span>
            </div>
            <div className="gos-mini-chart" aria-hidden="true">
              <i style={{ height: '22%' }} />
              <i style={{ height: '42%' }} />
              <i style={{ height: '36%' }} />
              <i style={{ height: '62%' }} />
              <i style={{ height: '55%' }} />
              <i style={{ height: '78%' }} />
              <i style={{ height: '68%' }} />
              <i style={{ height: '88%' }} />
            </div>
          </article>

          <article className="gos-contracts-panel">
            <div className="gos-section-head compact">
              <span>Contracts Overview</span>
              <small>Останні фінансові записи</small>
            </div>
            <div className="gos-contract-list">
              {(contracts.slice(0, 4).length ? contracts.slice(0, 4) : [
                { id: 'empty-1', title: 'Контрактів ще немає', amount: 0, players: [] },
              ]).map((contract) => (
                <div key={contract.id}>
                  <FileText size={16} />
                  <span>{contract.title}</span>
                  <b>{formatMoney(contract.amount)}</b>
                </div>
              ))}
            </div>
          </article>

          <article className="gos-top-panel">
            <div className="gos-section-head compact">
              <span>Top Members</span>
              <small>Найактивніші учасники</small>
            </div>
            <div className="gos-top-list">
              {(topMembers.length ? topMembers : [{ id: 'fallback', name: 'Очікує дані', role: 'Member', xp: 0 }]).map((item, index) => (
                <div key={item.id}>
                  <b>{index + 1}</b>
                  {item.avatar ? <img src={item.avatar} alt={item.name} /> : <span className="gos-rank-avatar">{item.name.slice(0, 1)}</span>}
                  <span>{item.name}<small>{item.role}</small></span>
                  <em>{item.xp} XP</em>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>

      <aside className="gos-right-panel">
        <section className="gos-feed-card">
          <div className="gos-panel-title">
            <span><Activity size={16} /> Live Activity</span>
            <small>LIVE</small>
          </div>
          <div className="gos-feed-list">
            {activity.slice(0, 6).map((item) => (
              <article key={item.id} className={`tone-${item.tone}`}>
                <span className="feed-dot" />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>
        </section>

        <section className="gos-feed-card">
          <div className="gos-panel-title">
            <span><Bell size={16} /> Notifications</span>
            <small>{activeWarnings}</small>
          </div>
          <div className="gos-notifications">
            <div><Newspaper size={16} /> Нова заявка <small>{applications[0]?.title || 'очікує'}</small></div>
            <div><CalendarDays size={16} /> Нова подія <small>{upcomingEvents[0]?.title || 'немає'}</small></div>
            <div><ScrollText size={16} /> Звіт системи <small>готовий</small></div>
            <div><Bot size={16} /> Discord Bot <small>{botStatus?.online === false ? 'offline' : 'online'}</small></div>
          </div>
        </section>

        <section className="gos-feed-card">
          <div className="gos-panel-title">
            <span><CalendarDays size={16} /> Upcoming Events</span>
            <small>{upcomingEvents.length}</small>
          </div>
          <div className="gos-events-list">
            {upcomingEvents.slice(0, 4).map((event) => (
              <Link to="/calendar" key={event.id}>
                <span className={`event-badge ${event.type}`}>{event.type === 'war' ? 'WAR' : 'EVENT'}</span>
                <strong>{event.title}</strong>
                <small>{event.date || 'дата'} · {event.time || 'час'}</small>
              </Link>
            ))}
          </div>
        </section>

        <section className="gos-feed-card bot-card">
          <div className="gos-panel-title">
            <span><Bot size={16} /> Bot Status</span>
            <small>{botStatus?.online === false ? 'OFF' : 'ON'}</small>
          </div>
          <div className="gos-bot-lines">
            <div><BadgeCheck size={16} /> Grizzly Bot <b>{botStatus?.online === false ? 'OFFLINE' : 'ONLINE'}</b></div>
            <div><Zap size={16} /> Firestore <b>{db ? 'CONNECTED' : 'FALLBACK'}</b></div>
            <div><Shield size={16} /> Security <b>ACTIVE</b></div>
          </div>
        </section>
      </aside>
    </div>
  );
}
