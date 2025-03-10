import dotenv from 'dotenv';
import { Request, Response } from 'express';
import Store from '../models/StoreModel';
dotenv.config({ path: '../../config.env' });
import { pegaEndereco } from '../services/cepService';
import { cadastraLoja, pegaDistancia } from '../services/storeService';
import logger from '../utils/logger';

export const getLojasProximas = async (req: Request, res: Response) => {
  try {
    const endereco = await pegaEndereco(req.params.cep);
    const lojasPorDistancia = await pegaDistancia(endereco);
    if (lojasPorDistancia.length !== 0) {
      res.status(200).json(lojasPorDistancia);
    } else {
      res
        .status(404)
        .json({ message: 'Não foi encontrada nenhuma loja próxima a você' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const todasLojas = async (req: Request,res: Response,) => {
  try {
    const stores = await Store.find();
    if (stores.length === 0) {
      res.status(404).json({ message: 'Nenhuma loja encontrada!' });
      return;
    }
    res.status(200).json(stores);
  } catch (error: any) {
    logger.error({ message: 'Erro ao buscar loja', error: error.message });
    res.status(500).json({ message: 'Erro ao buscar lojas' });
  }
};

export const criaLoja = async (req: Request, res: Response) => {
  try {
    const novaLoja = await cadastraLoja(req.body);
    res.status(201).json({ novaLoja });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
