import { BehaviorSubject } from "rxjs";
import type { TutorDetail } from "../../pets/types/pet.types";
import { tutoresFacade } from "../api/tutores.facade";

type TutorDetailState = {
  loading: boolean;
  error: string | null;
  tutor: TutorDetail | null;

  vinculoLoading: boolean;
  vinculoError: string | null;
};

const initialState: TutorDetailState = {
  loading: false,
  error: null,
  tutor: null,
  vinculoLoading: false,
  vinculoError: null,
};

const subject = new BehaviorSubject<TutorDetailState>(initialState);

export const tutorDetailStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  clear() {
    subject.next(initialState);
  },

  async fetch(id: number) {
    subject.next({ ...subject.value, loading: true, error: null });
    try {
      const tutor = await tutoresFacade.getById(id);
      subject.next({ ...subject.value, loading: false, tutor });
    } catch (e: any) {
      subject.next({ ...subject.value, loading: false, error: e?.message ?? "Erro ao carregar tutor" });
    }
  },

  async vincularPet(tutorId: number, petId: number) {
    subject.next({ ...subject.value, vinculoLoading: true, vinculoError: null });
    try {
      await tutoresFacade.vincularPet(tutorId, petId);
      await tutorDetailStore.fetch(tutorId);
      subject.next({ ...subject.value, vinculoLoading: false });
    } catch (e: any) {
      subject.next({ ...subject.value, vinculoLoading: false, vinculoError: e?.message ?? "Erro ao vincular pet" });
    }
  },

  async removerVinculo(tutorId: number, petId: number) {
    subject.next({ ...subject.value, vinculoLoading: true, vinculoError: null });
    try {
      await tutoresFacade.removerVinculo(tutorId, petId);
      await tutorDetailStore.fetch(tutorId);
      subject.next({ ...subject.value, vinculoLoading: false });
    } catch (e: any) {
      subject.next({ ...subject.value, vinculoLoading: false, vinculoError: e?.message ?? "Erro ao remover vínculo" });
    }
  },
};
