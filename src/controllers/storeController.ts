import Store from "../models/StoreModel"
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validaCep = (cep:string): string | null =>{
  const regexCep = /^\d{5}-?\d{3}$/
  if(typeof cep != "string"){
    cep = String(cep);
  }

  if(!regexCep.test(cep)) {
    return null
  }
  return cep.replace('-','');
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
    //validação da requisição
    //definir os tipos da minha req
    type reqStore = {
      nome : string,
      cep: string,
      rua: string,
      estado: string
    }
    const minhaReq:reqStore = req.body;

    console.log(minhaReq);
    let erros: string[]=[];
    //validação do nome
    if(minhaReq.nome.length< 11){
      console.log('é preciso informar o nome tenha ao menos 11 letras, exemplo: magic steps sp');
    }else if(minhaReq.nome. length === 0){
      console.log('É preciso informar o nome da loja')
    }
    //
    if(!validaCep(minhaReq.cep)){
      console.log('CEP inválido, os únicos formatos aceitos para o CEP são: 12345678 ou 12345-678')
    }
    try {
      const newStore = await Store.create(req.body);
      res.status(201).json(newStore);
    } catch (err: any) {
      console.log("Erro:", err.message);
      res.status(500).json({ message: "Erro ao criar loja" });
    }
  };
  