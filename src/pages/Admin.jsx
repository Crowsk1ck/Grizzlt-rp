import { Bot, Check, Clock, FileText, Newspaper, RefreshCw, Search, ShieldAlert, UserCheck, UserCog, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('applications');
  const [newsForm, setNewsForm] = useState({ title: '', tag: 'Grizzly Bulletin', text: '' });
  const [newsStatus, setNewsStatus] = useState('');

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

  async function publishNews(event) {
    event.preventDefault();
    setNewsStatus('Публікуємо...');

    try {
      const response = await fetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'News publish failed');

      setNewsStatus(`Новину опубліковано. ID: ${data.id}`);
      setNewsForm({ title: '', tag: 'Grizzly Bulletin', text: '' });
    } catch (publishError) {
      setNewsStatus(`Помилка: ${publishError.message}`);
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
    return (
      <section className="admin-control-page compact-state">
        <div className="admin-control-hero">
          <p className="eyebrow">Admin</p>
          <h1>Перевіряємо доступ</h1>
          <p>Завантажуємо Discord сесію та права користувача.</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="admin-control-page compact-state">
        <div className="admin-control-hero">
          <p className="eyebrow">Admin</p>
          <h1>Потрібен Discord Login</h1>
          <p>Для доступу до заявок і адмін-функцій потрібно увійти через Discord.</p>
          <a className="button primary" href="/api/auth/discord/login">Увійти через Discord</a>
        </div>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="admin-control-page compact-state">
        <div className="admin-control-hero">
          <p className="eyebrow">Admin</p>
          <h1>Немає доступу</h1>
          <p>Твій Discord ID не доданий у ADMIN_DISCORD_IDS.</p>
          <div className="auth-alert">
            <ShieldAlert size={18} /> Твій Discord ID: {user.id}
          </div>
        </div>
      </section>
    );
  }

  const tabs = [
    ['applications', 'Applications', stats.new],
    ['news', 'News', null],
    ['tools', 'Control', null],
    ['logs', 'Logs', null],
  ];

  return (
    <section className="admin-control-page">
      <div className="admin-control-hero">
        <div>
          <p className="eyebrow">Admin Module</p>
          <h1>Admin Control Center</h1>
          <p>Компактний OS-модуль для заявок, новин, статусів, Discord bot center та керування складом.</p>
        </div>
        <div className="admin-control-status">
          <span>ROLE</span>
          <strong>Administrator</strong>
          <small>{user.globalName || user.username}</small>
        </div>
      </div>

      <div className="admin-control-stats">
        <article>
          <span>Applications</span>
          <strong>{stats.total}</strong>
          <small>{stats.new} нових заявок</small>
        </article>
        <article>
          <span>Interview</span>
          <strong>{stats.interview}</strong>
          <small>очікують співбесіду</small>
        </article>
        <article>
          <span>Accepted</span>
          <strong>{stats.accepted}</strong>
          <small>прийнято в сімʼю</small>
        </article>
        <article>
          <span>Bot Status</span>
          <strong>Online</strong>
          <small>Discord sync active</small>
        </article>
      </div>

      <div className="admin-control-tabs" role="tablist" aria-label="Admin sections">
        {tabs.map(([value, label, count]) => (
          <button
            className={activeTab === value ? 'active' : ''}
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
          >
            {label}
            {count !== null && <span>{count}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'applications' && (
        <div className="admin-module-panel">
          <div className="admin-module-head">
            <div>
              <p className="eyebrow">Private</p>
              <h2>Панель заявок</h2>
              <p>Швидка модерація кандидатів без великого скролу і зайвих блоків.</p>
            </div>
            <button className="button secondary" type="button" onClick={loadApplications}>
              <RefreshCw size={16} /> Оновити
            </button>
          </div>

          <div className="admin-filter-row">
            <label className="search-field">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук по ніку або Discord" />
            </label>
            <div className="segmented admin-segmented">
              {[
                ['all', 'Всі'],
                ['new', 'Нові'],
                ['interview', 'Інтервʼю'],
                ['accepted', 'Так'],
                ['rejected', 'Ні'],
              ].map(([value, label]) => (
                <button className={filter === value ? 'active' : ''} type="button" key={value} onClick={() => setFilter(value)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && <p>Завантажуємо заявки...</p>}
          {error && <p className="auth-alert">{error}</p>}

          <div className="application-list compact">
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
        </div>
      )}

      {activeTab === 'news' && (
        <div className="admin-module-panel admin-news-module">
          <div className="admin-module-head">
            <div>
              <p className="eyebrow">News</p>
              <h2>Публікація новин</h2>
              <p>Короткі оголошення для сайту та Discord-інформування сімʼї.</p>
            </div>
            <Newspaper size={30} />
          </div>

          <form className="form admin-news-form compact" onSubmit={publishNews}>
            <div className="form-grid">
              <label>
                Заголовок
                <input value={newsForm.title} onChange={(event) => setNewsForm((current) => ({ ...current, title: event.target.value }))} placeholder="Наприклад: Відкрито новий набір" />
              </label>
              <label>
                Тег
                <input value={newsForm.tag} onChange={(event) => setNewsForm((current) => ({ ...current, tag: event.target.value }))} placeholder="Grizzly Bulletin" />
              </label>
            </div>
            <label>
              Текст новини
              <textarea value={newsForm.text} onChange={(event) => setNewsForm((current) => ({ ...current, text: event.target.value }))} placeholder="Коротко опиши новину для сайту" />
            </label>
            <button className="button primary" type="submit">
              <Newspaper size={18} /> Опублікувати
            </button>
            {newsStatus && <p className="form-status">{newsStatus}</p>}
          </form>
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="admin-module-panel">
          <div className="admin-module-head">
            <div>
              <p className="eyebrow">Control</p>
              <h2>Інструменти адміністрації</h2>
              <p>Швидкі переходи до ключових control center модулів.</p>
            </div>
            <FileText size={30} />
          </div>

          <div className="admin-tool-grid">
            <Link className="profile-action-card primary" to="/admin/members">
              <UserCog size={24} />
              <strong>Керування складом</strong>
              <span>Профілі учасників, ранги, зарплати, попередження та логи.</span>
            </Link>
            <Link className="profile-action-card" to="/admin/bot">
              <Bot size={24} />
              <strong>Discord Bot Center</strong>
              <span>DM, welcome, threads, нагадування, логи, slash-команди та Railway env.</span>
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="admin-module-panel">
          <div className="admin-module-head">
            <div>
              <p className="eyebrow">Logs</p>
              <h2>Системні логи</h2>
              <p>Місце під майбутню стрічку audit logs з Firestore.</p>
            </div>
          </div>
          <div className="admin-log-placeholder">
            <strong>LOG STREAM READY</strong>
            <span>Підключи колекцію activity_logs або admin_logs, і тут буде live-історія дій.</span>
          </div>
        </div>
      )}
    </section>
  );
}
