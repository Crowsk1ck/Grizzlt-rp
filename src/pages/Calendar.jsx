import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Edit3,
  MapPin,
  Plus,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { useAuth } from '../lib/auth.jsx';
import { db } from '../lib/firebase.js';
import './calendar.css';

const TYPE_META = {
  all: { label: 'Всі', short: 'Всі', className: 'all' },
  meeting: { label: 'Збори', short: 'Збір', className: 'meeting' },
  war: { label: 'Війни', short: 'Війна', className: 'war' },
  training: { label: 'Тренування', short: 'Трен.', className: 'training' },
  convoy: { label: 'Конвої', short: 'Конвой', className: 'convoy' },
  other: { label: 'Інше', short: 'Інше', className: 'other' },
};

const FILTERS = ['all', 'meeting', 'war', 'training', 'convoy', 'other'];
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

const emptyForm = {
  title: '',
  type: 'meeting',
  date: formatDateKey(new Date()),
  time: '20:00',
  location: '',
  description: '',
  rewardMoney: '',
  rewardXp: '',
};

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(value) {
  const [year, month, day] = String(value || '').split('-').map(Number);
  return new Date(year || 1970, (month || 1) - 1, day || 1);
}

function monthTitle(date) {
  return date.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' });
}

function buildMonthDays(activeMonth) {
  const first = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
}

function normalizeEvent(snapshotDoc) {
  const data = snapshotDoc.data();
  return {
    id: snapshotDoc.id,
    title: data.title || 'Без назви',
    type: data.type || 'other',
    date: data.date || '',
    time: data.time || '',
    location: data.location || '',
    description: data.description || '',
    rewardMoney: Number(data.rewardMoney || 0),
    rewardXp: Number(data.rewardXp || 0),
    participants: Array.isArray(data.participants) ? data.participants : [],
    createdBy: data.createdBy || null,
    createdAt: data.createdAt || null,
  };
}

function countByStatus(participants, status) {
  return participants.filter((participant) => participant.status === status).length;
}

