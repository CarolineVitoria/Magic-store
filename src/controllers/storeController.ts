import Store from "../models/StoreModel"
import { Request, Response, NextFunction, RequestHandler } from "express";
import axios from "axios";

//definir os tipos da minha req
type reqStore = {
  nome : string,
  cep: string,
  rua: string,
  estado: string,
  bairro: string,
  complemento: string,
}

export const validaCep = (cep:string): true | null =>{
  const regexCep = /^\d{5}-?\d{3}$/
  if(typeof cep != "string"){
    cep = String(cep);
  }

  if(!regexCep.test(cep)) {
    return null
  }
  return true
}
//preenche os dados e caso não tenha alguma informação manterá os dados passados
export const preencheEndereco = async (minhaReq: reqStore): Promise<reqStore | null> => {
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${minhaReq.cep}/json/`);

    if (data.erro) {
      throw new Error("CEP não encontrado");
    } // se o cep n for encontrado ele envia esse erro e caímos no catch, se ele não for lançado haverá erro ao tentar acessar as propriedades
    if(data.logradouro.length !==0){
      minhaReq.rua = data.logradouro;
    }
    if(data.estado.length !==0){
      minhaReq.estado = data.estado;
    }
    if(data.bairro.length !==0){
      minhaReq.bairro = data.bairro;
    }
    if(data.complemento.length !==0){
      minhaReq.rua = data.complemento;
    }
    console.log("Endereço encontrado:", data);

    return minhaReq;
  } catch (err: any) {
    console.error("Erro ao buscar o endereço:", err.message || err);
    return null; 
    // Retorna null para que minhaReq fique sem dados válidos para ser armazenado no banco
  }
};

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

    let minhaReq:reqStore = req.body;

    console.log(minhaReq);
    let erros: string[]=[];
    //validação do nome
    if(minhaReq.nome.length< 11){
      return res.status(400).json({ message: "O nome deve ter pelo menos 11 caracteres, exemplo: magic steps sp" });
    }else if(minhaReq.nome. length === 0){
      return res.status(400).json({ message: 'É preciso informar o nome da loja' });
    }
    //validação do cep
    if(!validaCep(minhaReq.cep)){
      return res.status(400).json({ message: 'CEP inválido, os únicos formatos aceitos para o CEP são: 12345678 ou 12345-678' });
    }else{
      minhaReq.cep = minhaReq.cep.replace('-', '');
    }
    //preenchendo dados com base no cep

    try {
      // Preenchendo o endereço

      const endereco = await preencheEndereco(minhaReq);
      if (!endereco) {
        return res.status(400).json({ message: "CEP inválido, tente outro CEP" });
      }
  
      minhaReq = endereco;

      const newStore = await Store.create(minhaReq);
      res.status(201).json(newStore);
    } catch (err: any) {
      console.error("Erro ao criar loja:", err.message);
      res.status(500).json({ message: "Erro ao criar loja" });
    }
  };
  
  