import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBxi9jixmJPGWodjLaNlY3oXeHvOGzQtlc",
  authDomain: "grizzly-6c924.firebaseapp.com",
  projectId: "grizzly-6c924",
  storageBucket: "grizzly-6c924.firebasestorage.app",
  messagingSenderId: "1098522296641",
  appId: "1:1098522296641:web:1fac71feda4e7ad9a8e1c0",
  measurementId: "G-GPLGFK68VD"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const realtimeDb = getDatabase(app)
export const auth = getAuth(app)
