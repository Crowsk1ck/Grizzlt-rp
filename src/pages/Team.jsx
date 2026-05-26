const members = ['Ghost','Blade','Rico','Shadow','Venom','Reaper']

export default function Team(){
  return(
    <section className="panel">
      <h2>Family Profiles</h2>

      <div className="team-grid">
        {members.map((member,index)=>(
          <div className="member-card" key={index}>
            <div className="avatar"></div>

            <h3>{member}</h3>
            <p>Officer • Online</p>

            <button className="primary-btn">
              Open Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}