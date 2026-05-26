export default function Admin(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Admin Control Panel</h2>

        <button className="primary-btn">
          Manage Users
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Members</h3>
          <span>92</span>
        </div>

        <div className="card">
          <h3>Applications</h3>
          <span>16</span>
        </div>

        <div className="card">
          <h3>Open Contracts</h3>
          <span>8</span>
        </div>
      </div>
    </section>
  )
}