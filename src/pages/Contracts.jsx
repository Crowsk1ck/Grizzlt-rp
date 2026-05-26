const contracts = [
  {name:'Weapon Delivery', status:'Completed', reward:'$42,000'},
  {name:'VIP Escort', status:'In Progress', reward:'$18,000'},
  {name:'Family Protection', status:'Pending', reward:'$27,000'}
]

export default function Contracts(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Contracts System</h2>

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