import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { tutorDetailStore } from "../state/tutorDetail.store";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function TutorDetailPage() {
  const { id } = useParams();
  const tutorId = useMemo(() => Number(id), [id]);

  const s = useObservableState(tutorDetailStore.state$, tutorDetailStore.snapshot);

  const [petIdInput, setPetIdInput] = useState("");

  useEffect(() => {
    tutorDetailStore.clear();
    if (Number.isFinite(tutorId) && tutorId > 0) {
      tutorDetailStore.fetch(tutorId);
    }
  }, [tutorId]);

  const tutor = s.tutor;

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-500">Detalhamento do Tutor</div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{tutor?.nome ?? "—"}</div>
          <div className="text-sm text-slate-600 mt-2 space-y-1">
            <div>📧 {tutor?.email || "—"}</div>
            <div>📞 {tutor?.telefone || "—"}</div>
            <div className="truncate">📍 {tutor?.endereco || "—"}</div>
            <div>🪪 CPF: {tutor?.cpf ? String(tutor.cpf) : "—"}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50" to="/tutores">
            ← Voltar
          </Link>
          {tutor && (
            <Link
              className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600"
              to={`/tutores/${tutor.id}/editar`}
            >
              Editar
            </Link>
          )}
        </div>
      </div>

      {s.error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{s.error}</div>
      )}

      {s.loading && <div className="mt-4 text-sm text-slate-500">Carregando...</div>}

      {tutor && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-lg font-bold text-slate-800">Pets vinculados</div>

              {(tutor.pets ?? []).length === 0 ? (
                <div className="mt-4 text-sm text-slate-500">Nenhum pet vinculado.</div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(tutor.pets ?? []).map((p) => (
                    <div key={p.id} className="rounded-xl border bg-slate-50 p-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{p.nome}</div>
                        <div className="text-sm text-slate-600 truncate">{p.raca}</div>
                        <div className="text-xs text-slate-500 mt-1">{p.idade} ano(s) • ID #{p.id}</div>
                      </div>

                      <button
                        className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-100 text-sm"
                        disabled={s.vinculoLoading}
                        onClick={() => tutorDetailStore.removerVinculo(tutor.id, p.id)}
                        title="Remover vínculo"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-lg font-bold text-slate-800">Vincular novo Pet</div>
              <div className="text-sm text-slate-500">Informe o ID do pet (petId).</div>

              {s.vinculoError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {s.vinculoError}
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                <input
                  value={petIdInput}
                  onChange={(e) => setPetIdInput(onlyDigits(e.target.value).slice(0, 10))}
                  className="w-56 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Ex.: 470"
                  inputMode="numeric"
                />
                <button
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
                  disabled={s.vinculoLoading || !petIdInput}
                  onClick={() => tutorDetailStore.vincularPet(tutor.id, Number(petIdInput))}
                >
                  {s.vinculoLoading ? "Processando..." : "Vincular"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-bold text-slate-800">Foto do Tutor</div>
            <div className="text-sm text-slate-500 mt-1">Upload será na tela de edição.</div>

            <div className="mt-4 h-56 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
              {tutor.foto?.url ? (
                <img src={tutor.foto.url} alt={tutor.nome} className="h-full w-full object-cover" />
              ) : (
                <div className="text-slate-400 text-sm">Sem foto</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
