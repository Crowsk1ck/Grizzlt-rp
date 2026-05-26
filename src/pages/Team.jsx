const members = [
  'Ghost',
  'Rico',
  'Blade',
  'Viper'
]

export default function Team(){
  return(
    <section className="panel">
      <h2>Family Team</h2>

      <div className="team-grid">
        {members.map((m,index)=>(
          <div className="member-card" key={index}>
            <div className="avatar"></div>
            <h3>{m}</h3>
            <p>Online</p>
          </div>
        ))}
      </div>
    </section>
  )
}