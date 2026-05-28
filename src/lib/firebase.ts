import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyCH6m_BCRqmL3wMd9QXek9mS3W9KxvJU30",
  authDomain: "portofolio-salman.firebaseapp.com",
  databaseURL: "https://portofolio-salman-default-rtdb.firebaseio.com",
  projectId: "portofolio-salman",
  storageBucket: "portofolio-salman.firebasestorage.app",
  messagingSenderId: "51681082240",
  appId: "1:51681082240:web:9a549902410c82a0a19f65",
  measurementId: "G-3X5SGR85DZ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app)
