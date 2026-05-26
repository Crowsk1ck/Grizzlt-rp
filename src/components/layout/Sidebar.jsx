import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return(
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-glow"></div>
        <h1>GRIZZLY</h1>
        <p>Realtime RP Ecosystem</p>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/contracts">Contracts</NavLink>
        <NavLink to="/team">Team</NavLink>
        <NavLink to="/wars">Wars</NavLink>
        <NavLink to="/economy">Economy</NavLink>
        <NavLink to="/admin">Admin</NavLink>
      </nav>
    </aside>
  )
}