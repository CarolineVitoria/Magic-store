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
const axios_1 = __importDefault(require("axios"));
const frete_service_1 = require("./frete.service");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('calculaFrete', () => {
    const lojaMock = {
        nome: 'Loja Teste',
        rua: 'Rua A',
        numero: '123',
        bairro: 'Bairro X',
        uf: 'SP',
        complemento: '',
        cep: '01001-000',
        distancia: 10,
        duracao: '0 H, 15 Min',
        coordenadas: { lat: -36.55, lng: -55.23 },
    };
    const cepClienteMock = '01310-100';
    beforeEach(() => {
        process.env.TOKEN_MELHOR_ENVIO = 'fake-token';
        mockedAxios.post.mockResolvedValue({
            data: [
                {
                    name: 'PAC',
                    delivery_time: 5,
                    currency: 'R$',
                    price: '20,00',
                },
                {
                    name: 'SEDEX',
                    delivery_time: 2,
                    currency: 'R$',
                    price: '35,00',
                },
            ],
        });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('deve retornar o frete formatado corretamente', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, frete_service_1.calculaFrete)(lojaMock, cepClienteMock);
        expect(result).toEqual({
            name: 'Loja Teste',
            city: 'Bairro X',
            postalCode: '01001-000',
            type: 'LOJA',
            distance: '10 km',
            value: [
                {
                    prazo: '5 dias úteis',
                    codProdutoAgencia: '04510',
                    price: 'R$ 20,00',
                    description: 'PAC a encomenda economica dos Correios',
                },
                {
                    prazo: '2 dias úteis',
                    codProdutoAgencia: '04014',
                    price: 'R$ 35,00',
                    description: 'Sedex a encomenda expressa dos Correios',
                },
            ],
            latitude: '-36.55',
            longitude: '-55.23',
        });
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    }));
});
