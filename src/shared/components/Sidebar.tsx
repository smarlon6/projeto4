export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 bg-teal-900 text-white flex-col">
      <div className="p-5 border-b border-white/10">
        <div className="font-bold">PetRegistry</div>
        <div className="text-xs text-white/70">Mato Grosso</div>
      </div>

      <nav className="p-4 text-sm flex-1">
        <div className="text-xs text-white/60 mb-2">Menu Principal</div>
        <a className="block px-3 py-2 rounded-lg bg-white/10" href="/">Pets</a>
        <a className="block px-3 py-2 rounded-lg hover:bg-white/10" href="/tutores">Tutores</a>

        <div className="text-xs text-white/60 mt-6 mb-2">Ações Rápidas</div>
        <a className="block px-3 py-2 rounded-lg hover:bg-white/10" href="/">+ Novo Pet</a>
        <a className="block px-3 py-2 rounded-lg hover:bg-white/10" href="/tutores">+ Novo Tutor</a>
      </nav>

      <div className="p-4 border-t border-white/10 text-sm">
        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10">Sair</button>
      </div>
    </aside>
  );
}
