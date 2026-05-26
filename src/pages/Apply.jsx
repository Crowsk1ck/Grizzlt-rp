export default function Apply(){
  return(
    <section className="panel">
      <h2>Join GRIZZLY Family</h2>

      <form className="apply-form">
        <input placeholder="Nickname" />
        <input placeholder="Discord Username" />
        <input placeholder="Age" />

        <textarea placeholder="Tell us why you want to join the family"></textarea>

        <button type="button" className="primary-btn">
          Send Application
        </button>
      </form>
    </section>
  )
}