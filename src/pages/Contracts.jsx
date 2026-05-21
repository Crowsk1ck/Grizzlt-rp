export default function Contracts(){
  const contracts = [
    'Bank Heist',
    'Secret Delivery',
    'Weapon Smuggling',
    'Territory Control'
  ]

  return(
    <>
      <h1 className="text-5xl font-black text-red-500 mb-8">
        CONTRACTS
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {contracts.map((contract,index)=>(
          <div key={index} className="card">
            <h2 className="text-2xl font-bold mb-3">
              {contract}
            </h2>

            <div className="bg-black/40 rounded-xl p-3">
              Status: ACTIVE
            </div>
          </div>
        ))}
      </div>
    </>
  )
}