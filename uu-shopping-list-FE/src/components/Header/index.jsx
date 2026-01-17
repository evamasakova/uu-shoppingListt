import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import { useTheme } from "../../context/ThemeContext";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMdMoon } from "react-icons/io";

export default function Header(props) {
  const { theme, toggle } = useTheme();

  const { currentUser } = useContext(DataContext);
  return (
    <header className="bg-gradient-to-r from-indigo-50 to-pink-50 shadow-md dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
        <Link
          to="/"
          className="text-2xl font-semibold text-gray-800 dark:text-gray-100 hover:text-pink-700 transition-colors"
        >
          🛒 ShoppingListApp
        </Link>

        <div className="ml-auto flex items-center gap-4">
          {/* Theme switcher */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            aria-label="Toggle color mode"
            className={`relative inline-flex items-center h-8 w-20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              theme === "dark"
                ? "bg-indigo-600 focus:ring-indigo-400"
                : "bg-gray-200 focus:ring-gray-300"
            }`}
          >
            {/* Sun (left) */}
            <span
              className={`absolute left-2 text-sm transition-opacity ${
                theme === "dark" ? "opacity-40 text-yellow-300" : "opacity-100 text-yellow-500"
              }`}
              aria-hidden
            >
              <MdOutlineWbSunny />
            </span>

            {/* Moon (right) */}
            <span
              className={`absolute right-2 text-sm transition-opacity ${
                theme === "dark" ? "opacity-100 text-indigo-100" : "opacity-40 text-indigo-200"
              }`}
              aria-hidden
            >
              <IoMdMoon />
            </span>

            {/* Knob */}
            <span
              className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                theme === "dark" ? "translate-x-13" : "translate-x-1"
              }`}
            />
          </button>

          <div className="flex items-center space-x-2 bg-white bg-opacity-70 px-3 py-1 rounded-full shadow-sm dark:bg-gray-800 dark:bg-opacity-40">
            <span className="text-gray-700 text-sm dark:text-gray-300">Logged in as:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {currentUser?.username || "Guest"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
