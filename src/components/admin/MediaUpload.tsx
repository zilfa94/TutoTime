import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { cloudinaryConfig } from '../../config/cloudinary';

interface TutorialStep {
  title: string;
  description: string;
  mediaUrl?: string;
}

interface Tutorial {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  prerequisites: string;
  tags: string[];
  thumbnailUrl: string;
  steps: TutorialStep[];
  createdAt: Date;
}

const MediaUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [duration, setDuration] = useState('');
  const [prerequisites, setPrerequisites] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [steps, setSteps] = useState<TutorialStep[]>([{ title: '', description: '' }]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleStepChange = (index: number, field: keyof TutorialStep, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, { title: '', description: '' }]);
  };

  const removeStep = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagArray = e.target.value.split(',').map(tag => tag.trim());
    setTags(tagArray);
  };

  const generateSignature = (timestamp: number) => {
    const str = `timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
    return crypto.subtle.digest('SHA-1', new TextEncoder().encode(str))
      .then(buffer => {
        return Array.from(new Uint8Array(buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
      });
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = await generateSignature(timestamp);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp.toString());
    formData.append('api_key', cloudinaryConfig.apiKey);
    formData.append('signature', signature);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement');
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Erreur Cloudinary:', error);
      throw new Error('Erreur lors du téléchargement sur Cloudinary');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thumbnail || !title || !description || steps.some(step => !step.title || !step.description)) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const thumbnailUrl = await uploadToCloudinary(thumbnail);
      
      const tutorial: Tutorial = {
        title,
        description,
        difficulty,
        duration,
        prerequisites,
        tags,
        thumbnailUrl,
        steps,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'tutorials'), tutorial);
      
      // Reset form
      setTitle('');
      setDescription('');
      setDifficulty('beginner');
      setDuration('');
      setPrerequisites('');
      setTags([]);
      setThumbnail(null);
      setSteps([{ title: '', description: '' }]);
      
      if (e.target instanceof HTMLFormElement) {
        e.target.reset();
      }
    } catch (error) {
      setError('Erreur lors de la création du tutoriel');
      console.error('Erreur:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="media-upload">
      <h3>Créer un nouveau tutoriel</h3>
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        
        {/* Informations de base */}
        <div className="form-section">
          <h4>Informations générales</h4>
          <div className="form-group">
            <input
              type="text"
              placeholder="Titre du tutoriel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              placeholder="Description du tutoriel"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
              required
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Durée estimée (ex: 2 heures)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Prérequis"
              value={prerequisites}
              onChange={(e) => setPrerequisites(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Tags (séparés par des virgules)"
              onChange={handleTagsChange}
            />
          </div>

          <div className="form-group">
            <label className="file-input-label">
              <span>Image de couverture</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                required
              />
            </label>
          </div>
        </div>

        {/* Étapes du tutoriel */}
        <div className="form-section">
          <h4>Étapes du tutoriel</h4>
          {steps.map((step, index) => (
            <div key={index} className="step-container">
              <h5>Étape {index + 1}</h5>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Titre de l'étape"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <textarea
                  placeholder="Description détaillée de l'étape"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                  required
                />
              </div>
              {steps.length > 1 && (
                <button
                  type="button"
                  className="remove-step-button"
                  onClick={() => removeStep(index)}
                >
                  Supprimer cette étape
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="add-step-button"
            onClick={addStep}
          >
            Ajouter une étape
          </button>
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={uploading}
        >
          {uploading ? 'Création en cours...' : 'Créer le tutoriel'}
        </button>
      </form>
    </div>
  );
};

export default MediaUpload;
