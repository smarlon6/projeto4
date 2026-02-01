import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStore } from "../state/auth.store";
import { useObservableState } from "../../../lib/useObservableState";

export function LoginPage() {
  const nav = useNavigate();
  const a = useObservableState(authStore.state$, authStore.snapshot);

  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");

  useEffect(() => {
    // se já estiver logado, manda pra home
    if (a.status === "authenticated") nav("/pets");
  }, [a.status, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await authStore.login(username, password);
  }

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white shadow-sm p-6">
        <div className="mb-6">
          <div className="text-xl font-bold text-slate-800">PET-MT</div>
          <div className="text-sm text-slate-500">Acesse com suas credenciais</div>
        </div>

        {a.error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {a.error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-600">Usuário</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Senha</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={a.loading}
            className="w-full px-4 py-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {a.loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="text-xs text-slate-500">
            Dica: para o ambiente do edital, use <b>admin/admin</b>.
          </div>
        </form>
      </div>
    </div>
  );
}
