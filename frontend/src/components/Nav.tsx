import { Link } from "react-router-dom";
import useAppStore from "../store/useStore";
import React, { useState } from "react";
import { User } from "../types";

const Nav: React.FC = () => {
  const { user, logout, darkMode, toggleDarkMode } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-blue-600 dark:text-blue-400"
          >
            CodeSprint
          </Link>
          <div className="hidden sm:flex space-x-4">
            {/* Desktop menu items */}
            <NavItems user={user} logout={logout} />
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                {user.name}
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
            <button
              className="sm:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mt-4 sm:hidden">
            <NavItems user={user} logout={logout} mobile={true} />
          </div>
        )}
      </div>
    </nav>
  );
};

const NavItems: React.FC<{
  user: User | null;
  logout: () => void;
  mobile?: boolean;
}> = ({ user, logout, mobile }) => {
  const baseClassName = `${
    mobile ? "flex flex-col space-y-2" : "flex space-x-4"
  }`;

  return (
    <ul className={baseClassName}>
      <li>
        <Link to="/problems" className="hover:text-blue-500 transition-colors">
          Problems
        </Link>
      </li>
      {!user && (
        <>
          <li>
            <Link to="/login" className="hover:text-blue-500 transition-colors">
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
          {(user.role === "creator" || user.role === "admin") && (
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
                Users
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
  );
};

export default Nav;
