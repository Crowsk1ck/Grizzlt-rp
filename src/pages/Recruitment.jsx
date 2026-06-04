import FirestoreForm from '../components/FirestoreForm.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

export default function Recruitment() {
  return (
    <>
      <PageHero
        eyebrow="Join"
        title="Вступ"
        text="Заповни заявку, покажи свій RP-досвід і будь готовий до короткої співбесіди в Discord."
      />
      <Section title="Заявка у Firestore">
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
      </Section>
    </>
  );
}
