export default function Team(){
  const members = [
    {name:'cr0wsk1ck', role:'ЛИДЕР', money:'$540,000', status:'В СЕТИ'},
    {name:'Shadow', role:'ЗАМЕСТИТЕЛЬ', money:'$365,000', status:'В СЕТИ'},
    {name:'Mugiwara', role:'ВЕТЕРАН', money:'$210,000', status:'В СЕТИ'},
    {name:'Nightmare', role:'ВЕТЕРАН', money:'$190,000', status:'НЕ В СЕТИ'},
    {name:'Blaze', role:'УЧАСТНИК', money:'$150,000', status:'В СЕТИ'},
    {name:'Hokage', role:'УЧАСТНИК', money:'$130,000', status:'В СЕТИ'},
    {name:'Soza', role:'УЧАСТНИК', money:'$75,000', status:'НЕ В СЕТИ'},
    {name:'Exotic', role:'УЧАСТНИК', money:'$40,000', status:'В СЕТИ'}
  ]

  return(
    <section className="team-page">
      <div className="team-header">
        <div>
          <h1>НАША КОМАНДА</h1>
          <p>Сильные лидеры. Верные соратники.</p>
        </div>

        <div className="team-stats">
          <div className="team-stat">
            <h3>86</h3>
            <span>ВСЕГО УЧАСТНИКОВ</span>
          </div>

          <div className="team-stat">
            <h3>48</h3>
            <span>ONLINE</span>
          </div>

          <div className="team-stat">
            <h3>32</h3>
            <span>В СЕТИ СЕГОДНЯ</span>
          </div>
        </div>
      </div>

      <div className="team-controls">
        <div className="tabs">
          <button className="active">ВСЕ УЧАСТНИКИ</button>
          <button>ЛИДЕРЫ</button>
          <button>ЗАМЕСТИТЕЛИ</button>
          <button>ВЕТЕРАНЫ</button>
        </div>

        <div className="search-row">
          <input placeholder="Поиск участника..." />
        </div>
      </div>

      <div className="members-grid">
        {members.map((member,index)=>(
          <div className="member-panel" key={index}>
            <div className="member-overlay"></div>

            <div className="member-content">
              <h3>{member.name}</h3>

              <span className="member-role">
                {member.role}
              </span>

              <div className="member-money">
                {member.money}
              </div>

              <div className={member.status === 'В СЕТИ' ? 'online' : 'offline'}>
                {member.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}