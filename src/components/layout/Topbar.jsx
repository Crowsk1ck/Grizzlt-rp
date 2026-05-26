export default function Topbar(){
  return(
    <header className="topbar">
      <div>
        <h2>GRIZZLY FAMILY SYSTEM</h2>
        <p>Premium Cyberpunk GTA RP Platform</p>
      </div>

      <div className="topbar-actions">
        <div className="notification-dot"></div>

        <button className="neon-btn">
          Discord Connected
        </button>
      </div>
    </header>
  )
}