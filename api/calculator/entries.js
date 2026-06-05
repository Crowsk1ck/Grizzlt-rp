import { isAdminUser, readSession } from '../_auth.js';
import { getAdminDb, serverTimestamp } from '../_firebaseAdmin.js';

const acceptedRoleId = process.env.ACCEPTED_ROLE_ID || process.env.VITE_ACCEPTED_ROLE_ID || '1390073033687044236';
const settingsCollection = 'calculator_settings';
const settingsDocument = 'main';
const contractsCollection = 'calculator_contracts';

const defaultContractTypes = {
  'Автоколона': 120000,
  'Великий контракт': 300000,
  'Охорона угоди': 180000,
  'Поставка': 250000,
};

function toJsonDate(value) {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate().toISOString();
  return value;
}

function cleanText(value, max) {
  return String(value || '').trim().slice(0, max);
}

function cleanDate(value) {
  const date = cleanText(value, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : new Date().toISOString().slice(0, 10);
}

function sortNames(items) {
  return [...new Set((items || []).map((item) => cleanText(item, 80)).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'uk', { sensitivity: 'base' }));
}

function parsePlayers(value) {
  if (Array.isArray(value)) return sortNames(value);
  return sortNames(String(value || '').split(/[.\n,;]+/));
}

function normalizeContractTypes(value) {
  if (typeof value === 'string') {
    return Object.fromEntries(
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [name, amount] = line.split('=');
          return [cleanText(name, 80), Math.round(Number(String(amount || '').replace(/\s+/g, '')))];
        })
        .filter(([name, amount]) => name && Number.isFinite(amount) && amount > 0)
        .sort(([a], [b]) => a.localeCompare(b, 'uk', { sensitivity: 'base' })),
    );
  }

  return Object.fromEntries(
    Object.entries(value || {})
      .map(([name, amount]) => [cleanText(name, 80), Math.round(Number(amount))])
      .filter(([name, amount]) => name && Number.isFinite(amount) && amount > 0)
      .sort(([a], [b]) => a.localeCompare(b, 'uk', { sensitivity: 'base' })),
  );
}

function serializeContract(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toJsonDate(data.createdAt),
    updatedAt: toJsonDate(data.updatedAt),
  };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

async function canUseCalculator(db, user) {
  if (!user?.id) return false;
  if (isAdminUser(user)) return true;

  const member = await db.collection('discord_members').doc(user.id).get();
  const roles = member.exists ? member.data()?.roles : [];

  return Array.isArray(roles) && roles.includes(acceptedRoleId);
}

async function getSettings(db) {
  const doc = await db.collection(settingsCollection).doc(settingsDocument).get();
  if (!doc.exists) {
    return {
      contractTypes: defaultContractTypes,
      players: [],
    };
  }

  const data = doc.data();
  return {
    contractTypes: Object.keys(data.contractTypes || {}).length ? normalizeContractTypes(data.contractTypes) : defaultContractTypes,
    players: sortNames(data.players || []),
  };
}

async function getDiscordPlayers(db) {
  const snapshot = await db.collection('discord_members').limit(500).get();
  return sortNames(
    snapshot.docs
      .map((doc) => doc.data())
      .filter((member) => !member.bot)
      .map((member) => member.nickname || member.globalName || member.username),
  );
}

