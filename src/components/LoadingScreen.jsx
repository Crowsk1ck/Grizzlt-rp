export default function LoadingScreen({ label = 'Завантажуємо Grizzly Family...' }) {
  return (
    <div className="route-loading" role="status" aria-live="polite">
      <img src="/assets/grizzly-logo.png" alt="Grizzly Family" />
      <strong>{label}</strong>
      <span />
    </div>
  );
}
