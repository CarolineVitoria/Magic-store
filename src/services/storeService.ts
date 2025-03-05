import axios from 'axios';
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });
import Store from "../models/StoreModel";
import { IReqStore } from '../interfaces/IStore';
import { pegaEndereco } from './cepService';

export const calculaDistancia = async (origemClinte: string, destinoLoja: string) => {
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes'
    const apiKey = process.env.KEY;
    
    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': "routes.distanceMeters,routes.duration"
    };
    const corpo = {
      origin: {
        address: origemClinte
      },
      destination: {
        address: destinoLoja
      },
      routing_preference: "TRAFFIC_AWARE",
      travel_mode: "DRIVE",
    };
    try{
      const distancia = await axios.post(url, corpo, {headers})
      console.log(distancia.data.routes[0]);
      return distancia.data.routes[0];
    }catch (error:any) {
      console.error('Erro ao fazer a requisição:', error);
    
    }
     
  }

function ordenarRotas(lojasPorDistancia) {
    return lojasPorDistancia.sort((a, b) => {
      if (a.distanciaKm === b.distanciaKm) {
        return a.duracaoSegundos - b.duracaoSegundos; 
      }
      return a.distanciaKm - b.distanciaKm; 
    });
  }
export const pegaDistancia = async(enderecoCliente) =>{
  //precisa organizar
    interface Distancia {
      distanceMeters: number,
      duration: string
    }
    interface DistanciaLojas {
      nome: string,
      distanciaKm: number,
      duracao: string,
    }
    //preciso testar mais
    enderecoCliente = `${enderecoCliente.rua}, ${enderecoCliente.bairro}, ${enderecoCliente.cidade} - ${enderecoCliente.uf}, Brasil`;
  
    const lojas = await Store.find().orFail();
  
    const lojasPorDistancia: DistanciaLojas[] = [];
    for(const loja of lojas){
      
      const enderecoLoja = `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;
      let distancia: Distancia = await calculaDistancia(enderecoCliente, enderecoLoja);
  
      const distanceKm:number = distancia.distanceMeters/1000;
      const horas:number = Math.floor(Number(distancia.duration.replace('s', '')) / 3600); // 1 hora = 3600 segundos
      const minutos:number = Math.floor((Number((distancia.duration.replace('s', ''))) % 3600) / 60); 
  
      let distanciaLoja:DistanciaLojas = {
        nome: loja.nome,
        distanciaKm: distanceKm,
        duracao: `${horas}H, ${minutos}min`,
      };
  
      console.log(distanciaLoja);
      if(distanciaLoja.distanciaKm<=100){
        lojasPorDistancia.push(distanciaLoja);
      }
      
    }
    return (ordenarRotas(lojasPorDistancia));
  } 

//preenche os dados e caso não tenha alguma informação manterá os dados passados
export const cadastraLoja = async (reqStore: IReqStore) => {
  try {
    const endereco = await pegaEndereco(reqStore.cep);
    
    if(endereco.rua.length !==0){
      reqStore.rua = endereco.rua;
    }
    if(endereco.estado.length !==0){
      reqStore.estado = endereco.estado;
    }
    if(endereco.bairro.length !==0){
      reqStore.bairro = endereco.bairro;
    }
    if(endereco.complemento.length !==0){
      reqStore.complemento = endereco.complemento;
    }
    if(endereco.uf.length !==0){
      reqStore.uf = endereco.uf;
    }
    if(endereco.cidade.length !==0){
      reqStore.cidade = endereco.cidade;
    }
    console.log("req da loja:", reqStore);
    const novaLoja = Store.create(reqStore);
    return novaLoja;
  } catch (err: any) {
    console.log("Erro ao cadastrar loja:", err.message || err);
    return err.message; 
    // Retorna null para que minhaReq fique sem dados válidos para ser armazenado no banco
  }
};