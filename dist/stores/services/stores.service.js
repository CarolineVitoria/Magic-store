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
exports.StoresService = void 0;
// src/stores/stores.service.ts
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose"); // Importar o decorator InjectModel
const mongoose_2 = require("mongoose");
const cep_service_1 = require("../../utils/cep.service");
const frete_service_1 = require("../../utils/frete.service");
const diastancia_1 = require("./diastancia");
let StoresService = class StoresService {
    constructor(storeModel) {
        this.storeModel = storeModel;
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storeModel.find().exec();
        });
    }
    pegaLojasProximas(cep) {
        return __awaiter(this, void 0, void 0, function* () {
            const enderecoCliente = yield (0, cep_service_1.pegaEndereco)(cep);
            const enderecoFormatado = `${enderecoCliente.rua}, ${enderecoCliente.bairro}, ${enderecoCliente.cidade} - ${enderecoCliente.uf}, Brasil`;
            const lojas = yield this.storeModel.find();
            const lojasPorDistancia = [];
            for (const loja of lojas) {
                if (loja.rua === enderecoCliente.rua &&
                    loja.bairro === enderecoCliente.bairro &&
                    loja.estado === enderecoCliente.estado) {
                    lojasPorDistancia.push({
                        nome: loja.nome,
                        rua: loja.rua,
                        distancia: 0,
                        duracao: '0 H, 0 Min',
                        numero: loja.numero || 'Não informado',
                        bairro: loja.bairro,
                        uf: loja.uf,
                        complemento: loja.complemento || 'Não informado',
                        cep: loja.cep,
                    });
                    continue;
                }
                const enderecoLoja = loja.numero
                    ? `${loja.rua}, ${loja.numero} ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`
                    : `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;
                const distancia = yield (0, diastancia_1.calculaDistancia)(enderecoFormatado, enderecoLoja);
                const medidas = (0, diastancia_1.converteMedidas)(distancia);
                const distanciaLoja = {
                    nome: loja.nome,
                    distancia: medidas.distanciaKm,
                    duracao: `${medidas.horas} H, ${medidas.minutos} Min`,
                    rua: loja.rua,
                    numero: loja.numero || 'Não informado',
                    bairro: loja.bairro,
                    uf: loja.uf,
                    complemento: loja.complemento || 'Não informado',
                    cep: loja.cep,
                };
                console.log(lojasPorDistancia.push(distanciaLoja));
            }
            (0, diastancia_1.ordenarRotas)(lojasPorDistancia);
            const resultadoPDV = yield this.entregaPDVOuVirtual(lojasPorDistancia, cep);
            return resultadoPDV;
        });
    }
    entregaPDVOuVirtual(lojasPorDistancia, cepCliente) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const loja of lojasPorDistancia) {
                if (loja.distancia <= 50) {
                    loja.tipo = 'PDV';
                    loja.frete = '$15,00';
                    loja.descricao = 'Carro';
                    loja.prazo = '1 dia útil';
                    return [loja]; // Retorna array com um item
                }
            }
            return yield (0, frete_service_1.calculaFrete)(lojasPorDistancia[0], cepCliente); // Já é array
        });
    }
};
exports.StoresService = StoresService;
exports.StoresService = StoresService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('stores')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StoresService);
