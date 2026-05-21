const cars = [
  'BMW M5',
  'Audi RS7',
  'Nissan GTR'
]

export default function Garage(){
  return(
    <>
      <h1 className="text-6xl font-black text-red-500 hero mb-10">
        GARAGE
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {cars.map((car,index)=>(
          <div key={index} className="glass rounded-[32px] p-8">
            🚗 {car}
          </div>
        ))}
      </div>
    </>
  )
}