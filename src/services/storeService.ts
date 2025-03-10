import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '../config.env' });
import Store from '../models/StoreModel';
import { IEndereco } from '../interfaces/IAddress';
import { IDistancia, IDistanciaLojas } from '../interfaces/IDistance';
import logger from '../utils/logger';
import { pegaEndereco } from './cepService';

export const calculaDistancia = async (
  origemClinte: string,
  destinoLoja: string,
) => {
  try {
    logger.info({
      message: 'Calculando distância para lojas',
      localizacaoCliente: origemClinte,
      localizacaoLoja: destinoLoja,
    });

    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const apiKey = process.env.KEY;

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
    };
    const corpo = {
      origin: {
        address: origemClinte,
      },
      destination: {
        address: destinoLoja,
      },
      routing_preference: 'TRAFFIC_AWARE',
      travel_mode: 'DRIVE',
    };

    const distancia = await axios.post(url, corpo, { headers });
    logger.info({ message: 'Distancia obtida com sucesso' });
    return distancia.data.routes[0];
  } catch (error: any) {
    logger.error({
      message: 'Erro ao calcular distância',
      error: error.message,
    });
    throw error;
  }
};
function converteMedidas(distancia: IDistancia) {
  const distanciaKm: number = distancia.distanceMeters / 1000;
  const horas: number = Math.floor(
    Number(distancia.duration.replace('s', '')) / 3600,
  );
  const minutos: number = Math.floor(
    (Number(distancia.duration.replace('s', '')) % 3600) / 60,
  );
  return {
    distanciaKm,
    horas,
    minutos,
  };
}

function ordenarRotas(lojasPorDistancia: IDistanciaLojas[]): IDistanciaLojas[] {
  return lojasPorDistancia.sort((a, b) => {
    return (
      Number(a.distancia.replace(' KM', '')) -
      Number(b.distancia.replace(' KM', ''))
    );
  });
}
export const pegaDistancia = async (origemClinte: IEndereco) => {
  try {
    logger.info({ message: 'Pegando a distancia' });
    const enderecoCliente = `${origemClinte.rua}, ${origemClinte.bairro}, ${origemClinte.cidade} - ${origemClinte.uf}, Brasil`;

    const lojas = await Store.find();

    const lojasPorDistancia: IDistanciaLojas[] = [];
    for (const loja of lojas) {
      if (
        loja.rua === origemClinte.rua &&
        loja.bairro === origemClinte.bairro &&
        loja.estado == origemClinte.estado
      ) {
        lojasPorDistancia.push({
          nome: loja.nome,
          rua: loja.rua,
          distancia: '0 KM',
          duracao: '0 H, 0 Min',
          numero: loja.numero || 'Não informado',
          bairro: loja.bairro,
          uf: loja.uf,
          complemento: loja.complemento || 'Não informado',
        });
        continue;
      }
      const enderecoLoja = loja.numero
        ? `${loja.rua}, ${loja.numero} ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`
        : `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;
      let distancia: IDistancia = await calculaDistancia(
        enderecoCliente,
        enderecoLoja,
      );
      const medidas = converteMedidas(distancia);

      let distanciaLoja: IDistanciaLojas = {
        nome: loja.nome,
        distancia: `${medidas.distanciaKm} KM`,
        duracao: `${medidas.horas} H, ${medidas.minutos} Min`,
        rua: loja.rua,
        numero: loja.numero || 'Não informado',
        bairro: loja.bairro,
        uf: loja.uf,
        complemento: loja.complemento || 'Não informado',
      };

      logger.info('Distância da loja', distanciaLoja);

      if (Number(distanciaLoja.distancia.replace(' KM', '')) <= 100) {
        lojasPorDistancia.push(distanciaLoja);
      }
    }
    return ordenarRotas(lojasPorDistancia);
  } catch (error: any) {
    logger.error({ message: 'Erro ao pegar distância', error: error.message });
    throw error;
  }
};

//preenche os dados e caso não tenha alguma informação manterá os dados passados
export const cadastraLoja = async (reqStore: IEndereco) => {
  try {
    logger.info({ message: 'Cadastrando a loja' });
    const endereco = await pegaEndereco(reqStore.cep);
    const campos: (keyof IEndereco)[] = [
      'rua',
      'estado',
      'bairro',
      'complemento',
      'uf',
      'cidade',
    ];

    for (const campo of campos) {
      if (endereco[campo] && endereco[campo].length !== 0) {
        reqStore[campo] = endereco[campo];
      }
    }

    logger.info('req da loja:', reqStore);
    const novaLoja = await Store.create(reqStore);
    return novaLoja;
  } catch (error: any) {
    logger.error({ message: 'Erro ao cadastrar loja', error: error.message });
    throw error;
  }
};
