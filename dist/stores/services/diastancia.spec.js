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
// stores/services/diastancia.spec.ts
const axios_1 = __importDefault(require("axios"));
const diastancia_1 = require("./diastancia");
jest.mock('axios');
global.fetch = jest.fn();
describe('Funções de distância', () => {
    describe('calculaDistancia', () => {
        it('retorna distância e duração da API', () => __awaiter(void 0, void 0, void 0, function* () {
            axios_1.default.post.mockResolvedValue({
                data: {
                    routes: [
                        {
                            distanceMeters: 10000,
                            duration: '1200s',
                        },
                    ],
                },
            });
            const result = yield (0, diastancia_1.calculaDistancia)('Origem', 'Destino');
            expect(result).toEqual({
                distanceMeters: 10000,
                duration: '1200s',
            });
        }));
    });
    describe('converteMedidas', () => {
        it('converte metros e segundos corretamente', () => {
            const distancia = { distanceMeters: 15000, duration: '5400s' };
            const resultado = (0, diastancia_1.converteMedidas)(distancia);
            expect(resultado).toEqual({
                distanciaKm: 15,
                horas: 1,
                minutos: 30,
            });
        });
    });
    describe('ordenarRotas', () => {
        it('ordena lojas pela menor distância', () => {
            const lojas = [
                { nome: 'Loja A', distancia: 20 },
                { nome: 'Loja B', distancia: 10 },
            ];
            const resultado = (0, diastancia_1.ordenarRotas)(lojas);
            expect(resultado[0].nome).toBe('Loja B');
        });
    });
    describe('pegaCoordenadas', () => {
        it('retorna coordenadas da API Google Maps', () => __awaiter(void 0, void 0, void 0, function* () {
            fetch.mockResolvedValue({
                json: () => __awaiter(void 0, void 0, void 0, function* () {
                    return ({
                        status: 'OK',
                        results: [
                            {
                                geometry: {
                                    location: {
                                        lat: -23.55052,
                                        lng: -46.633308,
                                    },
                                },
                            },
                        ],
                    });
                }),
            });
            const coordenadas = yield (0, diastancia_1.pegaCoordenadas)('01001-000');
            expect(coordenadas).toEqual({ lat: -23.55052, lng: -46.633308 });
        }));
        it('lança erro se a API não retornar OK', () => __awaiter(void 0, void 0, void 0, function* () {
            fetch.mockResolvedValue({
                json: () => __awaiter(void 0, void 0, void 0, function* () { return ({ status: 'ZERO_RESULTS' }); }),
            });
            yield expect((0, diastancia_1.pegaCoordenadas)('00000-000')).rejects.toThrow('Não foi possível obter as coordenadas.');
        }));
    });
});
