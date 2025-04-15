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
exports.calculaFrete = void 0;
const axios_1 = __importDefault(require("axios"));
const calculaFrete = (loja, cepCliente) => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';
    const token = process.env.TOKEN_MELHOR_ENVIO || 'seu_token_default';
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Agent': 'PhysicalStore/1.0',
    };
    const corpo = {
        from: { postal_code: `${loja.cep}` },
        to: { postal_code: `${cepCliente}` },
        products: [
            {
                id: '1',
                width: 15,
                height: 10,
                length: 20,
                weight: 1,
                insurance_value: 0,
                quantity: 1,
            },
        ],
    };
    console.log('em calcula frete');
    console.log(loja);
    console.log(cepCliente);
    const resposta = yield axios_1.default.post(url, corpo, { headers });
    console.log(resposta);
    return resposta.data;
});
exports.calculaFrete = calculaFrete;
