import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import AdminDashboard from './components/admin/AdminDashboard';
import TutorialForm from './components/admin/TutorialForm';
import TutorialList from './components/tutorials/TutorialList';
import TutorialDetail from './components/tutorials/TutorialDetail';
import './styles/global.css';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tutorials" element={<TutorialList />} />
        <Route path="/tutorial/:id" element={<TutorialDetail />} />

        {/* Routes protégées */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tutorial/new"
          element={
            <PrivateRoute>
              <TutorialForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tutorial/edit/:id"
          element={
            <PrivateRoute>
              <TutorialForm />
            </PrivateRoute>
          }
        />

        {/* Route 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
