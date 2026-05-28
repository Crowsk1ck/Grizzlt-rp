import '../styles/gallery.css'

export default function Gallery(){

  const galleryItems = [

    {
      title:'NIGHT LIFE',
      image:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
      likes:112,
      comments:19,
      days:'2 дня назад'
    },

    {
      title:'GANG EVENT',
      image:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop',
      likes:73,
      comments:11,
      days:'1 день назад'
    },

    {
      title:'CITY DRIVE',
      image:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
      likes:91,
      comments:24,
      days:'5 часов назад'
    },

    {
      title:'MEETING',
      image:'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop',
      likes:44,
      comments:8,
      days:'3 дня назад'
    },

    {
      title:'FAMILY WAR',
      image:'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop',
      likes:128,
      comments:41,
      days:'7 часов назад'
    },

    {
      title:'PREMIUM RP',
      image:'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop',
      likes:62,
      comments:14,
      days:'4 дня назад'
    }

  ]

  return(

    <div className="gallery-page">

      <div className="gallery-header">

        <div className="gallery-badge">
          GRIZZLY MEDIA
        </div>

        <h1>
          PREMIUM
          <br/>
          <span>GALLERY</span>
        </h1>

        <p>
          Лучшие моменты семьи GTA RP.
        </p>

      </div>

      <div className="gallery-grid">

        {galleryItems.map((item,index)=>(

          <div
            className="gallery-card"
            key={index}
          >

            <img
              src={item.image}
              alt=""
            />

            <div className="gallery-overlay"></div>

            <div className="gallery-content">

              <div className="gallery-tag">
                {item.title}
              </div>

              <div className="gallery-stats">

                <span>
                  ❤ {item.likes}
                </span>

                <span>
                  💬 {item.comments}
                </span>

              </div>

              <small>
                {item.days}
              </small>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}
