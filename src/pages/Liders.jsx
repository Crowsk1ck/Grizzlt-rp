import { useEffect, useState } from 'react'
import {
  db,
  collection,
  getDocs
} from '../services/firebase/firebase'

export default function Liders(){

  const [contracts,setContracts] = useState([])

  useEffect(()=>{

    loadContracts()

  },[])

  async function loadContracts(){

    try{

      const snapshot = await getDocs(
        collection(db,'contracts')
      )

      const data = snapshot.docs.map(doc=>({
        id:doc.id,
        ...doc.data()
      }))

      setContracts(data)

    }catch(error){

      console.error(error)

    }

  }

  const moneyMap = {}
  const contractsMap = {}

  contracts.forEach(contract=>{

    const total = parseInt(
      String(contract.price || 0).replace(/[^\d]/g,'')
    ) || 0

    const remaining = total * 0.8

    const members = contract.members
      ? contract.members.split(',').map(m=>m.trim())
      : []

    const share =
      members.length > 0
        ? remaining / members.length
        : 0

    members.forEach(member=>{

      if(!moneyMap[member]){
        moneyMap[member] = 0
      }

      if(!contractsMap[member]){
        contractsMap[member] = 0
      }

      moneyMap[member] += share
      contractsMap[member] += 1

    })

  })

  const topMoney = Object.entries(moneyMap)
    .sort((a,b)=>b[1]-a[1])

  const topContracts = Object.entries(contractsMap)
    .sort((a,b)=>b[1]-a[1])

  return(

    <section className="leaders-page">

      <div className="leaders-header">

        <h1>ЛИДЕРЫ</h1>

        <p>
          Лучшие участники семьи
        </p>

      </div>

      <div className="leaders-grid">

        <div className="leader-card">

          <h3>ТОП ПО ДЕНЬГАМ</h3>

          {topMoney.map(([name,money],index)=>(

            <div className="leader-user" key={index}>

              <span>{name}</span>

              <span>
                ${Math.floor(money).toLocaleString()}
              </span>

            </div>

          ))}

        </div>

        <div className="leader-card">

          <h3>ТОП ПО КОНТРАКТАМ</h3>

          {topContracts.map(([name,count],index)=>(

            <div className="leader-user" key={index}>

              <span>{name}</span>

              <span>
                {count}
              </span>

            </div>

          ))}

        </div>

      </div>

    </section>

  )

}
