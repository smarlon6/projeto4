import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { petDetailStore } from "../state/petDetail.store";

export function PetDetailPage() {
  const { id } = useParams();
  const petId = Number(id);

  const s = useObservableState(petDetailStore.state$, petDetailStore.snapshot);

  useEffect(() => {
    petDetailStore.clear();
    if (Number.isFinite(petId) && petId > 0) {
      petDetailStore.fetch(petId);
    }
  }, [petId]);

  if (!Number.isFinite(petId) || petId <= 0) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          ID inválido.
        </div>
        <Link className="inline-block mt-4 text-sm text-teal-700 underline" to="/">
          Voltar
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-500">Detalhamento do Pet</div>

          {/* Destaque no nome */}
          <div className="text-3xl font-extrabold text-slate-900 mt-1">
            {s.pet?.nome ?? "—"}
          </div>

          <div className="text-sm text-slate-600 mt-2">
            <span className="font-semibold">Raça:</span> {s.pet?.raca ?? "—"}{" "}
            <span className="mx-2">•</span>
            <span className="font-semibold">Idade:</span> {s.pet?.idade ?? "—"} ano(s)
          </div>
        </div>

        <div className="flex gap-2">
          <Link className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50" to="/">
            ← Voltar
          </Link>
            <Link
            className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
            to={`/pets/${s.pet?.id}/editar`}
            >
            Editar
            </Link>
        </div>
      </div>

      {s.error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm">
          {s.error}
        </div>
      )}

      {s.loading && <div className="mt-4 text-sm text-slate-500">Carregando...</div>}

      {s.pet && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 rounded-2xl border bg-white overflow-hidden shadow-sm">
            <div className="h-64 bg-slate-50 flex items-center justify-center overflow-hidden">
              {s.pet.foto?.url ? (
                <img
                  src={s.pet.foto.url}
                  alt={s.pet.nome}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="text-slate-400 text-sm">Sem foto</div>
              )}
            </div>
            <div className="p-4 text-sm text-slate-600">
              <div className="font-semibold text-slate-800">ID #{s.pet.id}</div>
              <div className="mt-2">
                Use o botão <b>Editar</b> para alterar dados do pet (Etapa 3).
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-lg font-bold text-slate-800">Tutores</div>


              {s.tutoresDetalhados.length === 0 ? (
                <div className="mt-4 text-sm text-slate-500">Nenhum tutor vinculado.</div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {s.tutoresDetalhados.map((t) => (
                    <div key={t.id} className="rounded-xl border bg-slate-50 p-4">
                      <div className="font-semibold text-slate-800">{t.nome}</div>
                      <div className="text-sm text-slate-600 mt-1">
                        {t.email && <div>📧 {t.email}</div>}
                        {t.telefone && <div>📞 {t.telefone}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


          </div>
        </div>
      )}
    </div>
  );
}
