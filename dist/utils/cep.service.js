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
exports.pegaEndereco = void 0;
const axios_1 = __importDefault(require("axios"));
const valida_cep_1 = require("../utils/valida-cep");
const logger_1 = __importDefault(require("../utils/logger"));
const pegaEndereco = (cep) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(0, valida_cep_1.validaCep)(cep)) {
        throw new Error('CEP inválido');
    }
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const { data } = yield axios_1.default.get(url);
    if (data.erro) {
        throw new Error('CEP não encontrado');
    }
    logger_1.default.info(data);
    const endDados = {
        rua: data.logradouro,
        bairro: data.bairro,
        cidade: data.localidade,
        uf: data.uf,
        estado: data.estado,
        complemento: data.complemento,
        cep: data.cep,
    };
    return endDados;
});
exports.pegaEndereco = pegaEndereco;
