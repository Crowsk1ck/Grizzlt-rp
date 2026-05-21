const contracts = [
  'Bank Heist',
  'Weapon Delivery',
  'Gang Elimination',
  'Territory Control'
]

export default function Contracts(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 hero mb-10">
        CONTRACTS
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {contracts.map((item,index)=>(
          <div key={index} className="glass rounded-[32px] p-8">
            <h2 className="text-3xl font-black mb-4">{item}</h2>

            <div className="bg-black/40 rounded-2xl p-4">
              ACTIVE MISSION
            </div>
          </div>
        ))}
      </div>
    </>
  )
}