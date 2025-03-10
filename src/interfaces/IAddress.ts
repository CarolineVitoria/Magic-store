export interface IEndereco {
  nome?: string;
  cep: string;
  cidade: string;
  rua: string;
  bairro: string;
  uf: string;
  estado: string;
  complemento?: string;
  numero?: string;
}
