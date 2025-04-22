"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cadastraLoja = exports.pegaDistancia = exports.calculaDistancia = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '../config.env' });
const StoreModel_1 = __importDefault(require("../models/StoreModel"));
//import logger from '../utils/logger';
const cepService_1 = require("./cepService");
const calculaDistancia = (origemClinte, destinoLoja) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logger.info({
        //   message: 'Calculando distância para lojas',
        //   localizacaoCliente: origemClinte,
        //   localizacaoLoja: destinoLoja,
        // });
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
        const distancia = yield axios_1.default.post(url, corpo, { headers });
        // logger.info({ message: 'Distancia obtida com sucesso' });
        return distancia.data.routes[0];
    }
    catch (error) {
        // logger.error({
        //   message: 'Erro ao calcular distância',
        //   error: error.message,
        // });
        throw error;
    }
});
exports.calculaDistancia = calculaDistancia;
function converteMedidas(distancia) {
    const distanciaKm = distancia.distanceMeters / 1000;
    const horas = Math.floor(Number(distancia.duration.replace('s', '')) / 3600);
    const minutos = Math.floor((Number(distancia.duration.replace('s', '')) % 3600) / 60);
    return {
        distanciaKm,
        horas,
        minutos,
    };
}
function ordenarRotas(lojasPorDistancia) {
    return lojasPorDistancia.sort((a, b) => {
        return (Number(a.distancia.replace(' KM', '')) -
            Number(b.distancia.replace(' KM', '')));
    });
}
const pegaDistancia = (origemClinte) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logger.info({ message: 'Pegando a distancia' });
        const enderecoCliente = `${origemClinte.rua}, ${origemClinte.bairro}, ${origemClinte.cidade} - ${origemClinte.uf}, Brasil`;
        const lojas = yield StoreModel_1.default.find();
        const lojasPorDistancia = [];
        for (const loja of lojas) {
            if (loja.rua === origemClinte.rua &&
                loja.bairro === origemClinte.bairro &&
                loja.estado == origemClinte.estado) {
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
            let distancia = yield (0, exports.calculaDistancia)(enderecoCliente, enderecoLoja);
            const medidas = converteMedidas(distancia);
            let distanciaLoja = {
                nome: loja.nome,
                distancia: `${medidas.distanciaKm} KM`,
                duracao: `${medidas.horas} H, ${medidas.minutos} Min`,
                rua: loja.rua,
                numero: loja.numero || 'Não informado',
                bairro: loja.bairro,
                uf: loja.uf,
                complemento: loja.complemento || 'Não informado',
            };
            // logger.info('Distância da loja', distanciaLoja);
            if (Number(distanciaLoja.distancia.replace(' KM', '')) <= 100) {
                lojasPorDistancia.push(distanciaLoja);
            }
        }
        return ordenarRotas(lojasPorDistancia);
    }
    catch (error) {
        // logger.error({ message: 'Erro ao pegar distância', error: error.message });
        throw error;
    }
});
exports.pegaDistancia = pegaDistancia;
//preenche os dados e caso não tenha alguma informação manterá os dados passados
const cadastraLoja = (reqStore) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logger.info({ message: 'Cadastrando a loja' });
        const endereco = yield (0, cepService_1.pegaEndereco)(reqStore.cep);
        const campos = [
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
        // logger.info('req da loja:', reqStore);
        const novaLoja = yield StoreModel_1.default.create(reqStore);
        return novaLoja;
    }
    catch (error) {
        // logger.error({ message: 'Erro ao cadastrar loja', error: error.message });
        throw error;
    }
});
exports.cadastraLoja = cadastraLoja;
