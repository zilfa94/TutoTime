import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import '../../styles/admin.css';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  thumbnailUrl: string;
  createdAt: Date;
}

const AdminDashboard: React.FC = () => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutorials = async () => {
      try {
        const tutorialsCollection = collection(db, 'tutorials');
        const tutorialsSnapshot = await getDocs(tutorialsCollection);
        const tutorialsList = tutorialsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Tutorial[];

        setTutorials(tutorialsList);
      } catch (error) {
        console.error('Erreur lors de la récupération des tutoriels:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleCreateTutorial = () => {
    navigate('/admin/tutorial/new');
  };

  const handleEditTutorial = (id: string) => {
    navigate(`/admin/tutorial/edit/${id}`);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord administrateur</h1>
        <div className="header-actions">
          <button onClick={handleCreateTutorial} className="create-button">
            Créer un tutoriel
          </button>
          <button onClick={handleLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </header>

      <main className="tutorials-list">
        {tutorials.length === 0 ? (
          <div className="no-tutorials">
            <p>Aucun tutoriel n'a été créé pour le moment.</p>
            <button onClick={handleCreateTutorial}>Créer votre premier tutoriel</button>
          </div>
        ) : (
          <div className="tutorials-grid">
            {tutorials.map((tutorial) => (
              <div key={tutorial.id} className="tutorial-card">
                <div className="tutorial-image">
                  <img src={tutorial.thumbnailUrl} alt={tutorial.title} />
                </div>
                <div className="tutorial-content">
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  <div className="tutorial-meta">
                    <span className={`difficulty ${tutorial.difficulty}`}>
                      {tutorial.difficulty}
                    </span>
                    <span className="date">
                      {tutorial.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    onClick={() => handleEditTutorial(tutorial.id)}
                    className="edit-button"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
