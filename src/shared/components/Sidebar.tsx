import { Link, NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-blue-900 text-white flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="font-bold">Pet-MT</div>
        <div className="text-xs text-white/70">Mato Grosso</div>
      </div>

      <nav className="p-4 text-sm flex-1">
        <div className="text-xs text-white/60 mb-2">Menu Principal</div>

        <NavLink
          to="/pets"
          className={({ isActive }) =>
            [
              "block px-3 py-2 rounded-lg transition-colors",
              isActive ? "bg-blue-800/60" : "hover:bg-blue-800/40",
            ].join(" ")
          }
        >
          Pets Lista
        </NavLink>

        <NavLink
          to="/tutores"
          className={({ isActive }) =>
            [
              "block px-3 py-2 rounded-lg transition-colors",
              isActive ? "bg-blue-800/60" : "hover:bg-blue-800/40",
            ].join(" ")
          }
        >
          Tutores Lista
        </NavLink>

        <div className="text-xs text-white/60 mt-6 mb-2">Ações Rápidas</div>

        <Link className="block px-3 py-2 rounded-lg hover:bg-blue-800/40 transition-colors" to="/pets/novo">
          + Novo Pet
        </Link>

        <Link className="block px-3 py-2 rounded-lg hover:bg-blue-800/40 transition-colors" to="/tutores/novo">
          + Novo Tutor
        </Link>
      </nav>

      <div className="p-4 border-t border-white/10 text-sm">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-800/40 transition-colors">
          Sair
        </button>
      </div>
    </aside>
  );
}
