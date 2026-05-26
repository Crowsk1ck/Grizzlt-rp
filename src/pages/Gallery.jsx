export default function Gallery(){
  return(
    <section className="panel">
      <div className="section-header">
        <h2>Gallery Storage</h2>

        <button className="primary-btn">
          Upload Media
        </button>
      </div>

      <div className="gallery-grid">
        <div className="gallery-item"></div>
        <div className="gallery-item"></div>
        <div className="gallery-item"></div>
        <div className="gallery-item"></div>
        <div className="gallery-item"></div>
        <div className="gallery-item"></div>
      </div>
    </section>
  )
}