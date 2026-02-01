import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useObservableState } from "../../../lib/useObservableState";
import { tutorFormStore } from "../state/tutorForm.store";
import { tutoresFacade } from "../api/tutores.facade";

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}

// máscara simples CPF: 000.000.000-00
function maskCpf(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);
  return [p1, p2, p3].filter(Boolean).join(".") + (p4 ? `-${p4}` : "");
}

// máscara simples telefone (BR): (99) 99999-9999 / (99) 9999-9999
function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const ddd = d.slice(0, 2);
  const part1 = d.length > 10 ? d.slice(2, 7) : d.slice(2, 6);
  const part2 = d.length > 10 ? d.slice(7, 11) : d.slice(6, 10);
  if (!ddd) return d;
  if (!part1) return `(${ddd})`;
  if (!part2) return `(${ddd}) ${part1}`;
  return `(${ddd}) ${part1}-${part2}`;
}

export function TutorFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tutorId = useMemo(() => Number(id), [id]);
  const isEdit = Number.isFinite(tutorId) && tutorId > 0;

  const s = useObservableState(tutorFormStore.state$, tutorFormStore.snapshot);

  const [fotoFile, setFotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEdit) tutorFormStore.loadForEdit(tutorId);
    else tutorFormStore.resetCreate();
  }, [isEdit, tutorId]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const saved = await tutorFormStore.save();
    if (!saved) return;

    if (fotoFile) {
      try {
        await tutoresFacade.uploadFoto(saved.id, fotoFile);
      } catch (err) {
        console.error(err);
      }
    }

    navigate(`/tutores/${saved.id}`);
  }

  return (
    <div className="p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-sm text-slate-500">{isEdit ? "Edição de Tutor" : "Novo Tutor"}</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {isEdit ? `Editar: ${s.nome || "—"}` : "Cadastrar Tutor"}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
            to={isEdit ? `/tutores/${tutorId}` : "/tutores"}
          >
            ← Voltar
          </Link>
        </div>
      </div>

      {s.error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{s.error}</div>
      )}

      {s.success && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">{s.success}</div>
      )}

      {s.loading ? (
        <div className="mt-4 text-sm text-slate-500">Carregando...</div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-slate-600">Nome completo *</label>
                <input
                  value={s.nome}
                  onChange={(e) => tutorFormStore.setField("nome", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Ex.: João da Silva"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-slate-600">Email *</label>
                <input
                  value={s.email}
                  onChange={(e) => tutorFormStore.setField("email", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="ex.: joao@email.com"
                  inputMode="email"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">Telefone *</label>
                <input
                  value={s.telefone}
                  onChange={(e) => tutorFormStore.setField("telefone", maskPhone(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="(11) 91234-5678"
                  inputMode="tel"
                />
              </div>

              <div>
                <label className="text-sm text-slate-600">CPF *</label>
                <input
                  value={s.cpf}
                  onChange={(e) => tutorFormStore.setField("cpf", maskCpf(e.target.value))}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-slate-600">Endereço *</label>
                <input
                  value={s.endereco}
                  onChange={(e) => tutorFormStore.setField("endereco", e.target.value)}
                  className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-teal-600/30"
                  placeholder="Rua, número, bairro, cidade"
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
                  onClick={() => tutorFormStore.resetCreate()}
                  className="px-4 py-2 rounded-xl border bg-white hover:bg-slate-50"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-bold text-slate-800">Foto do Tutor</div>
            <div className="text-sm text-slate-500 mt-1">Selecione uma imagem para enviar após salvar.</div>

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
          </div>
        </form>
      )}
    </div>
  );
}
