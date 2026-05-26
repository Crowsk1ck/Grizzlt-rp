export default function Sidebar(){
  return(
    <aside className="sidebar">
      <h1>GRIZZLY</h1>

      <nav>
        <button className="active">Dashboard</button>
        <button>Contracts</button>
        <button>Team</button>
        <button>Gallery</button>
        <button>Apply</button>
        <button>Admin</button>
      </nav>
    </aside>
  )
}