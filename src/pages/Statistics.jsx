import { useEffect, useState } from 'react'

import {
  collection,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase/firebase'

import '../styles/statistics.css'

export default function Statistics(){

  const [contracts,setContracts] = useState([])

  useEffect(()=>{

    const unsub = onSnapshot(

      collection(db,'contracts'),

      (snapshot)=>{

        const data = snapshot.docs.map(doc=>({

          id:doc.id,

          ...doc.data()

        }))

        setContracts(data)

      }

    )

    return ()=>unsub()

  },[])

  const totalIncome = contracts.reduce(

    (sum,contract)=>{

      const price = parseInt(

        String(contract.price || 0)
          .replace(/[^\d]/g,'')

      ) || 0

      return sum + price

    },

    0

  )

  const membersSet = new Set()

  contracts.forEach(contract=>{

    if(!contract.members) return

    contract.members
      .split(',')
      .forEach(member=>
        membersSet.add(
          member.trim()
        )
      )

  })

  const averageIncome =

    contracts.length > 0

      ? Math.floor(
          totalIncome /
          contracts.length
        )

      : 0

  const stats = [

    {
      title:'ОБЩИЙ ДОХОД',
      value:`$${totalIncome.toLocaleString()}`
    },

    {
      title:'КОНТРАКТОВ',
      value:contracts.length
    },

    {
      title:'УЧАСТНИКОВ',
      value:membersSet.size
    },

    {
      title:'СРЕДНИЙ ДОХОД',
      value:`$${averageIncome.toLocaleString()}`
    }

  ]

  return(

    <div className="statistics-page">

      <div className="statistics-header">

        <div className="statistics-badge">
          GRIZZLY ANALYTICS
        </div>

        <h1>
          LIVE
          <br/>
          <span>STATISTICS</span>
        </h1>

      </div>

      <div className="statistics-grid">

        {stats.map((item,index)=>(

          <div
            className="statistics-card"
            key={index}
          >

            <h3>
              {item.value}
            </h3>

            <span>
              {item.title}
            </span>

          </div>

        ))}

      </div>
const moneyMap = {}

contracts.forEach(contract=>{

  const total = parseInt(

    String(contract.price || 0)
      .replace(/[^\d]/g,'')

  ) || 0

  const members = contract.members
    ? contract.members
        .split(',')
        .map(m=>m.trim())
    : []

  const share =
    members.length > 0
      ? total / members.length
      : 0

  members.forEach(member=>{

    if(!moneyMap[member]){

      moneyMap[member] = 0

    }

    moneyMap[member] += share

  })

})

const topMoney =

  Object.entries(moneyMap)

    .sort((a,b)=>b[1]-a[1])

    .slice(0,5)
      <div className="statistics-top">

  <h2>
    ТОП ПО ДОХОДУ
  </h2>

  {topMoney.map(

    ([name,money],index)=>(

      <div
        className="statistics-user"
        key={index}
      >

        <span>

          #{index+1}
          {' '}
          {name}

        </span>

        <span>

          $
          {Math.floor(money)
            .toLocaleString()
          }

        </span>

      </div>

    )

  )}

</div>
      <div className="statistics-chart">

        <div className="chart-line"></div>

        <div className="chart-line second"></div>

        <div className="chart-line third"></div>

      </div>

    </div>

  )

}
