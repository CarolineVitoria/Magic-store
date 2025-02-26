import mongoose, { mongo } from "mongoose";
import DB_CONNECTION_STRING from "./env";

const conexaoDB = async () =>{
    try{
        const con = await mongoose.connect(DB_CONNECTION_STRING);
        console.log(`conexão com o banco de dados bem sucedida`);
    }catch(err){
        console.log(`Falha ao conectar com o banco ${err}`)
    }
    
}


const db = mongoose.connection;

export default conexaoDB;

