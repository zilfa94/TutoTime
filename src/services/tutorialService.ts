import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

class TutorialService {
  async publishTutorial(tutorialId: string): Promise<void> {
    try {
      const tutorialRef = doc(db, 'tutorials', tutorialId);
      await updateDoc(tutorialRef, {
        published: true,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Erreur lors de la publication du tutoriel:', error);
      throw error;
    }
  }
}

const tutorialService = new TutorialService();
export default tutorialService;
