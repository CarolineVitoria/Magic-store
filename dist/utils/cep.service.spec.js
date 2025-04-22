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
const cep_service_1 = require("./cep.service");
const valida_cep_1 = require("./valida-cep");
const logger_1 = __importDefault(require("./logger"));
jest.mock('axios');
jest.mock('./valida-cep', () => ({
    validaCep: jest.fn(),
}));
jest.mock('./logger', () => ({
    info: jest.fn(),
}));
const mockedAxios = axios_1.default;
const mockedValidaCep = valida_cep_1.validaCep;
const mockedLogger = logger_1.default;
describe('pegaEndereco', () => {
    const cep = '91349-900';
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('deve retornar endereço quando o CEP é válido e encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedValidaCep.mockReturnValue(true);
        mockedAxios.get.mockResolvedValue({
            data: {
                logradouro: 'Avenida João Wallig',
                bairro: 'Jardim Europa',
                localidade: 'Porto Alegre',
                uf: 'RS',
                estado: 'Rio Grande do Sul',
                complemento: '',
                cep,
            },
        });
        const endereco = yield (0, cep_service_1.pegaEndereco)(cep);
        expect(endereco).toEqual({
            rua: 'Avenida João Wallig',
            bairro: 'Jardim Europa',
            cidade: 'Porto Alegre',
            uf: 'RS',
            estado: 'Rio Grande do Sul',
            complemento: '',
            cep,
        });
        expect(mockedLogger.info).toHaveBeenCalledWith(expect.objectContaining({ cep }));
    }));
    it('deve lançar erro se o CEP for inválido', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedValidaCep.mockReturnValue(false);
        yield expect((0, cep_service_1.pegaEndereco)('123')).rejects.toThrow('CEP inválido');
    }));
    it('deve lançar erro se o CEP não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
        mockedValidaCep.mockReturnValue(true);
        mockedAxios.get.mockResolvedValue({
            data: {
                erro: true,
            },
        });
        yield expect((0, cep_service_1.pegaEndereco)(cep)).rejects.toThrow('CEP não encontrado');
    }));
});
