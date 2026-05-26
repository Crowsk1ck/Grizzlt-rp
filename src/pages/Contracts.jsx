const contracts = [
  {name:'Weapon Delivery', status:'Completed', reward:'$52,000'},
  {name:'Business Raid', status:'In Progress', reward:'$112,000'},
  {name:'VIP Escort', status:'Pending', reward:'$24,000'}
]

export default function Contracts(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Contracts 3.0</h2>

        <button className="primary-btn">
          New Contract
        </button>
      </div>

      <div className="search-box">
        <input placeholder="Search contracts..." />
      </div>

      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Status</th>
            <th>Reward</th>
          </tr>
        </thead>

        <tbody>
          {contracts.map((contract,index)=>(
            <tr key={index}>
              <td>{contract.name}</td>
              <td>{contract.status}</td>
              <td>{contract.reward}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}