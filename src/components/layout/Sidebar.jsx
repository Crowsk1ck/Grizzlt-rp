import {
  NavLink,
  Link
} from 'react-router-dom'

export default function Sidebar({ isAdmin }){
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
        <NavLink to="/Liders">Лідери</NavLink>
        <NavLink to="/economy">ЭКОНОМИКА</NavLink>
        {
  isAdmin && (

    <Link to="/admin">
      ADMIN PANEL
    </Link>

  )
}
      </nav>

      <div className="family-status">
        <div className="status-title">GRIZZLY FAMILY</div>
        <div className="status-online">ONLINE:0</div>
      </div>
    </aside>
  )
}
