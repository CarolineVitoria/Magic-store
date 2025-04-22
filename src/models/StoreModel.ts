import { Schema } from 'mongoose';

export const StoreSchema = new Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [11, 'O nome deve ter pelo menos 11 letras'],
    unique: [true, 'Já existe uma loja com esse nome'],
  },
  cep: {
    type: String,
    required: [true, 'O CEP é obrigatório'],
    unique: [true, 'Já existe uma loja com esse CEP'],
    minlength: [8, 'O cep deve ter 8 números'],
  },
  cidade: {
    type: String,
    required: [true, 'A cidade é obrigatória'],
  },
  rua: {
    type: String,
    required: [true, 'A rua é obrigatória'],
  },
  bairro: {
    type: String,
    required: [true, 'O bairro é obrigatório'],
  },
  complemento: {
    type: String,
  },
  estado: {
    type: String,
    required: [true, 'O estado é obrigatório'],
  },
  uf: {
    type: String,
    required: [true, 'A UF é obrigatória'],
  },
  numero: {
    type: String,
  },
});
