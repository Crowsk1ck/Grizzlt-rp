import { Link } from 'react-router-dom';
import FirestoreForm from '../components/FirestoreForm.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

export default function Recruitment() {
  const { hasFamilyRole, loading } = useAuth();

  return (
    <>
      <PageHero
        eyebrow="Join"
        title="Вступ"
        text="Заповни заявку, покажи свій RP-досвід і будь готовий до короткої співбесіди в Discord."
      />
      <Section title={hasFamilyRole ? 'Ти вже в родині' : 'Заявка у Firestore'}>
        {hasFamilyRole && !loading ? (
          <div className="candidate-status">
            <img className="mini-logo" src="/assets/grizzly-logo.png" alt="Grizzly Family" />
            <div>
              <h3>Вступ уже завершено</h3>
              <p>У тебе вже є роль Grizzly Family у Discord, тому повторна заявка не потрібна.</p>
              <Link className="button primary" to="/profile">Перейти в кабінет</Link>
            </div>
          </div>
        ) : (
          <div className="split align-start">
            <div>
              <h2>Кого беремо</h2>
              <p>Гравців 16+, які вміють слухати, тримати образ, грати не лише заради перемоги та готові до вечірнього онлайну.</p>
              <ul className="clean-list">
                <li>Випробувальний термін від 3 до 7 днів.</li>
                <li>Обов’язковий Discord і робочий мікрофон.</li>
                <li>Знання базових правил GTA 5 RP.</li>
              </ul>
            </div>
            <FirestoreForm type="applications" />
          </div>
        )}
      </Section>
    </>
  );
}
