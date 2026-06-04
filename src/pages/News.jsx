import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { news } from '../data/siteData.js';

export default function News() {
  return (
    <>
      <PageHero eyebrow="News" title="Новини" text="Оголошення родини, оновлення уставу та сезонні плани." />
      <Section>
        <div className="news-list">
          {news.map(([title, text]) => (
            <article key={title}>
              <span>Grizzly Bulletin</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
