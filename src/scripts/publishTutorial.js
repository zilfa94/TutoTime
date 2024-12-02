const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');

// Configuration Firebase (copiez celle de votre fichier config/firebase.ts)
const firebaseConfig = {
  apiKey: "AIzaSyDxHpJZK-VHj0VJpg_zL-P4GdFtk0AJFjg",
  authDomain: "tuti-time.firebaseapp.com",
  projectId: "tuti-time",
  storageBucket: "tuti-time.appspot.com",
  messagingSenderId: "1066668099897",
  appId: "1:1066668099897:web:d87b6f1f3c7e2a3c0f2e0c"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ID du tutoriel à publier
const tutorialId = 'ZCICBxQ6J44REfYTQVdJ';

async function publishTutorial() {
  try {
    const tutorialRef = doc(db, 'tutorials', tutorialId);
    await updateDoc(tutorialRef, {
      published: true,
      updatedAt: new Date()
    });
    console.log('Tutoriel publié avec succès !');
  } catch (error) {
    console.error('Erreur lors de la publication du tutoriel:', error);
  }
}

publishTutorial();
