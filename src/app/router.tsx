import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PetsPage } from "../features/pets/pages/PetsPage";
import { HealthPage } from "../pages/HealthPage";
import { PetDetailPage } from "../features/pets/pages/PetDetailPage";
import { PetFormPage } from "../features/pets/pages/PetFormPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PetsPage /> },
      { path: "/pets/novo", element: <PetFormPage /> },
      { path: "/pets/:id", element: <PetDetailPage /> },
      { path: "/pets/:id/editar", element: <PetFormPage /> },
      { path: "/health", element: <HealthPage /> },    
    ],
  },
]);
