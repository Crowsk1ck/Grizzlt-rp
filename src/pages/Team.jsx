import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase/firebase'

export default function Team(){

const ROLE_OWNER = '1390073606481907895'
const ROLE_LEADER = '1390074547864207534'
const ROLE_VETERAN = '1390074876207042590'

  const [members,setMembers] = useState([])

  const [stats,setStats] = useState({
    members:0,
    online:0
  })
  useEffect(()=>{
    const unsub = onSnapshot(
      collection(db,'discord'),
      (snapshot)=>{
        const users = []
        let onlineCount = 0
        snapshot.forEach((doc)=>{
          const data = doc.data()
          let role = 'УЧАСТНИК'
          if(data.roles?.includes(ROLE_OWNER)){
            role = 'ЛИДЕР'
          }
          else if(data.roles?.includes(ROLE_LEADER)){
            role = 'ЗАМЕСТИТЕЛЬ'
          }
          else if(data.roles?.includes(ROLE_VETERAN)){
            role = 'ВЕТЕРАН'
          }
          if(data.online){
            onlineCount++
          }
          users.push({
            name:data.username,
            role,
            status:data.online
              ? 'В СЕТИ'
              : 'НЕ В СЕТИ',
            avatar:data.avatar
          })
        })
        setMembers(users)
        setStats({
          members:users.length,
          online:onlineCount
        })
      }
    )
    return ()=>unsub()
  },[])

  return(
    <section className="team-page">
      <div className="team-header">
        <div>
          <h1>НАША КОМАНДА</h1>
          <p>Сильные лидеры. Верные соратники.</p>
        </div>

        <div className="team-stats">
          <div className="team-stat">
            <h3>{stats.members}</h3>
            <span>ВСЕГО УЧАСТНИКОВ</span>
          </div>

          <div className="team-stat">
            <h3>{stats.online}</h3>
            <span>ONLINE</span>
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
<img
  src={
    member.avatar ||
    'https://cdn.discordapp.com/embed/avatars/0.png'
  }
  alt=""
  className="member-avatar"
/>
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
