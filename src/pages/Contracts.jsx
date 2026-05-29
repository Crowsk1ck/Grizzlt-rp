import { useEffect, useState } from 'react'

import {
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore'

import { db } from '../services/firebase/firebase'

import '../styles/contracts.css'

export default function Contracts(){

  const [contracts,setContracts] = useState([])
  const [members,setMembers] = useState([])
  const [selectedMembers,setSelectedMembers] = useState([])

  const [form,setForm] = useState({
    title:'',
    client:'',
    price:'',
    members:''
  })

  useEffect(()=>{

    const unsub = onSnapshot(

      collection(db,'contracts'),

      (snapshot)=>{

        const arr = []

        snapshot.forEach((doc)=>{

          arr.push({
            id:doc.id,
            ...doc.data()
          })

        })

        setContracts(arr)

      }

    )

    return ()=>unsub()

  },[])

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

  async function createContract(){

    if(
      !form.title ||
      !form.price
    ){
      alert('Заполните все поля')
      return
    }

    if(
      selectedMembers.length === 0
    ){
      alert('Выберите участников')
      return
    }

    try{

      await addDoc(

        collection(
          db,
          'contracts'
        ),

        {

          title: form.title,
          price: form.price,
          members: selectedMembers.join(', '),
          createdAt: Date.now()

        }

      )

      setSelectedMembers([])

      setForm({

        title:'',
        price:'',
        members:''

      })

    }catch(error){

      console.log(error)

      alert(
        'Ошибка создания контракта'
      )

    }

  }

  const totalIncome = contracts.reduce(

    (acc,item)=>

      acc +
      Number(
        String(item.price)
          .replace(/[^\d]/g,'')
      ),

    0

  )

  return(

    <div className="contracts-page">

      <div className="contracts-top">

        <div className="contracts-hero">

          <div className="contracts-badge">
            GRIZZLY CONTRACTS
          </div>

          <h1>
            PREMIUM
            <br/>
            <span>CONTRACTS</span>
          </h1>

          <p>
            Управление контрактами семьи.
            Доходы. Выплаты. Контроль операций.
          </p>

        </div>

        <div className="contracts-stats">

          <div className="contracts-stat">
            <h3>{contracts.length}</h3>
            <span>ВСЕГО КОНТРАКТОВ</span>
          </div>

          <div className="contracts-stat">
            <h3>${totalIncome.toLocaleString()}</h3>
            <span>ОБЩИЙ ДОХОД</span>
          </div>

          <div className="contracts-stat">
            <h3>24</h3>
            <span>АКТИВНЫХ</span>
          </div>

          <div className="contracts-stat">
            <h3>98%</h3>
            <span>УСПЕШНОСТЬ</span>
          </div>

        </div>

      </div>

      <div className="contracts-layout">

        <div className="contracts-form-card">

          <h2>СОЗДАТЬ КОНТРАКТ</h2>

          <input
            type="text"
            placeholder="Название"
            value={form.title}
            onChange={(e)=>
              setForm({
                ...form,
                title:e.target.value
              })
            }
          />

          <input
            type="text"
            placeholder="Сумма"
            value={form.price}
            onChange={(e)=>
              setForm({
                ...form,
                price:e.target.value
              })
            }
          />

<div className="members-picker">

  {members.map(member => {

    const name =
      member.nickname ||
      member.username

    const selected =
      selectedMembers.includes(name)

    return (

      <div
        key={member.id}
        className={
          selected
            ? 'member-item selected'
            : 'member-item'
        }
        onClick={() => {

          if(selected){

            setSelectedMembers(

              selectedMembers.filter(
                item => item !== name
              )

            )

          }else{

            setSelectedMembers([
              ...selectedMembers,
              name
            ])

          }

        }}
      >

        {name}

      </div>

    )

  })}

</div>

          <button onClick={createContract}>
            СОЗДАТЬ
          </button>

        </div>

        <div className="contracts-table-card">

          <div className="contracts-table-header">
            <h2>АКТИВНЫЕ КОНТРАКТЫ</h2>
          </div>

          <div className="contracts-table">

            {contracts.map((contract)=>(

              <div
                className="contract-row"
                key={contract.id}
              >

                <div className="contract-info">

  <span className="contract-label">
    НАЗВАНИЕ
  </span>

  <h3>
    {contract.title}
  </h3>

</div>

<div className="contract-members">

  <span className="contract-label">
    УЧАСТНИКИ
  </span>

  <div className="contract-members-list">

    {(contract.members || '')
      .split(',')
      .slice(0,5)
      .map((name,index)=>(

        <span key={index}>
          {name.trim()}
        </span>

      ))
    }
</div>
                </div>
<div className="contract-price">

  <span className="contract-label">
    СУММА
  </span>

  <h3>
    ${contract.price}
  </h3>

</div>

              </div>

            ))}

          </div>

        </div>

      </div>
</div>
  )

}
