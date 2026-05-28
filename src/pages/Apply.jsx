import {
  useState
} from 'react'

import '../styles/apply.css'

export default function Apply(){

  const [form,setForm] =
    useState({

      nickname:'',
      age:'',
      discord:'',
      experience:'',
      about:''

    })

  const [loading,setLoading] =
    useState(false)

  async function sendApply(){

    if(
      !form.nickname ||
      !form.discord
    ) return

    setLoading(true)

    try{

      await fetch(

        'YOUR_DISCORD_WEBHOOK',

        {

          method:'POST',

          headers:{
            'Content-Type':'application/json'
          },

          body:JSON.stringify({

            embeds:[

              {

                title:'📨 НОВАЯ ЗАЯВКА',

                color:0xff0066,

                fields:[

                  {
                    name:'👤 НИК',
                    value:form.nickname
                  },

                  {
                    name:'🎂 ВОЗРАСТ',
                    value:form.age
                  },

                  {
                    name:'💬 DISCORD',
                    value:form.discord
                  },

                  {
                    name:'🎮 ОПЫТ',
                    value:form.experience
                  },

                  {
                    name:'📝 О СЕБЕ',
                    value:form.about
                  }

                ]

              }

            ]

          })

        }

      )

      alert(
        'Заявка отправлена'
      )

      setForm({

        nickname:'',
        age:'',
        discord:'',
        experience:'',
        about:''

      })

    }catch(error){

      console.log(error)

      alert(
        'Ошибка отправки'
      )

    }

    setLoading(false)

  }

  return(

    <div className="apply-page">

      <div className="apply-header">

        <div className="apply-badge">
          JOIN GRIZZLY
        </div>

        <h1>
          FAMILY
          <br/>
          <span>APPLICATION</span>
        </h1>

        <p>
          Подай заявку в элитную GTA RP семью.
        </p>

      </div>

      <div className="apply-card">

        <div className="apply-grid">

          <input
            type="text"
            placeholder="Ваш ник"
            value={form.nickname}
            onChange={(e)=>
              setForm({

                ...form,
                nickname:e.target.value

              })
            }
          />

          <input
            type="text"
            placeholder="Возраст"
            value={form.age}
            onChange={(e)=>
              setForm({

                ...form,
                age:e.target.value

              })
            }
          />

          <input
            type="text"
            placeholder="Discord"
            value={form.discord}
            onChange={(e)=>
              setForm({

                ...form,
                discord:e.target.value

              })
            }
          />

          <input
            type="text"
            placeholder="Опыт GTA RP"
            value={form.experience}
            onChange={(e)=>
              setForm({

                ...form,
                experience:e.target.value

              })
            }
          />

        </div>

        <textarea
          placeholder="Расскажите о себе"
          value={form.about}
          onChange={(e)=>
            setForm({

              ...form,
              about:e.target.value

            })
          }
        />

        <button
          className="apply-btn"
          onClick={sendApply}
        >

          {
            loading
            ? 'ОТПРАВКА...'
            : 'ОТПРАВИТЬ ЗАЯВКУ'
          }

        </button>

      </div>

    </div>

  )

}
