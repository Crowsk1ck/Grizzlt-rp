export default function Card({ icon: Icon, title, text, children }) {
  return (
    <article className="card">
      {Icon && (
        <span className="card-icon">
          <Icon size={22} />
        </span>
      )}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </article>
  );
}
