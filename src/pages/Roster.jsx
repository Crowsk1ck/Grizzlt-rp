import { Activity, Crown, Radio, Search, ShieldCheck, Users } from 'lucide-react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { roster } from '../data/siteData.js';
import { db } from '../lib/firebase.js';

function sortMembers(a, b, sortMode) {
  if (sortMode === 'name') {
    return (a.nickname || a.username || '').localeCompare(b.nickname || b.username || '');
  }

  return Number(b.online) - Number(a.online) || (a.nickname || a.username || '').localeCompare(b.nickname || b.username || '');
}

function memberName(member) {
  return member.nickname || member.username || 'Учасник Grizzly';
}

export default function Roster() {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('online');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const loadingTimer = window.setTimeout(() => {
      if (active) setLoading(false);
    }, 8000);

    function mapMembers(snapshot) {
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((member) => !member.bot);
    }

    getDocs(collection(db, 'discord_members'))
      .then((snapshot) => {
        if (!active) return;
        setMembers(mapMembers(snapshot));
        setLoading(false);
      })
      .catch((snapshotError) => {
        if (!active) return;
        setError(snapshotError.message);
        setLoading(false);
      });

    const unsubscribeMembers = onSnapshot(
      collection(db, 'discord_members'),
      (snapshot) => {
        if (!active) return;
        setMembers(mapMembers(snapshot));
        setLoading(false);
      },
      (snapshotError) => {
        if (!active) return;
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    const unsubscribeStats = onSnapshot(doc(db, 'stats', 'discord_members'), (snapshot) => {
      setStats(snapshot.exists() ? snapshot.data() : null);
    });

    return () => {
      active = false;
      window.clearTimeout(loadingTimer);
      unsubscribeMembers();
      unsubscribeStats();
    };
  }, []);

  const visibleStats = useMemo(() => {
    const online = members.filter((member) => member.online).length;
    const total = stats?.members || members.length;

    return {
      total,
      online: stats?.online || online,
      offline: Math.max(total - (stats?.online || online), 0),
    };
  }, [members, stats]);

  const filteredMembers = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    return members
      .filter((member) => {
        if (filter === 'online') return member.online;
        if (filter === 'offline') return !member.online;
        return true;
      })
      .filter((member) => {
        if (!searchValue) return true;
        const name = `${member.nickname || ''} ${member.username || ''}`.toLowerCase();
        return name.includes(searchValue);
      })
      .sort((a, b) => sortMembers(a, b, sortMode));
  }, [members, query, filter, sortMode]);

  const featuredMembers = filteredMembers.slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Roster"
        title="Склад родини"
        text="Живий Discord-склад Grizzly Family синхронізується через бота та Firestore: онлайн, аватари, нікнейми і статуси учасників."
      />

      <Section className="roster-page">
        <div className="roster-command">
          <div>
            <p className="eyebrow">Live Discord</p>
            <h2>Склад, який видно в реальному часі</h2>
            <p>
              Бот оновлює список учасників, онлайн-статус і аватари. Це допомагає швидко бачити,
              хто зараз на зв’язку, кого можна покликати на збір і як виглядає активність родини.
            </p>
          </div>
          <aside>
            <Radio size={34} />
            <span>Family signal</span>
            <strong>{visibleStats.online} online</strong>
            <p>Discord показує живий пульс родини, а сайт збирає його в одну преміум-панель.</p>
          </aside>
        </div>

        <div className="roster-stats premium">
          <article>
            <Users size={24} />
            <strong>{visibleStats.total}</strong>
            <span>учасників Discord</span>
          </article>
          <article>
            <Activity size={24} />
            <strong>{visibleStats.online}</strong>
            <span>онлайн зараз</span>
          </article>
          <article>
            <ShieldCheck size={24} />
            <strong>{visibleStats.offline}</strong>
            <span>offline / away</span>
          </article>
        </div>

        <div className="roster-controls premium">
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук по ніку або Discord" />
          </label>
          <div className="segmented">
            {[
              ['all', 'Всі'],
              ['online', 'Online'],
              ['offline', 'Offline'],
            ].map(([value, label]) => (
              <button className={filter === value ? 'active' : ''} type="button" key={value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} aria-label="Сортування складу">
            <option value="online">Online зверху</option>
            <option value="name">За ім’ям</option>
          </select>
        </div>

        {!loading && members.length > 0 && (
          <div className="roster-result-line">
            <span>Показано {filteredMembers.length} з {members.length}</span>
            <strong>{filter === 'all' ? 'Увесь склад' : filter === 'online' ? 'Зараз online' : 'Зараз offline'}</strong>
          </div>
        )}

        {featuredMembers.length > 0 && (
          <div className="roster-featured-grid">
            {featuredMembers.map((member, index) => (
              <article className={member.online ? 'online' : 'offline'} key={member.id}>
                <span>#{index + 1}</span>
                <img src={member.avatar || '/assets/grizzly-logo.png'} alt={memberName(member)} />
                <div>
                  <strong>{memberName(member)}</strong>
                  <p>@{member.username || member.id}</p>
                </div>
                <small>{member.online ? 'Online' : 'Offline'}</small>
              </article>
            ))}
          </div>
        )}

        {loading && <p className="auth-alert">Завантажуємо склад із Firestore...</p>}
        {error && <p className="auth-alert">Не вдалося прочитати discord_members: {error}</p>}

        {!loading && filteredMembers.length > 0 && (
          <div className="member-grid premium">
            {filteredMembers.map((member) => (
              <article className={`member-card ${member.online ? 'is-online' : 'is-offline'}`} key={member.id}>
                <img src={member.avatar || '/assets/grizzly-logo.png'} alt={memberName(member)} />
                <div>
                  <span className={member.online ? 'status online' : 'status offline'}>{member.online ? 'Online' : 'Offline'}</span>
                  <h3>{memberName(member)}</h3>
                  <p>@{member.username || member.id}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && members.length > 0 && filteredMembers.length === 0 && (
          <p className="auth-alert">Нічого не знайдено. Спробуй змінити пошук або фільтр.</p>
        )}

        {!loading && members.length === 0 && !error && (
          <section className="contract-panel fallback-roster">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Fallback</p>
                <h2>Базова структура родини</h2>
              </div>
              <Crown size={28} />
            </div>
            <div className="roster-fallback-list">
              {roster.map(([name, rank, duty]) => (
                <article key={name}>
                  <strong>{name}</strong>
                  <span>{rank}</span>
                  <p>{duty}</p>
                </article>
              ))}
            </div>
          </section>
        )}
      </Section>
    </>
  );
}
