import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return(
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-glow"></div>
        <h1>GRIZZLY</h1>
        <p>Cyberpunk RP Platform</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/contracts">Contracts</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </aside>
  )
}