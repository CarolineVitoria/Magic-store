"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validaCep = void 0;
const logger_1 = __importDefault(require("./logger"));
const validaCep = (cep) => {
    logger_1.default.info({ message: 'Validando o cep', cep: cep });
    const regexCep = /^\d{5}-?\d{3}$/;
    if (typeof cep != 'string') {
        cep = String(cep);
    }
    if (!regexCep.test(cep)) {
        return false;
    }
    return true;
};
exports.validaCep = validaCep;
