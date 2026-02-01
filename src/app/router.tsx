import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PetsPage } from "../features/pets/pages/PetsPage";
import { HealthPage } from "../pages/HealthPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PetsPage /> },
      { path: "/health", element: <HealthPage /> },
    ],
  },
]);
