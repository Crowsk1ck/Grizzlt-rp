import { useEffect, useMemo, useState } from 'react'

import {
  db,
  collection,
  getDocs
} from '../services/firebase/firebase'

export default function Members(){

  const [members,setMembers] = useState([])
  const [search,setSearch] = useState('')
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    loadMembers()

  },[])

  async function loadMembers(){

    try{

      setLoading(true)

      const snapshot = await getDocs(
        collection(db,'discord_members')
      )

      const data = snapshot.docs.map(doc=>({

        id:doc.id,
        ...doc.data(),

        contracts:0,
        income:0,
        level:Math.floor(Math.random()*50)+1,
        xp:Math.floor(Math.random()*100),
        role:'GRIZZLY MEMBER'

      }))

      const contractsSnapshot = await getDocs(
        collection(db,'contracts')
      )

      const contracts = contractsSnapshot.docs.map(doc=>(
        doc.data()
      ))

      data.forEach(member=>{

        contracts.forEach(contract=>{

          const users = String(
            contract.members || ''
          )
          .split(',')
          .map(v=>v.trim())

          if(
            users.includes(member.username)
          ){

            member.contracts += 1

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

          }

        })

      })

      setMembers(data)

    }catch(error){

      console.error(error)

    }finally{

      setLoading(false)

    }

  }

  const filteredMembers = useMemo(()=>{

    return members.filter(member=>
      member.username
      ?.toLowerCase()
      .includes(search.toLowerCase())
    )

  },[members,search])

  const totalIncome = members.reduce((acc,item)=>{
    return acc + item.income
  },0)

  const onlineMembers = members.filter(member=>
    member.online
  ).length

  return(

    <section className="premium-members-page">

      <div className="premium-members-top">

        <div>

          <span className="members-badge">
            GRIZZLY FAMILY
          </span>

          <h1>
            PREMIUM MEMBER SYSTEM
          </h1>

          <p>
            Управление составом семьи GTA RP
          </p>

        </div>

        <div className="members-search">

          <input
            type="text"
            placeholder="Поиск участника..."
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />

        </div>

      </div>

      <div className="members-stats-grid">

        <div className="premium-stat-card">

          <span>
            ВСЕГО УЧАСТНИКОВ
          </span>

          <h2>
            {members.length}
          </h2>

        </div>

        <div className="premium-stat-card">

          <span>
            ONLINE
          </span>

          <h2>
            {onlineMembers}
          </h2>

        </div>

        <div className="premium-stat-card">

          <span>
            ОБЩИЙ ДОХОД
          </span>

          <h2>
            ${Math.floor(totalIncome).toLocaleString()}
          </h2>

        </div>

      </div>

      {
        loading
          ? (
            <div className="members-loading">
              LOADING MEMBERS...
            </div>
          )
          : (
            <div className="premium-members-grid">

              {filteredMembers.map(member=>(

                <div
                  className="premium-member-card"
                  key={member.id}
                >

                  <div className="member-card-glow" />

                  <div className="member-avatar-wrapper">

                    <img
                      src={member.avatar}
                      alt=""
                      className="member-avatar"
                    />

                    <span className={
                      member.online
                        ? 'member-status online'
                        : 'member-status offline'
                    } />

                  </div>

                  <div className="member-info">

                    <h2>
                      {member.username}
                    </h2>

                    <p>
                      {member.role}
                    </p>

                  </div>

                  <div className="member-level">

                    <div className="level-top">

                      <span>
                        LEVEL {member.level}
                      </span>

                      <span>
                        {member.xp}%
                      </span>

                    </div>

                    <div className="xp-bar">

                      <div
                        className="xp-fill"
                        style={{
                          width:`${member.xp}%`
                        }}
                      />

                    </div>

                  </div>

                  <div className="premium-member-stats">

                    <div>

                      <strong>
                        {member.contracts}
                      </strong>

                      <p>
                        Контрактов
                      </p>

                    </div>

                    <div>

                      <strong>
                        ${Math.floor(member.income).toLocaleString()}
                      </strong>

                      <p>
                        Доход
                      </p>

                    </div>

                  </div>

                  <div className="premium-member-actions">

                    <button>
                      PROFILE
                    </button>

                    <button>
                      ADMIN PANEL
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )
      }

    </section>

  )

}
