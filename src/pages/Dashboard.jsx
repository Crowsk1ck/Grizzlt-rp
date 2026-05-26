export default function Dashboard(){
  return(
    <section className="grid">
      <div className="card">
        <h3>Total Contracts</h3>
        <span>$412,000</span>
      </div>

      <div className="card">
        <h3>Family Online</h3>
        <span>32</span>
      </div>

      <div className="card large">
        <h3>Live Activity</h3>
        <ul>
          <li>Rico completed a contract</li>
          <li>Ghost joined family war</li>
          <li>Blade uploaded screenshots</li>
        </ul>
      </div>
    </section>
  )
}