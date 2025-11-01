import { useState, useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ListDetail from "../pages/ListDetails";
import { DataContext } from "../context/DataContext";
import Header from "../components/Header";
export default function AppRoutes() {
  const { users, currentUser } = useContext(DataContext); // works only if wrapped in DataProvider
  const [currentUserId, setCurrentUserId] = useState(users[0]?._id || "");

  return (
    <BrowserRouter>
      <Header />

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={<Dashboard />}
        />
        <Route
          path="/list/:listId"
          element={<ListDetail />}
        />
      </Routes>
    </BrowserRouter>
  );
}
