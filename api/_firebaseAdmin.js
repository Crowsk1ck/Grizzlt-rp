import admin from 'firebase-admin';

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  return JSON.parse(raw);
}

export function getAdminDb() {
  if (!admin.apps.length) {
    const serviceAccount = getServiceAccount();
    if (!serviceAccount) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT is missing');
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.firestore();
}

export function serverTimestamp() {
  return admin.firestore.FieldValue.serverTimestamp();
}
