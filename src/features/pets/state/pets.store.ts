import { BehaviorSubject } from "rxjs";
import type { PageResponse, Pet } from "../types/pet.types";
import { petsFacade } from "../api/pets.facade";

type PetsState = {
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  nome: string;
  data: PageResponse<Pet> | null;
};

const initialState: PetsState = {
  loading: false,
  error: null,
  page: 0,
  size: 10,
  nome: "",
  data: null,
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
};
