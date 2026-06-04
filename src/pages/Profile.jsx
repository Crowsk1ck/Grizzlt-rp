import { LogIn, LogOut, ShieldCheck } from 'lucide-react';
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

export default function Profile() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const authError = authErrors[searchParams.get('authError')];

  return (
    <>
      <PageHero
        eyebrow="Discord Auth"
        title="Кабінет"
        text="Вхід через Discord потрібен для зручних заявок, перевірки профілю та майбутніх закритих розділів родини."
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
                <p>Після входу сайт знатиме твій Discord профіль і зможе додавати його до заявок.</p>
                <a className="button primary" href="/api/auth/discord/login">
                  <LogIn size={18} /> Discord Login
                </a>
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}
