import { Activity, Search, Users } from 'lucide-react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import PageHero from '../components/PageHero.jsx';
import Section from '../components/Section.jsx';
import { roster } from '../data/siteData.js';
import { db } from '../lib/firebase.js';

function sortMembers(a, b, sortMode) {
  if (sortMode === 'name') {
    return (a.nickname || a.username).localeCompare(b.nickname || b.username);
  }

  return Number(b.online) - Number(a.online) || (a.nickname || a.username).localeCompare(b.nickname || b.username);
}

export default function Roster() {
  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortMode, setSortMode] = useState('online');

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    const loadingTimer = window.setTimeout(() => {
      if (active) setLoading(false);
    }, 8000);

    function mapMembers(snapshot) {
      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((member) => !member.bot);
    }

    getDocs(collection(db, 'discord_members'))
      .then((snapshot) => {
        if (!active) return;
        setMembers(mapMembers(snapshot));
        setLoading(false);
      })
      .catch((snapshotError) => {
        if (!active) return;
        setError(snapshotError.message);
        setLoading(false);
      });

    const unsubscribeMembers = onSnapshot(
      collection(db, 'discord_members'),
      (snapshot) => {
        if (!active) return;
        setMembers(mapMembers(snapshot));
        setLoading(false);
      },
      (snapshotError) => {
        if (!active) return;
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    const unsubscribeStats = onSnapshot(doc(db, 'stats', 'discord_members'), (snapshot) => {
      setStats(snapshot.exists() ? snapshot.data() : null);
    });

    return () => {
      active = false;
      window.clearTimeout(loadingTimer);
      unsubscribeMembers();
      unsubscribeStats();
    };
  }, []);

  const visibleStats = useMemo(() => {
    const online = members.filter((member) => member.online).length;
    return {
      total: stats?.members || members.length,
      online: stats?.online || online,
    };
  }, [members, stats]);

  const filteredMembers = useMemo(() => {
    const searchValue = query.trim().toLowerCase();

    return members
      .filter((member) => {
        if (filter === 'online') return member.online;
        if (filter === 'offline') return !member.online;
        return true;
      })
      .filter((member) => {
        if (!searchValue) return true;
        const name = `${member.nickname || ''} ${member.username || ''}`.toLowerCase();
      }
