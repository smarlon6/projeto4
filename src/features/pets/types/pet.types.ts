export type Foto = {
  id: number;
  nome: string;
  contentType: string;
  url: string;
};

export type Tutor = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf: number;
  foto?: Foto | null;
};

export type TutorDetail = Tutor & {
  pets?: Pet[];
};

export type Pet = {
  id: number;
  nome: string;
  raca: string;
  idade: number;
  foto?: Foto | null;
};

export type PetDetail = Pet & {
  tutores?: Tutor[];
};

export type PageResponse<T> = {
  page: number;
  size: number;
  total: number;
  pageCount: number;
  content: T[];
};


