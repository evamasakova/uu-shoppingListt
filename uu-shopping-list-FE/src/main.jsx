import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRoutes from "./pages/AppRoutes.jsx";
import { DataProvider } from "./context/DataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DataProvider>
      <AppRoutes />
    </DataProvider>
  </StrictMode>
);
