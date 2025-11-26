import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-lg text-blue-600">
            CollabTask
          </span>
          {user && (
            <>
              <Link
                to="/"
                className={`text-sm ${
                  location.pathname === "/" ? "font-semibold" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className={`text-sm ${
                  location.pathname === "/tasks" ? "font-semibold" : ""
                }`}
              >
                Tasks
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={toggleTheme}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          {user && (
            <>
              <span className="hidden sm:block">
                {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded bg-red-500 text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
