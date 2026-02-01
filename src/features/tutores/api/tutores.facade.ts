import { http } from "../../../lib/http";
import type { Foto, PageResponse, Tutor, TutorDetail } from "../../pets/types/pet.types";

export type TutorInput = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
};

export type ListTutoresParams = {
  page?: number;
  size?: number;
  nome?: string;
};

export const tutoresFacade = {
  async list(params: ListTutoresParams) {
    const res = await http.get<PageResponse<Tutor>>("/v1/tutores", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        nome: params.nome || undefined,
      },
    });
    return res.data;
  },

  async getById(id: number) {
    const res = await http.get<TutorDetail>(`/v1/tutores/${id}`);
    return res.data;
  },

  async create(input: TutorInput) {
    const res = await http.post<Tutor>("/v1/tutores", input);
    return res.data;
  },

  async update(id: number, input: TutorInput) {
    const res = await http.put<Tutor>(`/v1/tutores/${id}`, input);
    return res.data;
  },

  async uploadFoto(id: number, file: File) {
    const form = new FormData();
    form.append("foto", file);

    const res = await http.post<Foto>(`/v1/tutores/${id}/fotos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  async vincularPet(tutorId: number, petId: number) {
    await http.post(`/v1/tutores/${tutorId}/pets/${petId}`);
  },

  async removerVinculo(tutorId: number, petId: number) {
    await http.delete(`/v1/tutores/${tutorId}/pets/${petId}`);
  },
};
