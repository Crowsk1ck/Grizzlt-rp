import '../styles/dashboard.css'

export default function Dashboard(){

  return(

    <div className="dashboard-page">

      <section className="hero-banner">

        <div className="hero-left">

          <div className="welcome">
            WELCOME TO
          </div>

          <h1>
            GRIZZLY
            <br/>
            <span>FAMILY</span>
          </h1>

          <p>
            Мы не просто семья —
            мы сила, которая правит улицами.
            Дисциплина. Хаос. Репутация.
          </p>

          <div className="hero-buttons">

            <button className="discord-join-btn">
              НАШ DISCORD
            </button>

            <button className="rules-btn">
              ПРАВИЛА СЕМЬИ
            </button>

          </div>

        </div>

        <div className="hero-right">

          <div className="hero-stat">
            <h3>48</h3>
            <span>ONLINE</span>
          </div>

          <div className="hero-stat">
            <h3>1247</h3>
            <span>КОНТРАКТОВ</span>
          </div>

          <div className="hero-stat">
            <h3>$2.5M</h3>
            <span>ОБЩИЙ ДОХОД</span>
          </div>

          <div className="hero-stat">
            <h3>86</h3>
            <span>УЧАСТНИКОВ</span>
          </div>

        </div>

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card">

          <h2>О НАС</h2>

          <p>
            Grizzly Family —
            элитная организация GTA RP сервера.

            Мы занимаемся контрактами,
            бизнесом, войнами и контролем территорий.
          </p>

          <button className="more-btn">
            УЗНАТЬ БОЛЬШЕ
          </button>

        </div>

        <div className="dashboard-card">

          <h2>ПОСЛЕДНИЕ НОВОСТИ</h2>

          <div className="news-item">
            <span>
              Новый контракт Vinewood
            </span>

            <span>
              2 часа назад
            </span>
          </div>

          <div className="news-item">
            <span>
              Захват территории
            </span>

            <span>
              5 часов назад
            </span>
          </div>

          <div className="news-item">
            <span>
              Пополнение состава
            </span>

            <span>
              1 день назад
            </span>
          </div>

          <div className="news-item">
            <span>
              Новый набор участников
            </span>

            <span>
              2 дня назад
            </span>
          </div>

        </div>

        <div className="dashboard-card">

          <h2>ТОП УЧАСТНИКОВ</h2>

          <div className="top-member">
            <span>1. cr0wsk1ck</span>
            <span>$540,000</span>
          </div>

          <div className="top-member">
            <span>2. Shadow</span>
            <span>$325,000</span>
          </div>

          <div className="top-member">
            <span>3. Mugiwara</span>
            <span>$210,000</span>
          </div>

          <div className="top-member">
            <span>4. Nightmare</span>
            <span>$180,000</span>
          </div>

          <div className="top-member">
            <span>5. Blaze</span>
            <span>$150,000</span>
          </div>

        </div>

      </section>

    </div>
  )
}
