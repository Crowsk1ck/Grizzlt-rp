const items = [
  'Heavy Sniper',
  'Armor x25',
  'Ammo x500',
  'Medkit x12'
]

export default function Inventory(){
  return(
    <>
      <h1 className="text-5xl font-black text-red-500 mb-8">
        INVENTORY SYSTEM
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item,index)=>(
          <div key={index} className="card">
            📦 {item}
          </div>
        ))}
      </div>
    </>
  )
}