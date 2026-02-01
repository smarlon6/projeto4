type Props = {
  value: string;
  onChange: (v: string) => void;
};

export function SearchInput({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 w-full max-w-xl">
      <span className="text-slate-400">🔎</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar pelo nome do pet..."
        className="w-full outline-none text-sm"
      />
    </div>
  );
}
