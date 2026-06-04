import Card from '../components/Card.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { businesses } from '../data/siteData.js';

export default function Business() {
  return (
    <>
      <PageHero eyebrow="Business" title="Бізнеси" text="Економічна сторона родини: послуги, угоди, транспорт і напрям подій." />
      <Section>
        <div className="grid four">
          {businesses.map((item) => (
            <Card key={item.title} {...item} />
          ))}
        </div>
      </Section>
    </>
  );
}
