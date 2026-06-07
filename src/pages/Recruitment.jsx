import { BadgeCheck, Clock, Headphones, LogIn, MessageCircle, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import FirestoreForm from '../components/FirestoreForm.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const requirements = [
  {
    icon: Headphones,
    title: 'Discord і мікрофон',
    text: 'Потрібен активний Discord, нормальний зв’язок і готовність бути на голосі під час зборів.',
  },
  {
    icon: ShieldCheck,
    title: 'Знання RP',
    text: 'Базові правила GTA 5 RP, адекватність у сценах і вміння не ламати атмосферу.',
  },
  {
    icon: Clock,
    title: 'Стабільний онлайн',
    text: 'Ми цінуємо людей, які можуть бути корисними не один вечір, а регулярно.',
  },
  {
    icon: UserCheck,
    title: 'Командна гра',
    text: 'У родині важливо чути команду, виконувати рішення і поважати старший склад.',
  },
];

const stages = [
  ['01', 'Авторизація', 'Увійди через Discord, щоб бот і адмінка бачили твій реальний акаунт.'],
  ['02', 'Анкета', 'Заповни форму без вигаданих даних: нік, вік, онлайн і коротко про себе.'],
  ['03', 'Розгляд', 'Заявка приходить у Discord адмінам, вони можуть прийняти, відхилити або покликати на співбесіду.'],
  ['04', 'Роль', 'Після прийняття бот видає роль Grizzly Family, а доступи на сайті оновлюються.'],
];

const tips = [
  'Не пиши одну фразу. Краще коротко, але по суті: досвід, сильні сторони, онлайн.',
  'Вкажи нік саме так, як він виглядає у грі.',
  'Якщо вже подавав заявку, повторну система не пропустить з того самого Discord.',
];

export default function Recruitment() {
  const { user, hasFamilyRole, loading } = useAuth();

  return (
    <>
      <PageHero
        eyebrow="Join"
        title="Вступ"
        text="Подай заявку в Grizzly Family, покажи свій RP-досвід і будь готовий до короткої співбесіди у Discord."
      />

      <Section className="recruit-page">
        {hasFamilyRole && !loading ? (
          <div className="recruit-accepted">
            <img className="mini-logo" src="/assets/grizzly-logo.png" alt="Grizzly Family" />
            <div>
              <p className="eyebrow">Доступ підтверджено</p>
              <h2>Ти вже в родині</h2>
              <p>
                У тебе вже є роль Grizzly Family у Discord, тому повторна заявка не потрібна.
                Можеш перейти в кабінет, переглянути доступи або користуватись сторінками для учасників.
              </p>
              <div className="hero-actions">
                <Link className="button primary" to="/profile">Перейти в кабінет</Link>
                <Link className="button secondary" to="/calculator">Калькулятор</Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="recruit-intro-grid">
              <div className="recruit-intro-copy">
                <p className="eyebrow">Кандидат Grizzly</p>
                <h2>Нам потрібні люди, які тримають рівень</h2>
                <p>
                  Вступ у Grizzly Family проходить через Discord. Це захищає родину від повторних заявок,
                  допомагає швидко видати роль після прийняття і дає адмінам повну картину по кандидату.
                </p>
                {!user && (
                  <a className="button primary" href="/api/auth/discord/login">
                    <LogIn size={18} /> Увійти через Discord
                  </a>
                )}
              </div>
              <aside className="recruit-status-card">
                <MessageCircle size={30} />
                <span>Статус</span>
                <strong>{user ? 'Discord підключено' : 'Потрібен Discord login'}</strong>
                <p>
                  {user
                    ? `Заявка буде прив’язана до акаунта @${user.username || user.globalName || user.id}.`
                    : 'Після входу форма відкриється для подачі однієї заявки.'}
                </p>
              </aside>
            </div>

            <div className="recruit-requirements">
              {requirements.map(({ icon: Icon, title, text }) => (
                <article key={title}>
                  <Icon size={23} />
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>

            <div className="recruit-layout">
              <section className="contract-panel recruit-form-panel">
                <div className="contract-panel-title">
                  <div>
                    <p className="eyebrow">Форма</p>
                    <h2>Заявка у родину</h2>
                  </div>
                  <Sparkles size={28} />
                </div>
                <FirestoreForm type="applications" />
              </section>

              <aside className="recruit-side">
                <section className="contract-panel">
                  <div className="contract-panel-title">
                    <div>
                      <p className="eyebrow">Етапи</p>
                      <h2>Як проходить вступ</h2>
                    </div>
                    <BadgeCheck size={28} />
                  </div>
                  <div className="recruit-stage-list">
                    {stages.map(([number, title, text]) => (
                      <article key={number}>
                        <span>{number}</span>
                        <div>
                          <strong>{title}</strong>
                          <p>{text}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="contract-panel">
                  <div className="contract-panel-title">
                    <div>
                      <p className="eyebrow">Поради</p>
                      <h2>Що написати</h2>
                    </div>
                  </div>
                  <div className="recruit-tip-list">
                    {tips.map((tip) => (
                      <p key={tip}>{tip}</p>
                    ))}
                  </div>
                </section>
              </aside>
            </div>
          </>
        )}
      </Section>
    </>
  );
}
