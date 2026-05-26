export default function Dashboard(){
  return(
    <>
      <section className="hero-panel">
        <span className="live-badge">LIVE REALTIME SYSTEM</span>

        <h1>Premium GTA RP Ecosystem</h1>

        <p>
          Realtime contracts, war analytics, economy tracking and advanced family management.
        </p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <span>$24.7M</span>
        </div>

        <div className="stat-card">
          <h3>Online Members</h3>
          <span>73</span>
        </div>

        <div className="stat-card">
          <h3>Family Rating</h3>
          <span>#2</span>
        </div>

        <div className="stat-card">
          <h3>Wars Won</h3>
          <span>48</span>
        </div>
      </section>

      <section className="dashboard-panels">
        <div className="glass-panel">
          <h2>Realtime Activity</h2>

          <div className="activity-list">
            <div className="activity-item">Ghost completed raid contract</div>
            <div className="activity-item">Blade uploaded war screenshots</div>
            <div className="activity-item">Venom joined family battle</div>
            <div className="activity-item">New member approved</div>
          </div>
        </div>

        <div className="glass-panel">
          <h2>Top Members</h2>

          <div className="top-member">Ghost — $2.4M</div>
          <div className="top-member">Blade — $1.7M</div>
          <div className="top-member">Venom — $1.3M</div>
        </div>
      </section>
    </>
  )
}