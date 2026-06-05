import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { diplomacy } from '../data/siteData.js';

const partners = [
  ['Автоклуби', 'Спільні нічні виїзди, заїзди, фотосесії та безпечні маршрути.'],
  ['Бізнес-родини', 'Перемовини, контракти, охорона зустрічей і довгострокові домовленості.'],
  ['Медіа-команди', 'Афіші, відео, репортажі з подій та просування RP-сцен.'],
];

export default function Diplomacy() {
  return (
    <>
      <PageHero eyebrow="Diplomacy" title="Дипломатія" text="Союзи, нейтралітет і конфлікти оформлюються через RP, а не через хаос." />
      <Section title="Статуси відносин">
        <div className="diplomacy-grid">
          {diplomacy.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section title="Партнерські напрями" eyebrow="Alliances" className="band">
        <div className="diplomacy-grid">
          {partners.map(([title, text]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
