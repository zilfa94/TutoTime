import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, where, limit, startAfter, QueryDocumentSnapshot, DocumentData } from '@firebase/firestore';
import { db } from '../../config/firebase';
import { Tutorial } from '../../types/Tutorial';
import '../../styles/tutorials.css';

const TUTORIALS_PER_PAGE = 9;

const TutorialList: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchTutorials = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      
      const tutorialsRef = collection(db, 'tutorials');
      let baseQuery;

      // Construction de la requête de base
      if (selectedDifficulty) {
        baseQuery = query(
          tutorialsRef,
          where('difficulty', '==', selectedDifficulty),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          orderBy('__name__', 'desc')
        );
      } else {
        baseQuery = query(
          tutorialsRef,
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          orderBy('__name__', 'desc')
        );
      }

      // Ajout de la pagination
      let finalQuery;
      if (isLoadMore && lastVisible) {
        finalQuery = query(baseQuery, startAfter(lastVisible), limit(TUTORIALS_PER_PAGE));
      } else {
        finalQuery = query(baseQuery, limit(TUTORIALS_PER_PAGE));
      }

      // Exécution de la requête
      const querySnapshot = await getDocs(finalQuery);
      
      // Ajout des logs de débogage
      console.log('Nombre de tutoriels trouvés:', querySnapshot.docs.length);
      querySnapshot.docs.forEach(doc => {
        console.log('Tutoriel trouvé:', { id: doc.id, ...doc.data() });
      });
      
      // Mise à jour du dernier document visible pour la pagination
      const lastVisibleDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisible(lastVisibleDoc);
      setHasMore(querySnapshot.docs.length === TUTORIALS_PER_PAGE);

      // Transformation des documents en tutoriels
      const tutorialsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          description: data.description || '',
          difficulty: data.difficulty || 'beginner',
          thumbnailUrl: data.thumbnailUrl || '',
          steps: data.steps || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          authorId: data.authorId || '',
          published: data.published || false,
          tags: data.tags || []
        } as Tutorial;
      });

      // Mise à jour de l'état
      if (isLoadMore) {
        setTutorials(prev => [...prev, ...tutorialsList]);
      } else {
        setTutorials(tutorialsList);
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des tutoriels:', err);
      if (err instanceof Error) {
        // Si l'erreur concerne un index manquant, afficher un message plus explicite
        if (err.message.includes('index')) {
          setError(`Une configuration de la base de données est nécessaire. Veuillez créer l'index composite requis dans Firebase. Message d'erreur : ${err.message}`);
        } else {
          setError('Une erreur est survenue lors du chargement des tutoriels.');
        }
      } else {
        setError('Une erreur inattendue est survenue.');
      }
    } finally {
      setLoading(false);
    }
  }, [lastVisible, selectedDifficulty]);

  useEffect(() => {
    // Réinitialiser uniquement si les filtres changent
    if (selectedDifficulty) {
      setTutorials([]);
      setLastVisible(null);
      fetchTutorials();
    } else {
      // Premier chargement ou réinitialisation des filtres
      fetchTutorials();
    }
  }, [selectedDifficulty]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDifficulty(e.target.value);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchTutorials(true);
    }
  };

  const handleTutorialClick = (tutorialId: string) => {
    window.location.href = `/tutorial/${tutorialId}`;
  };

  const filteredTutorials = tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTerm) ||
    tutorial.description.toLowerCase().includes(searchTerm)
  );

  const getDifficultyLabel = (difficulty: string) => {
    const labels: Record<string, string> = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    };
    return labels[difficulty] || difficulty;
  };

  if (error) {
    return (
      <div className="tutorials-page">
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="logo">
              Tuto Time
            </Link>
            <div className="nav-links">
              <Link to="/tutorials" className="nav-link">Tutoriels</Link>
              <Link to="/login" className="nav-link login-button">Connexion</Link>
            </div>
          </div>
        </nav>
        <div className="error-container">
          <div className="error">{error}</div>
          <button 
            className="retry-button"
            onClick={() => {
              setError(null);
              fetchTutorials();
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tutorials-page">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="logo">
            Tuto Time
          </Link>
          <div className="nav-links">
            <Link to="/tutorials" className="nav-link">Tutoriels</Link>
            <Link to="/login" className="nav-link login-button">Connexion</Link>
          </div>
        </div>
      </nav>

      <header className="tutorials-header">
        <h1>Tous les Tutoriels</h1>
        <p>Découvrez notre collection de tutoriels interactifs</p>
      </header>

      <div className="tutorials-filters">
        <input 
          type="text" 
          placeholder="Rechercher un tutoriel..." 
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select 
          className="filter-select"
          value={selectedDifficulty}
          onChange={handleDifficultyChange}
        >
          <option value="">Tous les niveaux</option>
          <option value="beginner">Débutant</option>
          <option value="intermediate">Intermédiaire</option>
          <option value="advanced">Avancé</option>
        </select>
      </div>

      <div className="tutorials-grid">
        {loading && !tutorials.length ? (
          <div className="loading-container">
            <div className="loading">Chargement des tutoriels...</div>
          </div>
        ) : filteredTutorials.length === 0 ? (
          <div className="no-tutorials">
            {searchTerm || selectedDifficulty ? 
              'Aucun tutoriel ne correspond à vos critères.' :
              'Aucun tutoriel disponible pour le moment.'}
          </div>
        ) : (
          filteredTutorials.map((tutorial) => (
            <div 
              key={tutorial.id} 
              className="tutorial-card"
              onClick={() => handleTutorialClick(tutorial.id)}
            >
              <div className="tutorial-image">
                <img 
                  src={tutorial.thumbnailUrl || '/placeholder-tutorial.jpg'} 
                  alt={tutorial.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-tutorial.jpg';
                  }}
                />
                <div className={`difficulty-badge ${tutorial.difficulty}`}>
                  {getDifficultyLabel(tutorial.difficulty)}
                </div>
              </div>
              <div className="tutorial-content">
                <h3>{tutorial.title}</h3>
                <p>{tutorial.description}</p>
                <div className="tutorial-meta">
                  <span className="tutorial-date">
                    {tutorial.createdAt.toLocaleDateString()}
                  </span>
                  <span className="tutorial-steps">
                    {tutorial.steps.length} étapes
                  </span>
                </div>
                <button 
                  className="view-tutorial-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTutorialClick(tutorial.id);
                  }}
                >
                  Voir le tutoriel
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && filteredTutorials.length > 0 && !loading && (
        <div className="load-more">
          <button 
            onClick={handleLoadMore}
            className="load-more-btn"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Charger plus'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorialList;
