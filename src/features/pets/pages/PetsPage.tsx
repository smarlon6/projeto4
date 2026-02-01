import { useEffect } from "react";
import { petsStore } from "../state/pets.store";
import { useObservableState } from "../../../lib/useObservableState";
import { PetCard } from "../components/PetCard";
import { SearchInput } from "../components/SearchInput";
import { Pagination } from "../components/Pagination";

import { authFacade } from "../../auth/api/auth.facade";
import { tokenStorage } from "../../../lib/tokenStorage";

export function PetsPage() {
  const s = useObservableState(petsStore.state$, petsStore.snapshot);

useEffect(() => {
  let cancelled = false;

  (async () => {
    try {
      // garante tokens válidos pelo menos uma vez
      if (!tokenStorage.getAccess() || !tokenStorage.getRefresh()) {
        const tokens = await authFacade.login("admin", "admin");
        tokenStorage.setTokens(tokens);
      }

      if (!cancelled) await petsStore.fetch();
    } catch (e) {
      // se falhou, tenta um relogin (1x) e busca de novo
      try {
        tokenStorage.clear();
        const tokens = await authFacade.login("admin", "admin");
        tokenStorage.setTokens(tokens);
        if (!cancelled) await petsStore.fetch();
      } catch {
        // deixa o erro aparecer no store
      }
    }
  })();

  return () => {
    cancelled = true;
  };
}, [s.page, s.nome]);
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-2xl font-bold text-slate-800">Pets {s.data ? `(${s.data.total})` : ""}</div>
          <div className="text-sm text-slate-500">Gerencie os animais e seus registros.</div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600">
              + Novo Pet
            </button>
            <button className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50">
              + Novo Tutor
            </button>
          </div>

          <SearchInput value={s.nome} onChange={(v) => petsStore.setNome(v)} />
        </div>

        {s.error && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
            {s.error}
          </div>
        )}

        {s.loading && <div className="text-sm text-slate-500">Carregando...</div>}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {s.data?.content?.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
          <div className="text-sm text-slate-500">
            Mostrando {s.data?.content?.length ?? 0} de {s.data?.total ?? 0}
          </div>
          <Pagination
            page={s.page}
            pageCount={s.data?.pageCount ?? 1}
            onPage={(p) => petsStore.setPage(p)}
          />
        </div>
      </div>
    </div>
  );
}
