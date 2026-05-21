export default function Dashboard(){
  return(
    <>
      <h1 className="text-8xl font-black text-red-500 hero mb-6">
        GTA 6 RP
      </h1>

      <div className="grid lg:grid-cols-4 gap-6 mb-10">

        <div className="glass rounded-[32px] p-6">
          ONLINE: 147
        </div>

        <div className="glass rounded-[32px] p-6">
          BALANCE: $52M
        </div>

        <div className="glass rounded-[32px] p-6">
          ACTIVE WARS: 6
        </div>

        <div className="glass rounded-[32px] p-6">
          TOP 3 FAMILY
        </div>

      </div>
    </>
  )
}