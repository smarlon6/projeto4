export type PetFoto = {
  id: number;
  nome: string;
  contentType: string;
  url: string;
};

export type Pet = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: PetFoto | null;
};

export type PageResponse<T> = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
};
