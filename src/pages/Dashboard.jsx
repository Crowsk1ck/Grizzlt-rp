export default function Dashboard(){
  return(
    <section className="dashboard-grid">
      <div className="card">
        <h3>Contracts Completed</h3>
        <span>824</span>
      </div>

      <div className="card">
        <h3>Members Online</h3>
        <span>48</span>
      </div>

      <div className="card">
        <h3>Family Income</h3>
        <span>$8.2M</span>
      </div>

      <div className="panel wide-panel">
        <h2>Realtime Activity Feed</h2>

        <div className="activity-feed">
          <div className="activity-item">Ghost completed contract "Weapon Delivery"</div>
          <div className="activity-item">Blade uploaded gallery screenshot</div>
          <div className="activity-item">Venom joined Family War</div>
          <div className="activity-item">New application approved</div>
        </div>
      </div>
    </section>
  )
}