export default function Section({ title, eyebrow, children, className = '' }) {
  return (
    <section className={`section ${className}`}>
      {(eyebrow || title) && (
        <div className="section-heading">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {title && <h2>{title}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}
