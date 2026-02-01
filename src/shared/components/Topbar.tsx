import { useNavigate } from "react-router-dom";
import { authStore } from "../../features/auth/state/auth.store";
import { useObservableState } from "../../lib/useObservableState";

export function Topbar() {
  const nav = useNavigate();
  const a = useObservableState(authStore.state$, authStore.snapshot);

  function onLogout() {
    authStore.logout();
    nav("/login");
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="text-sm text-slate-500"> </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-slate-700">{a.user?.username ?? "—"}</div>

        <button
          onClick={onLogout}
          className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 text-sm"
          type="button"
        >
          Sair
        </button>
      </div>
    </header>
  );
}
