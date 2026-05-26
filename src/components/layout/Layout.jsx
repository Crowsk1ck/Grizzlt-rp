import { NavLink } from 'react-router-dom'

export default function Layout({ children }){

  return(
    <div className="app-shell">

      <aside className="sidebar">

        <div className="logo-block">
          <h1>GRIZZLY</h1>
          <span>FAMILY</span>
        </div>

        <nav className="sidebar-nav">

          <NavLink to="/">Главная</NavLink>

          <NavLink to="/team">Команда</NavLink>

          <NavLink to="/contracts">Контракты</NavLink>

          <NavLink to="/stats">Статистика</NavLink>

          <NavLink to="/gallery">Галерея</NavLink>

          <NavLink to="/settings">Настройки</NavLink>

        </nav>

      </aside>

      <main className="main-content">
        {children}
      </main>

    </div>
  )
}