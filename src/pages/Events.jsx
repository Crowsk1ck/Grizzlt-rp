import { CalendarDays, Camera, Car, Clock, Crown, Handshake, Radio, ShieldCheck, UsersRound } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { events } from '../data/siteData.js';

const eventTypes = [
  {
    icon: Car,
    title: 'Колони',
    text: 'Нічні виїзди, маршрути містом, супровід, медіа і чітка координація у Discord.',
  },
  {
    icon: Handshake,
    title: 'Перемовини',
    text: 'Союзи, нейтралітет, бізнес-зустрічі та конфлікти через RP, а не хаотичні рішення.',
  },
  {
    icon: ShieldCheck,
    title: 'Закриті сцени',
    text: 'Активності для складу: тренування, перевірка дисципліни, ролі та командна взаємодія.',
  },
  {
    icon: Camera,
    title: 'Медіа',
    text: 'Фотосесії, банери, Discord-новини і контент, який підтримує стиль Grizzly Family.',
  },
];

const eventRules = [
  'Приходь вчасно і слухай відповідального за подію.',
  'Тримай Discord чистим: короткі команди, без шуму, без перебивання.',
  'Не починай сторонні конфлікти під час організованої сцени.',
  'Після події передай фото, відео або важливі деталі у відповідний канал.',
];

export default function Events() {
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Події"
        text="Регулярні RP-сцени для родини, союзників, кандидатів і медіа. Тут формується стиль, дисципліна та історія Grizzly Family."
      />

      <Section className="events-page">
        <div className="events-command">
          <div>
            <p className="eyebrow">Grizzly schedule</p>
            <h2>Подія має виглядати як сцена, а не випадковий збір</h2>
            <p>
              Ми робимо активності з підготовкою: відповідальний, час, роль кожного учасника,
              Discord-координація і зрозумілий результат після завершення.
            </p>
          </div>
          <aside>
            <Radio size={34} />
            <span>Live coordination</span>
            <strong>Discord керує ритмом подій</strong>
            <p>Оголошення, збір, ролі, маршрут і фінальний звіт тримаються в одному просторі.</p>
          </aside>
        </div>

        <div className="events-type-grid">
          {eventTypes.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={24} />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="events-layout">
          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Розклад</p>
                <h2>Найближчі активності</h2>
              </div>
              <CalendarDays size={28} />
            </div>
            <div className="events-schedule-list">
              {events.map(([title, date, text]) => (
                <article key={title}>
                  <span>
                    <Clock size={16} /> {date}
                  </span>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Порядок</p>
                <h2>Правила участі</h2>
              </div>
              <Crown size={28} />
            </div>
            <div className="events-rules-list">
              {eventRules.map((rule, index) => (
                <article key={rule}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{rule}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>

        <section className="events-cta">
          <UsersRound size={28} />
          <div>
            <p className="eyebrow">Для учасників</p>
            <h2>Хочеш провести власну подію?</h2>
            <p>Підготуй ідею, час, список учасників і короткий сценарій. Старший склад допоможе оформити сцену.</p>
          </div>
        </section>
      </Section>
    </>
  );
}
