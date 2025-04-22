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
    todasLojas() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Aqui, o serviço pode chamar o modelo ou repositório que acessa o banco
                const stores = yield this.storesService.findAll();
                if (stores.length === 0) {
                    throw new common_1.HttpException('Nenhuma loja encontrada!', common_1.HttpStatus.NOT_FOUND);
                }
                return stores;
            }
            catch (error) {
                // Caso ocorra um erro na consulta, usamos status 500
                throw new common_1.HttpException('Erro ao buscar lojas', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        });
    }
    getLojasProximas(cep, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lojas = yield this.storesService.pegaLojasProximas(cep);
                if (lojas.length !== 0) {
                    return res.status(common_1.HttpStatus.OK).json(lojas);
                }
                else {
                    return res.status(common_1.HttpStatus.NOT_FOUND).json({
                        message: 'Não foi encontrada nenhuma loja próxima a você',
                    });
                }
            }
            catch (error) {
                return res
                    .status(common_1.HttpStatus.BAD_REQUEST)
                    .json({ message: error.message });
            }
        });
    }
};
exports.StoresController = StoresController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "todasLojas", null);
__decorate([
    (0, common_1.Get)(':cep'),
    __param(0, (0, common_1.Param)('cep')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StoresController.prototype, "getLojasProximas", null);
exports.StoresController = StoresController = __decorate([
    (0, common_1.Controller)('api/stores'),
    __metadata("design:paramtypes", [stores_service_1.StoresService])
], StoresController);
