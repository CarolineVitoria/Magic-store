import Store from "../models/StoreModel"
import { Request, Response, NextFunction, RequestHandler } from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "../../config.env" });
import { pegaEndereco } from '../services/cepService';
import { cadastraLoja, pegaDistancia } from "../services/storeService";
import { validaCep } from "../utils/validaCep";

//definir os tipos da minha req
type reqStore = {
  nome : string,
  cep: string,
  cidade: string,
  rua: string,
  estado: string,
  bairro: string,
  complemento: string,
}
export const getLojasProximas = async (req: Request, res: Response) =>{
  try {
    const endereco = await pegaEndereco(req.params.cep);
    const lojasPorDistancia = await pegaDistancia(endereco);
    if(lojasPorDistancia.length !== 0){
      res.status(200).json(lojasPorDistancia);
    }else{
      res.status(404).json({message:'Não foi encontrada nenhuma loja próxima a você'});
    }
    
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export const todasLojas = async (req: Request, res: Response): Promise<void> => {

  try {
    const stores = await Store.find();
    if (stores.length === 0) {
      console.log("Nenhuma loja encontrada!");
      res.status(404).json({ message: "Nenhuma loja encontrada!" });
      return;
    }
    console.log(stores);
    res.status(200).json(stores);
  } catch (err: any) {
    console.log("Erro:", err.message);
    res.status(500).json({ message: "Erro ao buscar lojas" });
  }
};
  
export const criaLoja = async (req: Request, res: Response) => {
  try{
    const novaLoja = await cadastraLoja(req.body);
    res.status(201).json({novaLoja});
  }catch(err:any){
    res.status(400).json({message: err.message})
  }
};
  
  