export default function Admin(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Admin Ecosystem</h2>

        <button className="primary-btn">
          Manage Platform
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Members</h3>
          <span>124</span>
        </div>

        <div className="card">
          <h3>Applications Queue</h3>
          <span>14</span>
        </div>

        <div className="card">
          <h3>Open Contracts</h3>
          <span>11</span>
        </div>
      </div>
    </section>
  )
}