import { Link } from "react-router-dom";
import type { Pet } from "../types/pet.types";

type Props = {
  pet: Pet;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
};

export function PetCard({ pet, onDelete, isDeleting }: Props) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden shadow-sm hover:shadow transition">
      <Link to={`/pets/${pet.id}`} className="block">
        <div className="h-36 bg-slate-50 flex items-center justify-center overflow-hidden">
          {pet.foto?.url ? (
            <img
              src={pet.foto.url}
              alt={pet.nome}
              className="h-full w-full object-cover"
              loading="lazy"
            />
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
      </Link>

      {/* ✅ AÇÕES */}
      {onDelete && (
        <div className="px-4 pb-4">
          <button
            type="button"
            disabled={!!isDeleting}
            onClick={() => {
              const ok = window.confirm(`Excluir o pet "${pet.nome}" (ID #${pet.id})?`);
              if (ok) onDelete(pet.id);
            }}
            className="w-full px-4 py-2 rounded-xl border bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      )}
    </div>
  );
}
