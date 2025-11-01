import { Link } from "react-router-dom";
import { useContext } from "react";
import { DataContext } from "../../context/DataContext";

export default function Header() {
  const { currentUser } = useContext(DataContext);
   return (
    <header className="bg-gradient-to-r from-indigo-50 to-pink-50 shadow-md">
      <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-semibold text-gray-800 hover:text-pink-700 transition-colors"
        >
          🛒 ShoppingListApp
        </Link>

        <div className="flex items-center space-x-2 bg-white bg-opacity-70 px-3 py-1 rounded-full shadow-sm">
          <span className="text-gray-700 text-sm">Logged in as:</span>
          <span className="font-medium text-gray-900">
            {currentUser?.username || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
