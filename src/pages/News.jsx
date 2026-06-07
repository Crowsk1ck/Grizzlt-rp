import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { news as fallbackNews } from '../data/siteData.js';
import { db } from '../lib/firebase.js';

function normalizeNews(snapshot) {
  return snapshot.docs.map((item) => {
    const data = item.data();
    return {
      id: item.id,
      title: data.title,
      text: data.text,
      tag: data.tag || 'Grizzly Bulletin',
      date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
    };
  });
}

export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')))
      .then((snapshot) => setItems(normalizeNews(snapshot)))
      .catch((newsError) => setError(newsError.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleNews = items.length > 0
    ? items
    : fallbackNews.map(([title, text]) => ({ id: title, title, text, tag: 'Grizzly Bulletin' }));

  return (
    <>
      <PageHero eyebrow="News" title="Новини" text="Оголошення родини, оновлення правил, сезонні плани та важливі повідомлення." />
      <Section>
        {loading && <p>Завантажуємо новини...</p>}
        {error && <p className="auth-alert">Новини Firestore недоступні, показуємо резервний список: {error}</p>}
        <div className="news-list">
          {visibleNews.map((item) => (
            <article key={item.id}>
              <span>{item.tag}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              {item.date && <small>{new Date(item.date).toLocaleString('uk-UA')}</small>}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
