import { initializeApp } from 'firebase/app'
import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where,
orderBy,
deleteDoc,
doc
} from 'firebase/firestore'

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

export {
collection,
addDoc,
getDocs,
query,
where,
orderBy,
deleteDoc,
doc
}