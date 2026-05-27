import { useEffect, useState } from 'react'

import {
  db,
  collection,
  getDocs
} from '../services/firebase/firebase'

export default function Members(){

  const [members,setMembers] = useState([])

  useEffect(()=>{

    loadMembers()

  },[])

  async function loadMembers(){

    try{

      const snapshot = await getDocs(
        collection(db,'discord_members')
      )

      const data = snapshot.docs.map(doc=>({

        id:doc.id,
        ...doc.data(),

        contracts:0,
        income:0

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

    }

  }

  return(

    <section className="members-page">

      <div className="members-header">

        <h1>
          MEMBER MANAGER
        </h1>

        <p>
          Управление участниками семьи
        </p>

      </div>

      <div className="members-grid">

        {members.map(member=>(

          <div
            className="member-card"
            key={member.id}
          >

            <img
              src={member.avatar}
              alt=""
            />

            <h2>
              {member.username}
            </h2>

            <span className={
              member.online
                ? 'online'
                : 'offline'
            }>
              {
                member.online
                  ? 'ONLINE'
                  : 'OFFLINE'
              }
            </span>

            <div className="member-stats">

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
                  $
                  {Math.floor(
                    member.income
                  ).toLocaleString()}
                </strong>

                <p>
                  Доход
                </p>

              </div>

            </div>

            <div className="member-actions">

              <button>
                PROFILE
              </button>

              <button>
                ADMIN
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>

  )

}
