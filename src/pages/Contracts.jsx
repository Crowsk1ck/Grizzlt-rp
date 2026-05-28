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

  async function createContract(){

    if(
      !form.title ||
      !form.client ||
      !form.price
    ) return

    await addDoc(

      collection(db,'contracts'),

      {

        ...form,

        createdAt:Date.now()

      }

    )

    setForm({

      title:'',
      client:'',
      price:'',
      members:''

    })

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

            <h3>
              {contracts.length}
            </h3>

            <span>
              ВСЕГО КОНТРАКТОВ
            </span>

          </div>

          <div className="contracts-stat">

            <h3>
              $
              {totalIncome.toLocaleString()}
            </h3>

            <span>
              ОБЩИЙ ДОХОД
            </span>

          </div>

          <div className="contracts-stat">

            <h3>24</h3>

            <span>
              АКТИВНЫХ
            </span>

          </div>

          <div className="contracts-stat">

            <h3>98%</h3>

            <span>
              УСПЕШНОСТЬ
            </span>

          </div>

        </div>

      </div>

      <div className="contracts-layout">

        <div className="contracts-form-card">

          <h2>
            СОЗДАТЬ КОНТРАКТ
          </h2>

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
            placeholder="Клиент"
            value={form.client}
            onChange={(e)=>
              setForm({
                ...form,
                client:e.target.value
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

          <textarea
            placeholder="Участники"
            value={form.members}
            onChange={(e)=>
              setForm({
                ...form,
                members:e.target.value
              })
            }
          />

          <button
            onClick={createContract}
          >
            СОЗДАТЬ
          </button>

        </div>

        <div className="contracts-table-card">

          <div className="contracts-table-header">

            <h2>
              АКТИВНЫЕ КОНТРАКТЫ
            </h2>

          </div>

          <div className="contracts-table">

            {contracts.map((contract)=>(

              <div
                className="contract-row"
                key={contract.id}
              >

                <div className="contract-info">

                  <h3>
                    {contract.title}
                  </h3>

                  <span>
                    {contract.client}
                  </span>

                </div>

                <div className="contract-members">

                  {
                    contract.members ||
                    '—'
                  }

                </div>

                <div className="contract-price">

                  {contract.price}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  )

}
