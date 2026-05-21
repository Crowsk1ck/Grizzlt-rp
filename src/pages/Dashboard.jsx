export default function Dashboard(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 mb-8">
        GRIZZLY FAMILY
      </h1>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <div className="card">
          👥 Online Players: 147
        </div>

        <div className="card">
          💰 Family Balance: $52,000,000
        </div>

        <div className="card">
          ⚔ Active Wars: 6
        </div>

        <div className="card">
          🏆 TOP RP FAMILY
        </div>

      </div>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            LIVE CONTRACTS
          </h2>

          <div className="space-y-3">
            <div className="bg-black/40 p-3 rounded-xl">
              Bank Heist
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Territory Attack
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              VIP Delivery
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            FAMILY ACTIVITY
          </h2>

          <div className="space-y-3">
            <div className="bg-black/40 p-3 rounded-xl">
              New player joined
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Contract completed
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Territory captured
            </div>
          </div>
        </div>

      </div>
    </>
  )
}