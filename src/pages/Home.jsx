import { ArrowRight, BadgeCheck, CalendarDays, Crown, Radio, ScrollText, ShieldCheck, Sparkles, Swords, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import Section from '../components/Section.jsx';
import { events, familyName, stats } from '../data/siteData.js';

const heroSignals = ['Discord-заявки', 'Живий склад', 'Контракти', 'RP-події'];

const homeValues = [
  {
    icon: UsersRound,
    title: 'Єдність',
    text: 'Учасник Grizzly не грає сам по собі. Ми тримаємо зв’язок, прикриваємо своїх і діємо як один склад.',
  },
  {
    icon: Swords,
    title: 'Сила',
    text: 'Контракти, виїзди, перемовини і конфлікти проходять організовано, з ролями та чіткою задачею.',
  },
  {
    icon: ShieldCheck,
    title: 'Повага',
    text: 'Повага до RP, правил сервера і людей навколо — це те, що робить родину стабільною.',
  },
  {
    icon: Crown,
    title: 'Статус',
    text: 'Grizzly Family має впізнаваний стиль: неон, дисципліна, медіа, сильна подача і чиста репутація.',
  },
];

const pathSteps = [
  ['01', 'Discord вхід', 'Авторизуйся через Discord, щоб заявка була прив’язана до твого акаунта.'],
  ['02', 'Заявка', 'Заповни нік, вік, онлайн і коротко розкажи про свій RP-досвід.'],
  ['03', 'Співбесіда', 'Адміни переглянуть анкету і, якщо все добре, покличуть у Discord.'],
  ['04', 'Роль родини', 'Після прийняття бот видасть роль, а вкладка вступу зникне з меню.'],
];

export default function Home() {
  return (
    <>
      <section className="hero home-premium-hero">
        <div className="hero-content">
          <p className="eyebrow"></p>
          <h1>{familyName}</h1>
          <p>
            Неонова атмосфера, сильний Discord-склад, дисципліна, контракти та RP-сцени,
            які видно здалеку. Grizzly Family — це місце для тих, хто хоче грати красиво і командно.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/recruitment">
              Подати заявку <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/rules">
              <ScrollText size={18} /> Правила
            </Link>
          </div>
          <div className="home-signal-row">
            {heroSignals.map((signal) => (
              <span key={signal}>
                <BadgeCheck size={15} /> {signal}
              </span>
            ))}
          </div>
        </div>

        <aside className="home-hero-panel">
          <img src="/assets/grizzly-logo.png" alt={familyName} />
          <span>Сигнал родини</span>
          <strong>Вірність. Сила. Повага. Родина.</strong>
          <p>Наш стиль — нічне місто, чіткі рішення і команда, яка не губиться у важливий момент.</p>
        </aside>

        <div className="stat-strip">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Характер" title="Grizzly Family тримається на системі">
        <div className="home-values-grid">
          {homeValues.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={24} />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="home-path-section">
        <div className="home-path-panel">
          <div>
            <p className="eyebrow">Вступ</p>
            <h2>Шлях від кандидата до учасника</h2>
            <p>
              Ми не набираємо випадкових людей. Кандидат проходить Discord-заявку,
              коротку перевірку, співбесіду і тільки після цього отримує роль родини.
            </p>
            <Link className="button primary" to="/recruitment">
              Почати вступ <ArrowRight size={18} />
            </Link>
          </div>
          <div className="home-path-list">
            {pathSteps.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Активності" title="Що відбувається всередині родини" className="band">
        <div className="home-activity-grid">
          {events.map(([title, date, text]) => (
            <article key={title}>
              <CalendarDays size={22} />
              <span>{date}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
          <article className="home-activity-special">
            <Radio size={22} />
            <span>Discord</span>
            <strong>Живе керування</strong>
            <p>Заявки, новини, звіти, склад, ролі та адмін-дії підключені до Discord і Firestore.</p>
          </article>
        </div>
      </Section>

      <Section className="home-final-cta">
        <div>
          <Sparkles size={28} />
          <p className="eyebrow">Grizzly Family</p>
          <h2>Готовий зайти в родину?</h2>
          <p>Прочитай правила, авторизуйся через Discord і залиш заявку. Далі тебе побачить старший склад.</p>
        </div>
        <Link className="button primary" to="/recruitment">
          Подати заявку <ArrowRight size={18} />
        </Link>
      </Section>
    </>
  );
}
