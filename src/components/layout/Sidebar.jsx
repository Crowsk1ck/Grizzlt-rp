import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return(
    <aside className="sidebar">
      <div className="brand">
        <h1>GRIZZLY</h1>
        <p>Cyberpunk RP Ecosystem</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/contracts">Contracts</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/apply">Apply</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </aside>
  )
}