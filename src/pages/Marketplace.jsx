const items = [
  'Rare Weapon',
  'Premium Car',
  'Armor Pack'
]

export default function Marketplace(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 hero mb-10">
        MARKETPLACE
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {items.map((item,index)=>(
          <div key={index} className="glass rounded-[32px] p-8">
            🛒 {item}
          </div>
        ))}
      </div>
    </>
  )
}