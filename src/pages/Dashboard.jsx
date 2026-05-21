export default function Dashboard(){
  return(
    <>
      <h1 className="text-8xl font-black text-red-500 hero mb-6">
        GTA 6 RP
      </h1>

      <p className="text-2xl text-zinc-300 mb-12 max-w-3xl">
        Premium cinematic GTA RP ecosystem with modern gaming UI.
      </p>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <div className="glass rounded-[32px] p-6">
          <div className="text-zinc-400 mb-2">ONLINE</div>
          <div className="text-5xl font-black text-red-500">147</div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <div className="text-zinc-400 mb-2">BALANCE</div>
          <div className="text-4xl font-black text-red-500">$52M</div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <div className="text-zinc-400 mb-2">WARS</div>
          <div className="text-5xl font-black text-red-500">6</div>
        </div>

        <div className="glass rounded-[32px] p-6">
          <div className="text-zinc-400 mb-2">RANK</div>
          <div className="text-4xl font-black text-red-500">TOP 3</div>
        </div>

      </div>
    </>
  )
}