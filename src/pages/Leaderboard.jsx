const top = [
  ['Owner','$12M'],
  ['Deputy','$8M'],
  ['Sniper','$6M']
]

export default function Leaderboard(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 hero mb-10">
        LEADERBOARD
      </h1>

      <div className="space-y-5">
        {top.map((p,i)=>(
          <div key={i} className="glass rounded-[28px] p-6 flex justify-between">
            <span>#{i+1} {p[0]}</span>
            <span>{p[1]}</span>
          </div>
        ))}
      </div>
    </>
  )
}