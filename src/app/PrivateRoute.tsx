import { Navigate, Outlet } from "react-router-dom";
import { useObservableState } from "../lib/useObservableState";
import { authStore } from "../features/auth/state/auth.store";

export function PrivateRoute() {
  const a = useObservableState(authStore.state$, authStore.snapshot);

  // enquanto o app decide (bootstrap), mostra algo simples
  if (a.status === "unknown") {
    return <div className="p-6 text-sm text-slate-500">Carregando autenticação...</div>;
  }

  if (a.status !== "authenticated") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
