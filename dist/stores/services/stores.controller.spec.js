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
    describe('getLojasProximas', () => {
        it('deve retornar lojas e pins corretamente', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockLojas = [{ nome: 'Loja XPTO' }];
            const mockLojaComFrete = {
                name: 'Loja XPTO',
                latitude: '-30.00',
                longitude: '-51.00',
            };
            mockStoresService.pegaLojasProximas.mockResolvedValue(mockLojas);
            mockStoresService.entregaPDVOuVirtual.mockResolvedValue(mockLojaComFrete);
            const result = yield controller.getFrete('12345678');
            expect(result).toEqual({
                stores: [mockLojaComFrete],
                pins: [
                    {
                        name: 'Loja XPTO',
                        latitude: '-30.00',
                        longitude: '-51.00',
                    },
                ],
            });
            expect(service.pegaLojasProximas).toHaveBeenCalledWith('12345678');
        }));
        it('deve lançar erro se nenhuma loja for encontrada', () => __awaiter(void 0, void 0, void 0, function* () {
            mockStoresService.pegaLojasProximas.mockResolvedValue([]);
            yield expect(controller.getFrete('12345678')).rejects.toThrow(new common_1.HttpException('Não foi encontrada nenhuma loja próxima a você', common_1.HttpStatus.NOT_FOUND));
        }));
    });
});
