export default function Contracts(){
  return(
    <section className="glass-panel">
      <div className="header-row">
        <h2>Contracts 5.0</h2>

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
            <td>$52,000</td>
          </tr>

          <tr>
            <td>Business Raid</td>
            <td>In Progress</td>
            <td>$120,000</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}