import type { Pet } from "../types/pet.types";

type Props = { pet: Pet };

export function PetCard({ pet }: Props) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow transition">
      <div className="h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
        {pet.foto?.url ? (
          <img src={pet.foto.url} alt={pet.nome} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="text-slate-400 text-sm">Sem foto</div>
        )}
      </div>

      <div className="p-4">
        <div className="font-semibold text-slate-800 truncate">{pet.nome}</div>
        <div className="text-sm text-slate-500 truncate">{pet.raca || "—"}</div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="px-2 py-1 rounded-full bg-slate-100">Pet</span>
          <span className="px-2 py-1 rounded-full bg-slate-100">{pet.idade} ano(s)</span>
        </div>
      </div>
    </div>
  );
}
