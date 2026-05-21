const top = [
  ['Owner','$12,000,000'],
  ['Deputy','$8,500,000'],
  ['Sniper','$6,100,000']
]

export default function Leaderboard(){
  return(
    <>
      <h1 className="text-5xl font-black text-red-500 mb-8">
        FAMILY RANKING
      </h1>

      <div className="space-y-4">
        {top.map((p,i)=>(
          <div key={i} className="card flex justify-between">
            <span>#{i+1} {p[0]}</span>
            <span>{p[1]}</span>
          </div>
        ))}
      </div>
    </>
  )
}