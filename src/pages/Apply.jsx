export default function Apply(){
  return(
    <section className="panel">
      <h2>Family Application</h2>

      <form className="apply-form">
        <input placeholder="Nickname" />
        <input placeholder="Discord Username" />
        <input placeholder="Age" />
        <textarea placeholder="Tell us about yourself"></textarea>

        <button type="button" className="primary-btn">
          Submit Application
        </button>
      </form>
    </section>
  )
}