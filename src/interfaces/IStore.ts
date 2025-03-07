import { Types } from 'mongoose';
export interface IReqStore {
    nome?: string;
    cep: string;
    cidade: string;
    rua: string;
    bairro: string;
    uf: string;
    estado:string;
    complemento?: string;
    numero?: string;
};
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
};