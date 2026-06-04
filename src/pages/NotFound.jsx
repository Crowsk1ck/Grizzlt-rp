import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero.jsx';

export default function NotFound() {
  return (
    <PageHero eyebrow="404" title="Сторінку не знайдено" text={<Link className="button primary" to="/">Повернутися на головну</Link>} />
  );
}
