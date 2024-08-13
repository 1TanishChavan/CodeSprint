import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import ProfileEdit from './pages/ProfileEdit';
import ProblemEdit from './pages/ProblemEdit';
import api, { setAuthToken } from './api';
import CreateProblem from './pages/CreateProblem';

interface User {
  id: number;
  name: string;
  role: 'admin' | 'creator' | 'solver';
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          setAuthToken(token);
          const response = await api.get<User>('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token');
          setAuthToken('');
        }
      }
      setLoading(false);
    };
  
    fetchUser();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLogin = (loggedInUser: User, token: string) => {
    setUser(loggedInUser);
    localStorage.setItem('token', token);
    setAuthToken(token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    setAuthToken('');
  };

  const ProtectedRoute: React.FC<{ element: React.ReactElement; allowedRoles?: string[] }> = ({ element, allowedRoles }) => {
    if (loading) {
      return <div>Loading...</div>;
    }
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return element;
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <Nav darkMode={darkMode} toggleDarkMode={toggleDarkMode} user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Problems user={user} />} />
          <Route path="/problems" element={<Problems user={user} />} />
          <Route path="/problems/:id" element={<ProblemDetail user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleLogin} />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} allowedRoles={['admin']} />} />
          <Route path="/problems/create" element={<ProtectedRoute element={<CreateProblem />} allowedRoles={['creator', 'admin']} />} />
          <Route path="/profile/edit" element={<ProtectedRoute element={<ProfileEdit />} />} />
          <Route path="/problems/:id/edit" element={<ProtectedRoute element={<ProblemEdit />} allowedRoles={['creator', 'admin']} />} />
        </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;