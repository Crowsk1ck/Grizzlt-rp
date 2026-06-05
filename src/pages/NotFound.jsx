import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="404" title="Сторінку не знайдено" text="Такої сторінки немає або її адресу змінено." />
      <Section>
        <Link className="button primary" to="/">Повернутися на головну</Link>
      </Section>
    </>
  );
}
