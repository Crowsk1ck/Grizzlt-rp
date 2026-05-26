export default function Layout({ children }){

  return(
    <div className="app-shell">

      <aside className="sidebar">

        <div className="logo-block">
          <h1>GRIZZLY</h1>
          <span>FAMILY</span>
        </div>

        <nav className="sidebar-nav">
          <button className="active">Главная</button>
          <button>Команда</button>
          <button>Контракты</button>
          <button>Статистика</button>
          <button>Галерея</button>
          <button>Настройки</button>
        </nav>

      </aside>

      <main className="main-content">
        {children}
      </main>

    </div>
  )
}
