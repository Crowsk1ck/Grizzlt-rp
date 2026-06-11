import {
  ArrowDownToLine,
  BadgeCheck,
  BellRing,
  Bot,
  CheckCircle2,
  ExternalLink,
  MonitorDown,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const DOWNLOAD_URL = 'https://github.com/Crowsk1ck/Grizzly_OS/releases/latest/download/Grizzly-OS-Setup.exe';
const RELEASES_URL = 'https://github.com/Crowsk1ck/Grizzly_OS/releases';
const FALLBACK_VERSION = '1.0.2';

const features = [
  ['Windows 10 / 11', 'Окрема програма Grizzly OS з ярликом на робочому столі.'],
  ['Auto Update', 'Оновлення приходять через GitHub Releases без ручного перекидання файлів.'],
  ['OS Mode', 'Той самий стиль Grizzly Command Center, але у desktop-вікні.'],
  ['Tray + меню', 'Швидкий доступ, reload, fullscreen і перевірка оновлень.'],
];

export default function Download() {
  const [appInfo, setAppInfo] = useState(null);
  const [updateState, setUpdateState] = useState({ type: 'idle', message: 'Готово до перевірки оновлень' });
  const isDesktop = typeof window !== 'undefined' && Boolean(window.grizzlyDesktop?.isDesktop);

  const version = appInfo?.version || FALLBACK_VERSION;

  useEffect(() => {
    if (typeof document !== 'undefined' && isDesktop) {
      document.body.classList.add('electron-app');
    }

    if (!isDesktop) return undefined;

    window.grizzlyDesktop.getAppInfo?.().then((info) => {
      if (info?.ok) setAppInfo(info);
    }).catch(() => null);

    const unsubscribe = window.grizzlyDesktop.onUpdateEvent?.((event) => {
      if (!event?.type) return;

      const messages = {
        checking: 'Перевіряю оновлення Grizzly OS...',
        available: `Доступна нова версія ${event.version || ''}`.trim(),
        'download-progress': `Завантаження оновлення: ${event.percent || 0}%`,
        downloaded: `Оновлення ${event.version || ''} завантажено. Перезапусти додаток.`.trim(),
        'not-available': 'У тебе актуальна версія Grizzly OS.',
        error: event.message || 'Не вдалося перевірити оновлення.',
        'skipped-dev': event.message || 'Auto-update працює тільки у зібраному .exe.',
      };

      setUpdateState({
        type: event.type,
        message: messages[event.type] || 'Статус оновлення змінено',
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [isDesktop]);

  const statusLabel = useMemo(() => {
    if (isDesktop) return 'DESKTOP APP ACTIVE';
    return 'WEB DOWNLOAD MODE';
  }, [isDesktop]);

  const handleCheckUpdates = async () => {
    if (!isDesktop) return;
    setUpdateState({ type: 'checking', message: 'Перевіряю оновлення Grizzly OS...' });
    const result = await window.grizzlyDesktop.checkUpdates?.().catch((error) => ({ ok: false, reason: error.message }));
    if (result && result.ok === false && result.reason && result.reason !== 'already_checking') {
      setUpdateState({ type: 'error', message: String(result.reason) });
    }
  };

  return (
    <div className="download-os-page">
      <section className="download-hero-panel">
        <div className="download-hero-copy">
          <p className="eyebrow">Desktop Launcher</p>
          <h1>Grizzly OS Desktop</h1>
          <p>
            Офіційний Windows-додаток Grizzly Family: сайт, адмінка, календар, контракти,
            Discord-статус і автооновлення в одному premium OS-режимі.
          </p>

          <div className="download-actions">
            <a className="button primary download-main-btn" href={DOWNLOAD_URL} target="_blank" rel="noreferrer">
              <ArrowDownToLine size={19} /> Скачать для Windows
            </a>
            <a className="button secondary" href={RELEASES_URL} target="_blank" rel="noreferrer">
              <ExternalLink size={18} /> GitHub Releases
            </a>
          </div>
        </div>

        <aside className="download-device-card">
          <div className="download-screen">
            <span className="download-screen-glow" />
            <MonitorDown size={54} />
            <strong>GRIZZLY OS</strong>
            <small>Windows Command Center</small>
          </div>
          <div className="download-version-row">
            <span>Current version</span>
            <strong>v{version}</strong>
          </div>
          <div className="download-version-row">
            <span>Status</span>
            <strong>{statusLabel}</strong>
          </div>
        </aside>
      </section>

      <section className="download-status-grid">
        <article>
          <BadgeCheck size={22} />
          <span>Release channel</span>
          <strong>GitHub Latest</strong>
          <p>Файл завжди качається з останнього релізу.</p>
        </article>
        <article>
          <RefreshCw size={22} />
          <span>Auto Update</span>
          <strong>Enabled</strong>
          <p>Нова версія підтягується після публікації release.</p>
        </article>
        <article>
          <ShieldCheck size={22} />
          <span>Install type</span>
          <strong>NSIS x64</strong>
          <p>Звичайний Windows installer з ярликом.</p>
        </article>
        <article>
          <Bot size={22} />
          <span>System mode</span>
          <strong>OS Shell</strong>
          <p>Підключені tray, menu, fullscreen і updater.</p>
        </article>
      </section>

      <section className="download-core-grid">
        <div className="download-card download-large-card">
          <div className="os-section-title compact">
            <div>
              <p className="eyebrow">Install Protocol</p>
              <h2>Як встановити</h2>
            </div>
          </div>

          <div className="download-steps">
            <article>
              <strong>01</strong>
              <div>
                <h3>Скачай installer</h3>
                <p>Натисни “Скачать для Windows” і завантаж Grizzly-OS-Setup.exe.</p>
              </div>
            </article>
            <article>
              <strong>02</strong>
              <div>
                <h3>Встанови Grizzly OS</h3>
                <p>Запусти installer, вибери папку і дочекайся створення ярлика.</p>
              </div>
            </article>
            <article>
              <strong>03</strong>
              <div>
                <h3>Оновлення автоматично</h3>
                <p>Коли вийде новий release, додаток сам запропонує оновитися.</p>
              </div>
            </article>
          </div>
        </div>

        <aside className="download-card download-update-card">
          <div className="download-update-icon">
            <BellRing size={28} />
          </div>
          <p className="eyebrow">Update Center</p>
          <h2>Статус оновлень</h2>
          <p>{updateState.message}</p>
          <button className="button secondary" type="button" disabled={!isDesktop} onClick={handleCheckUpdates}>
            <RefreshCw size={18} /> Перевірити оновлення
          </button>
          {!isDesktop && <small>Кнопка активна тільки всередині Windows-додатку.</small>}
        </aside>
      </section>

      <section className="download-feature-grid">
        {features.map(([title, text]) => (
          <article key={title}>
            <CheckCircle2 size={20} />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="download-footer-cta">
        <Sparkles size={24} />
        <div>
          <strong>Grizzly OS тепер можна ставити як повноцінний desktop-додаток.</strong>
          <p>Після першої установки наступні версії приходять через auto-update.</p>
        </div>
        <a className="button primary" href={DOWNLOAD_URL} target="_blank" rel="noreferrer">Скачать</a>
      </section>
    </div>
  );
}
