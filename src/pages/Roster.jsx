import { Activity, Users } from 'lucide-react';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { roster } from '../data/siteData.js';
import { db } from '../lib/firebase.js';

export default function Roster() {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return undefined;
    }

    const unsubscribeMembers = onSnapshot(
      collection(db, 'discord_members'),
      (snapshot) => {
        const nextMembers = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .filter((member) => !member.bot)
          .sort((a, b) => Number(b.online) - Number(a.online) || a.nickname.localeCompare(b.nickname));

        setMembers(nextMembers);
        setLoading(false);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    const unsubscribeStats = onSnapshot(doc(db, 'stats', 'discord_members'), (snapshot) => {
      setStats(snapshot.exists() ? snapshot.data() : null);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeStats();
    };
  }, []);

  const visibleStats = useMemo(() => {
    const online = members.filter((member) => member.online).length;
    return {
      total: stats?.members || members.length,
      online: stats?.online || online,
    };
  }, [members, stats]);

  return (
    <>
      <PageHero
        eyebrow="Roster"
        title="Склад родини"
        text="Живий склад Grizzly Family синхронізується з Discord через бота та Firestore."
      />
      <Section title="Discord склад" eyebrow="Live">
        <div className="roster-stats">
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
        </div>

        {loading && <p>Завантажуємо склад із Firestore...</p>}
        {error && <p className="auth-alert">Не вдалося прочитати discord_members: {error}</p>}

        {!loading && members.length > 0 && (
          <div className="member-grid">
            {members.map((member) => (
              <article className="member-card" key={member.id}>
                <img src={member.avatar || '/assets/grizzly-logo.png'} alt={member.nickname || member.username} />
                <div>
                  <span className={member.online ? 'status online' : 'status offline'}>{member.online ? 'Online' : 'Offline'}</span>
                  <h3>{member.nickname || member.username}</h3>
                  <p>@{member.username}</p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && members.length === 0 && !error && (
          <div className="table fallback-roster">
            {roster.map(([name, rank, duty]) => (
              <div className="table-row" key={name}>
                <strong>{name}</strong>
                <span>{rank}</span>
                <p>{duty}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
