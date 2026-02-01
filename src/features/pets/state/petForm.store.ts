import { BehaviorSubject } from "rxjs";
import { petsFacade, type PetInput } from "../api/pets.facade";
import type { Pet } from "../types/pet.types";

type PetFormState = {
  mode: "create" | "edit";
  id: number | null;

  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;

  // campos do form
  nome: string;
  especie: string; // UI only
  raca: string;
  idade: string; // string pra facilitar máscara/validação no input
};

const initialState: PetFormState = {
  mode: "create",
  id: null,

  loading: false,
  saving: false,
  error: null,
  success: null,

  nome: "",
  especie: "",
  raca: "",
  idade: "",
};

const subject = new BehaviorSubject<PetFormState>(initialState);

export const petFormStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  setField<K extends keyof PetFormState>(key: K, value: PetFormState[K]) {
    subject.next({ ...subject.value, [key]: value, error: null, success: null });
  },

  resetCreate() {
    subject.next({ ...initialState, mode: "create" });
  },

  async loadForEdit(id: number) {
    subject.next({ ...subject.value, loading: true, error: null, success: null });

    try {
      const pet = await petsFacade.getById(id);

      subject.next({
        ...subject.value,
        loading: false,
        mode: "edit",
        id,
        nome: pet.nome ?? "",
        raca: pet.raca ?? "",
        idade: String(pet.idade ?? ""),
        especie: "", // API não tem; fica vazio
      });
    } catch (e: any) {
      subject.next({
        ...subject.value,
        loading: false,
        error: e?.message ?? "Erro ao carregar pet para edição",
      });
    }
  },

  validate() {
    const s = subject.value;

    const nome = s.nome.trim();
    const raca = s.raca.trim();
    const idadeNum = Number(s.idade);

    if (!nome) return "Informe o nome.";
    if (!raca) return "Informe a raça.";
    if (!s.idade.trim()) return "Informe a idade.";
    if (!Number.isFinite(idadeNum) || idadeNum < 0 || idadeNum > 60) return "Idade inválida (0 a 60).";

    return null;
  },

  buildInput(): PetInput {
    const s = subject.value;
    return {
      nome: s.nome.trim(),
      raca: s.raca.trim(),
      idade: Number(s.idade),
    };
  },

  async save() {
    const err = petFormStore.validate();
    if (err) {
      subject.next({ ...subject.value, error: err });
      return null;
    }

    subject.next({ ...subject.value, saving: true, error: null, success: null });

    try {
      const input = petFormStore.buildInput();
      const s = subject.value;

      let saved: Pet;
      if (s.mode === "create") {
        saved = await petsFacade.create(input);
        subject.next({ ...subject.value, saving: false, success: "Pet cadastrado com sucesso!" });
      } else {
        saved = await petsFacade.update(s.id!, input);
        subject.next({ ...subject.value, saving: false, success: "Pet atualizado com sucesso!" });
      }

      return saved;
    } catch (e: any) {
      subject.next({
        ...subject.value,
        saving: false,
        error: e?.message ?? "Erro ao salvar pet",
      });
      return null;
    }
  },
};
