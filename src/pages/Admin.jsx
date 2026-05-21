export default function Admin(){
  return(
    <>
      <h1 className="text-5xl font-black text-red-500 mb-8">
        LIVE ADMIN SYSTEM
      </h1>

      <div className="grid lg:grid-cols-2 gap-6">

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            ADMIN PERMISSIONS
          </h2>

          <div className="space-y-3">
            <div className="bg-black/40 p-3 rounded-xl">
              Manage Contracts
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Ban Players
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Economy Access
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-3xl font-bold mb-4">
            DISCORD BOT LOGS
          </h2>

          <div className="space-y-3">
            <div className="bg-black/40 p-3 rounded-xl">
              Player connected
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Donation received
            </div>

            <div className="bg-black/40 p-3 rounded-xl">
              Contract updated
            </div>
          </div>
        </div>

      </div>
    </>
  )
}