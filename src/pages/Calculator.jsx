import {
  Banknote,
  Calculator as CalculatorIcon,
  ClipboardList,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Trophy,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const kindLabels = {
  contracts: 'Контракти',
  money: 'Внесок',
  bonus: 'Премія',
};

const kindShortLabels = {
  contracts: 'контр.',
  money: 'грн',
  bonus: 'грн',
};

function formatNumber(value) {
  return Number(value || 0).toLocaleString('uk-UA');
}

function formatCurrency(value) {
  return `${formatNumber(value)} грн`;
}

function formatDate(value) {
  if (!value) return 'щойно';
  return new Date(value).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function displayEntryAmount(entry) {
  return `${formatNumber(entry.amount)} ${kindShortLabels[entry.kind] || 'грн'}`;
}

function getDefaultName(user, member) {
  return member?.nickname || user?.globalName || user?.username || '';
}

function buildPlayerStats(entries) {
  const grouped = new Map();

  entries.forEach((entry) => {
    const key = entry.playerName.trim().toLowerCase();
    const current = grouped.get(key) || {
      playerName: entry.playerName,
      contracts: 0,
      money: 0,
      records: 0,
      lastAt: entry.createdAt,
    };

    if (entry.kind === 'contracts') {
      current.contracts += Number(entry.amount || 0);
    } else {
      current.money += Number(entry.amount || 0);
    }

    current.records += 1;
    current.lastAt = entry.createdAt || current.lastAt;
    grouped.set(key, current);
  });

  return [...grouped.values()].sort((a, b) => b.money - a.money || b.contracts - a.contracts || a.playerName.localeCompare(b.playerName));
}

export default function Calculator() {
  const { user, isAdmin, member, hasFamilyRole, loading: authLoading } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    playerName: '',
    kind: 'money',
    amount: '',
    note: '',
  });

  const canUseCalculator = Boolean(user && (isAdmin || hasFamilyRole));

  useEffect(() => {
    setForm((current) => {
      if (current.playerName) return current;
      return { ...current, playerName: getDefaultName(user, member) };
    });
  }, [member, user]);

  async function loadEntries() {
    if (!canUseCalculator) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calculator/entries');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Calculator API error');
      setEntries(data.entries || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEntries();
  }, [canUseCalculator]);

  async function saveEntry(event) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');

    try {
      const response = await fetch('/api/calculator/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Entry save failed');

      setEntries((current) => [data.entry, ...current]);
      setForm((current) => ({ ...current, amount: '', note: '' }));
      setStatus('Запис додано у калькулятор.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEntry(id) {
    setError('');
    setStatus('');

    try {
      const response = await fetch('/api/calculator/entries', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Entry delete failed');

      setEntries((current) => current.filter((entry) => entry.id !== id));
      setStatus('Запис видалено.');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  const visibleEntries = useMemo(() => {
    const search = query.trim().toLowerCase();

    return entries
      .filter((entry) => (filter === 'all' ? true : entry.kind === filter))
      .filter((entry) => {
        if (!search) return true;
        const text = `${entry.playerName || ''} ${entry.note || ''} ${entry.createdBy?.username || ''}`.toLowerCase();
        return text.includes(search);
      });
  }, [entries, filter, query]);

  const playerStats = useMemo(() => buildPlayerStats(visibleEntries), [visibleEntries]);

  const totals = useMemo(() => {
    const money = visibleEntries
      .filter((entry) => entry.kind !== 'contracts')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const contracts = visibleEntries
      .filter((entry) => entry.kind === 'contracts')
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

    return {
      money,
      contracts,
      records: visibleEntries.length,
      players: playerStats.length,
      topPlayer: playerStats[0]?.playerName || 'Немає записів',
    };
  }, [playerStats, visibleEntries]);

  if (authLoading) {
    return <PageHero eyebrow="Calculator" title="Калькулятор" text="Перевіряємо Discord сесію та роль родини..." />;
  }

  if (!user) {
    return (
      <>
        <PageHero
          eyebrow="Calculator"
          title="Калькулятор Grizzly"
          text="Закритий облік контрактів, внесків та активності родини. Для доступу потрібен Discord Login."
        />
        <Section>
          <a className="button primary" href="/api/auth/discord/login">Увійти через Discord</a>
        </Section>
      </>
    );
  }

  if (!canUseCalculator) {
    return (
      <>
        <PageHero
          eyebrow="Calculator"
          title="Доступ закрито"
          text="Калькулятор доступний тільки учасникам Grizzly Family з потрібною Discord роллю."
        />
        <Section>
          <div className="auth-alert">
            <ShieldAlert size={18} /> Твій Discord ID: {user.id}. Якщо роль уже видали, натисни оновити профіль або зачекай синхронізацію бота.
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="K2 style tool"
        title="Калькулятор Grizzly"
        text="Облік контрактів, внесків і премій родини. Дані зберігаються у Firestore, а доступ мають тільки свої."
      />

      <Section className="calculator-section">
        <div className="calculator-stats">
          <article>
            <Banknote size={24} />
            <strong>{formatCurrency(totals.money)}</strong>
            <span>загальний баланс</span>
          </article>
          <article>
            <ClipboardList size={24} />
            <strong>{formatNumber(totals.contracts)}</strong>
            <span>контрактів</span>
          </article>
          <article>
            <Users size={24} />
            <strong>{formatNumber(totals.players)}</strong>
            <span>учасників у таблиці</span>
          </article>
          <article>
            <Trophy size={24} />
            <strong>{totals.topPlayer}</strong>
            <span>топ за фільтром</span>
          </article>
        </div>

        <div className="calculator-controls">
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук по ніку, нотатці або Discord" />
          </label>
          <div className="segmented calculator-filter">
            {[
              ['all', 'Всі'],
              ['contracts', 'Контракти'],
              ['money', 'Внески'],
              ['bonus', 'Премії'],
            ].map(([value, label]) => (
              <button className={filter === value ? 'active' : ''} type="button" key={value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          <button className="button secondary" type="button" onClick={loadEntries} disabled={loading}>
            <RefreshCw size={17} /> Оновити
          </button>
        </div>

        {error && <p className="auth-alert">{error}</p>}
        {status && <p className="form-status">{status}</p>}

        <div className="calculator-layout">
          <form className="form calculator-form" onSubmit={saveEntry}>
            <div>
              <p className="eyebrow">Новий запис</p>
              <h2>Додати активність</h2>
              <p>Запис одразу піде у Firestore і з'явиться в історії.</p>
            </div>

            <label>
              Нік / Discord
              <input
                value={form.playerName}
                onChange={(event) => setForm((current) => ({ ...current, playerName: event.target.value }))}
                placeholder="Наприклад: Dima Grizzly"
                required
              />
            </label>

            <div className="form-grid">
              <label>
                Тип запису
                <select value={form.kind} onChange={(event) => setForm((current) => ({ ...current, kind: event.target.value }))}>
                  <option value="money">Внесок</option>
                  <option value="contracts">Контракти</option>
                  <option value="bonus">Премія</option>
                </select>
              </label>
              <label>
                Сума / кількість
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                  placeholder="25000"
                  required
                />
              </label>
            </div>

            <label>
              Коментар
              <textarea
                value={form.note}
                onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                placeholder="Наприклад: контракти за вечір, внесок у склад, премія за актив"
              />
            </label>

            <button className="button primary" type="submit" disabled={saving}>
              <CalculatorIcon size={18} /> {saving ? 'Зберігаємо...' : 'Зберегти запис'}
            </button>
          </form>

          <div className="calculator-panel">
            <div className="calculator-panel-head">
              <div>
                <p className="eyebrow">Рейтинг</p>
                <h2>Топ учасників</h2>
              </div>
              <span>{formatNumber(totals.records)} записів</span>
            </div>

            <div className="calculator-ranking">
              {playerStats.slice(0, 8).map((player, index) => (
                <article className="calculator-rank-row" key={player.playerName}>
                  <strong>{index + 1}</strong>
                  <div>
                    <h3>{player.playerName}</h3>
                    <p>{formatNumber(player.records)} записів · {formatNumber(player.contracts)} контр.</p>
                  </div>
                  <span>{formatCurrency(player.money)}</span>
                </article>
              ))}
            </div>

            {!loading && playerStats.length === 0 && <p className="auth-alert">Поки немає записів за цим фільтром.</p>}
            {loading && <p>Завантажуємо записи...</p>}
          </div>
        </div>

        <div className="calculator-history">
          <div className="calculator-panel-head">
            <div>
              <p className="eyebrow">History</p>
              <h2>Останні дії</h2>
            </div>
            <span>показано {formatNumber(visibleEntries.length)}</span>
          </div>

          <div className="calculator-history-list">
            {visibleEntries.slice(0, 80).map((entry) => {
              const canDelete = isAdmin || entry.createdBy?.id === user.id;

              return (
                <article className="calculator-history-row" key={entry.id}>
                  <span className={`calc-kind ${entry.kind}`}>{kindLabels[entry.kind] || entry.kind}</span>
                  <div>
                    <h3>{entry.playerName}</h3>
                    <p>{entry.note || 'Без коментаря'} · @{entry.createdBy?.username || 'discord'} · {formatDate(entry.createdAt)}</p>
                  </div>
                  <strong>{displayEntryAmount(entry)}</strong>
                  {canDelete && (
                    <button type="button" onClick={() => deleteEntry(entry.id)} aria-label="Видалити запис">
                      <Trash2 size={16} />
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          {!loading && visibleEntries.length === 0 && <p className="auth-alert">Історія порожня. Додай перший запис зверху.</p>}
        </div>
      </Section>
    </>
  );
}
