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

  const topMoney = Object.entries(
    contracts.reduce((acc, contract) => {

      const total = parseInt(
        String(
          contract.price ||
          contract.amount ||
          0
        ).replace(/[^\d]/g,'')
      ) || 0

      const remaining = total * 0.8

      const members = contract.members
        ? contract.members.split(',').map(m=>m.trim())
        : []

      const share = members.length
        ? remaining / members.length
        : 0

      members.forEach(member => {

        if(!acc[member]){
          acc[member] = 0
        }

        acc[member] += share

      })

      return acc

    },{})
  )
  .sort((a,b)=>b[1]-a[1])
  .slice(0,10)

  const topContracts = Object.entries(
    contracts.reduce((acc, contract) => {

      const members = contract.members
        ? contract.members.split(',').map(m=>m.trim())
        : []

      members.forEach(member => {

        if(!acc[member]){
          acc[member] = 0
        }

        acc[member] += 1

      })

      return acc

    },{})
  )
  .sort((a,b)=>b[1]-a[1])
  .slice(0,10)

 return (

  <section className="leaders-page">

    <div className="leaders-header">
      <h1>ЛИДЕРЫ</h1>
      <p>Лучшие участники семьи</p>
    </div>

    <div className="leaders-grid">

      <div className="leader-card">

        <h3>ТОП ПО ДЕНЬГАМ</h3>

        {topMoney.length > 0 ? (

          topMoney.map(([name,money],index)=>(

            <div className="leader-user" key={index}>
              <span>{name}</span>

              <span>
                ${Math.floor(money).toLocaleString()}
              </span>
            </div>

          ))

        ) : (

          <div className="leader-user">
            Нет данных
          </div>

        )}

      </div>

      <div className="leader-card">

        <h3>ТОП ПО КОНТРАКТАМ</h3>

        {topContracts.length > 0 ? (

          topContracts.map(([name,count],index)=>(

            <div className="leader-user" key={index}>
              <span>{name}</span>
              <span>{count}</span>
            </div>

          ))

        ) : (

          <div className="leader-user">
            Нет данных
          </div>

        )}

      </div>

    </div>

  </section>

)

}
