import axios from 'axios';
import dotenv from "dotenv";
dotenv.config({ path: "../config.env" });
import Store from "../models/StoreModel";
import { IReqStore } from '../interfaces/IStore';
import {IDistancia, IDistanciaLojas} from '../interfaces/IDistance';
import { pegaEndereco } from './cepService';
import logger from '../utils/logger';

export const calculaDistancia = async (origemClinte: string, destinoLoja: string) => {
  try{
  logger.info({ message: 'Calculando distância para lojas', localizacaoCliente: origemClinte, localizacaoLoja: destinoLoja});

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
    
      const distancia = await axios.post(url, corpo, {headers})
      logger.info({ message: 'Distancia obtida com sucesso'});
      return distancia.data.routes[0];
    }catch (error:any) {
      logger.error({ message: 'Erro ao calcular distância', error: error.message });
      throw error;
    
    }
     
  }

function ordenarRotas(lojasPorDistancia:IDistanciaLojas[]): IDistanciaLojas[] {
    return lojasPorDistancia.sort((a, b) => {
      return a.distanciaKm - b.distanciaKm; 
    });
  }
export const pegaDistancia = async(origemClinte:IReqStore) =>{
    //preciso testar mais
    try{
    logger.info({ message: 'Pegando a distancia'});
    const enderecoCliente = `${origemClinte.rua}, ${origemClinte.bairro}, ${origemClinte.cidade} - ${origemClinte.uf}, Brasil`;
  
    const lojas = await Store.find().orFail();
  
    const lojasPorDistancia: IDistanciaLojas[] = [];
    for(const loja of lojas){
      
      const enderecoLoja = `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;
      let distancia: IDistancia = await calculaDistancia(enderecoCliente, enderecoLoja);
  
      const distanceKm:number = distancia.distanceMeters/1000;
      const horas:number = Math.floor(Number(distancia.duration.replace('s', '')) / 3600); // 1 hora = 3600 segundos
      const minutos:number = Math.floor((Number((distancia.duration.replace('s', ''))) % 3600) / 60); 
  
      let distanciaLoja:IDistanciaLojas = {
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
    }catch(error:any){
      logger.error({ message: 'Erro ao pegar distância', error: error.message });
      throw error;
    }
    
  } 

//preenche os dados e caso não tenha alguma informação manterá os dados passados
export const cadastraLoja = async (reqStore: IReqStore) => {
  logger.info({ message: 'Cadastrando a loja'});
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
    const novaLoja = await Store.create(reqStore);
    return novaLoja;
  } catch (error: any) {
    logger.error({ message: 'Erro ao cadastrar loja', error: error.message });
    throw error;

  }
};