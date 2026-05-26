const contracts = [
  { name:'Business Raid', status:'Completed', reward:'$120,000' },
  { name:'Weapon Delivery', status:'In Progress', reward:'$54,000' },
  { name:'VIP Escort', status:'Pending', reward:'$22,000' }
]

export default function Contracts(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Contracts 4.0</h2>

        <button className="primary-btn">
          Create Contract
        </button>
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