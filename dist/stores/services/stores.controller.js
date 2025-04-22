"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.StoresController = void 0;
const common_1 = require("@nestjs/common");
const stores_service_1 = require("./stores.service");
const swagger_1 = require("@nestjs/swagger");
let StoresController = class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield this.storesService.findAll();
                return {
                    stores,
                    total: stores.length
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.BadRequestException(error.message);
                }
                throw new common_1.BadRequestException('Erro ao buscar lojas');
            }
        });
    }
    getFrete(cep) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stores = yield this.storesService.pegaLojasProximas(cep);
                if (stores.length === 0) {
                    throw new common_1.NotFoundException('Não foi encontrada nenhuma loja próxima a você');
                }
                const lojaComFrete = yield this.storesService.entregaPDVOuVirtual(stores, cep);
                const pins = [
                    {
                        name: lojaComFrete.name,
                        latitude: lojaComFrete.latitude,
                        longitude: lojaComFrete.longitude,
                    },
                ];
                return {
                    stores: [lojaComFrete],
                    pins,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.BadRequestException(error.message);
                }
                throw new common_1.BadRequestException('Erro ao buscar lojas próximas');
            }
        });
    }
    storeByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const store = yield this.storesService.findById(id);
                if (!store) {
                    throw new common_1.NotFoundException('Loja não encontrada');
                }
                const pins = [
                    {
                        name: store.nome,
                        latitude: store.latitude,
                        longitude: store.longitude,
                    },
                ];
                return {
                    store,
                    pins,
                    limit: 1,
                    offset: 0,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.BadRequestException(error.message);
                }
                throw new common_1.BadRequestException('Erro ao buscar loja por ID');
            }
        });
    }
    storeByState(state) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const formattedState = state.trim();
                const stores = yield this.storesService.storeByState(formattedState);
                if (stores.length === 0) {
                    throw new common_1.NotFoundException('Nenhuma loja encontrada para esse estado');
                }
                return {
                    store: stores,
                    limit: stores.length,
                    offset: 0,
                    total: stores.length,
                };
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_1.BadRequestException(error.message);
                }
                throw new common_1.BadRequestException('Erro ao buscar lojas por estado');
            }
        });
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Get)('/'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as lojas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de lojas retornada com sucesso.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':cep'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar lojas próximas por CEP' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna lojas próximas com cálculo de frete e pins.' }),
    __param(0, (0, common_1.Param)('cep')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getFrete", null);
__decorate([
    (0, common_1.Get)('by-id/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar loja por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Retorna loja com base no ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "storeByID", null);
__decorate([
    (0, common_1.Get)('by-state/:state'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar lojas por estado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de lojas no estado informado' }),
    __param(0, (0, common_1.Param)('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "storeByState", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.Controller)('api/stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
