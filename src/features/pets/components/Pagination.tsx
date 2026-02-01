type Props = {
  page: number;
  pageCount: number;
  onPage: (p: number) => void;
};

export function Pagination({ page, pageCount, onPage }: Props) {
  const canPrev = page > 0;
  const canNext = page + 1 < pageCount;

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-3 py-2 rounded-xl border bg-white disabled:opacity-50"
        disabled={!canPrev}
        onClick={() => onPage(page - 1)}
      >
        Anterior
      </button>

      <div className="text-sm text-slate-600">
        Página <b>{page + 1}</b> de <b>{pageCount || 1}</b>
      </div>

      <button
        className="px-3 py-2 rounded-xl border bg-white disabled:opacity-50"
        disabled={!canNext}
        onClick={() => onPage(page + 1)}
      >
        Próxima
      </button>
    </div>
  );
}
