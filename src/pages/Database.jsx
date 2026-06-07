import { Database, ShieldCheck } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { firebaseStatus } from '../lib/firebase.js';

export default function DatabasePage() {
  const pending = JSON.parse(localStorage.getItem('pending-firestore-records') || '[]');

  return (
    <>
      <PageHero
        eyebrow="Firestore"
        title="База даних"
        text="Заявки та повідомлення сайту підключаються до Firebase Firestore через змінні середовища Vercel."
      />
      <Section title="Статус підключення">
        <div className="grid two">
          <article className="card">
            <span className="card-icon">
              <Database size={22} />
            </span>
            <h3>{firebaseStatus.connected ? 'Firestore підключено' : 'Firestore ще не підключено'}</h3>
            <p>
              {firebaseStatus.connected
                ? `Проєкт: ${firebaseStatus.projectId}`
                : 'Додай VITE_FIREBASE_* змінні у Vercel і зроби redeploy.'}
            </p>
          </article>
          <article className="card">
            <span className="card-icon">
              <ShieldCheck size={22} />
            </span>
            <h3>Правила безпеки</h3>
            <p>Публічний сайт може створювати заявки, але читання бази закрите для відвідувачів.</p>
          </article>
        </div>
        {!firebaseStatus.connected && pending.length > 0 && (
          <p className="auth-alert">Локально збережено заявок без Firebase: {pending.length}</p>
        )}
      </Section>
    </>
  );
}
