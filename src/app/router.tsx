import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { PetsPage } from "../features/pets/pages/PetsPage";
import { HealthPage } from "../pages/HealthPage";
import { PetDetailPage } from "../features/pets/pages/PetDetailPage";
import { PetFormPage } from "../features/pets/pages/PetFormPage";

import { TutoresPage } from "../features/tutores/pages/TutoresPage";
import { TutorDetailPage } from "../features/tutores/pages/TutorDetailPage";
import { TutorFormPage } from "../features/tutores/pages/TutorFormPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <PetsPage /> },
      { path: "/pets/novo", element: <PetFormPage /> },
      { path: "/pets/:id", element: <PetDetailPage /> },
      { path: "/pets/:id/editar", element: <PetFormPage /> },
      { path: "/health", element: <HealthPage /> },  
      { path: "/tutores", element: <TutoresPage /> },
      { path: "/tutores/novo", element: <TutorFormPage /> },
      { path: "/tutores/:id", element: <TutorDetailPage /> },
      { path: "/tutores/:id/editar", element: <TutorFormPage /> },        
    ],
  },
]);
