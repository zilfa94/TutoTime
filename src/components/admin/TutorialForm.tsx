import React, { useState, ChangeEvent, FormEvent } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import cloudinaryService from '../../services/cloudinary';
import '../../styles/tutorialForm.css';

interface TutorialStep {
  title: string;
  description: string;
  mediaUrl?: string;
  order: number;
}

interface Tutorial {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnailUrl: string;
  steps: TutorialStep[];
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  published: boolean;
}

const TutorialForm: React.FC = () => {
  const [tutorial, setTutorial] = useState<Tutorial>({
    title: '',
    description: '',
    difficulty: 'beginner',
    tags: [],
    thumbnailUrl: '/placeholder-tutorial.jpg',
    steps: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'user123',
    published: false
  });

  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingStepIndex, setUploadingStepIndex] = useState<number | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTutorial(prev => ({
      ...prev,
      [name]: name === 'tags' ? value.split(',').map(tag => tag.trim()) : value,
      updatedAt: new Date()
    }));
  };

  const handleStepChange = (index: number, field: keyof TutorialStep, value: string) => {
    setTutorial(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) =>
        i === index ? { ...step, [field]: value } : step
      ),
      updatedAt: new Date()
    }));
  };

  const handleStepMediaChange = async (index: number, e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setError('');
        setUploadingStepIndex(index);
        const file = e.target.files[0];
        const uploadResult = await cloudinaryService.uploadFile(file);
        setTutorial(prev => ({
          ...prev,
          steps: prev.steps.map((step, i) =>
            i === index ? { ...step, mediaUrl: uploadResult.url } : step
          ),
          updatedAt: new Date()
        }));
      } catch (err) {
        setError('Erreur lors de l\'upload de l\'image de l\'étape');
        console.error(err);
      } finally {
        setUploadingStepIndex(null);
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setError('');
        setIsUploading(true);
        const file = e.target.files[0];
        const uploadResult = await cloudinaryService.uploadFile(file);
        setTutorial(prev => ({
          ...prev,
          thumbnailUrl: uploadResult.url,
          updatedAt: new Date()
        }));
      } catch (err) {
        setError('Erreur lors de l\'upload de l\'image');
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const addStep = () => {
    setTutorial(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        {
          title: '',
          description: '',
          mediaUrl: '/placeholder-step.jpg',
          order: prev.steps.length
        }
      ],
      updatedAt: new Date()
    }));
  };

  const removeStep = (index: number) => {
    setTutorial(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index).map((step, i) => ({
        ...step,
        order: i
      })),
      updatedAt: new Date()
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Validation des champs requis
      if (!tutorial.title.trim()) {
        throw new Error('Le titre est requis');
      }
      if (!tutorial.description.trim()) {
        throw new Error('La description est requise');
      }
      if (tutorial.steps.length === 0) {
        throw new Error('Au moins une étape est requise');
      }
      if (tutorial.steps.some(step => !step.title.trim() || !step.description.trim())) {
        throw new Error('Toutes les étapes doivent avoir un titre et une description');
      }

      // Création du tutoriel
      const docRef = await addDoc(collection(db, 'tutorials'), {
        ...tutorial,
        steps: tutorial.steps.map((step, index) => ({
          ...step,
          order: index,
          mediaUrl: step.mediaUrl || '/placeholder-step.jpg'
        }))
      });

      setSuccess('Tutoriel créé avec succès !');
      
      // Réinitialisation du formulaire
      setTutorial({
        title: '',
        description: '',
        difficulty: 'beginner',
        tags: [],
        thumbnailUrl: '/placeholder-tutorial.jpg',
        steps: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        authorId: 'user123',
        published: false
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="tutorial-form-container">
      <h2>Créer un nouveau tutoriel</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form className="tutorial-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Informations générales</h3>

          <div className="form-field">
            <label>Titre</label>
            <input
              type="text"
              name="title"
              value={tutorial.title}
              onChange={handleInputChange}
              placeholder="Titre du tutoriel"
              required
            />
          </div>

          <div className="form-field">
            <label>Image de couverture</label>
            <label className={`file-upload ${isUploading ? 'uploading' : ''}`}>
              {isUploading ? 'Upload en cours...' : 
                tutorial.thumbnailUrl !== '/placeholder-tutorial.jpg' ? 
                'Changer l\'image' : 'Choisir une image'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            {tutorial.thumbnailUrl !== '/placeholder-tutorial.jpg' && (
              <img 
                src={tutorial.thumbnailUrl} 
                alt="Aperçu" 
                className="thumbnail-preview"
              />
            )}
          </div>

          <div className="form-field">
            <label>Description</label>
            <textarea
              name="description"
              value={tutorial.description}
              onChange={handleInputChange}
              placeholder="Description du tutoriel"
              required
            />
          </div>

          <div className="form-field">
            <label>Niveau de difficulté</label>
            <select
              name="difficulty"
              value={tutorial.difficulty}
              onChange={handleInputChange}
              required
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>

          <div className="form-field">
            <label>Tags</label>
            <input
              type="text"
              name="tags"
              value={tutorial.tags.join(', ')}
              onChange={handleInputChange}
              placeholder="Tags (séparés par des virgules)"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Étapes du tutoriel</h3>
          <button type="button" onClick={addStep} className="add-step-button">
            + Ajouter une étape
          </button>
          
          <div className="step-list">
            {tutorial.steps.map((step, index) => (
              <div key={index} className="step-item">
                <div className="step-header">
                  <h4>Étape {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="remove-step-button"
                  >
                    Supprimer
                  </button>
                </div>
                
                <div className="form-field">
                  <label>Titre de l'étape</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                    placeholder="Titre de l'étape"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Description de l'étape</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                    placeholder="Description de l'étape"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Image de l'étape</label>
                  <label className={`file-upload ${uploadingStepIndex === index ? 'uploading' : ''}`}>
                    {uploadingStepIndex === index ? 'Upload en cours...' :
                      step.mediaUrl !== '/placeholder-step.jpg' ? 
                      'Changer l\'image' : 'Ajouter une image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleStepMediaChange(index, e)}
                      disabled={uploadingStepIndex !== null}
                    />
                  </label>
                  {step.mediaUrl !== '/placeholder-step.jpg' && (
                    <img 
                      src={step.mediaUrl} 
                      alt={`Étape ${index + 1}`} 
                      className="step-image-preview"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Créer le tutoriel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorialForm;