async function writeSettings(db, data) {
  await db.collection(settingsCollection).doc(settingsDocument).set(
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

async function readCalculatorData(db) {
  const [settings, discordPlayers, contractsSnapshot] = await Promise.all([
    getSettings(db),
    getDiscordPlayers(db).catch(() => []),
    db.collection(contractsCollection).orderBy('createdAt', 'desc').limit(500).get(),
  ]);

  return {
    contractTypes: settings.contractTypes,
    players: sortNames([...settings.players, ...discordPlayers]),
    savedPlayers: settings.players,
    contracts: contractsSnapshot.docs.map(serializeContract),
  };
}

async function ensureAdmin(user, res) {
  if (!isAdminUser(user)) {
    res.status(403).json({ error: 'Admin access required' });
    return false;
  }

  return true;
}

function getQueryId(req) {
  if (req.query?.id) return String(req.query.id);
  try {
    const url = new URL(req.url, 'https://grizzly.local');
    return url.searchParams.get('id');
  } catch {
    return null;
  }
}

async function addContract(db, user, body) {
  const name = cleanText(body.name || body.contractName, 100);
  const amount = Math.round(Number(body.amount));
  const players = parsePlayers(body.players);

  if (!name || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000 || players.length === 0) {
    const error = new Error('Invalid contract data');
    error.statusCode = 400;
    throw error;
  }

  const ref = await db.collection(contractsCollection).add({
    date: cleanDate(body.date),
    name,
    amount,
    players,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: {
      id: user.id,
      username: user.username,
      globalName: user.globalName,
    },
  });

  return serializeContract(await ref.get());
}

async function updateContract(db, user, body) {
  const id = cleanText(body.id, 120);
  if (!id) {
    const error = new Error('Contract id required');
    error.statusCode = 400;
    throw error;
  }

  const ref = db.collection(contractsCollection).doc(id);
  const contract = await ref.get();

  if (!contract.exists) {
    const error = new Error('Contract not found');
    error.statusCode = 404;
    throw error;
  }

  const ownsContract = contract.data()?.createdBy?.id === user.id;
  if (!isAdminUser(user) && !ownsContract) {
    const error = new Error('Only admins or contract author can edit it');
    error.statusCode = 403;
    throw error;
  }

  const name = cleanText(body.name || body.contractName, 100);
  const amount = Math.round(Number(body.amount));
  const players = parsePlayers(body.players);

  if (!name || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000 || players.length === 0) {
    const error = new Error('Invalid contract data');
    error.statusCode = 400;
    throw error;
  }

  await ref.set(
    {
      date: cleanDate(body.date),
      name,
      amount,
      players,
      updatedAt: serverTimestamp(),
      updatedBy: {
        id: user.id,
        username: user.username,
        globalName: user.globalName,
      },
    },
    { merge: true },
  );

  return serializeContract(await ref.get());
}

async function deleteContract(db, user, id) {
  const ref = db.collection(contractsCollection).doc(id);
  const contract = await ref.get();

  if (!contract.exists) {
    const error = new Error('Contract not found');
    error.statusCode = 404;
    throw error;
  }

  const ownsContract = contract.data()?.createdBy?.id === user.id;
  if (!isAdminUser(user) && !ownsContract) {
    const error = new Error('Only admins or contract author can delete it');
    error.statusCode = 403;
    throw error;
  }

  await ref.delete();
}

async function clearContracts(db) {
  const snapshot = await db.collection(contractsCollection).limit(500).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();
}

export default async function handler(req, res) {
  const user = readSession(req);
  if (!user) {
    res.status(401).json({ error: 'Discord login required' });
    return;
  }

  try {
    const db = getAdminDb();
    const hasAccess = await canUseCalculator(db, user);

    if (!hasAccess) {
      res.status(403).json({ error: 'Family role required' });
      return;
    }

    if (req.method === 'GET') {
      res.status(200).json(await readCalculatorData(db));
      return;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const action = body.action || 'addContract';

      if (action === 'addContract') {
        const contract = await addContract(db, user, body);
        res.status(201).json({ contract, ...(await readCalculatorData(db)) });
        return;
      }

      if (action === 'addContractType') {
        if (!(await ensureAdmin(user, res))) return;
        const settings = await getSettings(db);
        const name = cleanText(body.name, 80);
        const amount = Math.round(Number(body.amount));
        if (!name || !Number.isFinite(amount) || amount <= 0) {
          res.status(400).json({ error: 'Invalid contract type' });
          return;
        }
        await writeSettings(db, { contractTypes: normalizeContractTypes({ ...settings.contractTypes, [name]: amount }) });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      if (action === 'saveContractTypes') {
        if (!(await ensureAdmin(user, res))) return;
        const contractTypes = normalizeContractTypes(body.contractTypes || body.settingsText);
        await writeSettings(db, { contractTypes: Object.keys(contractTypes).length ? contractTypes : defaultContractTypes });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      if (action === 'addPlayer') {
        if (!(await ensureAdmin(user, res))) return;
        const settings = await getSettings(db);
        const players = sortNames([...settings.players, ...parsePlayers(body.name || body.playersText)]);
        await writeSettings(db, { players });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      if (action === 'savePlayers') {
        if (!(await ensureAdmin(user, res))) return;
        await writeSettings(db, { players: parsePlayers(body.players || body.playersText) });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      res.status(400).json({ error: 'Unknown calculator action' });
      return;
    }

    if (req.method === 'PATCH') {
      const body = await readJsonBody(req);
      const contract = await updateContract(db, user, body);
      res.status(200).json({ contract, ...(await readCalculatorData(db)) });
      return;
    }

    if (req.method === 'DELETE') {
      const body = await readJsonBody(req).catch(() => ({}));
      const action = body.action || '';

      if (action === 'clearContracts') {
        if (!(await ensureAdmin(user, res))) return;
        await clearContracts(db);
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      if (action === 'deleteContractType') {
        if (!(await ensureAdmin(user, res))) return;
        const settings = await getSettings(db);
        const name = cleanText(body.name, 80);
        const contractTypes = { ...settings.contractTypes };
        delete contractTypes[name];
        await writeSettings(db, { contractTypes: normalizeContractTypes(contractTypes) });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      if (action === 'deletePlayer') {
        if (!(await ensureAdmin(user, res))) return;
        const settings = await getSettings(db);
        const name = cleanText(body.name, 80).toLowerCase();
        await writeSettings(db, { players: settings.players.filter((player) => player.toLowerCase() !== name) });
        res.status(200).json(await readCalculatorData(db));
        return;
      }

      const id = cleanText(body.id || getQueryId(req), 120);
      if (!id) {
        res.status(400).json({ error: 'Contract id required' });
        return;
      }

      await deleteContract(db, user, id);
      res.status(200).json(await readCalculatorData(db));
      return;
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}
