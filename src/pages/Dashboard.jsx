export default function Dashboard(){
  return(
    <section className="dashboard-grid">
      <div className="card">
        <h3>Total Contracts</h3>
        <span>412</span>
      </div>

      <div className="card">
        <h3>Family Online</h3>
        <span>38</span>
      </div>

      <div className="card">
        <h3>Monthly Income</h3>
        <span>$3.7M</span>
      </div>

      <div className="panel large-panel">
        <h2>Live Activity Feed</h2>

        <div className="activity-list">
          <div className="activity-item">Ghost completed Family Contract</div>
          <div className="activity-item">Blade uploaded Gallery Media</div>
          <div className="activity-item">New Family Application Submitted</div>
          <div className="activity-item">Admin approved new member</div>
        </div>
      </div>
    </section>
  )
}