import { useEffect, useState } from 'react'

import {
  db,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from '../services/firebase/firebase'
import '../styles/admin.css'
export default function Admin(){

  const [contracts,setContracts] = useState([])
  const [search,setSearch] = useState('')
  const [tab,setTab] = useState('contracts')
  const [discordMembers,setDiscordMembers] = useState([])

  const [editing,setEditing] = useState(null)

  const [form,setForm] = useState({
    name:'',
    price:'',
    owner:'',
    members:''
  })

  useEffect(()=>{

    loadContracts()
    
    loadDiscordMembers()

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
async function loadDiscordMembers(){

  try{

    const snapshot = await getDocs(
      collection(db,'discord_members')
    )

    const data = snapshot.docs.map(doc=>({
      id:doc.id,
      ...doc.data()
    }))

    setDiscordMembers(data)

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

  async function saveEdit(){

    try{

      await updateDoc(

        doc(db,'contracts',editing),

        {
          name:form.name,
          price:form.price,
          owner:form.owner,
          members:form.members
        }

      )

      setContracts(prev=>

        prev.map(item=>

          item.id === editing

            ? {
                ...item,
                ...form
              }

            : item

        )

      )

      setEditing(null)

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

      <div className="admin-tabs">

        <button
          className={
            tab === 'contracts'
              ? 'active-tab'
              : ''
          }
          onClick={()=>
            setTab('contracts')
          }
        >
          CONTRACTS
        </button>

        <button
          className={
            tab === 'members'
              ? 'active-tab'
              : ''
          }
          onClick={()=>
            setTab('members')
          }
        >
          MEMBERS
        </button>

        <button
          className={
            tab === 'analytics'
              ? 'active-tab'
              : ''
          }
          onClick={()=>
            setTab('analytics')
          }
        >
          ANALYTICS
        </button>

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

      {tab === 'contracts' && (

  <div className="admin-table">

    <div className="admin-table-head">

      <span>Контракт</span>
      <span>Сумма</span>
      <span>Создатель</span>
      <span>Участники</span>
      <span>Удалить</span>
      <span>Редактировать</span>

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

        <button
          className="edit-btn"
          onClick={()=>{

            setEditing(contract.id)

            setForm({
              name:contract.name || '',
              price:contract.price || '',
              owner:contract.owner || '',
              members:contract.members || ''
            })

          }}
        >
          EDIT
        </button>

      </div>

    ))}

  </div>

)}

{tab === 'members' && (

  <div className="members-admin-grid">

    {discordMembers.map((member,index)=>(

      <div
        className="member-admin-card"
        key={index}
      >

        <img
          src={member.avatar}
          alt=""
          className="member-avatar"
        />

        <h2>
          {member.username}
        </h2>

        <p>

          {

            member.online
              ? '🟢 ONLINE'
              : '🔴 OFFLINE'

          }

        </p>

        <div className="member-card-bottom">

          <button className="profile-btn">

            PROFILE

          </button>

          <div className="member-row-buttons">

            <button className="admin-btn">

              ADMIN

            </button>

            <button className="ban-btn">

              BAN

            </button>

          </div>

        </div>

      </div>

    ))}

  </div>

)}

{tab === 'analytics' && (

  <div className="analytics-box">

    <h2>
      ANALYTICS SYSTEM
    </h2>

    <p>
      Soon...
    </p>

  </div>

)}
      {editing && (

        <div className="modal-overlay">

          <div className="edit-modal">

            <h2>EDIT CONTRACT</h2>

            <input
              value={form.name}
              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value
                })
              }
              placeholder="Название"
            />

            <input
              value={form.price}
              onChange={(e)=>
                setForm({
                  ...form,
                  price:e.target.value
                })
              }
              placeholder="Сумма"
            />

            <input
              value={form.owner}
              onChange={(e)=>
                setForm({
                  ...form,
                  owner:e.target.value
                })
              }
              placeholder="Создатель"
            />

            <textarea
              value={form.members}
              onChange={(e)=>
                setForm({
                  ...form,
                  members:e.target.value
                })
              }
              placeholder="Участники"
            />

            <div className="modal-buttons">

              <button
                className="save-btn"
                onClick={saveEdit}
              >
                SAVE
              </button>

              <button
                className="close-btn"
                onClick={()=>
                  setEditing(null)
                }
              >
                CLOSE
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  )

}
