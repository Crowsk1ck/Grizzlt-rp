import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return(
    <aside className="sidebar">
      <div className="brand">
        <h1>GRIZZLY</h1>
        <span>FAMILY</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/">ГЛАВНАЯ</NavLink>
        <NavLink to="/contracts">КОНТРАКТЫ</NavLink>
        <NavLink to="/team">КОМАНДА</NavLink>
        <NavLink to="/wars">ВОЙНЫ</NavLink>
        <NavLink to="/economy">ЭКОНОМИКА</NavLink>
        <NavLink to="/admin">АДМИН</NavLink>
      </nav>

      <div className="family-status">
        <div className="status-title">GRIZZLY FAMILY</div>
        <div className="status-online">ONLINE: 48</div>
      </div>
    </aside>
  )
}