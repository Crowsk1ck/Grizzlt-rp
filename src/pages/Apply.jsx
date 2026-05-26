export default function Apply(){
  return(
    <section className="panel">
      <h2>Apply Form</h2>

      <form className="apply-form">
        <input placeholder="Nickname"/>
        <input placeholder="Discord"/>
        <textarea placeholder="Tell us about yourself"></textarea>

        <button type="button" className="primary-btn">
          Send Application
        </button>
      </form>
    </section>
  )
}