import { BadgeDollarSign, Crown, Shield, Star, UserCheck, Users } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';

const ranks = [
  {
    name: 'Лідер',
    salary: '$ 250 000+',
    access: 'Фінальні рішення, дипломатія, стратегія, склад і великі події.',
    icon: Crown,
  },
  {
    name: 'Заступник',
    salary: '$ 180 000',
    access: 'Керує напрямами, контролює дисципліну та приймає рішення по складу.',
    icon: Star,
  },
  {
    name: 'Радник',
    salary: '$ 130 000',
    access: 'Дипломатія, конфлікти, внутрішній баланс і допомога старшому складу.',
    icon: Shield,
  },
  {
    name: 'Куратор',
    salary: '$ 90 000',
    access: 'Веде напрям: рекрутинг, бізнес, події, медіа або автопарк.',
    icon: UserCheck,
  },
  {
    name: 'Боєць',
    salary: '$ 55 000',
    access: 'Контракти, активності, сімейні виїзди та допомога новачкам.',
    icon: Users,
  },
  {
    name: 'Кандидат',
    salary: 'Випробувальний термін',
    access: 'Навчання правилам родини, базові активності та співбесіда.',
    icon: BadgeDollarSign,
  },
];

const bonuses = [
  ['Топ контрактів тижня', '$ 50 000 - $ 150 000', 'За стабільну активність і результат.'],
  ['Медіа / контент', '$ 25 000 - $ 80 000', 'Фото, відео, афіші та Discord-активність.'],
  ['Допомога новачкам', '$ 30 000 - $ 90 000', 'Адаптація кандидатів і дисципліна на зборах.'],
  ['Особлива задача', 'за рішенням старших', 'RP-сцени, дипломатія, охорона або бізнес-активність.'],
];

export default function Ranks() {
  return (
    <>
      <PageHero
        eyebrow="Ranks"
        title="Ранги та зарплати"
        text="Довідник посад Grizzly Family: відповідальність, бонуси, доступи та очікування від кожного рангу."
      />

      <Section title="Ієрархія родини" eyebrow="Structure">
        <div className="rank-grid">
          {ranks.map(({ name, salary, access, icon: Icon }) => (
            <article className="rank-card" key={name}>
              <span className="card-icon">
                <Icon size={24} />
              </span>
              <div>
                <h3>{name}</h3>
                <strong>{salary}</strong>
                <p>{access}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="band" title="Бонуси" eyebrow="Money">
        <div className="table">
          {bonuses.map(([name, reward, text]) => (
            <div className="table-row" key={name}>
              <strong>{name}</strong>
              <span>{reward}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
