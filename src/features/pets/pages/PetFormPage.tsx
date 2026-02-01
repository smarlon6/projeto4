import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { petFormStore } from "../state/petForm.store";
import { petsFacade } from "../api/pets.facade";

// máscara simples: só números
function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

export function PetFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const petId = useMemo(() => Number(id), [id]);

  const s = useObservableState(petFormStore.state$, petFormStore.snapshot);

  const isEdit = Number.isFinite(petId) && petId > 0;

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEdit) petFormStore.loadForEdit(petId);
    else petFormStore.resetCreate();
  }, [isEdit, petId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const saved = await petFormStore.save();
    if (!saved) return;

    // Se tiver foto selecionada: upload
    if (fotoFile) {
      try {
        await petsFacade.uploadFoto(saved.id, fotoFile);
      } catch (err) {
        // não impede de navegar, mas você pode mostrar msg
        console.error(err);
      }
    }

    // volta pro detalhe do pet salvo
    navigate(`/pets/${saved.id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-500">{isEdit ? "Edição de Pet" : "Novo Pet"}</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {isEdit ? `Editar: ${s.nome || "—"}` : "Cadastrar Pet"}
          </div>
        </div>

        <div className="flex gap-2">
          <Link className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50" to={isEdit ? `/pets/${petId}` : "/"}>
            ← Voltar
          </Link>
        </div>
      </div>

      {s.error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {s.error}
        </div>
      )}

      {s.success && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {s.success}
        </div>
      )}

      {s.loading ? (
        <div className="mt-4 text-sm text-slate-500">Carregando...</div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-600">Nome *</label>
                <input
                  value={s.nome}
                  onChange={(e) => petFormStore.setField("nome", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Ex.: Rex"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Espécie (UI)</label>
                <select
                  value={s.especie}
                  onChange={(e) => petFormStore.setField("especie", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-teal-600/30"
                >
                  <option value="">Selecione</option>
                  <option value="cachorro">Cachorro</option>
                  <option value="gato">Gato</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-slate-600">Idade (anos) *</label>
                <input
                  value={s.idade}
                  onChange={(e) => petFormStore.setField("idade", onlyDigits(e.target.value).slice(0, 2))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Ex.: 3"
                  inputMode="numeric"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-slate-600">Raça *</label>
                <input
                  value={s.raca}
                  onChange={(e) => petFormStore.setField("raca", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Ex.: Labrador Retriever"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                disabled={s.saving}
                className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {s.saving ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar"}
              </button>

              {!isEdit && (
                <button
                  type="button"
                  onClick={() => petFormStore.resetCreate()}
                  className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-bold text-slate-800">Foto do Pet</div>
            <div className="text-sm text-slate-500 mt-1">
              Se você selecionar uma foto, ela será enviada após salvar.
            </div>

            <input
              type="file"
              accept="image/*"
              className="mt-4 block w-full text-sm"
              onChange={(e) => setFotoFile(e.target.files?.[0] ?? null)}
            />

            {fotoFile && (
              <div className="mt-3 text-sm text-slate-600">
                Selecionado: <b>{fotoFile.name}</b>
              </div>
            )}

            {isEdit && (
              <div className="mt-4 text-xs text-slate-500">
                * Em edição, o upload usa o ID do pet atual.
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
