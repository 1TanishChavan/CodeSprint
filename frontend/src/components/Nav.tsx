import React from "react";
import { Link } from "react-router-dom";
import useAppStore from "../store/useStore";

const Nav: React.FC = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAppStore();

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
        >
          CodeSprint
        </Link>
        <ul className="flex space-x-4">
          {/* <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li> */}
          <li>
            <Link
              to="/problems"
              className="hover:text-blue-500 transition-colors"
            >
              Problems
            </Link>
          </li>

          {!user && (
            <>
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-500 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-blue-500 transition-colors"
                >
                  Register
                </Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-500 transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/edit"
                  className="hover:text-blue-500 transition-colors"
                >
                  Edit Profile
                </Link>
              </li>
              {user.role === "creator" && (
                <li>
                  <Link
                    to="/problems/create"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Create Problem
                  </Link>
                </li>
              )}
              {user.role === "admin" && (
                <li>
                  <Link
                    to="/admin"
                    className="hover:text-blue-500 transition-colors"
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={logout}
                  className="hover:text-blue-500 transition-colors"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
        <div className="flex items-center space-x-4">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Welcome, {user.name}
            </span>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
