import '../styles/admin.css'

export default function Admin(){

  const actions = [

    {
      title:'Добавить участника',
      action:'addMember'
    },

    {
      title:'Удалить участника',
      action:'deleteMember'
    },

    {
      title:'Выдать контракт',
      action:'addContract'
    },

    {
      title:'Обновить статистику',
      action:'updateStats'
    },

    {
      title:'Очистить логи',
      action:'clearLogs'
    }

  ]

  function handleAdminAction(type){

    if(type === 'addMember'){

      alert(
        'Система добавления участника скоро будет подключена'
      )

    }

    if(type === 'deleteMember'){

      alert(
        'Система удаления участника скоро будет подключена'
      )

    }

    if(type === 'addContract'){

      alert(
        'Система контрактов скоро будет подключена'
      )

    }

    if(type === 'updateStats'){

      alert(
        'Статистика обновлена'
      )

    }

    if(type === 'clearLogs'){

      alert(
        'Логи очищены'
      )

    }

  }

  const logs = [

    'cr0wsk1ck выдал контракт',
    'Shadow получил повышение',
    'Nightmare обновил статистику',
    'Добавлен новый участник',
    'Система синхронизирована'

  ]

  return(

    <div className="admin-page">

      <div className="admin-header">

        <div className="admin-badge">
          ADMIN PANEL
        </div>

        <h1>
          SYSTEM
          <br/>
          <span>CONTROL</span>
        </h1>

        <p>
          Управление премиальной GTA RP системой.
        </p>

      </div>

      <div className="admin-grid">

        <div className="admin-actions">

          <h2>
            БЫСТРЫЕ ДЕЙСТВИЯ
          </h2>

          <div className="actions-list">

            {actions.map((item,index)=>(

              <button
                key={index}
                className="action-btn"
                onClick={()=>
                  handleAdminAction(
                    item.action
                  )
                }
              >

                {item.title}

              </button>

            ))}

          </div>

        </div>

        <div className="admin-stats">

          <div className="admin-stat-card">

            <h3>
              86
            </h3>

            <span>
              УЧАСТНИКОВ
            </span>

          </div>

          <div className="admin-stat-card">

            <h3>
              48
            </h3>

            <span>
              ONLINE
            </span>

          </div>

          <div className="admin-stat-card">

            <h3>
              1247
            </h3>

            <span>
              КОНТРАКТОВ
            </span>

          </div>

          <div className="admin-stat-card">

            <h3>
              $2.5M
            </h3>

            <span>
              ДОХОД
            </span>

          </div>

        </div>

      </div>

      <div className="admin-logs">

        <h2>
          ПОСЛЕДНИЕ ДЕЙСТВИЯ
        </h2>

        <div className="logs-list">

          {logs.map((item,index)=>(

            <div
              className="log-item"
              key={index}
            >

              <div className="log-dot"></div>

              <span>
                {item}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  )

}
