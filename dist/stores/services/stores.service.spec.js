"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stores_service_1 = require("./stores.service");
const mongoose_1 = require("@nestjs/mongoose");
const cepService = __importStar(require("../../utils/cep.service"));
const freteService = __importStar(require("../../utils/frete.service"));
const distanciaUtils = __importStar(require("./diastancia"));
describe('StoresService', () => {
    let service;
    let model;
    const mockStoreModel = {
        find: jest.fn(),
        findById: jest.fn(),
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                stores_service_1.StoresService,
                {
                    provide: (0, mongoose_1.getModelToken)('stores'),
                    useValue: mockStoreModel,
                },
            ],
        }).compile();
        service = module.get(stores_service_1.StoresService);
        model = module.get((0, mongoose_1.getModelToken)('stores'));
    }));
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('deve retornar todas as lojas', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStores = [{ nome: 'Loja 1' }, { nome: 'Loja 2' }];
            mockStoreModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockStores) });
            const result = yield service.findAll();
            expect(result).toEqual(mockStores);
        }));
    });
    describe('findById', () => {
        it('deve retornar uma loja pelo ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStore = { nome: 'Loja XPTO' };
            mockStoreModel.findById.mockResolvedValue(mockStore);
            const result = yield service.findById('fake-id');
            expect(result).toEqual(mockStore);
        }));
    });
    describe('storeByState', () => {
        it('deve retornar lojas por estado ou UF', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStores = [{ estado: 'São Paulo' }, { uf: 'SP' }];
            mockStoreModel.find.mockResolvedValue(mockStores);
            const result = yield service.storeByState('sp');
            expect(result).toEqual(mockStores);
        }));
    });
    describe('entregaPDVOuVirtual', () => {
        it('deve retornar uma loja com entrega tipo PDV', () => __awaiter(void 0, void 0, void 0, function* () {
            const lojas = [{
                    nome: 'Loja Teste',
                    bairro: 'Centro',
                    cep: '12345-000',
                    distancia: 10,
                    coordenadas: { lat: -23.5, lng: -46.6 }
                }];
            const result = yield service.entregaPDVOuVirtual(lojas, '12345-000');
            expect(result.type).toBe('PDV');
        }));
        it('deve retornar uma entrega virtual caso a distância seja maior que 50km', () => __awaiter(void 0, void 0, void 0, function* () {
            const lojas = [{
                    nome: 'Loja Longa',
                    bairro: 'Centro',
                    cep: '99999-000',
                    distancia: 60,
                    coordenadas: { lat: -23.5, lng: -46.6 }
                }];
            const frete = {
                name: 'Entrega Virtual',
                city: 'Virtual',
                postalCode: '00000-000',
                type: 'VIRTUAL',
                distance: '60 km',
                value: [],
                latitude: '-20.5',
                longitude: '-40.6'
            };
            jest.spyOn(freteService, 'calculaFrete').mockResolvedValue(frete);
            const result = yield service.entregaPDVOuVirtual(lojas, '12345-000');
            expect(result.type).toBe('VIRTUAL');
        }));
    });
    describe('pegaLojasProximas', () => {
        it('deve calcular distâncias e ordenar lojas', () => __awaiter(void 0, void 0, void 0, function* () {
            const cepMock = {
                rua: 'Rua A',
                bairro: 'Centro',
                cidade: 'São Paulo',
                estado: 'São Paulo',
                uf: 'SP',
            };
            const mockLojas = [
                {
                    nome: 'Loja 1',
                    rua: 'Rua A',
                    bairro: 'Centro',
                    cidade: 'São Paulo',
                    estado: 'São Paulo',
                    uf: 'SP',
                    cep: '01000-000',
                },
            ];
            const coordenadasMock = { lat: -23.5, lng: -46.6 };
            jest.spyOn(cepService, 'pegaEndereco').mockResolvedValue(cepMock);
            jest.spyOn(distanciaUtils, 'pegaCoordenadas').mockResolvedValue(coordenadasMock);
            jest.spyOn(distanciaUtils, 'ordenarRotas').mockImplementation(lojas => lojas);
            mockStoreModel.find.mockResolvedValue(mockLojas);
            const result = yield service.pegaLojasProximas('01000-000');
            expect(result).toHaveLength(1);
            expect(result[0].nome).toBe('Loja 1');
        }));
    });
});
