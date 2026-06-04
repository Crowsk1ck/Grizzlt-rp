import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { roster } from '../data/siteData.js';

export default function Roster() {
  return (
    <>
      <PageHero eyebrow="Roster" title="Склад родини" text="Ключові ролі та активні учасники поточного сезону." />
      <Section>
        <div className="table">
          {roster.map(([name, rank, duty]) => (
            <div className="table-row" key={name}>
              <strong>{name}</strong>
              <span>{rank}</span>
              <p>{duty}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
