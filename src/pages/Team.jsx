import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase/firebase'

import '../styles/team.css'

export default function Team(){

  const [members,setMembers] = useState([])

  const [search,setSearch] = useState('')

  const [filter,setFilter] = useState('all')

  useEffect(()=>{

    const unsub = onSnapshot(

      collection(db,'discord_members'),

      (snapshot)=>{

        const arr = []

        snapshot.forEach((doc)=>{

          arr.push({
            id:doc.id,
            ...doc.data()
          })

        })

        setMembers(arr)
      }

    )

    return ()=>unsub()

  },[])

  const filteredMembers = members.filter((member)=>{

    const matchSearch =
      member.username
        ?.toLowerCase()
        .includes(search.toLowerCase())

const LEADER_ROLE = '1390073606481907895'
const DEPUTY_ROLE = '1390074547864207534'

const matchRole =

  filter === 'all'

  ? true

  : filter === 'leader'

  ? member.roles?.includes(LEADER_ROLE)

  : filter === 'deputy'

  ? member.roles?.includes(DEPUTY_ROLE)

  : !member.roles?.includes(LEADER_ROLE) &&
    !member.roles?.includes(DEPUTY_ROLE)

    return matchSearch && matchRole

  })

  const totalIncome = members.reduce(

    (acc,member)=>

      acc + Number(member.earned || 0),

    0
  )

  const onlineMembers = members.filter(

    (m)=>m.online

  ).length

  return(

    <div className="team-page">

      <div className="team-top">

        <div className="team-hero">

          <div className="team-badge">
            GRIZZLY FAMILY
          </div>

          <h1>
            PREMIUM
            <br/>
            <span>TEAM SYSTEM</span>
          </h1>

          <p>
            Сильные лидеры.
            Верные соратники.
            Премиальная система семьи GTA RP.
          </p>

        </div>

        <div className="team-stats">

          <div className="team-stat">
            <h3>{members.length}</h3>
            <span>ВСЕГО УЧАСТНИКОВ</span>
          </div>

          <div className="team-stat">
            <h3>{onlineMembers}</h3>
            <span>ONLINE</span>
          </div>

          <div className="team-stat">
            <h3>${totalIncome}</h3>
            <span>ОБЩИЙ ДОХОД</span>
          </div>

          <div className="team-stat">
            <h3>0</h3>
            <span>КОНТРАКТОВ</span>
          </div>

        </div>

      </div>

      <div className="team-controls">

        <div className="team-tabs">

          <button
            className={
              filter === 'all'
              ? 'active'
              : ''
            }
            onClick={()=>setFilter('all')}
          >
            ВСЕ
          </button>

          <button
            className={
              filter === 'leader'
              ? 'active'
              : ''
            }
            onClick={()=>setFilter('leader')}
          >
            ЛИДЕРЫ
          </button>

          <button
            className={
              filter === 'deputy'
              ? 'active'
              : ''
            }
            onClick={()=>setFilter('deputy')}
          >
            ЗАМЫ
          </button>

          <button
            className={
              filter === 'member'
              ? 'active'
              : ''
            }
            onClick={()=>setFilter('member')}
          >
            УЧАСТНИКИ
          </button>

        </div>

        <input
          type="text"
          className="team-search"
          placeholder="Поиск участника..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
        />

      </div>

      <div className="members-grid">

        {filteredMembers.map((member)=>(

          <div
            className="member-card"
            key={member.id}
          >

            <div
              className={
                member.online
                ? 'member-status online'
                : 'member-status offline'
              }
            />

            <div className="member-top">

              <img
                src={
                  member.avatar ||
                  'https://i.imgur.com/6VBx3io.png'
                }
                alt=""
                className="member-avatar"
              />

              <div className="member-info">

                <h3>
                  {member.username}
                </h3>

                <div className="member-role">

                  {
                    member.roles?.includes(LEADER_ROLE)
                    ? 'ЛИДЕР'

                    : member.roles?.includes(DEPUTY_ROLE)
                    ? 'ЗАМЕСТИТЕЛЬ'

                    : 'УЧАСТНИК'
                  }

                </div>

              </div>

            </div>

            <div className="member-stats">

              <div className="member-box">

                <strong>
                  LEVEL {Math.floor(Math.random()*50)+1}
                </strong>

                <span>
                  УРОВЕНЬ
                </span>

              </div>

              <div className="member-box">

                <strong>
                  {Math.floor(Math.random()*120)}
                </strong>

                <span>
                  КОНТРАКТОВ
                </span>

              </div>

              <div className="member-box">

                <strong>
                  ${Math.floor(Math.random()*900000)}
                </strong>

                <span>
                  ЗАРАБОТАНО
                </span>

              </div>

              <div className="member-box">

                <strong>
                  {
                    member.online
                    ? 'ONLINE'
                    : 'OFFLINE'
                  }
                </strong>

                <span>
                  СТАТУС
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}
