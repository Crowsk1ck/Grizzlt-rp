export default function Contracts(){
  return(
    <section className="glass-panel">
      <div className="section-header">
        <h2>Contracts System 6.0</h2>

        <button className="neon-btn">
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
          <tr>
            <td>Weapon Delivery</td>
            <td>Completed</td>
            <td>$82,000</td>
          </tr>

          <tr>
            <td>Business Raid</td>
            <td>In Progress</td>
            <td>$160,000</td>
          </tr>

          <tr>
            <td>VIP Escort</td>
            <td>Pending</td>
            <td>$36,000</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}