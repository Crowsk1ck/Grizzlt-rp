export default function Admin(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Admin Control Center</h2>

        <button className="primary-btn">
          Manage Platform
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Members</h3>
          <span>148</span>
        </div>

        <div className="card">
          <h3>Pending Reports</h3>
          <span>6</span>
        </div>

        <div className="card">
          <h3>Open Tickets</h3>
          <span>11</span>
        </div>
      </div>
    </section>
  )
}