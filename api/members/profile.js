import { getAdminDb } from '../_firebaseAdmin.js';
import { isAdminUser, readSession } from '../_auth.js';

const acceptedRoleId = process.env.VITE_ACCEPTED_ROLE_ID || process.env.DISCORD_ACCEPTED_ROLE_ID || '1390073033687044236';

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function normalizeName(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^@/, '');
}

function serializeDoc(snapshot) {
  if (!snapshot.exists) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    updatedAt: toJsonDate(data.updatedAt),
    reviewedAt: toJsonDate(data.reviewedAt),
  };
}

function serializeWarning(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
  };
}

function contractMatches(contract, names) {
  const players = Array.isArray(contract.players) ? contract.players : [];
  return players.some((player) => names.has(normalizeName(player)));
}

function summarizeContracts(contracts, names) {
  const matched = contracts.filter((contract) => contractMatches(contract, names));
  const gross = matched.reduce((sum, contract) => sum + Number(contract.amount || 0), 0);
  const dates = matched
    .map((contract) => contract.date || toJsonDate(contract.createdAt))
    .filter(Boolean)
    .sort();

  return {
    contracts: matched.length,
    gross,
    average: matched.length ? Math.round(gross / matched.length) : 0,
    lastDate: dates.at(-1) || null,
    recent: matched.slice(0, 8).map((contract) => ({
      id: contract.id,
      name: contract.name,
      amount: contract.amount,
      date: contract.date || toJsonDate(contract.createdAt),
    })),
  };
}

export default async function handler(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const db = getAdminDb();
    const [memberDoc, profileDoc, applicationDoc, warningsSnapshot, contractsSnapshot] = await Promise.all([
      db.collection('discord_members').doc(user.id).get(),
      db.collection('member_profiles').doc(user.id).get(),
      db.collection('applications').doc(user.id).get(),
      db.collection('member_warnings').where('memberId', '==', user.id).limit(50).get(),
      db.collection('calculator_contracts').orderBy('createdAt', 'desc').limit(500).get(),
    ]);

    const member = serializeDoc(memberDoc);
    const profile = serializeDoc(profileDoc);
    const application = serializeDoc(applicationDoc);
    const hasFamilyRole = Boolean(isAdminUser(user) || member?.roles?.includes(acceptedRoleId));
    const names = new Set(
      [
        user.username,
        user.globalName,
        member?.username,
        member?.nickname,
        profile?.rpNickname,
        profile?.nickname,
        application?.nickname,
      ]
        .map(normalizeName)
        .filter(Boolean),
    );
    const contracts = contractsSnapshot.docs.map(serializeDoc);
    const warnings = warningsSnapshot.docs
      .map(serializeWarning)
      .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));

    res.status(200).json({
      user,
      member,
      profile,
      application,
      hasFamilyRole,
      progress: summarizeContracts(contracts, names),
      warnings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
