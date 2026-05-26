export default function Layout({ children }){

  return(
    <div className="app-shell">

      <aside className="sidebar">

        <div className="logo-block">
          <h1>GRIZZLY</h1>
          <span>FAMILY</span>
        </div>

        <nav className="sidebar-nav">
          <a className="active">Главная</a>
          <a>Команда</a>
          <a>Контракты</a>
          <a>Статистика</a>
          <a>Галерея</a>
          <a>Настройки</a>
        </nav>

      </aside>

      <main className="main-content">
        {children}
      </main>

    </div>
  )
}