import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/home.css';

const Home: React.FC = () => {
  return (
    <div className="home">
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

      <header className="hero">
        <div className="hero-content">
          <h1>Apprenez à votre rythme</h1>
          <p>Découvrez des tutoriels interactifs créés par des experts</p>
          <div className="hero-buttons">
            <Link to="/tutorials" className="primary-button">
              Parcourir les tutoriels
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="features">
          <h2>Pourquoi choisir Tuto Time ?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Apprentissage interactif</h3>
              <p>Des tutoriels étape par étape pour un apprentissage efficace</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Contenu varié</h3>
              <p>Une large gamme de sujets pour tous les niveaux</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Progression rapide</h3>
              <p>Suivez votre progression et évoluez à votre rythme</p>
            </div>
          </div>
        </section>

        <section className="featured-tutorials">
          <h2>Tutoriels populaires</h2>
          <div className="tutorials-grid">
            <div className="tutorial-card">
              <div className="tutorial-icon">💻</div>
              <h3>Développement Web</h3>
              <p>Les bases du développement web moderne</p>
            </div>
            <div className="tutorial-card">
              <div className="tutorial-icon">🎨</div>
              <h3>Design UI/UX</h3>
              <p>Créez des interfaces utilisateur attractives</p>
            </div>
            <div className="tutorial-card">
              <div className="tutorial-icon">📱</div>
              <h3>Applications Mobiles</h3>
              <p>Développez des apps mobiles performantes</p>
            </div>
            <div className="tutorial-card">
              <div className="tutorial-icon">🔧</div>
              <h3>Outils Développeur</h3>
              <p>Maîtrisez les outils essentiels</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="cta-content">
            <h2>Prêt à commencer ?</h2>
            <p>Rejoignez notre communauté d'apprenants dès aujourd'hui</p>
            <Link to="/tutorials" className="primary-button">
              Commencer maintenant
            </Link>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Tuto Time</h3>
            <p>La plateforme d'apprentissage interactive</p>
          </div>
          <div className="footer-section">
            <h3>Liens rapides</h3>
            <ul>
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/tutorials">Tutoriels</Link></li>
              <li><Link to="/login">Connexion</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>support@tutotime.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Tuto Time. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
