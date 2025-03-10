import { Types } from 'mongoose';
export interface IStore {
  nome: string;
  cep: string;
  cidade: string;
  rua: string;
  bairro: string;
  complemento?: string;
  estado: string;
  uf: string;
  numero?: string;
  _id: Types.ObjectId;
}
