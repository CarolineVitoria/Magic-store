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
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const stores_controller_1 = require("./stores.controller");
const stores_service_1 = require("./stores.service");
const common_1 = require("@nestjs/common");
describe('StoresController', () => {
    let controller;
    let service;
    const mockStoresService = {
        findAll: jest.fn(),
        pegaLojasProximas: jest.fn(),
        entregaPDVOuVirtual: jest.fn(),
        findById: jest.fn(),
        storeByState: jest.fn(),
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            controllers: [stores_controller_1.StoresController],
            providers: [
                {
                    provide: stores_service_1.StoresService,
                    useValue: mockStoresService,
                },
            ],
        }).compile();
        controller = module.get(stores_controller_1.StoresController);
        service = module.get(stores_service_1.StoresService);
    }));
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('findAll', () => {
        it('deve retornar todas as lojas', () => __awaiter(void 0, void 0, void 0, function* () {
            const storesMock = [{ nome: 'Loja 1' }, { nome: 'Loja 2' }];
            mockStoresService.findAll.mockResolvedValue(storesMock);
            const result = yield controller.findAll();
            expect(result).toEqual({ stores: storesMock, total: 2 });
        }));
    });
    describe('getFrete', () => {
        it('deve retornar loja com frete e pins', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockLojas = [{ nome: 'Loja XPTO' }];
            const mockLojaComFrete = {
                name: 'Loja XPTO',
                latitude: '-30.00',
                longitude: '-51.00',
                city: 'Cidade',
                postalCode: '00000',
                type: 'PDV',
                distance: '0 km',
                value: [
                    {
                        prazo: '1 dia útil',
                        codProdutoAgencia: '00000',
                        price: 'R$ 15,00',
                        description: 'Motoboy',
                    },
                ],
            };
            mockStoresService.pegaLojasProximas.mockResolvedValue(mockLojas);
            mockStoresService.entregaPDVOuVirtual.mockResolvedValue(mockLojaComFrete);
            const result = yield controller.getFrete('12345678');
            expect(result).toEqual({
                stores: [mockLojaComFrete],
                pins: [
                    {
                        name: mockLojaComFrete.name,
                        latitude: mockLojaComFrete.latitude,
                        longitude: mockLojaComFrete.longitude,
                    },
                ],
            });
        }));
        it('deve lançar erro se nenhuma loja for encontrada', () => __awaiter(void 0, void 0, void 0, function* () {
            mockStoresService.pegaLojasProximas.mockResolvedValue([]);
            yield expect(controller.getFrete('12345678')).rejects.toThrow(new common_1.HttpException('Não foi encontrada nenhuma loja próxima a você', common_1.HttpStatus.NOT_FOUND));
        }));
    });
    describe('storeByID', () => {
        it('deve retornar loja por ID com pins', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStore = {
                nome: 'Loja Teste',
                latitude: '-5.1',
                longitude: '-42.0',
            };
            mockStoresService.findById.mockResolvedValue(mockStore);
            const result = yield controller.storeByID('abc123');
            expect(result).toEqual({
                store: mockStore,
                pins: [
                    {
                        name: mockStore.nome,
                        latitude: mockStore.latitude,
                        longitude: mockStore.longitude,
                    },
                ],
                limit: 1,
                offset: 0,
            });
        }));
        it('deve lançar erro se loja não for encontrada', () => __awaiter(void 0, void 0, void 0, function* () {
            mockStoresService.findById.mockResolvedValue(null);
            yield expect(controller.storeByID('invalido')).rejects.toThrow(new common_1.HttpException('Loja não encontrada', common_1.HttpStatus.NOT_FOUND));
        }));
    });
    describe('storeByState', () => {
        it('deve retornar lojas pelo estado', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStores = [{ nome: 'Loja A' }, { nome: 'Loja B' }];
            mockStoresService.storeByState.mockResolvedValue(mockStores);
            const result = yield controller.storeByState('SP');
            expect(result).toEqual({
                store: mockStores,
                limit: 2,
                offset: 0,
                total: 2,
            });
        }));
        it('deve lançar erro se nenhuma loja for encontrada no estado', () => __awaiter(void 0, void 0, void 0, function* () {
            mockStoresService.storeByState.mockResolvedValue([]);
            yield expect(controller.storeByState('XX')).rejects.toThrow(new common_1.HttpException('Nenhuma loja encontrada para esse estado', common_1.HttpStatus.NOT_FOUND));
        }));
    });
});
