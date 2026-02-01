import { Link, NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-teal-900 text-white flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="font-bold">PetRegistry</div>
        <div className="text-xs text-white/70">Mato Grosso</div>
      </div>

      <nav className="p-4 text-sm flex-1">
        <div className="text-xs text-white/60 mb-2">Menu Principal</div>

        <NavLink
          to="/pets"
          className={({ isActive }) =>
            "block px-3 py-2 rounded-lg " + (isActive ? "bg-white/10" : "hover:bg-white/10")
          }
        >
          Pets
        </NavLink>

        <NavLink
          to="/tutores"
          className={({ isActive }) =>
            "block px-3 py-2 rounded-lg " + (isActive ? "bg-white/10" : "hover:bg-white/10")
          }
        >
          Tutores
        </NavLink>

        <div className="text-xs text-white/60 mt-6 mb-2">Ações Rápidas</div>

        <Link className="block px-3 py-2 rounded-lg hover:bg-white/10" to="/pets/novo">
          + Novo Pet
        </Link>

        <Link className="block px-3 py-2 rounded-lg hover:bg-white/10" to="/tutores/novo">
          + Novo Tutor
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10 text-sm">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10">
          Sair
        </button>
      </div>
    </aside>
  );
}
