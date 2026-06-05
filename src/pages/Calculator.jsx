import {
  Banknote,
  CalendarDays,
  Clipboard,
  ClipboardList,
  FilePenLine,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const familyFundRate = 0.1;
const officeDailyCost = 10000;
const estateDailyCost = 100000;

const emptyContractForm = {
  date: new Date().toISOString().slice(0, 10),
  name: '',
  amount: '',
  playersText: '',
};

function formatNumber(value) {
  return Math.round(Number(value || 0)).toLocaleString('uk-UA');
}

function formatMoney(value) {
  return `$ ${formatNumber(value)}`;
}

function formatDateTime(value) {
  if (!value) return 'щойно';
  return new Date(value).toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function sortNames(items) {
  return [...new Set((items || []).map((item) => String(item || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'uk', { sensitivity: 'base' }));
}

function parsePlayers(value) {
  if (Array.isArray(value)) return sortNames(value);
  return sortNames(String(value || '').split(/[.\n,;]+/));
}

function playersToText(players) {
  return sortNames(players).join('. ');
}

function contractTypesToText(contractTypes) {
  return Object.entries(contractTypes || {})
    .sort(([a], [b]) => a.localeCompare(b, 'uk', { sensitivity: 'base' }))
    .map(([name, amount]) => `${name} = ${amount}`)
    .join('\n');
}

function getPeriodDays(contracts, from, to) {
  if (from && to) {
    const start = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);
    if (!Number.isNaN(start.valueOf()) && !Number.isNaN(end.valueOf()) && end >= start) {
      return Math.max(1, Math.round((end - start) / 86400000) + 1);
    }
  }

  const uniqueDays = new Set(contracts.map((contract) => contract.date).filter(Boolean));
  return Math.max(1, uniqueDays.size || 1);
}

function calculateMoneyModel(contracts, from, to) {
  const total = contracts.reduce((sum, contract) => sum + Number(contract.amount || 0), 0);
  const playerContracts = contracts.reduce((sum, contract) => sum + parsePlayers(contract.players).length, 0);
  const days = getPeriodDays(contracts, from, to);
  const familyFund = total * familyFundRate;
  const officeCost = days * officeDailyCost;
  const estateCost = days * estateDailyCost;
  const deductions = familyFund + officeCost + estateCost;
  const net = total - deductions;

  return { total, playerContracts, days, familyFund, officeCost, estateCost, deductions, net };
}

function calculatePlayerStats(contracts, knownPlayers, from, to) {
  const model = calculateMoneyModel(contracts, from, to);
  const stats = {};

  knownPlayers.forEach((player) => {
    stats[player] = { count: 0, gross: 0, familyFund: 0, property: 0, income: 0 };
  });

  contracts.forEach((contract) => {
    const players = parsePlayers(contract.players);
    if (!players.length) return;

    const share = Number(contract.amount || 0) / players.length;
    players.forEach((player) => {
      if (!stats[player]) stats[player] = { count: 0, gross: 0, familyFund: 0, property: 0, income: 0 };
      stats[player].count += 1;
      stats[player].gross += share;
    });
  });

  const propertyTotal = model.officeCost + model.estateCost;
  Object.keys(stats).forEach((player) => {
    const gross = Number(stats[player].gross || 0);
    stats[player].familyFund = gross * familyFundRate;
    stats[player].property = model.total > 0 ? (gross / model.total) * propertyTotal : 0;
    stats[player].income = Math.max(0, gross - stats[player].familyFund - stats[player].property);
  });

  return {
    model,
    rows: Object.entries(stats)
      .filter(([, value]) => value.count > 0)
      .sort((a, b) => b[1].income - a[1].income || b[1].gross - a[1].gross || a[0].localeCompare(b[0])),
  };
}

function buildChartRows(contracts, model) {
  const byDate = contracts.reduce((acc, contract) => {
    const date = contract.date || 'Без дати';
    acc[date] = (acc[date] || 0) + Number(contract.amount || 0);
    return acc;
  }, {});
  const rows = Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  const max = Math.max(...rows.map(([, value]) => value), 1);

  return rows.map(([date, gross]) => ({
    date,
    gross,
    net: model.total > 0 ? (gross / model.total) * model.net : 0,
    width: Math.max(4, Math.round((gross / max) * 100)),
  }));
}

export default function Calculator() {
  const { user, isAdmin, hasFamilyRole, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [contractTypes, setContractTypes] = useState({});
  const [players, setPlayers] = useState([]);
  const [savedPlayers, setSavedPlayers] = useState([]);
  const [contractForm, setContractForm] = useState(emptyContractForm);
  const [editingId, setEditingId] = useState('');
  const [newContractType, setNewContractType] = useState({ name: '', amount: '' });
  const [newPlayer, setNewPlayer] = useState('');
  const [playerPick, setPlayerPick] = useState('');
  const [contractTypesText, setContractTypesText] = useState('');
  const [playersText, setPlayersText] = useState('');
  const [filters, setFilters] = useState({ from: '', to: '', query: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const canUseCalculator = Boolean(user && (isAdmin || hasFamilyRole));

  function applyData(data) {
    setContracts(data.contracts || []);
    setContractTypes(data.contractTypes || {});
    setPlayers(sortNames(data.players || []));
    setSavedPlayers(sortNames(data.savedPlayers || []));
    setContractTypesText(contractTypesToText(data.contractTypes || {}));
    setPlayersText(sortNames(data.savedPlayers || []).join('\n'));
  }

  async function requestCalculator(method, body) {
    const response = await fetch('/api/calculator/entries', {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Calculator API error');
    return data;
  }

  async function loadData() {
    if (!canUseCalculator) return;
    setLoading(true);
    setError('');

    try {
      applyData(await requestCalculator('GET'));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [canUseCalculator]);

  function updateContractField(field, value) {
    setContractForm((current) => {
      if (field === 'name' && contractTypes[value]) {
        return { ...current, name: value, amount: String(contractTypes[value]) };
      }
      return { ...current, [field]: value };
    });
  }

  function addPickedPlayer() {
    const picked = playerPick.trim();
    if (!picked) return;

    const nextPlayers = parsePlayers(contractForm.playersText);
    if (!nextPlayers.some((player) => player.toLowerCase() === picked.toLowerCase())) {
      nextPlayers.push(picked);
    }

    setContractForm((current) => ({ ...current, playersText: playersToText(nextPlayers) }));
    setPlayerPick('');
  }

  async function saveContract(event) {
    event.preventDefault();
    setSaving(true);
    setStatus('');
    setError('');

    try {
      const method = editingId ? 'PATCH' : 'POST';
      const payload = {
        action: 'addContract',
        id: editingId,
        date: contractForm.date,
        name: contractForm.name,
        amount: contractForm.amount,
        players: parsePlayers(contractForm.playersText),
      };

      applyData(await requestCalculator(method, payload));
      setContractForm(emptyContractForm);
      setEditingId('');
      setPlayerPick('');
      setStatus(editingId ? 'Контракт оновлено.' : 'Контракт додано.');
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(contract) {
    setEditingId(contract.id);
    setContractForm({
      date: contract.date || emptyContractForm.date,
      name: contract.name || '',
      amount: String(contract.amount || ''),
      playersText: playersToText(contract.players || []),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId('');
    setContractForm(emptyContractForm);
  }

  async function deleteContract(id) {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('DELETE', { id }));
      setStatus('Контракт видалено.');
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  async function clearContracts() {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('DELETE', { action: 'clearContracts' }));
      setStatus('Історію контрактів очищено.');
    } catch (clearError) {
      setError(clearError.message);
    }
  }

  async function addContractType() {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('POST', { action: 'addContractType', ...newContractType }));
      setNewContractType({ name: '', amount: '' });
      setStatus('Контракт додано у довідник.');
    } catch (typeError) {
      setError(typeError.message);
    }
  }

  async function saveContractTypes() {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('POST', { action: 'saveContractTypes', settingsText: contractTypesText }));
      setStatus('Довідник контрактів збережено.');
    } catch (typeError) {
      setError(typeError.message);
    }
  }

  async function deleteContractType(name) {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('DELETE', { action: 'deleteContractType', name }));
      setStatus('Контракт прибрано з довідника.');
    } catch (typeError) {
      setError(typeError.message);
    }
  }

  async function addPlayer() {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('POST', { action: 'addPlayer', name: newPlayer }));
      setNewPlayer('');
      setStatus('Гравця додано у довідник.');
    } catch (playerError) {
      setError(playerError.message);
    }
  }

  async function savePlayers() {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('POST', { action: 'savePlayers', playersText }));
      setStatus('Довідник гравців збережено.');
    } catch (playerError) {
      setError(playerError.message);
    }
  }

  async function deletePlayer(name) {
    setError('');
    setStatus('');

    try {
      applyData(await requestCalculator('DELETE', { action: 'deletePlayer', name }));
      setStatus('Гравця прибрано з ручного довідника.');
    } catch (playerError) {
      setError(playerError.message);
    }
  }

  const filteredContracts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return contracts
      .filter((contract) => {
        if (filters.from && contract.date < filters.from) return false;
        if (filters.to && contract.date > filters.to) return false;
        return true;
      })
      .filter((contract) => {
        if (!query) return true;
        const text = `${contract.name || ''} ${parsePlayers(contract.players).join(' ')} ${contract.createdBy?.username || ''}`.toLowerCase();
        return text.includes(query);
      });
  }, [contracts, filters]);

  const { rows: playerStats, model } = useMemo(
    () => calculatePlayerStats(filteredContracts, players, filters.from, filters.to),
    [filteredContracts, filters.from, filters.to, players],
  );

  const chartRows = useMemo(() => buildChartRows(filteredContracts, model), [filteredContracts, model]);
  const topPlayer = playerStats[0]?.[0] || 'Немає даних';

  function copyReport() {
    const lines = [
      'Калькулятор Grizzly Family',
      '',
      `Контрактів: ${filteredContracts.length}`,
      `Участей: ${model.playerContracts}`,
      `Загальна сума: ${formatMoney(model.total)}`,
      `Фонд родини 10%: -${formatMoney(model.familyFund)}`,
      `Офіс (${model.days} дн.): -${formatMoney(model.officeCost)}`,
      `Маєток (${model.days} дн.): -${formatMoney(model.estateCost)}`,
      `Чистий дохід: ${formatMoney(model.net)}`,
      '',
      'Топ учасників:',
      ...playerStats.map(([player, value], index) => `${index + 1}. ${player} - ${value.count} контр. - ${formatMoney(value.income)}`),
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    setStatus('Звіт скопійовано.');
  }

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
            <ShieldAlert size={18} /> Твій Discord ID: {user.id}
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Calculator"
        title="Калькулятор контрактів"
        text="Контракти, учасники, фонд родини, витрати на офіс і маєток, чистий дохід та історія виконання."
      />

      <Section className="calculator-section">
        <div className="calculator-stats">
          <article>
            <ClipboardList size={24} />
            <strong>{filteredContracts.length}</strong>
            <span>контрактів</span>
          </article>
          <article>
            <Users size={24} />
            <strong>{model.playerContracts}</strong>
            <span>участей</span>
          </article>
          <article>
            <Banknote size={24} />
            <strong>{formatMoney(model.net)}</strong>
            <span>чистий дохід</span>
          </article>
          <article>
            <Trophy size={24} />
            <strong>{topPlayer}</strong>
            <span>топ періоду</span>
          </article>
        </div>

        {error && <p className="auth-alert">{error}</p>}
        {status && <p className="form-status">{status}</p>}

        <div className="contract-calculator-grid">
          <form className="form contract-panel contract-form" onSubmit={saveContract}>
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">{editingId ? 'Редагування' : 'Новий контракт'}</p>
                <h2>{editingId ? 'Оновити контракт' : 'Додати контракт'}</h2>
              </div>
              {editingId && (
                <button className="icon-button" type="button" onClick={cancelEdit} aria-label="Скасувати редагування">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="form-grid">
              <label>
                Дата
                <input type="date" value={contractForm.date} onChange={(event) => updateContractField('date', event.target.value)} />
              </label>
              <label>
                Сума
                <input
                  min="1"
                  step="1"
                  type="number"
                  value={contractForm.amount}
                  onChange={(event) => updateContractField('amount', event.target.value)}
                  placeholder="300000"
                  required
                />
              </label>
            </div>

            <label>
              Назва контракту
              <input
                list="contract-type-list"
                value={contractForm.name}
                onChange={(event) => updateContractField('name', event.target.value)}
                placeholder="Наприклад: Великий контракт"
                required
              />
              <datalist id="contract-type-list">
                {Object.keys(contractTypes).map((name) => <option value={name} key={name} />)}
              </datalist>
            </label>

            <div className="contract-player-picker">
              <label>
                Учасник
                <input
                  list="calculator-player-list"
                  value={playerPick}
                  onChange={(event) => setPlayerPick(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addPickedPlayer();
                    }
                  }}
                  placeholder="Почни вводити нік"
                />
                <datalist id="calculator-player-list">
                  {players.map((player) => <option value={player} key={player} />)}
                </datalist>
              </label>
              <button className="button secondary" type="button" onClick={addPickedPlayer}>
                <Plus size={17} /> Додати
              </button>
            </div>

            <label>
              Учасники через крапку
              <textarea
                value={contractForm.playersText}
                onBlur={() => setContractForm((current) => ({ ...current, playersText: playersToText(parsePlayers(current.playersText)) }))}
                onChange={(event) => updateContractField('playersText', event.target.value)}
                placeholder="Dima Grizzly. Maryana Grizzly. dark warrior"
                required
              />
            </label>

            <div className="contract-actions">
              <button className="button primary" type="submit" disabled={saving}>
                <FilePenLine size={18} /> {saving ? 'Зберігаємо...' : editingId ? 'Оновити' : 'Додати'}
              </button>
              <button className="button secondary" type="button" onClick={copyReport}>
                <Clipboard size={18} /> Звіт
              </button>
              {isAdmin && (
                <button className="button secondary danger-button" type="button" onClick={clearContracts}>
                  <Trash2 size={18} /> Очистити
                </button>
              )}
            </div>
          </form>

          <aside className="contract-panel contract-directory">
            <div className="contract-panel-title">
              <div>
                <p className="eyebrow">Довідники</p>
                <h2>Контракти і гравці</h2>
              </div>
              <button className="icon-button" type="button" onClick={loadData} disabled={loading} aria-label="Оновити калькулятор">
                <RefreshCw size={18} />
              </button>
            </div>

            <div className="directory-columns">
              <div>
                <h3>Контракти</h3>
                <div className="directory-list">
                  {Object.entries(contractTypes).map(([name, amount]) => (
                    <div className="directory-row" key={name}>
                      <div>
                        <strong>{name}</strong>
                        <span>{formatMoney(amount)}</span>
                      </div>
                      {isAdmin && (
                        <button type="button" onClick={() => deleteContractType(name)} aria-label="Видалити тип контракту">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3>Гравці</h3>
                <div className="directory-list compact">
                  {players.slice(0, 18).map((player) => (
                    <div className="directory-row" key={player}>
                      <strong>{player}</strong>
                      {isAdmin && savedPlayers.includes(player) && (
                        <button type="button" onClick={() => deletePlayer(player)} aria-label="Видалити гравця">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="admin-directory-tools">
                <div className="form-grid">
                  <input
                    value={newContractType.name}
                    onChange={(event) => setNewContractType((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Назва контракту"
                  />
                  <input
                    min="1"
                    type="number"
                    value={newContractType.amount}
                    onChange={(event) => setNewContractType((current) => ({ ...current, amount: event.target.value }))}
                    placeholder="Сума"
                  />
                </div>
                <button className="button secondary" type="button" onClick={addContractType}>
                  <Plus size={17} /> Додати контракт
                </button>

                <label>
                  Довідник контрактів
                  <textarea value={contractTypesText} onChange={(event) => setContractTypesText(event.target.value)} />
                </label>
                <button className="button secondary" type="button" onClick={saveContractTypes}>Зберегти контракти</button>

                <div className="contract-player-picker">
                  <input value={newPlayer} onChange={(event) => setNewPlayer(event.target.value)} placeholder="Нік гравця або кілька через крапку" />
                  <button className="button secondary" type="button" onClick={addPlayer}>
                    <Plus size={17} /> Додати
                  </button>
                </div>
                <label>
                  Ручний довідник гравців
                  <textarea value={playersText} onChange={(event) => setPlayersText(event.target.value)} />
                </label>
                <button className="button secondary" type="button" onClick={savePlayers}>Зберегти гравців</button>
              </div>
            )}
          </aside>
        </div>

        <div className="contract-filter-panel">
          <label className="search-field">
            <Search size={18} />
            <input value={filters.query} onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))} placeholder="Пошук по контракту або гравцю" />
          </label>
          <label>
            Від
            <input type="date" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} />
          </label>
          <label>
            До
            <input type="date" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} />
          </label>
          <button className="button secondary" type="button" onClick={() => setFilters({ from: '', to: '', query: '' })}>
            Скинути
          </button>
        </div>

        <div className="contract-summary-grid">
          <article><CalendarDays size={20} /><span>Період</span><strong>{model.days} дн.</strong></article>
          <article><Banknote size={20} /><span>Загальна сума</span><strong>{formatMoney(model.total)}</strong></article>
          <article><span>10%</span><span>Фонд родини</span><strong>-{formatMoney(model.familyFund)}</strong></article>
          <article><span>Офіс</span><span>{model.days} дн.</span><strong>-{formatMoney(model.officeCost)}</strong></article>
          <article><span>Маєток</span><span>{model.days} дн.</span><strong>-{formatMoney(model.estateCost)}</strong></article>
          <article><Banknote size={20} /><span>Дохід</span><strong>{formatMoney(model.net)}</strong></article>
        </div>

        <div className="contract-chart-panel">
          <div className="contract-panel-title">
            <div>
              <p className="eyebrow">Графік</p>
              <h2>Дохід по датах</h2>
            </div>
          </div>
          <div className="contract-chart">
            {chartRows.map((row) => (
              <div className="contract-chart-row" key={row.date}>
                <span>{row.date}</span>
                <div className="contract-chart-track">
                  <div className="contract-chart-bar" style={{ width: `${row.width}%` }} />
                </div>
                <strong>{formatMoney(row.net)}</strong>
              </div>
            ))}
            {chartRows.length === 0 && <p className="auth-alert">За цим фільтром контрактів немає.</p>}
          </div>
        </div>

        <div className="contract-table-panel">
          <div className="contract-panel-title">
            <div>
              <p className="eyebrow">Розподіл</p>
              <h2>Топ гравців</h2>
            </div>
          </div>
          <div className="contract-table-wrap">
            <table className="contract-table">
              <thead>
                <tr>
                  <th>Гравець</th>
                  <th>Контракти</th>
                  <th>Брудний дохід</th>
                  <th>Витрати</th>
                  <th>Чистий дохід</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map(([player, value], index) => (
                  <tr className={index < 3 ? `top-${index + 1}` : ''} key={player}>
                    <td><span className="rank-badge">#{index + 1}</span>{player}</td>
                    <td>{value.count}</td>
                    <td>{formatMoney(value.gross)}</td>
                    <td>-{formatMoney(value.familyFund + value.property)}</td>
                    <td className="money-green">{formatMoney(value.income)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {playerStats.length === 0 && <p className="auth-alert">Поки немає гравців у статистиці.</p>}
        </div>

        <div className="contract-history-grid">
          {filteredContracts.map((contract) => {
            const canEdit = isAdmin || contract.createdBy?.id === user.id;

            return (
              <article className="contract-history-card" key={contract.id}>
                <div className="contract-history-head">
                  <div>
                    <span>{contract.date}</span>
                    <h3>{contract.name}</h3>
                  </div>
                  <strong>{formatMoney(contract.amount)}</strong>
                </div>
                <p><b>Учасники:</b> {playersToText(contract.players)}</p>
                <p><b>Додав:</b> @{contract.createdBy?.username || 'discord'} · {formatDateTime(contract.createdAt)}</p>
                {canEdit && (
                  <div className="contract-actions">
                    <button className="button secondary" type="button" onClick={() => startEdit(contract)}>
                      <FilePenLine size={16} /> Редагувати
                    </button>
                    <button className="button secondary danger-button" type="button" onClick={() => deleteContract(contract.id)}>
                      <Trash2 size={16} /> Видалити
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {!loading && filteredContracts.length === 0 && <p className="auth-alert">Історія контрактів порожня.</p>}
        {loading && <p>Завантажуємо калькулятор...</p>}
      </Section>
    </>
  );
}
