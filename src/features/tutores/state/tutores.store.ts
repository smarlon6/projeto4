import { BehaviorSubject } from "rxjs";
import type { Tutor, PageResponse } from "../../pets/types/pet.types";
import { tutoresFacade } from "../api/tutores.facade";

type TutoresState = {
  loading: boolean;
  error: string | null;
  data: PageResponse<Tutor> | null;
  page: number;
  nome: string;
};

const initialState: TutoresState = {
  loading: false,
  error: null,
  data: null,
  page: 0,
  nome: "",
};

const subject = new BehaviorSubject<TutoresState>(initialState);

export const tutoresStore = {
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
    subject.next({ ...subject.value, loading: true, error: null });
    try {
      const s = subject.value;
      const data = await tutoresFacade.list({ page: s.page, size: 10, nome: s.nome });
      subject.next({ ...subject.value, loading: false, data });
    } catch (e: any) {
      subject.next({ ...subject.value, loading: false, error: e?.message ?? "Erro ao listar tutores" });
    }
  },
};
