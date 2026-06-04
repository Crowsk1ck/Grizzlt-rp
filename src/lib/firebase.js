import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const firebaseStatus = {
  connected: Boolean(db),
  projectId: firebaseConfig.projectId || null,
};

export async function addFirestoreRecord(collectionName, payload, options = {}) {
  if (!db) {
    const cached = JSON.parse(localStorage.getItem('pending-firestore-records') || '[]');
    cached.push({ collectionName, documentId: options.documentId || null, payload, createdAt: new Date().toISOString() });
    localStorage.setItem('pending-firestore-records', JSON.stringify(cached));
    return { offline: true };
  }

  const data = {
    ...payload,
    source: 'grizzly-family-site',
    createdAt: serverTimestamp(),
  };

  if (options.documentId) {
    await setDoc(doc(db, collectionName, options.documentId), data);
    return { id: options.documentId };
  }

  return addDoc(collection(db, collectionName), data);
}
