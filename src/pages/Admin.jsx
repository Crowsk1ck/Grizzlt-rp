import { Check, Clock, Search, ShieldAlert, UserCheck, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const statusLabels = {
  new: 'Нова',
  interview: 'Співбесіда',
  accepted: 'Прийнято',
  rejected: 'Відхилено',
};

const statusIcons = {
  new: Clock,
  interview: UserCheck,
  accepted: Check,
  rejected: X,
};

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');

  async function loadApplications() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/applications');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Admin API error');
      setApplications(data.applications || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setError('');

    try {
      const response = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Status update failed');

      setApplications((current) =>
        current.map((item) => (item.id === id ? data.application : item)),
      );
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  useEffect(() => {
    if (isAdmin) loadApplications();
  }, [isAdmin]);

  const stats = useMemo(() => {
    return applications.reduce(
      (acc, item) => {
        const status = item.status || 'new';
        acc[status] = (acc[status] || 0) + 1;
        acc.total += 1;
        return acc;
      },
      { total: 0, new: 0, interview: 0, accepted: 0, rejected: 0 },
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const search = query.trim().toLowerCase();

    return applications
      .filter((item) => {
        if (filter === 'all') return true;
        return (item.status || 'new') === filter;
      })
      .filter((item) => {
        if (!search) return true;
        const text = `${item.nickname || ''} ${item.discord || ''} ${item.discordUser?.username || ''}`.toLowerCase();
        return text.includes(search);
      });
  }, [applications, query, filter]);

  if (authLoading) {
    return <PageHero eyebrow="Admin" title="Адмінка" text="Перевіряємо Discord сесію..." />;
  }

  if (!user) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Адмінка" text="Для доступу до заявок потрібен Discord Login." />
        <Section>
          <a className="button primary" href="/api/auth/discord/login">Увійти через Discord</a>
        </Section>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Немає доступу" text="Твій Discord ID не доданий у ADMIN_DISCORD_IDS." />
        <Section>
          <div className="auth-alert">
            <ShieldAlert size={18} /> Твій Discord ID: {user.id}
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Admin" title="Заявки" text="Закрита панель Grizzly Family для перегляду та обробки заявок." />
      <Section title="Панель заявок" eyebrow="Private">
        <div className="admin-stats">
          {[
            ['total', 'Всього'],
            ['new', 'Нові'],
            ['interview', 'Співбесіда'],
            ['accepted', 'Прийняті'],
            ['rejected', 'Відхилені'],
          ].map(([key, label]) => (
            <article key={key}>
              <strong>{stats[key]}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>

        <div className="roster-controls">
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук по ніку або Discord" />
          </label>
          <div className="segmented">
            {[
              ['all', 'Всі'],
              ['new', 'Нові'],
              ['interview', 'Інтерв’ю'],
              ['accepted', 'Так'],
              ['rejected', 'Ні'],
            ].map(([value, label]) => (
              <button className={filter === value ? 'active' : ''} type="button" key={value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          <button className="button secondary" type="button" onClick={loadApplications}>
            Оновити
          </button>
        </div>

        {loading && <p>Завантажуємо заявки...</p>}
        {error && <p className="auth-alert">{error}</p>}

        <div className="application-list">
          {filteredApplications.map((application) => {
            const StatusIcon = statusIcons[application.status || 'new'] || Clock;

            return (
              <article className="application-card" key={application.id}>
                <div className="application-head">
                  <div>
                    <span className={`status ${application.status || 'new'}`}>
                      <StatusIcon size={13} /> {statusLabels[application.status || 'new'] || application.status}
                    </span>
                    <h3>{application.nickname}</h3>
                    <p>{application.discord} · {application.createdAt ? new Date(application.createdAt).toLocaleString('uk-UA') : 'без дати'}</p>
                  </div>
                  <span className="application-id">{application.id}</span>
                </div>
                <p>{application.message}</p>
                <div className="application-meta">
                  <span>Вік: {application.age}</span>
                  <span>Онлайн: {application.online}</span>
                  {application.reviewedBy?.username && <span>Рішення: @{application.reviewedBy.username}</span>}
                </div>
                <div className="application-actions">
                  <button type="button" onClick={() => updateStatus(application.id, 'accepted')}>
                    <Check size={16} /> Прийняти
                  </button>
                  <button type="button" onClick={() => updateStatus(application.id, 'interview')}>
                    <UserCheck size={16} /> Співбесіда
                  </button>
                  <button type="button" onClick={() => updateStatus(application.id, 'rejected')}>
                    <X size={16} /> Відхилити
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!loading && filteredApplications.length === 0 && <p className="auth-alert">Заявок за цим фільтром немає.</p>}
      </Section>
    </>
  );
}
