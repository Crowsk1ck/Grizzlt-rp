import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Grizzly UI error', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="error-boundary">
        <div>
          <AlertTriangle size={34} />
          <p className="eyebrow">System</p>
          <h1>Щось пішло не так</h1>
          <p>Онови сторінку. Якщо помилка повториться, перевір останній деплой або консоль Vercel.</p>
          <button className="button primary" type="button" onClick={() => window.location.reload()}>
            <RefreshCw size={18} /> Оновити
          </button>
        </div>
      </main>
    );
  }
}
