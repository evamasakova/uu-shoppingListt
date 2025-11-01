import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ListDetail from "../pages/ListDetails";
import Header from "../components/Header";
export default function AppRoutes() {

  return (
    <BrowserRouter>
      <Header />
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
