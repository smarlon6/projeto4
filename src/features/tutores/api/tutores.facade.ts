import { http } from "../../../lib/http";
import type { Tutor } from "../../pets/types/pet.types";


export const tutoresFacade = {
  async getById(id: number) {
    const res = await http.get<Tutor>(`/v1/tutores/${id}`);
    return res.data;
  },
};
