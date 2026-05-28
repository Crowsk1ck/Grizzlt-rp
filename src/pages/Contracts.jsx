import { useEffect, useMemo, useState } from 'react'
import '../styles/contracts.css'
import {
  db,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from '../services/firebase/firebase'

import {
  sendWebhook,
  contractsWebhook
} from '../services/webhooks/discord'

export default function Contracts(){

  const [contracts,setContracts] = useState([])

  const [form,setForm] = useState({
    name:'',
    price:'',
    owner:'',
    members:''
  })

  const [loading,setLoading] = useState(false)

  async function loadContracts(){
    try{
      const q = query(
        collection(db,'contracts'),
        orderBy('createdAt','desc')
      )

      const snapshot = await getDocs(q)

      const data = snapshot.docs.map(docItem=>({
        id:docItem.id,
        ...docItem.data()
      }))

      setContracts(data)
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    loadContracts()
  },[])

  async function handleCreateContract(){

    if(
      !form.name ||
      !form.price ||
      !form.owner
    ){
      return alert('Заполни все поля')
    }

    try{
      setLoading(true)

      const contractData = {
        name:form.name,
        price:form.price,
        owner:form.owner,
        members:form.members,
        date:new Date().toLocaleDateString(),
        createdAt:Date.now()
      }

      await addDoc(
        collection(db,'contracts'),
        contractData
      )

      await sendWebhook(
        contractsWebhook,
        {
embeds:[
  {
    color:0xff005c,

    author:{
      name:'GRIZZLY FAMILY',
      icon_url:''
    },

    title:'📦 НОВЫЙ КОНТРАКТ',

    description:
`>>> 💼 **Контракт:** \`${form.name}\`

💰 **Сумма:** \`${Number(form.price).toLocaleString()}$\`

👑 **Создатель:** \`${form.owner}\`

👥 **Участники:**
${form.members
  .split(',')
  .map(m=>`• ${m.trim()}`)
  .join('\n')}
`,

    thumbnail:{
      url:'https://i.imgur.com/7F9Z6vC.png'
    },

    image:{
      url:''
    },

    footer:{
      text:'Grizzly Family System'
    },

    timestamp:new Date()
  }
]
        }
      )

      setForm({
        name:'',
        price:'',
        owner:'',
        members:''
      })

      await loadContracts()

    }catch(error){
      console.error(error)
    }finally{
      setLoading(false)
    }
  }

  async function handleDelete(id){

    try{

      await deleteDoc(
        doc(db,'contracts',id)
      )

      await loadContracts()

    }catch(error){
      console.error(error)
    }
  }

  const participantsCount = useMemo(()=>{
    if(!form.members) return 0

    return form.members
      .split(',')
      .filter(Boolean)
      .length
  },[form.members])

  const totalIncome = useMemo(()=>{
    return contracts.reduce((acc,item)=>{
      const value = Number(
        String(item.price)
          .replace(/[^0-9]/g,'')
      )

      return acc + value
    },0)
  },[contracts])

  return(
    <section className="contracts-page">

      <div className="contracts-header">
        <div>
          <h1>КОНТРАКТЫ</h1>
          <p>Управление контрактами семьи.</p>
        </div>
      </div>

      <div className="contracts-layout">

        <div className="contract-form-panel">
          <h2>ДОБАВИТЬ КОНТРАКТ</h2>

          <input
            placeholder="Название контракта"
            value={form.name}
            onChange={(e)=>
              setForm({
                ...form,
                name:e.target.value
              })
            }
          />

          <input
            placeholder="Сумма ($)"
            value={form.price}
            onChange={(e)=>
              setForm({
                ...form,
                price:e.target.value
              })
            }
          />

          <input
            placeholder="Кто начал контракт"
            value={form.owner}
            onChange={(e)=>
              setForm({
                ...form,
                owner:e.target.value
              })
            }
          />

          <textarea
            placeholder="Участники (через запятую)"
            value={form.members}
            onChange={(e)=>
              setForm({
                ...form,
                members:e.target.value
              })
            }
          ></textarea>

          <span className="participants-count">
            Количество участников: {participantsCount}
          </span>

          <button
            className="contract-submit-btn"
            onClick={handleCreateContract}
            disabled={loading}
          >
            {
              loading
              ? 'СОЗДАНИЕ...'
              : 'ДОБАВИТЬ КОНТРАКТ'
            }
          </button>
        </div>

        <div className="contracts-table-panel">

          <div className="table-top">
            <h2>СПИСОК КОНТРАКТОВ</h2>
          </div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>НАЗВАНИЕ</th>
                <th>СУММА</th>
                <th>КТО НАЧАЛ</th>
                <th>УЧАСТНИКИ</th>
                <th>ДАТА</th>
                <th>ДЕЙСТВИЯ</th>
              </tr>
            </thead>

            <tbody>
              {
                contracts.map((contract,index)=>(
                  <tr key={contract.id}>
                    <td>{index + 1}</td>
                    <td>{contract.name}</td>
                    <td>{contract.price}</td>
                    <td>{contract.owner}</td>
                    <td>{contract.members}</td>
                    <td>{contract.date}</td>
                    <td>
                      <span
                        className="delete-btn"
                        onClick={()=>
                          handleDelete(contract.id)
                        }
                      >
                        🗑
                      </span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

        </div>

      </div>

      <div className="contracts-stats">

        <div className="contract-stat-card">
          <span>КОНТРАКТОВ</span>
          <h3>{contracts.length}</h3>
        </div>

        <div className="contract-stat-card green">
          <span>ОБЩИЙ ДОХОД</span>
          <h3>
            ${totalIncome.toLocaleString()}
          </h3>
        </div>

      </div>

    </section>
  )
}
