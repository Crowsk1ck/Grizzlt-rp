import '../styles/dashboard.css'

export default function Dashboard(){

  const topMembers = [

    {
      name:'cr0wsk1ck',
      money:'$540,000'
    },

    {
      name:'Shadow',
      money:'$325,000'
    },

    {
      name:'Nightmare',
      money:'$210,000'
    }

  ]

  const activity = [

    'Новый контракт Vinewood',
    'Захват территории',
    'Пополнение состава',
    'Успешная операция',
    'Новый набор участников'

  ]

  return(

    <div className="dashboard-page">

      <section className="dashboard-hero">

        <div className="dashboard-overlay"></div>

        <div className="dashboard-left">

          <div className="dashboard-badge">
            GRIZZLY FAMILY
          </div>

          <h1>
            PREMIUM
            <br />
            <span>GTA RP</span>
          </h1>

          <p>
            Элитная организация GTA RP сервера.
            Контракты. Контроль территорий.
            Дисциплина. Репутация. Власть.
          </p>

          <div className="dashboard-buttons">

            <button className="join-btn">
              DISCORD
            </button>

            <button className="rules-btn">
              ПРАВИЛА
            </button>

          </div>

        </div>

        <div className="dashboard-right">

          <div className="hero-card">

            <h3>48</h3>

            <span>ONLINE</span>

          </div>

          <div className="hero-card">

            <h3>1247</h3>

            <span>КОНТРАКТОВ</span>

          </div>

          <div className="hero-card">

            <h3>$2.5M</h3>

            <span>ОБЩИЙ ДОХОД</span>

          </div>

          <div className="hero-card">

            <h3>86</h3>

            <span>УЧАСТНИКОВ</span>

          </div>

        </div>

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card about-card">

          <h2>О НАС</h2>

          <p>
            Grizzly Family —
            одна из самых влиятельных организаций
            GTA RP сервера.
            Мы занимаемся контрактами,
            бизнесом,
            войнами и контролем территорий.
          </p>

          <button className="more-btn">
            УЗНАТЬ БОЛЬШЕ
          </button>

        </div>

        <div className="dashboard-card activity-card">

          <h2>АКТИВНОСТЬ</h2>

          <div className="activity-list">

            {activity.map((item,index)=>(

              <div
                className="activity-item"
                key={index}
              >

                <div className="activity-dot"></div>

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

        <div className="dashboard-card top-card">

          <h2>ТОП УЧАСТНИКОВ</h2>

          <div className="top-list">

            {topMembers.map((member,index)=>(

              <div
                className="top-item"
                key={index}
              >

                <div className="top-user">

                  <div className="top-avatar">

                    {index+1}

                  </div>

                  <span>
                    {member.name}
                  </span>

                </div>

                <strong>
                  {member.money}
                </strong>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>

  )

}
