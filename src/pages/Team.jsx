import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase/firebase'
import '../styles/team.css'

export default function Team(){

  const ROLE_OWNER = '1390073606481907895'
  const ROLE_LEADER = '1390074547864207534'
  const ROLE_VETERAN = '1390074876207042590'

  const [filter,setFilter] = useState('ALL')
  const [members,setMembers] = useState([])
  const [contracts,setContracts] = useState([])
  const [search,setSearch] = useState('')

  const [stats,setStats] = useState({
    members:0,
    online:0,
    income:0,
    contracts:0
  })

  useEffect(()=>{

    const unsubMembers = onSnapshot(
      collection(db,'discord_members'),
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
            online:data.online,
            avatar:data.avatar,
            contracts:0,
            income:0,
            level:Math.floor(Math.random()*50)+1
          })

        })

        setMembers(users)

        setStats(prev=>({
          ...prev,
          members:users.length,
          online:onlineCount
        }))

      }
    )

    const unsubContracts = onSnapshot(
      collection(db,'contracts'),
      (snapshot)=>{

        const data = []

        snapshot.forEach((doc)=>{
          data.push(doc.data())
        })

        setContracts(data)

      }
    )

    return ()=>{
      unsubMembers()
      unsubContracts()
    }

  },[])

  useEffect(()=>{

    if(!members.length){
      return
    }

    const updatedMembers = [...members]

    let totalIncome = 0
    let totalContracts = 0

    updatedMembers.forEach(member=>{

      member.contracts = 0
      member.income = 0

      contracts.forEach(contract=>{

        const users = String(
          contract.members || ''
        )
        .split(',')
        .map(v=>v.trim())

        if(
          users.includes(member.name)
        ){

          member.contracts += 1

          totalContracts++

          const total = Number(
            String(
              contract.price || 0
            ).replace(/[^\d]/g,'')
          )

          const membersCount =
            users.length || 1

          const share =
            (total * 0.8)
            / membersCount

          member.income += share

          totalIncome += share

        }

      })

    })

    setMembers(updatedMembers)

    setStats(prev=>({
      ...prev,
      income:Math.floor(totalIncome),
      contracts:totalContracts
    }))

  },[contracts])

  const filteredMembers = members
    .filter(member=>

      filter === 'ALL'
        ? true
        : member.role === filter

    )
    .filter(member=>

      member.name
        ?.toLowerCase()
        .includes(search.toLowerCase())

    )

  const topMember = [...members]
    .sort((a,b)=>b.income-a.income)[0]

  return(

    <section className="team-page">

      <div className="team-header">

        <div>

          <span className="team-badge">
            GRIZZLY FAMILY
          </span>

          <h1>
            PREMIUM TEAM SYSTEM
          </h1>

          <p>
            Сильные лидеры. Верные соратники.
          </p>

        </div>

        <div className="team-stats">

          <div className="team-stat">
            <h3>{stats.members}</h3>
            <span>
              ВСЕГО УЧАСТНИКОВ
            </span>
          </div>

          <div className="team-stat">
            <h3>{stats.online}</h3>
            <span>
              ONLINE
            </span>
          </div>

          <div className="team-stat">
            <h3>
              ${stats.income.toLocaleString()}
            </h3>
            <span>
              ОБЩИЙ ДОХОД
            </span>
          </div>

          <div className="team-stat">
            <h3>{stats.contracts}</h3>
            <span>
              КОНТРАКТОВ
            </span>
          </div>

        </div>

      </div>

      {topMember && (

        <div className="top-earner">

          <div>

            <span>
              TOP EARNER
            </span>

            <h2>
              {topMember.name}
            </h2>

          </div>

          <strong>
            ${Math.floor(
              topMember.income
            ).toLocaleString()}
          </strong>

        </div>

      )}

      <div className="team-controls">

        <div className="tabs">

          <button
            className={
              filter === 'ALL'
                ? 'active'
                : ''
            }
            onClick={()=>
              setFilter('ALL')
            }
          >
            ВСЕ
          </button>

          <button
            className={
              filter === 'ЛИДЕР'
                ? 'active'
                : ''
            }
            onClick={()=>
              setFilter('ЛИДЕР')
            }
          >
            ЛИДЕРЫ
          </button>

          <button
            className={
              filter === 'ЗАМЕСТИТЕЛЬ'
                ? 'active'
                : ''
            }
            onClick={()=>
              setFilter('ЗАМЕСТИТЕЛЬ')
            }
          >
            ЗАМЫ
          </button>

          <button
            className={
              filter === 'ВЕТЕРАН'
                ? 'active'
                : ''
            }
            onClick={()=>
              setFilter('ВЕТЕРАН')
            }
          >
            ВЕТЕРАНЫ
          </button>

        </div>

        <div className="search-row">

          <input
            placeholder="Поиск участника..."
            value={search}
            onChange={(e)=>
              setSearch(e.target.value)
            }
          />

        </div>

      </div>

      <div className="members-grid">

        {filteredMembers.map((member,index)=>(

          <div
            className="member-panel"
            key={index}
          >

            <div className="member-overlay"></div>

            <div className="member-glow"></div>

            <div className="member-content">

              <div className="avatar-wrapper">

                <img
                  src={
                    member.avatar ||
                    'https://cdn.discordapp.com/embed/avatars/0.png'
                  }
                  alt=""
                  className="member-avatar"
                />

className={
  member.online
    ? 'status-dot status-online'
    : 'status-dot status-offline'
} />

              </div>

              <h3>
                {member.name}
              </h3>

              <span className="member-role">
                {member.role}
              </span>

              <div className="member-level">
                LEVEL {member.level}
              </div>

              <div className="member-stats-box">

                <div>

                  <strong>
                    {member.contracts}
                  </strong>

                  <span>
                    Контрактов
                  </span>

                </div>

                <div>

                  <strong>
                    ${Math.floor(
                      member.income
                    ).toLocaleString()}
                  </strong>

                  <span>
                    Заработано
                  </span>

                </div>

              </div>

              <div
  className={
    member.status === 'В СЕТИ'
      ? 'team-online'
      : 'team-offline'
  }
>
  {member.status}
</div>

</div>

</div>

))}

      </div>

    </section>

  )

}
