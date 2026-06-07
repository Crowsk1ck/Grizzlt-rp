import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { events } from '../data/siteData.js';

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Events" title="Події" text="Регулярні RP-сцени для родини, союзників, кандидатів і медіа." />
      <Section>
        <div className="event-grid">
          {events.map(([title, date, text]) => (
            <article className="event-card" key={title}>
              <span>{date}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
