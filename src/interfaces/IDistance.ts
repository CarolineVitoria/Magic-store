export interface IDistancia {
  distanceMeters: number;
  duration: string;
}
export interface IDistanciaLojas {
  nome: string;
  distancia: number;
  duracao: string;
  rua: string;
  numero?: string;
  bairro: string;
  uf: string;
  complemento?: string;
  tipo?: string;
  frete?: string;
  prazo?: string;
  descricao?: string;
  cep: string;
}
