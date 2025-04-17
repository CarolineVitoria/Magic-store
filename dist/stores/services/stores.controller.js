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
let StoresController = class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    getLojasProximas(cep, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lojas = yield this.storesService.pegaLojasProximas(cep);
                if (lojas.length === 0) {
                    return res.status(common_1.HttpStatus.NOT_FOUND).json({
                        message: 'Não foi encontrada nenhuma loja próxima a você',
                    });
                }
                const lojaComFrete = yield this.storesService.entregaPDVOuVirtual(lojas, cep);
                const pins = [
                    {
                        name: lojaComFrete.name,
                        latitude: lojaComFrete.latitude,
                        longitude: lojaComFrete.longitude,
                    },
                ];
                return res.status(common_1.HttpStatus.OK).json({
                    stores: [lojaComFrete],
                    pins,
                    limit: 1,
                    offset: 0,
                    total: 1,
                });
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
    storeByID(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const store = yield this.storesService.findById(id);
                if (!store) {
                    return res.status(common_1.HttpStatus.NOT_FOUND).json({
                        message: 'Loja não encontrada',
                    });
                }
                return res.status(common_1.HttpStatus.OK).json({
                    store,
                    limit: 1,
                    offset: 0,
                });
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
    storeByState(state, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let formattedState = state.trim();
                const store = yield this.storesService.storeByState(formattedState);
                if (store.length === 0) {
                    return res.status(common_1.HttpStatus.NOT_FOUND).json({
                        message: 'Loja não encontrada',
                    });
                }
                return res.status(common_1.HttpStatus.OK).json({
                    store,
                    limit: 1,
                    offset: 0,
                });
            }
            catch (error) {
                return this.handleError(res, error);
            }
        });
    }
    handleError(res, error) {
        if (error instanceof Error) {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ message: error.message });
        }
        else {
            return res
                .status(common_1.HttpStatus.BAD_REQUEST)
                .json({ message: 'Erro desconhecido' });
        }
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Get)(':cep'),
    __param(0, (0, common_1.Param)('cep')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getLojasProximas", null);
__decorate([
    (0, common_1.Get)('by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "storeByID", null);
__decorate([
    (0, common_1.Get)('by-state/:state'),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "storeByState", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.Controller)('api/stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
