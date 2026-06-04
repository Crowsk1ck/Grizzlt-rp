import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { gallery } from '../data/siteData.js';

export default function Gallery() {
  return (
    <>
      <PageHero eyebrow="Gallery" title="Галерея" text="Візуальна історія родини: зустрічі, колони, перемовини та медіа-сцени." />
      <Section>
        <div className="gallery-grid">
          {gallery.map(([title, text], index) => (
            <article className={`gallery-tile tile-${index + 1}`} key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
