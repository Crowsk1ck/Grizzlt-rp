import FirestoreForm from '../components/FirestoreForm.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Контакти" text="Зв’язок зі штабом родини для союзів, подій, питань і заявок." />
      <Section title="Написати штабу">
        <div className="split align-start">
          <div className="contact-panel">
            <h2>Discord</h2>
            <p>grizzly-family</p>
            <h2>Сервер</h2>
            <p>GTA 5 RP, вечірній прайм-тайм</p>
            <h2>Формат зв’язку</h2>
            <p>Коротко: хто ти, з чим прийшов, кого представляєш і який результат потрібен.</p>
          </div>
          <FirestoreForm type="messages" />
        </div>
      </Section>
    </>
  );
}
