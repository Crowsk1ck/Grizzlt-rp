export default function Contracts(){
  return(
    <section className="panel">
      <h2>Contracts System</h2>

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
            <td>$42,000</td>
          </tr>

          <tr>
            <td>VIP Escort</td>
            <td>In Progress</td>
            <td>$18,000</td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}