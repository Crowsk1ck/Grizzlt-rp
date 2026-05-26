const contracts = [
  {name:'Bank Raid', status:'Completed', money:'$85,000'},
  {name:'Weapon Delivery', status:'In Progress', money:'$22,000'},
  {name:'VIP Escort', status:'Pending', money:'$14,000'}
]

export default function Contracts(){
  return(
    <section className="panel">
      <h2>Contracts System</h2>

      <table>
        <thead>
          <tr>
            <th>Contract</th>
            <th>Status</th>
            <th>Earnings</th>
          </tr>
        </thead>

        <tbody>
          {contracts.map((c,index)=>(
            <tr key={index}>
              <td>{c.name}</td>
              <td>{c.status}</td>
              <td>{c.money}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}