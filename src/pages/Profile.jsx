import { Check, Clock, LogIn, LogOut, ShieldCheck, UserCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  new: { label: 'Нова заявка', icon: Clock, text: 'Заявку отримано. Очікуй рішення старшого складу.' },
  interview: { label: 'Співбесіда', icon: UserCheck, text: 'Тебе запросили на співбесіду. Перевір Discord DM або канал співбесіди.' },
  accepted: { label: 'Прийнято', icon: Check, text: 'Вітаємо в Grizzly Family. Роль у Discord має бути видана ботом.' },
  rejected: { label: 'Відхилено', icon: X, text: 'Цього разу заявку відхилено. Можеш спробувати пізніше, якщо набір буде відкрито.' },
};

export default function Profile() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationError, setApplicationError] = useState('');
  const authError = authErrors[searchParams.get('authError')];

  useEffect(() => {
    if (!user) return;

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

  return (
    <>
      <PageHero
        eyebrow="Discord Auth"
        title="Кабінет"
        text="Вхід через Discord потрібен для заявок, статусу кандидата та закритих розділів Grizzly Family."
      />
      <Section title={user ? 'Твій Discord профіль' : 'Авторизація'}>
        {authError && <p className="auth-alert">{authError}</p>}
        <div className="profile-panel">
          {loading && <p>Перевіряємо сесію...</p>}
          {!loading && user && (
            <>
              <img src={user.avatar} alt={user.username} />
              <div>
                <p className="eyebrow">Успішний вхід</p>
                <h2>{user.globalName || user.username}</h2>
                <p>Discord ID: {user.id}</p>
                <a className="button secondary" href="/api/auth/logout">
                  <LogOut size={18} /> Вийти
                </a>
              </div>
            </>
          )}
          {!loading && !user && (
            <>
              <span className="profile-icon">
                <ShieldCheck size={36} />
              </span>
              <div>
                <h2>Увійди через Discord</h2>
                <p>Після входу сайт знатиме твій Discord профіль і зможе показувати статус заявки.</p>
                <a className="button primary" href="/api/auth/discord/login">
                  <LogIn size={18} /> Discord Login
                </a>
              </div>
            </>
          )}
        </div>
      </Section>

      {user && (
        <Section title="Статус заявки" eyebrow="Candidate">
          {applicationLoading && <p>Перевіряємо твою заявку...</p>}
          {applicationError && <p className="auth-alert">{applicationError}</p>}
          {!applicationLoading && !application && !applicationError && (
            <div className="candidate-status">
              <Clock size={28} />
              <div>
                <h3>Заявку ще не подано</h3>
                <p>Перейди на сторінку вступу та заповни форму. Один Discord акаунт може подати тільки одну заявку.</p>
                <a className="button primary" href="/recruitment">Подати заявку</a>
              </div>
            </div>
          )}
          {!applicationLoading && application && (
            <div className="candidate-status">
              <StatusIcon size={28} />
              <div>
                <span className={`status ${application.status || 'new'}`}>{currentStatus.label}</span>
                <h3>{application.nickname}</h3>
                <p>{currentStatus.text}</p>
                <div className="application-meta">
                  <span>Discord: {application.discord}</span>
                  <span>Онлайн: {application.online}</span>
                  {application.createdAt && <span>Подано: {new Date(application.createdAt).toLocaleString('uk-UA')}</span>}
                </div>
              </div>
            </div>
          )}
        </Section>
      )}
    </>
  );
}
