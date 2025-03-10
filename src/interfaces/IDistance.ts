export interface IDistancia {
  distanceMeters: number;
  duration: string;
}
export interface IDistanciaLojas {
  nome: string;
  distancia: string;
  duracao: string;
  rua: string;
  numero?: string;
  bairro: string;
  uf: string;
  complemento?: string;
}
