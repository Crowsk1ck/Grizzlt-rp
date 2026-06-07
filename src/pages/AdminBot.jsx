import {
  AlertTriangle,
  Bell,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
  MessageCircleWarning,
  Newspaper,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const configLabels = {
  applicationChannel: 'Канал заявок',
  reportChannel: 'Канал звітів',
  newsChannel: 'Канал новин',
  logChannel: 'Канал логів',
  welcomeChannel: 'Welcome канал',
  dmFallbackChannel: 'Fallback DM',
  acceptedRole: 'Роль родини',
  candidateRole: 'Роль кандидата',
  adminMentionRole: 'Тег адмінів',
  newsMentionRole: 'Тег новин',
};

function formatDate(value) {
  if (!value) return 'без дати';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function displayName(item) {
  return item?.nickname || item?.discordUser?.globalName || item?.discordUser?.username || item?.discord || item?.id || 'Кандидат';
}

function statusLabel(status) {
  const labels = {
    new: 'Нова',
    interview: 'Співбесіда',
    accepted: 'Прийнято',
    rejected: 'Відхилено',
    sent: 'Відправлено',
    error: 'Помилка',
  };

  return labels[status] || status || 'Невідомо';
}

export default function AdminBot() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadBotDashboard() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/bot');
      const nextData = await response.json();
      if (!response.ok) throw new Error(nextData.error || 'Bot dashboard API error');
      setData(nextData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadBotDashboard();
  }, [isAdmin]);

  const dmFailed = useMemo(
    () => (data?.applications || []).filter((item) => item.dmSent === false).slice(0, 8),
    [data],
  );

  const interviews = useMemo(
    () => (data?.applications || []).filter((item) => (item.status || 'new') === 'interview').slice(0, 8),
    [data],
  );

  if (authLoading) {
    return <PageHero eyebrow="Bot" title="Bot Center" text="Перевіряємо Discord сесію..." />;
  }

  if (!user) {
    return (
      <>
        <PageHero eyebrow="Bot" title="Bot Center" text="Для доступу потрібен Discord Login." />
        <Section>
          <a className="button primary" href="/api/auth/discord/login">Увійти через Discord</a>
        </Section>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <PageHero eyebrow="Bot" title="Немає доступу" text="Ця сторінка доступна тільки адміністрації." />
        <Section>
          <div className="auth-alert">
            <ShieldAlert size={18} /> Твій Discord ID: {user.id}
          </div>
        </Section>
      </>
    );
  }

  const stats = data?.stats || {};
  const config = data?.botConfig || {};

  return (
    <>
      <PageHero
        eyebrow="Bot Center"
        title="Панель Discord бота"
        text="Живий контроль заявок, DM, ролей, welcome-повідомлень, логів, новин і нагадувань."
      />

      <Section className="admin-bot-page">
        <div className="calculator-controls">
          <div>
            <p className="eyebrow">Status</p>
            <h2>Огляд системи</h2>
          </div>
          <button className="button secondary" type="button" onClick={loadBotDashboard}>
            <RefreshCw size={18} /> Оновити
          </button>
        </div>

        {loading && <p>Завантажуємо панель бота...</p>}
        {error && <p className="auth-alert">{error}</p>}

        <div className="admin-stats bot-stats-grid">
          {[
            [Users, stats.discordMembers || 0, 'Discord учасників'],
            [Sparkles, stats.discordOnline || 0, 'Online зараз'],
            [FileText, stats.totalApplications || 0, 'Заявок всього'],
            [Clock, stats.interviewApplications || 0, 'На співбесіді'],
            [MessageCircleWarning, stats.dmFailed || 0, 'DM не дійшло'],
            [CheckCircle2, stats.acceptedApplications || 0, 'Прийнято'],
            [Bell, stats.reminders || 0, 'Нагадувань'],
            [Newspaper, stats.news || 0, 'Новин у Discord'],
          ].map(([Icon, value, label]) => (
            <article key={label}>
              <Icon size={20} />
              <strong>{value}</strong>
              <span>{label}</span>
            </article>
          ))}
        </div>

        <div className="bot-dashboard-grid">
          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Railway env</p>
                <h2>Конфіг бота</h2>
              </div>
              <Bot size={28} />
            </div>
            <div className="bot-config-grid">
              {Object.entries(configLabels).map(([key, label]) => (
                <article key={key} className={config[key] ? 'good' : 'warn'}>
                  <span>{label}</span>
                  <strong>{config[key] ? 'OK' : 'Не задано'}</strong>
                </article>
              ))}
              <article className={config.threads ? 'good' : 'warn'}>
                <span>Threads</span>
                <strong>{config.threads ? 'Увімкнено' : 'Вимкнено'}</strong>
              </article>
              <article className="good">
                <span>Нагадування</span>
                <strong>{config.interviewReminderHours || 24} год.</strong>
              </article>
            </div>
          </section>

          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">DM Watch</p>
                <h2>DM проблеми</h2>
              </div>
              <MessageCircleWarning size={28} />
            </div>
            <div className="compact-list">
              {dmFailed.map((item) => (
                <article key={item.id}>
                  <span className="status rejected">DM failed</span>
                  <strong>{displayName(item)}</strong>
                  <p>{item.dmErrorText || item.dmError || 'Discord заблокував повідомлення'}</p>
                  <p>{formatDate(item.reviewedAt || item.dmRetryAt)}</p>
                </article>
              ))}
              {dmFailed.length === 0 && <p>Проблем з DM зараз немає.</p>}
            </div>
          </section>
        </div>

        <div className="bot-dashboard-grid">
          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Interviews</p>
                <h2>Очікують співбесіду</h2>
              </div>
              <Clock size={28} />
            </div>
            <div className="compact-list">
              {interviews.map((item) => (
                <article key={item.id}>
                  <span className="status interview">{statusLabel(item.status)}</span>
                  <strong>{displayName(item)}</strong>
                  <p>{item.discord || item.discordUser?.username || item.id}</p>
                  <p>
                    {formatDate(item.reviewedAt || item.createdAt)}
                    {item.interviewReminderSent ? ' · нагадування вже було' : ''}
                  </p>
                </article>
              ))}
              {interviews.length === 0 && <p>Немає заявок на співбесіді.</p>}
            </div>
          </section>

          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Warnings</p>
                <h2>Останні попередження</h2>
              </div>
              <AlertTriangle size={28} />
            </div>
            <div className="compact-list">
              {(data?.warnings || []).slice(0, 8).map((warning) => (
                <article key={warning.id}>
                  <span className={`status ${warning.level === 'critical' ? 'rejected' : 'new'}`}>{warning.level || 'warning'}</span>
                  <strong>{warning.memberId}</strong>
                  <p>{warning.reason}</p>
                  <p>{formatDate(warning.createdAt)} · @{warning.createdBy?.username || 'admin'}</p>
                </article>
              ))}
              {(data?.warnings || []).length === 0 && <p>Попереджень немає.</p>}
            </div>
          </section>
        </div>

        <section className="contract-panel">
          <div className="contract-panel-title">
            <div>
              <p className="eyebrow">Timeline</p>
              <h2>Останні дії</h2>
            </div>
          </div>
          <div className="bot-timeline">
            {(data?.logs || []).slice(0, 30).map((log) => (
              <article key={log.id}>
                <span>{formatDate(log.createdAt)}</span>
                <strong>{log.action}</strong>
                <p>
                  {log.targetId || 'system'} · @{log.admin?.username || 'admin'}
                </p>
              </article>
            ))}
            {(data?.logs || []).length === 0 && <p>Логів поки немає.</p>}
          </div>
        </section>
      </Section>
    </>
  );
}
