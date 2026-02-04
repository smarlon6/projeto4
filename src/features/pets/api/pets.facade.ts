import { http } from "../../../lib/http";
import type { Foto, PageResponse, Pet, PetDetail } from "../types/pet.types";

export type PetInput = {
  nome: string;
  raca: string;
  idade: number;
};

export type ListPetsParams = {
  page?: number;
  size?: number;
  nome?: string;
  raca?: string;
};

export const petsFacade = {
  async list(params: ListPetsParams) {
    const res = await http.get<PageResponse<Pet>>("/v1/pets", {
      params: {
        page: params.page ?? 0,
        size: params.size ?? 10,
        nome: params.nome || undefined,
        raca: params.raca || undefined,
      },
    });
    return res.data;
  },

  async getById(id: number) {
    const res = await http.get<PetDetail>(`/v1/pets/${id}`);
    return res.data;
  },

  async create(input: PetInput) {
    const res = await http.post<Pet>("/v1/pets", input);
    return res.data;
  },

  async update(id: number, input: PetInput) {
    const res = await http.put<Pet>(`/v1/pets/${id}`, input);
    return res.data;
  },

  async uploadFoto(id: number, file: File) {
    const form = new FormData();
    form.append("foto", file);

    const res = await http.post<Foto>(`/v1/pets/${id}/fotos`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },

  // ✅ NOVO: excluir pet (204 No Content)
  async remove(id: number) {
    await http.delete(`/v1/pets/${id}`);
  },
};
