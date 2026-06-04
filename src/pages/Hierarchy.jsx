import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { hierarchy } from '../data/siteData.js';

export default function Hierarchy() {
  return (
    <>
      <PageHero eyebrow="Hierarchy" title="Ієрархія" text="Зрозуміла система рангів допомагає тримати дисципліну та діяти без хаосу." />
      <Section>
        <div className="rank-list">
          {hierarchy.map(([rank, text], index) => (
            <article key={rank} className="rank-item">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{rank}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
