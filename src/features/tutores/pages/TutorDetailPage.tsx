import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { tutorDetailStore } from "../state/tutorDetail.store";
import { petsFacade } from "../../pets/api/pets.facade"; // ✅

type PetListItem = {
  id: number;
  nome: string;
  raca?: string;
  idade?: number;
  foto?: { url?: string } | null;
};

type PageResp<T> = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
};

export function TutorDetailPage() {
  const { id } = useParams();
  const tutorId = useMemo(() => Number(id), [id]);

  const s = useObservableState(tutorDetailStore.state$, tutorDetailStore.snapshot);
  const tutor = s.tutor;

  // =========================
  // ✅ Seletor de pets (busca)
  // =========================
  const [petQuery, setPetQuery] = useState("");
  const [petPage, setPetPage] = useState(0);
  const [petList, setPetList] = useState<PageResp<PetListItem> | null>(null);
  const [petListLoading, setPetListLoading] = useState(false);
  const [petListError, setPetListError] = useState<string | null>(null);

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const linkedPetIds = useMemo(() => new Set((tutor?.pets ?? []).map((p) => p.id)), [tutor]);

  // Carrega tutor
  useEffect(() => {
    tutorDetailStore.clear();
    if (Number.isFinite(tutorId) && tutorId > 0) {
      tutorDetailStore.fetch(tutorId);
    }
  }, [tutorId]);

  // Carrega lista de pets (com debounce simples)
  useEffect(() => {
    let alive = true;
    const t = setTimeout(async () => {
      try {
        setPetListLoading(true);
        setPetListError(null);

        // ✅ Ajuste aqui se seu petsFacade.list tiver outra assinatura
        const data = await petsFacade.list({
          page: petPage,
          size: 10,
          nome: petQuery.trim() || undefined,
        });

        if (!alive) return;

        // opcional: filtra pets já vinculados ao tutor
        const filtered = {
          ...data,
          content: (data.content ?? []).filter((p: PetListItem) => !linkedPetIds.has(p.id)),
        };

        setPetList(filtered);
      } catch (e: any) {
        if (!alive) return;
        setPetListError(e?.message ?? "Erro ao carregar lista de pets");
      } finally {
        if (alive) setPetListLoading(false);
      }
    }, 350);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [petQuery, petPage, linkedPetIds]);

  function pickPet(p: PetListItem) {
    setSelectedPetId(p.id);
  }

  async function vincularSelecionado() {
    if (!tutor || !selectedPetId) return;
    await tutorDetailStore.vincularPet(tutor.id, selectedPetId);
    // opcional: limpa seleção após vincular
    setSelectedPetId(null);
    // após vincular, o store normalmente refaz o fetch do tutor ou você pode chamar:
    // tutorDetailStore.fetch(tutor.id);
  }

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
            {/* Pets vinculados */}
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

            {/* ✅ Vincular novo Pet com lista */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="text-lg font-bold text-slate-800">Vincular novo Pet</div>
              <div className="text-sm text-slate-500">
                Busque um pet e selecione na lista (não precisa digitar ID).
              </div>

              {s.vinculoError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {s.vinculoError}
                </div>
              )}

              {petListError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {petListError}
                </div>
              )}

              <div className="mt-4 flex gap-2 flex-wrap items-center">
                <input
                  value={petQuery}
                  onChange={(e) => {
                    setPetQuery(e.target.value);
                    setPetPage(0);
                  }}
                  className="w-72 rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Buscar pet por nome..."
                />

                <button
                  className="px-4 py-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 disabled:opacity-50"
                  disabled={s.vinculoLoading || !selectedPetId}
                  onClick={vincularSelecionado}
                >
                  {s.vinculoLoading ? "Processando..." : selectedPetId ? `Vincular ID #${selectedPetId}` : "Selecione um pet"}
                </button>

                {selectedPetId && (
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
                    onClick={() => setSelectedPetId(null)}
                  >
                    Limpar seleção
                  </button>
                )}
              </div>

              <div className="mt-4">
                {petListLoading ? (
                  <div className="text-sm text-slate-500">Carregando pets...</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(petList?.content ?? []).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => pickPet(p)}
                        className={`text-left rounded-xl border p-4 hover:shadow-sm transition bg-white ${
                          selectedPetId === p.id ? "ring-2 ring-teal-600/40 border-teal-300" : ""
                        }`}
                      >
                        <div className="font-semibold text-slate-800 truncate">{p.nome}</div>
                        <div className="text-sm text-slate-600 truncate">{p.raca ?? "—"}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          {p.idade ?? "—"} ano(s) • ID #{p.id}
                        </div>
                        <div className="mt-3 text-xs inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                          {selectedPetId === p.id ? "Selecionado" : "Selecionar"}
                        </div>
                      </button>
                    ))}

                    {(petList?.content ?? []).length === 0 && (
                      <div className="text-sm text-slate-500">Nenhum pet disponível para vincular.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Paginação simples */}
              {petList && petList.pageCount > 1 && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                    disabled={petPage <= 0}
                    onClick={() => setPetPage((p) => Math.max(0, p - 1))}
                  >
                    Anterior
                  </button>
                  <div className="text-sm text-slate-500">
                    Página <b>{petPage + 1}</b> de <b>{petList.pageCount}</b>
                  </div>
                  <button
                    className="px-3 py-2 rounded-xl border bg-white hover:bg-slate-50 disabled:opacity-50"
                    disabled={petPage >= petList.pageCount - 1}
                    onClick={() => setPetPage((p) => p + 1)}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Foto */}
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
