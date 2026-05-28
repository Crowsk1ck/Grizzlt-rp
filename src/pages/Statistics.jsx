import '../styles/statistics.css'

export default function Statistics(){

  const stats = [

    {
      title:'ОБЩИЙ ДОХОД',
      value:'$2.5M'
    },

    {
      title:'КОНТРАКТОВ',
      value:'1247'
    },

    {
      title:'ONLINE',
      value:'48'
    },

    {
      title:'УСПЕШНОСТЬ',
      value:'98%'
    }

  ]

  return(

    <div className="statistics-page">

      <div className="statistics-header">

        <div className="statistics-badge">
          GRIZZLY ANALYTICS
        </div>

        <h1>
          LIVE
          <br/>
          <span>STATISTICS</span>
        </h1>

      </div>

      <div className="statistics-grid">

        {stats.map((item,index)=>(

          <div
            className="statistics-card"
            key={index}
          >

            <h3>
              {item.value}
            </h3>

            <span>
              {item.title}
            </span>

          </div>

        ))}

      </div>

      <div className="statistics-chart">

        <div className="chart-line"></div>

        <div className="chart-line second"></div>

        <div className="chart-line third"></div>

      </div>

    </div>

  )

}
