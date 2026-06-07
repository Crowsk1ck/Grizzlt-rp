import { Crown, Gem, Handshake, Radio, ShieldCheck, Swords, UsersRound } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

const values = [
  {
    icon: UsersRound,
    title: 'Єдність',
    text: 'Ми тримаємося разом у спокійних сценах, конфліктах, бізнесі та щоденній грі.',
  },
  {
    icon: Crown,
    title: 'Статус',
    text: 'Grizzly Family має виглядати впевнено: дисципліна, стиль, репутація і сильна подача.',
  },
  {
    icon: ShieldCheck,
    title: 'Повага',
    text: 'Повага до своїх, союзників, опонентів і правил сервера стоїть вище швидких перемог.',
  },
  {
    icon: Gem,
    title: 'Якість RP',
    text: 'Ми цінуємо красиві сцени, зрозумілу роль, чисту комунікацію і гру без хаосу.',
  },
];

const directions = [
  ['Контракти', 'Організовані виїзди, супровід, безпека угод і стабільний заробіток родини.'],
  ['Дипломатія', 'Союзи, нейтралітет, перемовини і конфлікти проходять через старший склад.'],
  ['Медіа', 'Новини, галерея, Discord-оголошення, події та візуальний образ Grizzly Family.'],
  ['Склад', 'Набір, адаптація кандидатів, ролі, активність і розвиток кожного учасника.'],
];

const principles = [
  'Сильна родина починається з дисципліни, а не з гучних слів.',
  'Кожен учасник відповідає не тільки за себе, а й за репутацію Grizzly Family.',
  'Рішення приймаються спокійно: факти, позиція старшого складу, повага до RP-сцени.',
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Про родину"
        text="Grizzly Family — преміальна GTA 5 RP родина з неоновим стилем, сильною дисципліною, активним Discord і командною грою."
      />

      <Section className="about-page">
        <div className="about-identity">
          <div className="about-copy">
            <p className="eyebrow">Grizzly Family</p>
            <h2>Ми будуємо не просто склад, а впізнавану RP-родину</h2>
            <p>
              Grizzly Family об'єднує гравців, які хочуть грати красиво, стабільно і з характером.
              Для нас важливі атмосфера, командна робота, репутація та вміння діяти разом у будь-якій ситуації.
            </p>
            <p>
              Родина бере участь у контрактах, переговорах, подіях, бізнес-сценах і внутрішніх активностях.
              Кожен напрям має свою відповідальність, а кожен учасник може вирости від кандидата до важливої ролі у складі.
            </p>
          </div>

          <aside className="about-signal">
            <Radio size={34} />
            <span>Сигнал родини</span>
            <strong>Вірність. Сила. Повага. Родина.</strong>
            <p>Це короткий кодекс Grizzly: тримати стиль, не губити дисципліну і залишати після себе сильну історію.</p>
          </aside>
        </div>

        <div className="about-values-grid">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={24} />
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="about-split">
          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Напрями</p>
                <h2>Що робить родина</h2>
              </div>
              <Swords size={28} />
            </div>
            <div className="about-direction-list">
              {directions.map(([title, text]) => (
                <article key={title}>
                  <span>{title}</span>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="contract-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Кодекс</p>
                <h2>Як ми тримаємо рівень</h2>
              </div>
              <Handshake size={28} />
            </div>
            <div className="about-principles">
              {principles.map((item, index) => (
                <article key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </Section>
    </>
  );
}
