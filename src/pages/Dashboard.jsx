export default function Dashboard(){
  return(
    <>
      <section className="hero-banner">
        <div className="hero-gradient"></div>

        <div className="hero-left">
          <span className="welcome">WELCOME TO</span>

          <h1>
            GRIZZLY <span>FAMILY</span>
          </h1>

          <p>
            Мы не просто семья — мы сила, которая правит улицами.
            Дисциплина. Хаос. Репутация.
          </p>

          <div className="hero-buttons">
            <a
  href="https://discord.gg/ТВОЙ_ИНВАЙТ"
  target="_blank"
  rel="noreferrer"
  className="primary-btn"
>
  НАШ DISCORD
</a>
            <button className="secondary-btn">ПРАВИЛА СЕМЬИ</button>
          </div>
        </div>
      </section>

      <section className="stats-row">
        <div className="stat-box">
          <h3>48</h3>
          <span>ONLINE</span>
        </div>

        <div className="stat-box">
          <h3>1247</h3>
          <span>КОНТРАКТОВ</span>
        </div>

        <div className="stat-box">
          <h3>$2.540.000</h3>
          <span>ДОХОД</span>
        </div>

        <div className="stat-box">
          <h3>86</h3>
          <span>УЧАСТНИКОВ</span>
        </div>

        <div className="stat-box">
          <h3>24</h3>
          <span>МЕРОПРИЯТИЯ</span>
        </div>
      </section>

      <section className="dashboard-layout">
        <div className="panel">
          <h2>О НАС</h2>

          <p>
            Grizzly Family — элитная организация GTA RP сервера.
            Мы занимаемся контрактами, бизнесом, войнами и контролем территорий.
          </p>

          <button className="primary-btn small-btn">
            УЗНАТЬ БОЛЬШЕ
          </button>
        </div>

        <div className="panel">
          <h2>ПОСЛЕДНИЕ НОВОСТИ</h2>

          <div className="news-item">
            Новый контракт Vinewood
          </div>

          <div className="news-item">
            Захват территории completed
          </div>

          <div className="news-item">
            Набор новых участников
          </div>

          <div className="news-item">
            Обновление семейного склада
          </div>
        </div>

        <div className="panel">
          <h2>ТОП УЧАСТНИКОВ</h2>

          <div className="top-user">Ghost — $540.000</div>
          <div className="top-user">Shadow — $325.000</div>
          <div className="top-user">Venom — $210.000</div>
          <div className="top-user">Blade — $190.000</div>
        </div>
      </section>
    </>
  )
}
