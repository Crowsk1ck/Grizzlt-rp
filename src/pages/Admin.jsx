import { useEffect, useState } from 'react'

import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc
} from '../services/firebase/firebase'

export default function Admin(){

  const [contracts,setContracts] = useState([])
  const [search,setSearch] = useState('')

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

  async function deleteContract(id){

    const confirmDelete = confirm(
      'Удалить контракт?'
    )

    if(!confirmDelete) return

    try{

      await deleteDoc(
        doc(db,'contracts',id)
      )

      setContracts(prev=>
        prev.filter(item=>item.id !== id)
      )

    }catch(error){

      console.error(error)

    }

  }

  const totalIncome = contracts.reduce((acc,item)=>{

    const value = parseInt(
      String(item.price || 0)
        .replace(/[^\d]/g,'')
    ) || 0

    return acc + value

  },0)

  const filteredContracts = contracts.filter(contract=>

    contract.name
      ?.toLowerCase()
      .includes(search.toLowerCase())

  )

  return(

    <section className="admin-page">

      <div className="admin-header">

        <div>
          <h1>ADMIN PANEL</h1>

          <p>
            Управление системой Grizzly
          </p>
        </div>

        <input
          type="text"
          placeholder="Поиск контрактов..."
          value={search}
          onChange={(e)=>
            setSearch(e.target.value)
          }
          className="admin-search"
        />

      </div>

      <div className="admin-stats">

        <div className="admin-stat">

          <span>КОНТРАКТОВ</span>

          <h2>
            {contracts.length}
          </h2>

        </div>

        <div className="admin-stat">

          <span>ОБЩИЙ ДОХОД</span>

          <h2>
            ${totalIncome.toLocaleString()}
          </h2>

        </div>

      </div>

      <div className="admin-table">

        <div className="admin-table-head">

          <span>Контракт</span>
          <span>Сумма</span>
          <span>Создатель</span>
          <span>Участники</span>
          <span>Удалить</span>

        </div>

        {filteredContracts.map(contract=>(

          <div
            className="admin-row"
            key={contract.id}
          >

            <span>
              {contract.name}
            </span>

            <span>
              {contract.price}
            </span>

            <span>
              {contract.owner}
            </span>

            <span>
              {contract.members}
            </span>

            <button
              className="delete-btn"
              onClick={()=>
                deleteContract(contract.id)
              }
            >
              DELETE
            </button>

          </div>

        ))}

      </div>

    </section>

  )

}
