import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { diplomacy } from '../data/siteData.js';

export default function Diplomacy() {
  return (
    <>
      <PageHero eyebrow="Diplomacy" title="Дипломатія" text="Союзи, нейтралітет і конфлікти оформлюються через RP, а не через хаос." />
      <Section>
        <div className="diplomacy-grid">
          {diplomacy.map(([title, text]) => (
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
