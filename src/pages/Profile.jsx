import {
  Activity,
  BadgeCheck,
  CalendarClock,
  Check,
  ClipboardList,
  Clock,
  Crown,
  Fingerprint,
  KeyRound,
  LogIn,
  LogOut,
  Radio,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const authErrors = {
  discord_config: 'Discord авторизацію ще не налаштовано: додай DISCORD_CLIENT_ID та DISCORD_CLIENT_SECRET.',
  discord_state: 'Discord сесія застаріла або state не збігся. Спробуй увійти ще раз.',
  discord_token: 'Discord не видав токен. Перевір Redirect URI у Discord Developer Portal.',
  discord_user: 'Не вдалося отримати Discord профіль. Спробуй ще раз трохи пізніше.',
};

const statusMeta = {
  new: {
    label: 'Нова заявка',
    icon: Clock,
    tone: 'new',
    text: 'Заявку отримано. Очікуй рішення старшого складу.',
  },
  interview: {
    label: 'Співбесіда',
    icon: UserCheck,
    tone: 'interview',
    text: 'Тебе запросили на співбесіду. Перевір Discord DM або канал співбесіди.',
  },
  accepted: {
    label: 'Прийнято',
    icon: Check,
    tone: 'accepted',
    text: 'Вітаємо в Grizzly Family. Роль у Discord має бути видана ботом.',
  },
  rejected: {
    label: 'Відхилено',
    icon: X,
    tone: 'rejected',
    text: 'Цього разу заявку відхилено. Можеш спробувати пізніше, якщо набір буде відкрито.',
  },
};

function formatDateTime(value) {
  if (!value) return 'Не вказано';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Не вказано';

  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function valueOrDash(value) {
  return value || 'Не вказано';
}

export default function Profile() {
  const { user, isAdmin, member, hasFamilyRole, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const authError = authErrors[searchParams.get('authError')];

  useEffect(() => {
    if (!user) {
      setApplication(null);
      return;
    }

    setApplicationLoading(true);
    setApplicationError('');

    fetch('/api/applications/me')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Application API error');
        setApplication(data.application || null);
      })
      .catch((error) => setApplicationError(error.message))
      .finally(() => setApplicationLoading(false));
  }, [user]);

  const currentStatus = statusMeta[application?.status || 'new'];
  const StatusIcon = currentStatus?.icon || Clock;
  const displayName = member?.nickname || user?.globalName || user?.username || 'Discord гравець';
  const discordName = member?.username || user?.username || 'discord';
  const avatar = member?.avatar || user?.avatar || '/assets/grizzly-logo.png';
  const roleCount = Array.isArray(member?.roles) ? member.roles.length : 0;
  const isOnline = Boolean(member?.online);

  const accessCards = useMemo(
    () => [
      {
        label: 'Discord вхід',
        value: user ? 'Активний' : 'Не виконано',
        icon: ShieldCheck,
        tone: user ? 'good' : 'warn',
      },
      {
        label: 'Роль родини',
        value: hasFamilyRole ? 'Підтверджено' : 'Очікується',
        icon: BadgeCheck,
        tone: hasFamilyRole ? 'good' : 'neutral',
      },
      {
        label: 'Адмін доступ',
        value: isAdmin ? 'Доступний' : 'Немає',
        icon: Crown,
        tone: isAdmin ? 'admin' : 'neutral',
      },
      {
        label: 'Заявка',
        value: application ? currentStatus.label : 'Не подано',
        icon: ClipboardList,
        tone: application ? currentStatus.tone : 'neutral',
      },
    ],
    [application, currentStatus.label, currentStatus.tone, hasFamilyRole, isAdmin, user],
  );

  const quickActions = useMemo(
    () =>
      [
        !hasFamilyRole && {
          title: application ? 'Переглянути вступ' : 'Подати заявку',
          text: application ? 'Форма вступу та правила подачі.' : 'Заповни анкету для вступу в родину.',
          to: '/recruitment',
          icon: ClipboardList,
          primary: !application,
        },
        (hasFamilyRole || isAdmin) && {
          title: 'Калькулятор',
          text: 'Контракти, фонд родини, звіти та історія.',
          to: '/calculator',
          icon: Activity,
          primary: true,
        },
        {
          title: 'Склад',
          text: 'Живий Discord список родини.',
          to: '/roster',
          icon: Users,
        },
        isAdmin && {
          title: 'Адмінка',
          text: 'Заявки, рішення та новини сайту.',
          to: '/admin',
          icon: KeyRound,
        },
      ].filter(Boolean),
    [application, hasFamilyRole, isAdmin],
  );

  if (loading) {
    return <PageHero eyebrow="Profile" title="Кабінет" text="Перевіряємо Discord сесію та доступи профілю..." />;
  }

  return (
    <>
      <PageHero
        eyebrow="Profile"
        title="Кабінет"
        text="Особистий профіль Grizzly Family з Discord-даними, статусом заявки, ролями та швидкими діями."
      />

      <Section className="profile-page">
        {authError && <p className="auth-alert">{authError}</p>}

        {!user && (
          <div className="profile-guest">
            <div className="profile-guest-copy">
              <span className="profile-icon large">
                <ShieldCheck size={42} />
              </span>
              <p className="eyebrow">Discord Login</p>
              <h2>Увійди в особистий кабінет</h2>
              <p>
                Після входу сайт покаже твій Discord профіль, статус заявки, доступ до закритих розділів та майбутні
                активності родини.
              </p>
              <a className="button primary" href="/api/auth/discord/login">
                <LogIn size={18} /> Увійти через Discord
              </a>
            </div>

            <div className="profile-guest-grid">
              {[
                [Fingerprint, 'Безпечний вхід', 'Авторизація проходить через офіційний Discord OAuth2.'],
                [ClipboardList, 'Статус заявки', 'Після подачі анкети тут буде видно рішення адміністрації.'],
                [Shield, 'Ролі та доступ', 'Права на закриті сторінки беруться з Discord ролей.'],
              ].map(([Icon, title, text]) => (
                <article key={title}>
                  <Icon size={22} />
                  <strong>{title}</strong>
                  <span>{text}</span>
                </article>
              ))}
            </div>
          </div>
        )}

        {user && (
          <>
            <div className="profile-hero-card">
              <div className="profile-avatar-wrap">
                <img src={avatar} alt={displayName} />
                <span className={isOnline ? 'status online' : 'status offline'}>{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              <div className="profile-main-info">
                <p className="eyebrow">Discord профіль</p>
                <h2>{displayName}</h2>
                <p>@{discordName}</p>

                <div className="profile-badges">
                  {hasFamilyRole && <span className="status accepted">У родині</span>}
                  {isAdmin && <span className="status interview">Адмін</span>}
                  {!hasFamilyRole && !isAdmin && <span className="status new">Гість</span>}
                </div>
              </div>

              <div className="profile-actions">
                {(hasFamilyRole || isAdmin) && (
                  <Link className="button primary" to="/calculator">
                    <Activity size={18} /> Калькулятор
                  </Link>
                )}
                {!hasFamilyRole && (
                  <Link className="button primary" to="/recruitment">
                    <ClipboardList size={18} /> Заявка
                  </Link>
                )}
                <a className="button secondary" href="/api/auth/logout">
                  <LogOut size={18} /> Вийти
                </a>
              </div>
            </div>

            <div className="profile-access-grid">
              {accessCards.map(({ label, value, icon: Icon, tone }) => (
                <article className={`profile-access-card ${tone}`} key={label}>
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
                    <p className="eyebrow">Candidate</p>
                    <h2>Статус заявки</h2>
                  </div>
                  <StatusIcon size={28} />
                </div>

                {applicationLoading && <p>Перевіряємо твою заявку...</p>}
                {applicationError && <p className="auth-alert">{applicationError}</p>}

                {!applicationLoading && !application && !applicationError && (
                  <div className="profile-empty-state">
                    <Clock size={32} />
                    <h3>Заявку ще не подано</h3>
                    <p>Перейди на сторінку вступу та заповни форму. Один Discord акаунт може подати тільки одну заявку.</p>
                    <Link className="button primary" to="/recruitment">
                      Подати заявку
                    </Link>
                  </div>
                )}

                {!applicationLoading && application && (
                  <div className="profile-application">
                    <span className={`status ${application.status || 'new'}`}>{currentStatus.label}</span>
                    <h3>{application.nickname}</h3>
                    <p>{currentStatus.text}</p>

                    <div className="profile-info-list">
                      <div>
                        <span>Discord</span>
                        <strong>{valueOrDash(application.discord)}</strong>
                      </div>
                      <div>
                        <span>Онлайн</span>
                        <strong>{valueOrDash(application.online)}</strong>
                      </div>
                      <div>
                        <span>Вік</span>
                        <strong>{valueOrDash(application.age)}</strong>
                      </div>
                      <div>
                        <span>Подано</span>
                        <strong>{formatDateTime(application.createdAt)}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </article>

              <aside className="profile-side-panel">
                <div className="profile-panel-head">
                  <div>
                    <p className="eyebrow">Access</p>
                    <h2>Дані Discord</h2>
                  </div>
                  <Radio size={28} />
                </div>

                <div className="profile-info-list">
                  <div>
                    <span>Discord ID</span>
                    <strong>{user.id}</strong>
                  </div>
                  <div>
                    <span>Синхронізація бота</span>
                    <strong>{member ? 'Знайдено в складі' : 'Немає у складі'}</strong>
                  </div>
                  <div>
                    <span>Ролей Discord</span>
                    <strong>{roleCount}</strong>
                  </div>
                  <div>
                    <span>Статус</span>
                    <strong>{isOnline ? 'Онлайн зараз' : 'Офлайн'}</strong>
                  </div>
                </div>

                {!hasFamilyRole && !isAdmin && (
                  <div className="profile-note">
                    <ShieldAlert size={20} />
                    <p>Закриті розділи відкриються після прийняття заявки та видачі Discord ролі.</p>
                  </div>
                )}
              </aside>
            </div>

            <div className="profile-quick-actions">
              {quickActions.map(({ title, text, to, icon: Icon, primary }) => (
                <Link className={primary ? 'profile-action-card primary' : 'profile-action-card'} to={to} key={title}>
                  <Icon size={24} />
                  <strong>{title}</strong>
                  <span>{text}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </Section>

      {user && (
        <Section className="band" title="Що далі" eyebrow="Next">
          <div className="grid four">
            {[
              [CalendarClock, 'Слідкуй за статусом', 'Рішення по заявці та запрошення на співбесіду з’являться у профілі.'],
              [Users, 'Перевір склад', 'Дивись живий Discord список, онлайн та ніки учасників родини.'],
              [Activity, 'Веди активність', 'Після отримання ролі відкриється калькулятор контрактів та звітів.'],
              [Sparkles, 'Тримай профіль чистим', 'Актуальний Discord нік допомагає адміністрації швидше знаходити тебе.'],
            ].map(([Icon, title, text]) => (
              <article className="card" key={title}>
                <span className="card-icon">
                  <Icon size={24} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
