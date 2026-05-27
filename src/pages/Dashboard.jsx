export default function Dashboard(){
  const [showRules,setShowRules] = useState(false)
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
  href="https://discord.gg/APPf3Rq3dF"
  target="_blank"
  rel="noreferrer"
  className="discord-join-btn"
>

  <svg
    className="discord-svg"
    viewBox="0 0 127.14 96.36"
  >
    <path
      fill="currentColor"
      d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.11 0A72.37 72.37 0 0 0 45.64 0 105.89 105.89 0 0 0 19.39 8.09C2.79 32.65-1.71 56.6.54 80.21h.04a105.73 105.73 0 0 0 32.17 16.15 77.7 77.7 0 0 0 6.89-11.11 68.42 68.42 0 0 1-10.85-5.18c.91-.66 1.8-1.34 2.66-2.04a75.57 75.57 0 0 0 64.32 0c.87.71 1.76 1.39 2.66 2.04a68.68 68.68 0 0 1-10.87 5.19 77 77 0 0 0 6.89 11.1A105.25 105.25 0 0 0 126.6 80.22c2.64-27.29-4.5-51.02-18.9-72.15ZM42.45 65.69C36.18 65.69 31 59.98 31 52.97S36.06 40.25 42.45 40.25c6.46 0 11.63 5.78 11.45 12.72 0 7.01-5.06 12.72-11.45 12.72Zm42.24 0c-6.27 0-11.45-5.71-11.45-12.72s5.06-12.72 11.45-12.72c6.46 0 11.63 5.78 11.45 12.72 0 7.01-5.06 12.72-11.45 12.72Z"
    />
  </svg>

  <span>
    НАШ DISCORD
  </span>

</a>
<button
  className="secondary-btn"
  onClick={() => setShowRules(true)}
>
  ПРАВИЛА
</button>
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

          <button className="learn-btn">
        Дізнатись
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
