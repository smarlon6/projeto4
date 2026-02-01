import { BehaviorSubject } from "rxjs";
import { tutoresFacade, type TutorInput } from "../api/tutores.facade";
import type { Tutor } from "../../pets/types/pet.types";

type TutorFormState = {
  mode: "create" | "edit";
  id: number | null;

  loading: boolean;
  saving: boolean;
  error: string | null;
  success: string | null;

  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: string; // string para máscara
};

const initialState: TutorFormState = {
  mode: "create",
  id: null,

  loading: false,
  saving: false,
  error: null,
  success: null,

  nome: "",
  email: "",
  telefone: "",
  endereco: "",
  cpf: "",
};

const subject = new BehaviorSubject<TutorFormState>(initialState);

export const tutorFormStore = {
  state$: subject.asObservable(),
  get snapshot() {
    return subject.value;
  },

  setField<K extends keyof TutorFormState>(key: K, value: TutorFormState[K]) {
    subject.next({ ...subject.value, [key]: value, error: null, success: null });
  },

  resetCreate() {
    subject.next({ ...initialState, mode: "create" });
  },

  async loadForEdit(id: number) {
    subject.next({ ...subject.value, loading: true, error: null, success: null });

    try {
      const tutor = await tutoresFacade.getById(id);

      subject.next({
        ...subject.value,
        loading: false,
        mode: "edit",
        id,
        nome: tutor.nome ?? "",
        email: tutor.email ?? "",
        telefone: tutor.telefone ?? "",
        endereco: tutor.endereco ?? "",
        cpf: tutor.cpf ? String(tutor.cpf) : "",
      });
    } catch (e: any) {
      subject.next({
        ...subject.value,
        loading: false,
        error: e?.message ?? "Erro ao carregar tutor para edição",
      });
    }
  },

  validate() {
    const s = subject.value;

    if (!s.nome.trim()) return "Informe o nome completo.";
    if (!s.email.trim()) return "Informe o email.";
    if (!s.telefone.trim()) return "Informe o telefone.";
    if (!s.endereco.trim()) return "Informe o endereço.";

    const cpfNum = Number(s.cpf.replace(/\D/g, ""));
    if (!s.cpf.trim()) return "Informe o CPF.";
    if (!Number.isFinite(cpfNum) || String(cpfNum).length !== 11) return "CPF inválido (11 dígitos).";

    // email simples
    if (!/^\S+@\S+\.\S+$/.test(s.email.trim())) return "Email inválido.";

    return null;
  },

  buildInput(): TutorInput {
    const s = subject.value;

    return {
      nome: s.nome.trim(),
      email: s.email.trim(),
      telefone: s.telefone.trim(),
      endereco: s.endereco.trim(),
      cpf: Number(s.cpf.replace(/\D/g, "")),
    };
  },

  async save() {
    const err = tutorFormStore.validate();
    if (err) {
      subject.next({ ...subject.value, error: err });
      return null;
    }

    subject.next({ ...subject.value, saving: true, error: null, success: null });

    try {
      const input = tutorFormStore.buildInput();
      const s = subject.value;

      let saved: Tutor;
      if (s.mode === "create") {
        saved = await tutoresFacade.create(input);
        subject.next({ ...subject.value, saving: false, success: "Tutor cadastrado com sucesso!" });
      } else {
        saved = await tutoresFacade.update(s.id!, input);
        subject.next({ ...subject.value, saving: false, success: "Tutor atualizado com sucesso!" });
      }

      return saved;
    } catch (e: any) {
      subject.next({
        ...subject.value,
        saving: false,
        error: e?.message ?? "Erro ao salvar tutor",
      });
      return null;
    }
  },
};
