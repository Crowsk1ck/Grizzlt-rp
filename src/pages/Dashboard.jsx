export default function Dashboard(){
  return(
    <section className="dashboard-grid">
      <div className="card">
        <h3>Total Revenue</h3>
        <span>$12.8M</span>
      </div>

      <div className="card">
        <h3>Active Contracts</h3>
        <span>24</span>
      </div>

      <div className="card">
        <h3>Online Members</h3>
        <span>52</span>
      </div>

      <div className="panel wide-panel">
        <h2>Realtime Activity</h2>

        <div className="activity-feed">
          <div className="activity-item">Ghost finished a raid contract</div>
          <div className="activity-item">Rico approved an application</div>
          <div className="activity-item">Blade uploaded gallery media</div>
          <div className="activity-item">Venom joined a family event</div>
        </div>
      </div>
    </section>
  )
}