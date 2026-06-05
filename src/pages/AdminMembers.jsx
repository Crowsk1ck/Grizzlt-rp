import { AlertTriangle, ClipboardList, RefreshCw, Save, Search, ShieldAlert, Trash2, UserCog } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';

const emptyProfile = {
  rpNickname: '',
  rank: '',
  position: '',
  salary: '',
  vehicle: '',
  business: '',
  status: 'active',
  note: '',
};

function formatDate(value) {
  if (!value) return 'щойно';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function displayName(member) {
  return member?.profile?.rpNickname || member?.nickname || member?.username || member?.id || 'Учасник';
}

export default function AdminMembers() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [members, setMembers] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [logs, setLogs] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [profileForm, setProfileForm] = useState(emptyProfile);
  const [warningForm, setWarningForm] = useState({ level: 'warning', reason: '' });
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch('/api/admin/members');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Members API error');
      const nextMembers = data.members || [];
      setMembers(nextMembers);
      setWarnings(data.warnings || []);
      setLogs(data.logs || []);
      setSelectedId((current) => {
        if (nextMembers.some((member) => member.id === current)) return current;
        return nextMembers[0]?.id || '';
      });
    } catch (error) {
      setStatus(`Помилка: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const selectedMember = useMemo(
    () => members.find((member) => member.id === selectedId) || null,
    [members, selectedId],
  );

  useEffect(() => {
    if (!selectedMember) return;
    setProfileForm({
      ...emptyProfile,
      ...(selectedMember.profile || {}),
      rpNickname: selectedMember.profile?.rpNickname || selectedMember.nickname || '',
    });
    setWarningForm({ level: 'warning', reason: '' });
  }, [selectedMember]);

  const filteredMembers = useMemo(() => {
    const search = query.trim().toLowerCase();
    return members.filter((member) => {
      if (!search) return true;
      return `${displayName(member)} ${member.username || ''} ${member.profile?.rank || ''}`.toLowerCase().includes(search);
    });
  }, [members, query]);

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    if (!selectedId) return;
    setStatus('Зберігаємо профіль...');

    try {
      const response = await fetch('/api/admin/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: selectedId, profile: profileForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Save failed');
      setMembers(data.members || []);
      setWarnings(data.warnings || []);
      setLogs(data.logs || []);
      setStatus('Профіль учасника збережено.');
    } catch (error) {
      setStatus(`Помилка: ${error.message}`);
    }
  }

  async function addWarning(event) {
    event.preventDefault();
    if (!selectedId) return;
    setStatus('Додаємо попередження...');

    try {
      const response = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: selectedId, ...warningForm }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Warning failed');
      setMembers(data.members || []);
      setWarnings(data.warnings || []);
      setLogs(data.logs || []);
      setWarningForm({ level: 'warning', reason: '' });
      setStatus('Попередження додано.');
    } catch (error) {
      setStatus(`Помилка: ${error.message}`);
    }
  }

  async function deleteWarning(warningId) {
    setStatus('Видаляємо попередження...');

    try {
      const response = await fetch('/api/admin/members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ warningId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Delete failed');
      setMembers(data.members || []);
      setWarnings(data.warnings || []);
      setLogs(data.logs || []);
      setStatus('Попередження видалено.');
    } catch (error) {
      setStatus(`Помилка: ${error.message}`);
    }
  }

  if (authLoading) {
    return <PageHero eyebrow="Admin" title="Склад" text="Перевіряємо Discord сесію..." />;
  }

  if (!user) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Склад" text="Для доступу потрібен Discord Login." />
        <Section>
          <a className="button primary" href="/api/auth/discord/login">Увійти через Discord</a>
        </Section>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <PageHero eyebrow="Admin" title="Немає доступу" text="Ця сторінка доступна тільки адміністрації." />
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
        eyebrow="Admin"
        title="Керування складом"
        text="Редактор профілів учасників, попередження, службові примітки та журнал дій адміністрації."
      />

      <Section className="admin-members-page">
        <div className="calculator-controls">
          <label className="search-field">
            <Search size={18} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Пошук по ніку, Discord або рангу" />
          </label>
          <button className="button secondary" type="button" onClick={loadData}>
            <RefreshCw size={18} /> Оновити
          </button>
          <span className="roster-count">{filteredMembers.length} учасників</span>
        </div>

        {status && <p className="form-status">{status}</p>}
        {loading && <p>Завантажуємо склад...</p>}
        {!loading && filteredMembers.length === 0 && (
          <div className="auth-alert">
            <ShieldAlert size={18} /> Склад поки порожній. Якщо бот ще не синхронізував Discord, прийняті заявки
            підтягнуться сюди автоматично. Також перевір Railway env `DISCORD_SERVER_ID` і `FIREBASE_SERVICE_ACCOUNT`.
          </div>
        )}

        <div className="admin-member-layout">
          <aside className="admin-member-list">
            {filteredMembers.map((member) => (
              <button
                className={selectedId === member.id ? 'active' : ''}
                type="button"
                key={member.id}
                onClick={() => setSelectedId(member.id)}
              >
                <img src={member.avatar || '/assets/grizzly-logo.png'} alt={displayName(member)} />
                <span>
                  <strong>{displayName(member)}</strong>
                  <small>
                    @{member.username} · {member.profile?.rank || 'без рангу'}
                    {member.fromApplication ? ' · із заявки' : ''}
                  </small>
                </span>
              </button>
            ))}
          </aside>

          <div className="admin-member-editor">
            {selectedMember && (
              <>
                <form className="contract-panel" onSubmit={saveProfile}>
                  <div className="contract-panel-title">
                    <div>
                      <p className="eyebrow">Profile</p>
                      <h2>{displayName(selectedMember)}</h2>
                    </div>
                    <UserCog size={28} />
                  </div>

                  <div className="form-grid three">
                    <label>
                      RP-нік
                      <input name="rpNickname" value={profileForm.rpNickname} onChange={updateProfileField} />
                    </label>
                    <label>
                      Ранг
                      <input name="rank" value={profileForm.rank} onChange={updateProfileField} placeholder="Боєць" />
                    </label>
                    <label>
                      Статус
                      <select name="status" value={profileForm.status} onChange={updateProfileField}>
                        <option value="active">active</option>
                        <option value="trial">trial</option>
                        <option value="vacation">vacation</option>
                        <option value="blocked">blocked</option>
                      </select>
                    </label>
                    <label>
                      Посада
                      <input name="position" value={profileForm.position} onChange={updateProfileField} placeholder="Контракти / бізнес" />
                    </label>
                    <label>
                      Зарплата / бонус
                      <input name="salary" value={profileForm.salary} onChange={updateProfileField} inputMode="numeric" />
                    </label>
                    <label>
                      Авто
                      <input name="vehicle" value={profileForm.vehicle} onChange={updateProfileField} />
                    </label>
                    <label>
                      Бізнес
                      <input name="business" value={profileForm.business} onChange={updateProfileField} />
                    </label>
                  </div>
                  <label>
                    Нотатка адміна
                    <textarea name="note" value={profileForm.note} onChange={updateProfileField} />
                  </label>
                  <button className="button primary" type="submit">
                    <Save size={18} /> Зберегти профіль
                  </button>
                </form>

                <div className="contract-calculator-grid">
                  <form className="contract-panel" onSubmit={addWarning}>
                    <div className="contract-panel-title">
                      <div>
                        <p className="eyebrow">Warnings</p>
                        <h2>Попередження</h2>
                      </div>
                      <AlertTriangle size={28} />
                    </div>
                    <label>
                      Рівень
                      <select value={warningForm.level} onChange={(event) => setWarningForm((current) => ({ ...current, level: event.target.value }))}>
                        <option value="warning">warning</option>
                        <option value="strict">strict</option>
                        <option value="critical">critical</option>
                      </select>
                    </label>
                    <label>
                      Причина
                      <textarea
                        required
                        value={warningForm.reason}
                        onChange={(event) => setWarningForm((current) => ({ ...current, reason: event.target.value }))}
                      />
                    </label>
                    <button className="button primary" type="submit">
                      <AlertTriangle size={18} /> Додати
                    </button>
                  </form>

                  <div className="contract-table-panel">
                    <div className="contract-panel-title">
                      <div>
                        <p className="eyebrow">History</p>
                        <h2>Активні записи</h2>
                      </div>
                    </div>
                    <div className="compact-list">
                      {warnings
                        .filter((warning) => warning.memberId === selectedId)
                        .map((warning) => (
                          <article key={warning.id}>
                            <span className={`status ${warning.level === 'critical' ? 'rejected' : 'new'}`}>{warning.level}</span>
                            <strong>{warning.reason}</strong>
                            <p>{formatDate(warning.createdAt)} · @{warning.createdBy?.username || 'admin'}</p>
                            <button className="icon-button" type="button" onClick={() => deleteWarning(warning.id)} aria-label="Видалити попередження">
                              <Trash2 size={16} />
                            </button>
                          </article>
                        ))}
                      {warnings.filter((warning) => warning.memberId === selectedId).length === 0 && <p>Попереджень немає.</p>}
                    </div>
                  </div>
                </div>
              </>
            )}
            {!selectedMember && !loading && (
              <div className="contract-panel">
                <div className="contract-panel-title">
                  <div>
                    <p className="eyebrow">Empty</p>
                    <h2>Немає кого редагувати</h2>
                  </div>
                  <UserCog size={28} />
                </div>
                <p>
                  Тут з’являться учасники після синхронізації бота або після першої заявки через Discord Login.
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section className="band" title="Журнал дій" eyebrow="Logs">
        <div className="compact-list">
          {logs.map((log) => (
            <article key={log.id}>
              <span className="status new">{log.action}</span>
              <strong>{log.targetId}</strong>
              <p>
                {formatDate(log.createdAt)} · @{log.admin?.username || 'admin'}
              </p>
            </article>
          ))}
          {logs.length === 0 && (
            <p>
              <ClipboardList size={18} /> Логів поки немає.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
