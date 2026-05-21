export default function Dashboard(){
  return(
    <>
      <h1 className="text-8xl font-black text-red-500 hero mb-6">
        GTA 6 RP
      </h1>

      <p className="text-2xl text-zinc-300 mb-12 max-w-3xl">
        Ultimate cinematic GTA RP experience with particles, smoke,
        neon effects and animated HUD.
      </p>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <div className="glass rounded-[32px] p-6 neon">
          <div className="text-zinc-400 mb-2">ONLINE PLAYERS</div>
          <div className="text-5xl font-black text-red-500">147</div>
        </div>

        <div className="glass rounded-[32px] p-6 neon">
          <div className="text-zinc-400 mb-2">FAMILY BALANCE</div>
          <div className="text-4xl font-black text-red-500">$52M</div>
        </div>

        <div className="glass rounded-[32px] p-6 neon">
          <div className="text-zinc-400 mb-2">ACTIVE WARS</div>
          <div className="text-5xl font-black text-red-500">6</div>
        </div>

        <div className="glass rounded-[32px] p-6 neon">
          <div className="text-zinc-400 mb-2">GLOBAL RANK</div>
          <div className="text-4xl font-black text-red-500">TOP 3</div>
        </div>

      </div>

      <div className="glass rounded-[40px] p-10 neon">
        <h2 className="text-5xl font-black text-red-500 hero mb-6">
          LIVE GTA HUD
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-black/40 rounded-3xl p-6">
            🔥 Territory Assault
          </div>

          <div className="bg-black/40 rounded-3xl p-6">
            💰 Bank Mission
          </div>

          <div className="bg-black/40 rounded-3xl p-6">
            ⚔ Gang War Started
          </div>

        </div>
      </div>
    </>
  )
}