export default function Contracts(){

  const contracts = [
    {
      name:'Поставка оружия',
      price:'$250,000',
      owner:'cr0wsk1ck',
      members:'cr0wsk1ck, Shadow, Blaze',
      date:'25.08.2025'
    },
    {
      name:'Захват банка',
      price:'$100,000',
      owner:'Shadow',
      members:'Shadow, Mugiwara, Hokage',
      date:'24.08.2025'
    },
    {
      name:'Ограбление бизнеса',
      price:'$100,000',
      owner:'Mugiwara',
      members:'Mugiwara, Exotic',
      date:'24.08.2025'
    },
    {
      name:'Поставка материалов',
      price:'$200,000',
      owner:'Nightmare',
      members:'Nightmare, Young, Killa',
      date:'23.08.2025'
    }
  ]

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

          <input placeholder="Название контракта" />
          <input placeholder="Сумма ($)" />
          <input placeholder="Кто начал контракт" />

          <textarea
            placeholder="Участники (через запятую)"
          ></textarea>

          <span className="participants-count">
            Количество участников: 0
          </span>

          <button className="primary-btn full-btn">
            ДОБАВИТЬ КОНТРАКТ
          </button>
        </div>

        <div className="contracts-table-panel">
          <div className="table-top">
            <h2>СПИСОК КОНТРАКТОВ</h2>

            <button className="secondary-btn">
              ОЧИСТИТЬ ПАНЕЛЬ
            </button>
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
              {contracts.map((contract,index)=>(
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{contract.name}</td>
                  <td>{contract.price}</td>
                  <td>{contract.owner}</td>
                  <td>{contract.members}</td>
                  <td>{contract.date}</td>
                  <td>
                    <span className="delete-btn">🗑</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <div className="contracts-stats">

        <div className="contract-stat-card">
          <span>КОНТРАКТОВ</span>
          <h3>1247</h3>
        </div>

        <div className="contract-stat-card green">
          <span>ОБЩИЙ ДОХОД</span>
          <h3>$2,540,000</h3>
        </div>

        <div className="contract-stat-card pink">
          <span>РАСХОДЫ</span>
          <h3>$720,000</h3>
        </div>

        <div className="contract-stat-card green">
          <span>ЧИСТЫЙ ДОХОД</span>
          <h3>$1,820,000</h3>
        </div>

      </div>

    </section>
  )
}