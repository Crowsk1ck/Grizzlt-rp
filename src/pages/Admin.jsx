export default function Admin(){
  return(
    <section className="panel">
      <h2>Admin Panel</h2>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Total Members</h3>
          <span>92</span>
        </div>

        <div className="card">
          <h3>Applications</h3>
          <span>16</span>
        </div>
      </div>
    </section>
  )
}