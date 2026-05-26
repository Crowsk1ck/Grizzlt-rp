export default function Dashboard(){
  return(
    <section className="dashboard-grid">
      <div className="card">
        <h3>Total Contracts</h3>
        <span>248</span>
      </div>

      <div className="card">
        <h3>Online Members</h3>
        <span>34</span>
      </div>

      <div className="card">
        <h3>Monthly Income</h3>
        <span>$2.4M</span>
      </div>

      <div className="panel large-panel">
        <h2>Live Activity Feed</h2>

        <div className="activity">
          <p>Ghost completed a contract</p>
          <p>Blade joined family war</p>
          <p>Rico uploaded screenshots</p>
          <p>New application received</p>
        </div>
      </div>
    </section>
  )
}