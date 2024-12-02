import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBc88gwuZqxtpokWMEP5bNWRH3YgFr8Qc0",
  authDomain: "tuti-time.firebaseapp.com",
  projectId: "tuti-time",
  storageBucket: "tuti-time.firebasestorage.app",
  messagingSenderId: "557053395365",
  appId: "1:557053395365:web:2ffe574d0fefe0d470e84c",
  measurementId: "G-LY3ZLL15F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Fonction utilitaire pour la connexion admin
export const loginAdmin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Échec de la connexion');
  }
};

// Fonction utilitaire pour la déconnexion
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : 'Échec de la déconnexion');
  }
};
