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
exports.criaLoja = exports.todasLojas = exports.getLojasProximas = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const StoreModel_1 = __importDefault(require("../models/StoreModel"));
dotenv_1.default.config({ path: '../../config.env' });
const cepService_1 = require("../services/cepService");
const storeService_1 = require("../services/storeService");
const logger_1 = __importDefault(require("../utils/logger"));
const getLojasProximas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const endereco = yield (0, cepService_1.pegaEndereco)(req.params.cep);
        const lojasPorDistancia = yield (0, storeService_1.pegaDistancia)(endereco);
        if (lojasPorDistancia.length !== 0) {
            res.status(200).json(lojasPorDistancia);
        }
        else {
            res
                .status(404)
                .json({ message: 'Não foi encontrada nenhuma loja próxima a você' });
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.getLojasProximas = getLojasProximas;
const todasLojas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stores = yield StoreModel_1.default.find();
        if (stores.length === 0) {
            res.status(404).json({ message: 'Nenhuma loja encontrada!' });
            return;
        }
        res.status(200).json(stores);
    }
    catch (error) {
        logger_1.default.error({ message: 'Erro ao buscar loja', error: error.message });
        res.status(500).json({ message: 'Erro ao buscar lojas' });
    }
});
exports.todasLojas = todasLojas;
const criaLoja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const novaLoja = yield (0, storeService_1.cadastraLoja)(req.body);
        res.status(201).json({ novaLoja });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.criaLoja = criaLoja;
