export default function Team(){
  const members = [
    'Owner',
    'Deputy',
    'Main Fighter',
    'Contract Manager'
  ]

  return(
    <>
      <h1 className="text-5xl font-black text-red-500 mb-8">
        TEAM
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {members.map((member,index)=>(
          <div key={index} className="card text-center">
            <div className="w-24 h-24 rounded-full bg-red-500/20 mx-auto mb-4"></div>

            <h2 className="text-2xl font-bold">
              {member}
            </h2>
          </div>
        ))}
      </div>
    </>
  )
}