import { AtSign, Clock, Handshake, Mail, MessageCircle, Radio, ShieldQuestion } from 'lucide-react';
import FirestoreForm from '../components/FirestoreForm.jsx';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

const contactCards = [
  {
    icon: MessageCircle,
    title: 'Discord',
    value: 'grizzly-family',
    text: 'Основний канал зв’язку для заявок, співбесід, новин і швидких питань.',
  },
  {
    icon: Clock,
    title: 'Прайм-тайм',
    value: '19:00 - 00:00',
    text: 'Найкращий час для відповіді штабу, зборів, перемовин і розгляду звернень.',
  },
  {
    icon: Handshake,
    title: 'Союзи',
    value: 'через RP',
    text: 'Перемовини, нейтралітет і спільні події оформлюються спокійно та через старший склад.',
  },
];

const requestTypes = [
  ['Союз або нейтралітет', 'Хто ви, кого представляєте, що пропонуєте і який формат очікуєте.'],
  ['Подія або сцена', 'Час, місце, учасники, ідея, потрібна роль Grizzly Family.'],
  ['Питання по родині', 'Коротко опиши ситуацію, Discord для відповіді і бажаний результат.'],
  ['Медіа або контент', 'Посилання, ідея, формат публікації або матеріали для новини.'],
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Контакти"
        text="Зв’язок зі штабом Grizzly Family для союзів, подій, питань, медіа та важливих звернень."
      />

      <Section className="contact-page">
        <div className="contact-command">
          <div>
            <p className="eyebrow">Штаб родини</p>
            <h2>Пиши коротко, зрозуміло і з конкретною метою</h2>
            <p>
              Контактна форма створена для звернень, які потрібно передати штабу.
              Якщо питання стосується вступу, краще використовувати сторінку заявки, щоб бот і адмінка правильно обробили анкету.
            </p>
          </div>
          <aside>
            <Radio size={34} />
            <span>Signal</span>
            <strong>Grizzly Family на зв’язку</strong>
            <p>Залиш повідомлення на сайті або напиши у Discord, якщо питання потребує швидкої реакції.</p>
          </aside>
        </div>

        <div className="contact-card-grid">
          {contactCards.map(({ icon: Icon, title, value, text }) => (
            <article key={title}>
              <Icon size={24} />
              <span>{title}</span>
              <strong>{value}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>

        <div className="contact-layout">
          <section className="contract-panel contact-form-panel">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Message</p>
                <h2>Написати штабу</h2>
              </div>
              <Mail size={28} />
            </div>
            <FirestoreForm type="messages" />
          </section>

          <aside className="contact-side">
            <section className="contract-panel">
              <div className="contract-panel-title">
                <div>
                  <p className="eyebrow">Формат</p>
                  <h2>Що можна писати</h2>
                </div>
                <ShieldQuestion size={28} />
              </div>
              <div className="contact-request-list">
                {requestTypes.map(([title, text]) => (
                  <article key={title}>
                    <span>{title}</span>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="contract-panel contact-note-panel">
              <AtSign size={26} />
              <p className="eyebrow">Важливо</p>
              <h2>Для вступу використовуй заявку</h2>
              <p>
                Контактна форма не замінює анкету кандидата. Для вступу потрібна Discord-авторизація
                і сторінка “Вступ”, щоб система не пропустила повторні заявки.
              </p>
            </section>
          </aside>
        </div>
      </Section>
    </>
  );
}
