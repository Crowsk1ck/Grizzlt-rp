import { LogIn, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { addFirestoreRecord } from '../lib/firebase.js';
import { useAuth } from '../lib/auth.jsx';

async function notifyDiscord(type, form, documentId, user) {
  const response = await fetch('/api/discord/application', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type,
      form,
      documentId,
      discordUser: user
        ? {
            id: user.id,
            username: user.username,
            globalName: user.globalName,
          }
        : null,
    }),
  });

  if (!response.ok) return { ok: false };
  return response.json();
}

export default function FirestoreForm({ type = 'applications' }) {
  const { user, loading: authLoading } = useAuth();
  const isApplication = type === 'applications';
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nickname: '',
    discord: '',
    age: '',
    online: '',
    message: '',
  });

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      discord: current.discord || user.globalName || user.username,
    }));
  }, [user]);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus('');

    if (isApplication && !user) {
      setStatus('Спочатку увійди через Discord. Одна людина може подати тільки одну заявку.');
      setLoading(false);
      return;
    }

    const discordUser = user
      ? {
          id: user.id,
          username: user.username,
          globalName: user.globalName,
        }
      : null;

    try {
      const payload = {
        ...form,
        discordUser,
      };

      if (isApplication) {
        payload.status = 'new';
      }

      const result = await addFirestoreRecord(
        type,
        payload,
        {
          documentId: isApplication ? user.id : undefined,
        },
      );

      let discordResult = { ok: false, skipped: true };
      if (!result.offline) {
        discordResult = await notifyDiscord(type, form, result.id, user);
      }

      if (result.offline) {
        setStatus('Firebase env не заповнено, запис збережено локально.');
      } else if (discordResult.ok) {
        setStatus(`Заявку відправлено у Firestore і Discord. ID: ${result.id}`);
      } else if (isApplication) {
        setStatus(`Заявку відправлено у Firestore. Бот у Discord побачить її автоматично. ID: ${result.id}`);
      } else {
        setStatus(`Повідомлення відправлено у Firestore. ID: ${result.id}`);
      }

      setForm({ nickname: '', discord: user?.globalName || user?.username || '', age: '', online: '', message: '' });
    } catch (error) {
      if (isApplication && error.code === 'permission-denied') {
        setStatus('Ти вже подавав заявку з цього Discord акаунта. Повторна заявка недоступна.');
      } else {
        setStatus(`Помилка відправки: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  if (isApplication && !authLoading && !user) {
    return (
      <div className="form login-required">
        <h3>Потрібен Discord Login</h3>
        <p>Щоб одна людина не могла подавати багато заявок, вступ доступний тільки після входу через Discord.</p>
        <a className="button primary" href="/api/auth/discord/login">
          <LogIn size={18} /> Увійти через Discord
        </a>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Нікнейм
          <input required name="nickname" value={form.nickname} onChange={updateField} placeholder="Dominic_Crown" />
        </label>
        <label>
          Discord
          <input required name="discord" value={form.discord} onChange={updateField} placeholder="Discord username" />
        </label>
        <label>
          Вік
          <input required name="age" value={form.age} onChange={updateField} placeholder="16+" />
        </label>
        <label>
          Онлайн
          <input required name="online" value={form.online} onChange={updateField} placeholder="19:00-00:00" />
        </label>
      </div>
      <label>
        Про себе
        <textarea required name="message" value={form.message} onChange={updateField} placeholder="Досвід RP, сильні сторони, чому хочеш до нас" />
      </label>
      <button className="button primary" disabled={loading} type="submit">
        <Send size={18} />
        {loading ? 'Відправка...' : 'Відправити'}
      </button>
      {status && <p className="form-status">{status}</p>}
    </form>
  );
}
