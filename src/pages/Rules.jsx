import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { rules } from '../data/siteData.js';

export default function Rules() {
  return (
    <>
      <PageHero eyebrow="Rules" title="Устав" text="Короткі правила, які зберігають атмосферу та захищають репутацію родини." />
      <Section>
        <ol className="rules-list">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </Section>
    </>
  );
}
