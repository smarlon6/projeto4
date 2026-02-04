import { BehaviorSubject } from "rxjs";
import type { PageResponse, Pet } from "../types/pet.types";
import { petsFacade } from "../api/pets.facade";

type PetsState = {
  loading: boolean;
  error: string | null;

  // paginação/filtro
  page: number;
  size: number;
  nome: string;

  // dados
  data: PageResponse<Pet> | null;

  // ✅ exclusão
  deletingId: number | null;
  deleteError: string | null;
};

const initialState: PetsState = {
  loading: false,
  error: null,
  page: 0,
  size: 10,
  nome: "",
  data: null,
  deletingId: null,
  deleteError: null,
};

const subject = new BehaviorSubject<PetsState>(initialState);

export const petsStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  setNome(nome: string) {
    subject.next({ ...subject.value, nome, page: 0 });
  },

  setPage(page: number) {
    subject.next({ ...subject.value, page });
  },

  async fetch() {
    const s = subject.value;
    subject.next({ ...s, loading: true, error: null });

    try {
      const data = await petsFacade.list({ page: s.page, size: s.size, nome: s.nome });
      subject.next({ ...subject.value, loading: false, data });
    } catch (e: any) {
      const msg = e?.message ?? "Erro ao buscar pets";
      subject.next({ ...subject.value, loading: false, error: msg });
    }
  },

  // ✅ NOVO: excluir pet
  async deletePet(id: number) {
    const s = subject.value;

    // evita duplo clique / duas exclusões simultâneas
    if (s.deletingId) return;

    subject.next({ ...s, deletingId: id, deleteError: null });

    try {
      await petsFacade.remove(id);

      // Se era o último item da página atual e não é a primeira página,
      // volta uma página para evitar tela vazia.
      const currentCount = s.data?.content?.length ?? 0;
      const shouldGoBackPage = currentCount <= 1 && s.page > 0;

      if (shouldGoBackPage) {
        subject.next({ ...subject.value, page: s.page - 1 });
      }

      // Recarrega lista (mantém total/pageCount corretos)
      await this.fetch();

      subject.next({ ...subject.value, deletingId: null });
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Erro ao excluir pet";
      subject.next({ ...subject.value, deletingId: null, deleteError: msg });
    }
  },
};
