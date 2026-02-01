import { createBrowserRouter } from "react-router-dom";
import App from "./App";

// Páginas
import { PetsPage } from "../features/pets/pages/PetsPage";
import { PetDetailPage } from "../features/pets/pages/PetDetailPage";
import { PetFormPage } from "../features/pets/pages/PetFormPage";

import { TutoresPage } from "../features/tutores/pages/TutoresPage";
import { TutorDetailPage } from "../features/tutores/pages/TutorDetailPage";
import { TutorFormPage } from "../features/tutores/pages/TutorFormPage";

import { LoginPage } from "../features/auth/pages/LoginPage";
import { PrivateRoute } from "./PrivateRoute";

export const router = createBrowserRouter([
  // pública
  { path: "/login", element: <LoginPage /> },

  // protegidas
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          // default
          { path: "/", element: <PetsPage /> },

          // ===== PETS =====
          { path: "/pets", element: <PetsPage /> },
          { path: "/pets/novo", element: <PetFormPage /> },
          { path: "/pets/:id/editar", element: <PetFormPage /> },
          { path: "/pets/:id", element: <PetDetailPage /> },

          // ===== TUTORES =====
          { path: "/tutores", element: <TutoresPage /> },
          { path: "/tutores/novo", element: <TutorFormPage /> },
          { path: "/tutores/:id/editar", element: <TutorFormPage /> },
          { path: "/tutores/:id", element: <TutorDetailPage /> },
        ],
      },
    ],
  },
]);
