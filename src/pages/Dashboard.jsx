export default function Dashboard(){
  return(
    <>
      <section className="hero-panel">
        <div>
          <span className="badge">LIVE SYSTEM</span>
          <h1>Premium Cyberpunk GTA RP Platform</h1>
          <p>Realtime contracts, analytics and family ecosystem.</p>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <span>$18.2M</span>
        </div>

        <div className="stat-card">
          <h3>Members Online</h3>
          <span>61</span>
        </div>

        <div className="stat-card">
          <h3>Contracts</h3>
          <span>1428</span>
        </div>
      </section>

      <section className="widgets-grid">
        <div className="glass-panel">
          <h2>Realtime Activity</h2>

          <div className="activity">
            <div>Ghost completed Weapon Delivery</div>
            <div>Blade uploaded gallery media</div>
            <div>Venom started Family War</div>
            <div>New application approved</div>
          </div>
        </div>

        <div className="glass-panel">
          <h2>Top Members</h2>

          <div className="top-member">Ghost — $1.2M</div>
          <div className="top-member">Blade — $980K</div>
          <div className="top-member">Venom — $712K</div>
        </div>
      </section>
    </>
  )
}