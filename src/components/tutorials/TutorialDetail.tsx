import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Tutorial } from '../../types/Tutorial';
import { DEFAULT_IMAGES } from '../../config/defaultImages';
import '../../styles/tutorialDetail.css';

const TutorialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorial = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const tutorialRef = doc(db, 'tutorials', id);
        const tutorialDoc = await getDoc(tutorialRef);

        if (tutorialDoc.exists()) {
          const data = tutorialDoc.data();
          console.log('Données du tutoriel:', data); 
          console.log('Étapes du tutoriel:', data.steps); 

          const tutorialData = {
            id: tutorialDoc.id,
            title: data.title || '',
            description: data.description || '',
            difficulty: data.difficulty || 'beginner',
            thumbnailUrl: data.thumbnailUrl || '',
            steps: data.steps?.map((step: any, index: number) => {
              console.log(`Étape ${index + 1}:`, step); 
              return {
                ...step,
                mediaUrl: step.mediaUrl || DEFAULT_IMAGES.STEP_PLACEHOLDER
              };
            }) || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            authorId: data.authorId || '',
            published: data.published || false,
            tags: data.tags || []
          } as Tutorial;
          
          console.log('Données formatées:', tutorialData); 
          setTutorial(tutorialData);
        } else {
          setError('Tutoriel non trouvé');
        }
      } catch (err) {
        console.error('Erreur lors de la récupération du tutoriel:', err);
        setError('Une erreur est survenue lors du chargement du tutoriel');
      } finally {
        setLoading(false);
      }
    };

    fetchTutorial();
  }, [id]);

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error || !tutorial) {
    return <div className="error">{error || 'Tutoriel non trouvé'}</div>;
  }

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <div className="tutorial-detail">
      <header className="tutorial-header">
        <div className="tutorial-header-content">
          <h1>{tutorial.title}</h1>
          <div className="tutorial-meta">
            <span className={`difficulty ${tutorial.difficulty}`}>
              {getDifficultyLabel(tutorial.difficulty)}
            </span>
            <span className="date">
              Créé le {tutorial.createdAt.toLocaleDateString()}
            </span>
          </div>
        </div>
      </header>

      <main className="tutorial-content">
        {tutorial.thumbnailUrl && (
          <div className="tutorial-image">
            <img 
              src={tutorial.thumbnailUrl}
              alt={tutorial.title}
              onError={(e) => {
                console.error('Erreur de chargement de l\'image:', tutorial.thumbnailUrl);
                e.currentTarget.src = DEFAULT_IMAGES.TUTORIAL_PLACEHOLDER;
              }}
              onLoad={() => {
                console.log('Image principale chargée avec succès:', tutorial.thumbnailUrl);
              }}
            />
          </div>
        )}
        <div className="tutorial-description">
          <h2>Description</h2>
          <p>{tutorial.description}</p>
        </div>

        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="tutorial-tags">
            {tutorial.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="tutorial-steps">
          <h2>Étapes du tutoriel</h2>
          {tutorial.steps.map((step, index) => (
            <div key={index} className="step">
              <div className="step-header">
                <h3>
                  <span className="step-number">{index + 1}</span>
                  {step.title}
                </h3>
              </div>
              <div className="step-content">
                <p>{step.description}</p>
                {step.mediaUrl ? (
                  <div className="step-media">
                    <img 
                      src={step.mediaUrl}
                      alt={`Étape ${index + 1}: ${step.title}`}
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image de l\'étape:', step.mediaUrl);
                        e.currentTarget.src = DEFAULT_IMAGES.STEP_PLACEHOLDER;
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default TutorialDetail;
