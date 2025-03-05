import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

const conexaoDB = async () =>{
    try{
        const con = await mongoose.connect(process.env.DB_CONNECTION_STRING!);
        console.log(`conexão com o banco de dados bem sucedida`);
    }catch(err){
        console.log(`Falha ao conectar com o banco ${err}`)
    }
    
}


const db = mongoose.connection;

export default conexaoDB;

