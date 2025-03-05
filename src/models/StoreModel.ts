import mongoose, { Document, Types } from 'mongoose';
import { IStore } from '../interfaces/IStore';


const storeSchema = new mongoose.Schema({
    nome: {
        type: String, 
        required: [true, 'O nome é obrigatório'],
        minlength: [11, 'o nome deve ter pelo menos 11 letras']
    },
    cep: { //precisa ser String pq se o CEP começa com 0 o mongo por padrão irá tirar-lo
        type: String, 
        required: [true, 'O CEP é obrigatório'],
        unique: [true, 'Já existe uma loja com esse CEP, não é possível que duas lojas diferentes tenham o mesmo CEP.'],
        minlength: [8, 'O cep só tem 8 números']
    },
    cidade: {
        type: String, 
        required: [true, 'A Cidade é obrigatória']
    },
    rua: {
        type: String, 
        required: [true, 'A rua é obrigatória']
    },
    bairro: {
        type: String,
        required: [true, 'O bairro é obrigatória']
    },
    complemento: {
        type: String,
    },
    estado: {
        type: String,
        required: [true, 'O estado é Obrigatório']
    },
    uf:{
        type: String,
        required: [true, 'A UF é obrigatória']
    },
    numero:{
        type: String,
    }
})
const Store = mongoose.model<IStore & Document>('stores', storeSchema);

export default Store;