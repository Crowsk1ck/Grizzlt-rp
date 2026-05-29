import '../styles/dashboard.css'

import {
  useEffect,
  useState
} from 'react'

import {
  collection,
  getDocs
} from 'firebase/firestore'

import {
  db
} from '../services/firebase/firebase'

export default function Dashboard(){

const LOGIN_URL =
'https://discord.com/oauth2/authorize?client_id=1508833507894624399&response_type=token&redirect_uri=https%3A%2F%2Fwww.grizzly-family.online%2F&scope=identify'

const isAuth =
  !!localStorage.getItem(
    'discord_token'
  )
  
  const [members,setMembers] =
    useState([])

  const [contracts,setContracts] =
    useState([])

  useEffect(()=>{

    async function loadData(){

      try{

        const membersSnap =
          await getDocs(
            collection(
              db,
              'discord_members'
            )
          )

        const membersData =
          membersSnap.docs.map(doc=>({

            id:doc.id,
            ...doc.data()

          }))

        setMembers(
          membersData
        )

        const contractsSnap =
          await getDocs(
            collection(
              db,
              'contracts'
            )
          )

        const contractsData =
          contractsSnap.docs.map(doc=>({

            id:doc.id,
            ...doc.data()

          }))

        setContracts(
          contractsData
        )

      }catch(error){

        console.log(error)

      }

    }

    loadData()

  },[])

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

  {

!isAuth ? (
  <a href={LOGIN_URL} className="join-btn">
    ВОЙТИ DISCORD
  </a>
)

    ) : (

      <a
        href="https://discord.gg/"
        target="_blank"
        rel="noreferrer"
        className="join-btn"
      >
        DISCORD
      </a>

    )

  }

  <button className="rules-btn">
    ПРАВИЛА
  </button>

</div>

        </div>

        <div className="dashboard-right">

          <div className="hero-card">

            <h3>

              {
                members.filter(
                  member=>member.online
                ).length
              }

            </h3>

            <span>
              ONLINE
            </span>

          </div>

          <div className="hero-card">

            <h3>

              {
                contracts.length
              }

            </h3>

            <span>
              КОНТРАКТОВ
            </span>

          </div>

          <div className="hero-card">

            <h3>
              {

    '$' +

    contracts.reduce(

      (total,contract)=>

        total +

        Number(
          contract.price || 0
        ),

      0

    ).toLocaleString()

  }
            </h3>

            <span>
              ОБЩИЙ ДОХОД
            </span>

          </div>

          <div className="hero-card">

            <h3>

              {
                members.length
              }

            </h3>

            <span>
              УЧАСТНИКОВ
            </span>

          </div>

        </div>

      </section>

      <section className="dashboard-grid">

        <div className="dashboard-card about-card">

          <h2>
            О НАС
          </h2>

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

          <h2>
            АКТИВНОСТЬ
          </h2>

          <div className="activity-list">

            {activity.map((item,index)=>(

              <div
                className="activity-item"
                key={index}
              >

                <div className="activity-dot"></div>

                <span>
                  {item}
                </span>

              </div>

            ))}

          </div>

        </div>

        <div className="dashboard-card top-card">

          <h2>
            ТОП УЧАСТНИКОВ
          </h2>

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
