import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { SearchInput } from "../../pets/components/SearchInput";
import { Pagination } from "../../pets/components/Pagination";
import { tutoresStore } from "../state/tutores.store";

export function TutoresPage() {
  const s = useObservableState(tutoresStore.state$, tutoresStore.snapshot);

  useEffect(() => {
    tutoresStore.fetch();
  }, [s.page, s.nome]);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-2xl font-bold text-slate-800">
            Tutores {s.data ? `(${s.data.total})` : ""}
          </div>
          <div className="text-sm text-slate-500">Gerencie tutores e seus pets vinculados.</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <Link to="/tutores/novo" className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
              + Novo Tutor
            </Link>
          </div>

          <SearchInput value={s.nome} onChange={(v) => tutoresStore.setNome(v)} />
        </div>

        {s.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            {s.error}
          </div>
        )}

        {s.loading && <div className="text-sm text-slate-500">Carregando...</div>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {s.data?.content?.map((t) => (
            <Link
              key={t.id}
              to={`/tutores/${t.id}`}
              className="rounded-2xl border bg-white p-4 shadow-sm hover:shadow transition"
            >
              <div className="font-semibold text-slate-800 truncate">{t.nome}</div>
              <div className="text-sm text-slate-500 mt-1 truncate">{t.telefone}</div>
              <div className="text-xs text-slate-400 mt-2 truncate">{t.endereco}</div>
            </Link>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-slate-500">
            Mostrando {s.data?.content?.length ?? 0} de {s.data?.total ?? 0}
          </div>
          <Pagination page={s.page} pageCount={s.data?.pageCount ?? 1} onPage={(p) => tutoresStore.setPage(p)} />
        </div>
      </div>
    </div>
  );
}
