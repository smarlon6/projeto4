import { http } from "../../../lib/http";
import type { PageResponse, Pet } from "../types/pet.types";

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
    const res = await http.get<Pet>(`/v1/pets/${id}`);
    return res.data;
  },
};
