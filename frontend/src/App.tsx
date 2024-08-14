import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import ProfileEdit from "./pages/ProfileEdit";
import ProblemEdit from "./pages/ProblemEdit";
import CreateProblem from "./pages/CreateProblem";
import useAppStore from "./store/useStore";

const App: React.FC = () => {
  const { user, checkAuth, darkMode } = useAppStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const ProtectedRoute: React.FC<{
    element: React.ReactElement;
    allowedRoles?: string[];
  }> = ({ element, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    // @ts-ignore
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          <Nav />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Problems />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={<ProtectedRoute element={<Dashboard />} />}
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute
                    element={<AdminPanel />}
                    allowedRoles={["admin"]}
                  />
                }
              />
              <Route
                path="/problems/create"
                element={
                  <ProtectedRoute
                    element={<CreateProblem />}
                    allowedRoles={["creator", "admin"]}
                  />
                }
              />
              <Route
                path="/profile/edit"
                element={<ProtectedRoute element={<ProfileEdit />} />}
              />
              <Route
                path="/problems/:id/edit"
                element={
                  <ProtectedRoute
                    element={<ProblemEdit />}
                    allowedRoles={["creator", "admin"]}
                  />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
