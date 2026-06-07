import { AlertTriangle, BadgeCheck, Car, MessageSquareText, ScrollText, Shield, UsersRound } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

const ruleGroups = [
  {
    icon: Shield,
    title: 'RP та сервер',
    accent: 'pink',
    rules: [
      'Дотримуйся правил сервера, логіки RP, Fear RP, NLR, MG та PG.',
      'Не ламай сцену заради швидкої вигоди. Спочатку відіграш, потім розбір ситуації.',
      'Конфлікт має мати RP-причину, а не емоції з Discord або особисту образу.',
    ],
  },
  {
    icon: UsersRound,
    title: 'Дисципліна родини',
    accent: 'blue',
    rules: [
      'На збір приходь підготовленим: зв’язок, транспорт, форма, броня та розуміння задачі.',
      'Рішення старшого складу виконується одразу. Обговорення можливе після сцени.',
      'Не винось внутрішні питання у публічні чати, голосові канали або сторонні Discord сервери.',
    ],
  },
  {
    icon: MessageSquareText,
    title: 'Комунікація',
    accent: 'violet',
    rules: [
      'У Discord говоримо коротко, по суті і без крику під час активної сцени.',
      'Образи, токсичність, провокації та приниження учасників родини заборонені.',
      'Якщо виникла проблема, передай факти куратору або старшому складу.',
    ],
  },
  {
    icon: Car,
    title: 'Майно та ресурси',
    accent: 'amber',
    rules: [
      'Транспорт, бізнеси, склад і ресурси родини використовуються тільки з дозволу відповідального рангу.',
      'Після активності поверни майно у нормальному стані або повідом про втрати.',
      'Особистий прибуток не може бути важливішим за інтерес родини.',
    ],
  },
  {
    icon: BadgeCheck,
    title: 'Активність',
    accent: 'green',
    rules: [
      'Учасник має бути на зв’язку, відповідати на важливі оголошення і брати участь у житті родини.',
      'Довга відсутність без попередження може впливати на роль, ранг або доступи.',
      'Кандидат проходить адаптацію, знайомиться з правилами і показує стабільність.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Порушення',
    accent: 'red',
    rules: [
      'За порушення можуть бути попередження, зняття ролі, пониження або виключення.',
      'Серйозні ситуації розглядаються старшим складом за доказами, а не за чутками.',
      'Повторні порушення вважаються небажанням бути частиною Grizzly Family.',
    ],
  },
];

const fastRules = [
  'Поважай своїх і не підставляй родину.',
  'Не починай конфлікт без причини та підтвердження старшого складу.',
  'Не використовуй майно родини без дозволу.',
  'Не зливай внутрішню інформацію.',
  'Тримай Discord, гру і RP-сцени в охайному стані.',
];

export default function Rules() {
  return (
    <>
      <PageHero
        eyebrow="Rules"
        title="Правила родини"
        text="Устав Grizzly Family створений для порядку, сильної атмосфери, якісного RP і захисту репутації кожного учасника."
      />

      <Section className="rules-page">
        <div className="rules-overview">
          <div>
            <p className="eyebrow">Устав</p>
            <h2>Правила тримають родину сильною</h2>
            <p>
              У Grizzly Family правила не для формальності. Вони допомагають швидко діяти у сценах,
              не губити дисципліну, поважати союзників і залишати за родиною преміальну репутацію.
            </p>
          </div>
          <aside>
            <ScrollText size={34} />
            <strong>Коротко</strong>
            <span>Спокій. Повага. Факти. Команда.</span>
          </aside>
        </div>

        <div className="rules-grid">
          {ruleGroups.map(({ icon: Icon, title, accent, rules }) => (
            <article className={`rule-card ${accent}`} key={title}>
              <div className="rule-card-head">
                <Icon size={24} />
                <h2>{title}</h2>
              </div>
              <ol>
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ol>
            </article>
          ))}
        </div>

        <section className="contract-panel rules-fast-panel">
          <div className="contract-panel-title">
            <div>
              <p className="eyebrow">Пам'ятка</p>
              <h2>5 правил, які треба знати одразу</h2>
            </div>
            <BadgeCheck size={28} />
          </div>
          <div className="rules-fast-list">
            {fastRules.map((rule, index) => (
              <article key={rule}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{rule}</p>
              </article>
            ))}
          </div>
        </section>
      </Section>
    </>
  );
}
