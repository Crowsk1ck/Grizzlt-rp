const members = ['Ghost','Blade','Rico','Viper','Shadow','Venom']

export default function Team(){
  return(
    <section className="panel">
      <h2>Family Team</h2>

      <div className="team-grid">
        {members.map((member,index)=>(
          <div className="member-card" key={index}>
            <div className="avatar"></div>

            <h3>{member}</h3>
            <p>Online • Officer</p>

            <button className="primary-btn">
              View Profile
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}