export default function Calendar() {
  const { user, isAdmin } = useAuth();
  const [activeMonth, setActiveMonth] = useState(() => new Date());
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [selectedDate, setSelectedDate] = useState(formatDateKey(new Date()));
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setError('Firebase Firestore не підключено. Перевір VITE_FIREBASE_* змінні.');
      return undefined;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'events'),
      (snapshot) => {
        const nextEvents = snapshot.docs.map(normalizeEvent).sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
        setEvents(nextEvents);
        setLoading(false);
        setError('');
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const filteredEvents = useMemo(
    () => events.filter((event) => filter === 'all' || event.type === filter),
    [events, filter],
  );

  const eventsByDate = useMemo(() => {
    const map = new Map();
    filteredEvents.forEach((event) => {
      if (!map.has(event.date)) map.set(event.date, []);
      map.get(event.date).push(event);
    });
    return map;
  }, [filteredEvents]);

  const monthDays = useMemo(() => buildMonthDays(activeMonth), [activeMonth]);
  const todayKey = formatDateKey(new Date());
  const selectedEvent = events.find((event) => event.id === selectedEventId) || filteredEvents.find((event) => event.date === selectedDate) || filteredEvents[0] || null;
  const selectedParticipant = selectedEvent?.participants.find((participant) => participant.id === user?.id);
  const futureEvents = filteredEvents.filter((event) => event.date >= todayKey).slice(0, 8);
  const goingParticipants = selectedEvent?.participants.filter((participant) => participant.status === 'going') || [];

  function shiftMonth(direction) {
    setActiveMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1));
  }

  function goToday() {
    const today = new Date();
    setActiveMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(formatDateKey(today));
  }

  function openCreateForm() {
    setEditingId('');
    setForm({ ...emptyForm, date: selectedDate || todayKey });
    setShowForm(true);
  }

  function openEditForm(event) {
    setEditingId(event.id);
    setForm({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      rewardMoney: String(event.rewardMoney || ''),
      rewardXp: String(event.rewardXp || ''),
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId('');
    setForm(emptyForm);
    setSaving(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!db || !user || !isAdmin) return;

    const payload = {
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      time: form.time,
      location: form.location.trim(),
      description: form.description.trim(),
      rewardMoney: Number(form.rewardMoney || 0),
      rewardXp: Number(form.rewardXp || 0),
    };

    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await updateDoc(doc(db, 'events', editingId), payload);
      } else {
        const created = await addDoc(collection(db, 'events'), {
          ...payload,
          participants: [],
          createdAt: serverTimestamp(),
          createdBy: {
            id: user.id,
            username: user.username,
          },
        });
        setSelectedEventId(created.id);
      }
      closeForm();
    } catch (submitError) {
      setError(submitError.message);
      setSaving(false);
    }
  }

  async function handleDelete(eventId) {
    if (!db || !isAdmin) return;
    if (!window.confirm('Видалити цю подію?')) return;

    await deleteDoc(doc(db, 'events', eventId));
    if (selectedEventId === eventId) setSelectedEventId('');
  }

  async function setParticipation(status) {
    if (!db || !user || !selectedEvent) {
      setError('Щоб відмітитися на події, спочатку увійди через Discord.');
      return;
    }

    const nextParticipant = {
      id: user.id,
      username: user.globalName || user.username,
      avatar: user.avatar,
      status,
    };
    const participants = selectedEvent.participants.filter((participant) => participant.id !== user.id);
    participants.push(nextParticipant);

    await updateDoc(doc(db, 'events', selectedEvent.id), { participants });
  }

  return (
    <>
      <PageHero
        eyebrow="Family schedule"
        title="Календар подій"
        text="Плануй збори, війни, тренування, конвої та сімейні RP-активності Grizzly Family."
      />

      <Section className="calendar-page">
        <div className="calendar-toolbar">
          <div className="calendar-titlebox">
            <CalendarDays size={26} />
            <div>
              <p className="eyebrow">Місяць</p>
              <h2>{monthTitle(activeMonth)}</h2>
            </div>
          </div>

          <div className="calendar-actions">
            <button className="icon-button" type="button" onClick={() => shiftMonth(-1)} aria-label="Попередній місяць">
              <ChevronLeft size={20} />
            </button>
            <button className="button secondary" type="button" onClick={goToday}>Сьогодні</button>
            <button className="icon-button" type="button" onClick={() => shiftMonth(1)} aria-label="Наступний місяць">
              <ChevronRight size={20} />
            </button>
            {isAdmin && (
              <button className="button primary" type="button" onClick={openCreateForm}>
                <Plus size={18} /> Створити подію
              </button>
            )}
          </div>
        </div>

        <div className="calendar-filters">
          {FILTERS.map((type) => (
            <button key={type} className={filter === type ? 'active' : ''} type="button" onClick={() => setFilter(type)}>
              {TYPE_META[type].label}
            </button>
          ))}
        </div>

        {error && <p className="auth-alert">{error}</p>}
        {loading && <p className="calendar-loading">Завантажуємо календар...</p>}

        <div className="calendar-layout">
          <div className="calendar-board">
            <div className="calendar-weekdays">
              {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
            </div>

            <div className="calendar-grid">
              {monthDays.map((day) => {
                const dateKey = formatDateKey(day);
                const dayEvents = eventsByDate.get(dateKey) || [];
                const isCurrentMonth = day.getMonth() === activeMonth.getMonth();
                const isToday = dateKey === todayKey;
                const isSelected = dateKey === selectedDate;

                return (
                  <button
                    className={`calendar-day ${isCurrentMonth ? '' : 'muted'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    <span className="day-number">{day.getDate()}</span>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          className={`day-event ${TYPE_META[event.type]?.className || 'other'}`}
                          key={event.id}
                          onClick={(clickEvent) => {
                            clickEvent.stopPropagation();
                            setSelectedDate(event.date);
                            setSelectedEventId(event.id);
                          }}
                        >
                          {event.time} {event.title}
                        </span>
                      ))}
                      {dayEvents.length > 3 && <span className="day-more">+{dayEvents.length - 3}</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="event-details-panel">
            <div className="event-details-head">
              <p className="eyebrow">Деталі події</p>
              {selectedEvent && <span className={`event-type ${TYPE_META[selectedEvent.type]?.className || 'other'}`}>{TYPE_META[selectedEvent.type]?.label || 'Інше'}</span>}
            </div>

            {!selectedEvent && (
              <div className="calendar-empty">
                <CalendarDays size={42} />
                <h3>Подію не вибрано</h3>
                <p>Клікни на подію в календарі або створи нову, якщо ти адмін.</p>
              </div>
            )}

            {selectedEvent && (
              <>
                <h2>{selectedEvent.title}</h2>
                <div className="event-meta-list">
                  <span><CalendarDays size={16} /> {selectedEvent.date}</span>
                  <span><Clock size={16} /> {selectedEvent.time}</span>
                  <span><MapPin size={16} /> {selectedEvent.location}</span>
                  <span><Coins size={16} /> ${selectedEvent.rewardMoney.toLocaleString('uk-UA')}</span>
                  <span><Star size={16} /> {selectedEvent.rewardXp.toLocaleString('uk-UA')} XP</span>
                  <span><Users size={16} /> {selectedEvent.participants.length} відміток</span>
                </div>
                <p className="event-description">{selectedEvent.description}</p>

                <div className="rsvp-box">
                  <p>Твій статус: <strong>{selectedParticipant ? TYPE_META_STATUS[selectedParticipant.status] : 'не вибрано'}</strong></p>
                  <div className="rsvp-actions">
                    <button className={selectedParticipant?.status === 'going' ? 'active going' : ''} type="button" onClick={() => setParticipation('going')}>
                      <Check size={16} /> Я буду
                    </button>
                    <button className={selectedParticipant?.status === 'maybe' ? 'active maybe' : ''} type="button" onClick={() => setParticipation('maybe')}>
                      <Star size={16} /> Можливо
                    </button>
                    <button className={selectedParticipant?.status === 'declined' ? 'active declined' : ''} type="button" onClick={() => setParticipation('declined')}>
                      <X size={16} /> Не буду
                    </button>
                  </div>
                </div>

                <div className="participants-summary">
                  <div><strong>{countByStatus(selectedEvent.participants, 'going')}</strong><span>будуть</span></div>
                  <div><strong>{countByStatus(selectedEvent.participants, 'maybe')}</strong><span>можливо</span></div>
                  <div><strong>{countByStatus(selectedEvent.participants, 'declined')}</strong><span>не будуть</span></div>
                </div>

                {isAdmin && (
                  <div className="admin-event-tools">
                    <button className="button secondary" type="button" onClick={() => openEditForm(selectedEvent)}>
                      <Edit3 size={16} /> Редагувати
                    </button>
                    <button className="danger-button" type="button" onClick={() => handleDelete(selectedEvent.id)}>
                      <Trash2 size={16} /> Видалити
                    </button>
                  </div>
                )}

                {isAdmin && (
                  <div className="going-list">
                    <h3>Хто натиснув “Я буду”</h3>
                    {goingParticipants.length === 0 && <p>Поки ніхто не підтвердив участь.</p>}
                    {goingParticipants.map((participant) => (
                      <div key={participant.id}>
                        <img src={participant.avatar || '/assets/grizzly-logo.png'} alt={participant.username} />
                        <span>{participant.username}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </aside>
        </div>

        <div className="upcoming-events-panel">
          <div className="section-heading">
            <p className="eyebrow">Next</p>
            <h2>Майбутні події</h2>
          </div>
          <div className="upcoming-events-grid">
            {futureEvents.map((event) => (
              <button key={event.id} type="button" onClick={() => {
                setSelectedEventId(event.id);
                setSelectedDate(event.date);
                setActiveMonth(parseDateKey(event.date));
              }}>
                <span className={`event-type ${TYPE_META[event.type]?.className || 'other'}`}>{TYPE_META[event.type]?.short || 'Інше'}</span>
                <strong>{event.title}</strong>
                <small>{event.date} о {event.time}</small>
                <p>{event.location}</p>
              </button>
            ))}
            {futureEvents.length === 0 && <p className="calendar-empty-line">Майбутніх подій поки немає.</p>}
          </div>
        </div>

        {showForm && isAdmin && (
          <div className="calendar-modal" role="dialog" aria-modal="true">
            <form className="calendar-form" onSubmit={handleSubmit}>
              <div className="calendar-form-head">
                <div>
                  <p className="eyebrow">{editingId ? 'Редагування' : 'Нова подія'}</p>
                  <h2>{editingId ? 'Редагувати подію' : 'Створити подію'}</h2>
                </div>
                <button className="icon-button" type="button" onClick={closeForm} aria-label="Закрити форму">
                  <X size={20} />
                </button>
              </div>

              <label>
                Назва події
                <input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Збір K2" />
              </label>
              <div className="calendar-form-grid">
                <label>
                  Тип події
                  <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
                    <option value="meeting">Збори</option>
                    <option value="war">Війни</option>
                    <option value="training">Тренування</option>
                    <option value="convoy">Конвої</option>
                    <option value="other">Інше</option>
                  </select>
                </label>
                <label>
                  Дата
                  <input required type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
                </label>
                <label>
                  Час
                  <input required type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
                </label>
                <label>
                  Місце
                  <input required value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} placeholder="Гора Чиліад" />
                </label>
                <label>
                  Нагорода $
                  <input min="0" type="number" value={form.rewardMoney} onChange={(event) => setForm({ ...form, rewardMoney: event.target.value })} placeholder="500000" />
                </label>
                <label>
                  Нагорода XP
                  <input min="0" type="number" value={form.rewardXp} onChange={(event) => setForm({ ...form, rewardXp: event.target.value })} placeholder="500" />
                </label>
              </div>
              <label>
                Опис
                <textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Обовʼязковий збір сімʼї" />
              </label>

              <button className="button primary" type="submit" disabled={saving}>
                {saving ? 'Зберігаємо...' : editingId ? 'Зберегти зміни' : 'Створити подію'}
              </button>
            </form>
          </div>
        )}
      </Section>
    </>
  );
}

const TYPE_META_STATUS = {
  going: 'Я буду',
  maybe: 'Можливо',
  declined: 'Не буду',
};
