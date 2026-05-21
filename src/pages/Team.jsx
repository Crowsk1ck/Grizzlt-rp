export default function Team(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 hero mb-10">
        TEAM
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="glass rounded-[32px] p-8 text-center">
          OWNER
        </div>

        <div className="glass rounded-[32px] p-8 text-center">
          DEPUTY
        </div>

        <div className="glass rounded-[32px] p-8 text-center">
          FIGHTER
        </div>

      </div>
    </>
  )
}