export default function Apply(){
  return(
    <section className="panel">
      <h2>Apply Form</h2>

      <form className="apply-form">
        <input placeholder="Nickname" />
        <input placeholder="Discord" />
        <textarea placeholder="Why do you want to join?"></textarea>
        <button type="button">Send Application</button>
      </form>
    </section>
  )
}