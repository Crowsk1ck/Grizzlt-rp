import Card from '../components/Card.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { achievements } from '../data/siteData.js';

export default function Achievements() {
  return (
    <>
      <PageHero eyebrow="Wins" title="Досягнення" text="Те, що підсилює статус Grizzly Family протягом сезону." />
      <Section>
        <div className="grid four">
          {achievements.map((item) => (
            <Card key={item.title} {...item} />
          ))}
        </div>
      </Section>
    </>
  );
}
