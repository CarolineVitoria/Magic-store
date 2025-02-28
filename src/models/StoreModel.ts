import { kMaxLength } from 'buffer';
import mongoose, { Document, Schema } from 'mongoose';


interface IStore extends Document {
    nome: string
}
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
    rua: {
        type: String, 
        required: [true, 'A rua é obrigatória']
    },
    estado: {
        type: String,
        required: [true, 'O estado é Obrigatório']
    }
})

const Store = mongoose.model<IStore>('stores', storeSchema);

export default Store;