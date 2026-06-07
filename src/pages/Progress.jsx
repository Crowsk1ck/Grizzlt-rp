import { Activity, AlertTriangle, Banknote, ClipboardList, LogIn, ShieldAlert, Trophy, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

function formatMoney(value) {
  return `$ ${Math.round(Number(value || 0)).toLocaleString('uk-UA')}`;
}

function formatDate(value) {
  if (!value) return 'немає';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('uk-UA');
}

export default function Progress() {
  const { user, isAdmin, hasFamilyRole, loading: authLoading } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError('');

    fetch('/api/members/profile')
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'Profile API error');
        setData(payload);
      })
      .catch((profileError) => setError(profileError.message))
      .finally(() => setLoading(false));
  }, [user]);

  const profile = data?.profile || {};
  const member = data?.member || {};
  const progress = data?.progress || {};
  const warnings = data?.warnings || [];
  const canSeeProgress = Boolean(user && (isAdmin || hasFamilyRole || data?.hasFamilyRole));
  const waitingForData = Boolean(user && !data && !error);

  const stats = useMemo(
    () => [
      { label: 'Контрактів', value: progress.contracts || 0, icon: ClipboardList },
      { label: 'Загальна сума', value: formatMoney(progress.gross), icon: Banknote },
      { label: 'Середній контракт', value: formatMoney(progress.average), icon: Trophy },
      { label: 'Попереджень', value: warnings.length, icon: AlertTriangle },
    ],
    [progress.average, progress.contracts, progress.gross, warnings.length],
  );

  if (authLoading) {
    return <PageHero eyebrow="Progress" title="Мій прогрес" text="Перевіряємо Discord сесію..." />;
  }

  if (!user) {
    return (
      <>
        <PageHero eyebrow="Progress" title="Мій прогрес" text="Особиста статистика відкривається після входу через Discord." />
        <Section>
          <a className="button primary" href="/api/auth/discord/login">
            <LogIn size={18} /> Увійти через Discord
          </a>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Progress"
        title="Мій прогрес"
        text="Контракти, внесок у родину, ранг, попередження та персональна активність Grizzly Family."
      />

      <Section className="progress-page">
        {!canSeeProgress && (
          <div className="auth-alert">
            <ShieldAlert size={18} /> Повна статистика відкриється після отримання ролі родини.
          </div>
        )}
        {(loading || waitingForData) && <p>Завантажуємо персональну статистику...</p>}
        {error && <p className="auth-alert">{error}</p>}
        {!loading && !waitingForData && !error && !data && (
          <div className="auth-alert">
            <ShieldAlert size={18} /> Персональний профіль ще не створено. Адмін може додати ранг і нотатки в
            {' '}<Link to="/admin/members">адмінці складу</Link>.
          </div>
        )}

        {data && (
          <>
            <div className="profile-hero-card">
              <div className="profile-avatar-wrap">
                <img src={member.avatar || user.avatar || '/assets/grizzly-logo.png'} alt={profile.rpNickname || member.nickname || user.username} />
                <span className={member.online ? 'status online' : 'status offline'}>{member.online ? 'Online' : 'Offline'}</span>
              </div>
              <div className="profile-main-info">
                <p className="eyebrow">Member profile</p>
                <h2>{profile.rpNickname || member.nickname || user.globalName || user.username}</h2>
                <p>@{member.username || user.username}</p>
                <div className="profile-badges">
                  <span className="status accepted">{profile.rank || 'Без рангу'}</span>
                  <span className="status new">{profile.status || 'active'}</span>
                </div>
              </div>
              <div className="profile-actions">
                <Link className="button primary" to="/calculator">
                  <Activity size={18} /> Контракти
                </Link>
                <Link className="button secondary" to="/ranks">
                  <UserRound size={18} /> Ранги
                </Link>
              </div>
            </div>

            <div className="profile-access-grid">
              {stats.map(({ label, value, icon: Icon }) => (
                <article className="profile-access-card good" key={label}>
                  <Icon size={23} />
                  <span>{label}</span>
                  <strong>{value}</strong>
                </article>
              ))}
            </div>

            <div className="profile-layout">
              <article className="profile-status-panel">
                <div className="profile-panel-head">
                  <div>
                    <p className="eyebrow">Details</p>
                    <h2>Картка учасника</h2>
                  </div>
                  <UserRound size={28} />
                </div>
                <div className="profile-info-list">
                  <div>
                    <span>Посада</span>
                    <strong>{profile.position || 'Не вказано'}</strong>
                  </div>
                  <div>
                    <span>Зарплата / бонус</span>
                    <strong>{profile.salary ? formatMoney(profile.salary) : 'Не вказано'}</strong>
                  </div>
                  <div>
                    <span>Авто</span>
                    <strong>{profile.vehicle || 'Не вказано'}</strong>
                  </div>
                  <div>
                    <span>Бізнес</span>
                    <strong>{profile.business || 'Не вказано'}</strong>
                  </div>
                  <div>
                    <span>Останній контракт</span>
                    <strong>{formatDate(progress.lastDate)}</strong>
                  </div>
                  <div>
                    <span>Примітка</span>
                    <strong>{profile.note || 'Адмін ще не додав примітку.'}</strong>
                  </div>
                </div>
              </article>

              <aside className="profile-side-panel">
                <div className="profile-panel-head">
                  <div>
                    <p className="eyebrow">Warnings</p>
                    <h2>Попередження</h2>
                  </div>
                  <AlertTriangle size={28} />
                </div>

                {warnings.length === 0 && <p>Активних попереджень немає.</p>}
                <div className="compact-list">
                  {warnings.map((warning) => (
                    <article key={warning.id}>
                      <span className={`status ${warning.level === 'critical' ? 'rejected' : 'new'}`}>{warning.level || 'warning'}</span>
                      <strong>{warning.reason}</strong>
                      <p>{formatDate(warning.createdAt)} | @{warning.createdBy?.username || 'admin'}</p>
                    </article>
                  ))}
                </div>
              </aside>
            </div>

            <div className="contract-table-panel">
              <div className="profile-panel-head">
                <div>
                  <p className="eyebrow">Recent</p>
                  <h2>Останні контракти</h2>
                </div>
                <ClipboardList size={28} />
              </div>
              <div className="compact-list">
                {(progress.recent || []).map((contract) => (
                  <article key={contract.id}>
                    <strong>{contract.name}</strong>
                    <span>{formatMoney(contract.amount)}</span>
                    <p>{formatDate(contract.date)}</p>
                  </article>
                ))}
                {(!progress.recent || progress.recent.length === 0) && <p>Поки немає контрактів, де тебе вдалося знайти по ніку.</p>}
              </div>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
