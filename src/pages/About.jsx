import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Про родину"
        text="Grizzly Family будує преміальний RP навколо сили, поваги, вірності та атмосфери нічного міста."
      />
      <Section title="Наш стиль">
        <div className="split">
          <div>
            <h2>Не натовп, а структура</h2>
            <p>
              Родина грає через ролі, обов’язки та наслідки. Кожен учасник розуміє,
              навіщо він у сцені, кому підпорядковується і як його дії впливають на репутацію Grizzly.
            </p>
          </div>
          <div className="quote-panel">
            <strong>Кодекс Grizzly</strong>
            <p>Поважай сцену. Тримай стиль. Не ламай атмосферу заради швидкої перемоги.</p>
          </div>
        </div>
      </Section>
    </>
  );
}
