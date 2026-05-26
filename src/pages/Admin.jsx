export default function Admin(){
  return(
    <section className="panel">
      <h2>Admin Panel</h2>

      <div className="admin-grid">
        <div className="card">
          <h3>Total Members</h3>
          <span>89</span>
        </div>

        <div className="card">
          <h3>Monthly Income</h3>
          <span>$1.4M</span>
        </div>
      </div>
    </section>
  )
}