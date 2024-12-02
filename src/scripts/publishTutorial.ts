import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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
