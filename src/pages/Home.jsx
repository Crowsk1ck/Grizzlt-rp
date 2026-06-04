import { ArrowRight, CalendarDays, ScrollText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Section from '../components/Section.jsx';
import { events, features, familyName, stats } from '../data/siteData.js';

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <img className="hero-logo" src="/assets/grizzly-logo.png" alt={familyName} />
          <p className="eyebrow">Преміальна GTA RP родина</p>
          <h1>{familyName}</h1>
          <p>
            Неонова атмосфера, сильний склад, нічні виїзди, повага до RP та стиль,
            який видно здалеку. Разом ми сильніші.
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/recruitment">
              Подати заявку <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/rules">
              <ScrollText size={18} /> Устав
            </Link>
          </div>
        </div>
        <div className="stat-strip">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <Section eyebrow="Цінності" title="Grizzly Family тримається на характері">
        <div className="grid four">
          {features.map((item) => (
            <Card key={item.title} {...item} />
          ))}
        </div>
      </Section>

      <Section eyebrow="Розклад" title="Найближчі активності" className="band">
        <div className="timeline">
          {events.map(([title, date, text]) => (
            <article key={title} className="timeline-item">
              <CalendarDays size={22} />
              <div>
                <strong>{title}</strong>
                <span>{date}</span>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
