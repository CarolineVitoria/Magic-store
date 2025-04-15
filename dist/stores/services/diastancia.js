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
exports.ordenarRotas = exports.converteMedidas = exports.calculaDistancia = void 0;
const axios_1 = __importDefault(require("axios"));
const calculaDistancia = (origem, destino) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.KEY;
    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';
    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
    };
    const corpo = {
        origin: { address: origem },
        destination: { address: destino },
        routing_preference: 'TRAFFIC_AWARE',
        travel_mode: 'DRIVE',
    };
    const resposta = yield axios_1.default.post(url, corpo, { headers });
    return resposta.data.routes[0];
});
exports.calculaDistancia = calculaDistancia;
const converteMedidas = (distancia) => {
    const distanciaKm = distancia.distanceMeters / 1000;
    const duracaoSegundos = parseInt(distancia.duration.replace('s', ''));
    const horas = Math.floor(duracaoSegundos / 3600);
    const minutos = Math.floor((duracaoSegundos % 3600) / 60);
    return { distanciaKm, horas, minutos };
};
exports.converteMedidas = converteMedidas;
const ordenarRotas = (lojas) => {
    return lojas.sort((a, b) => Number(a.distancia) - Number(b.distancia));
};
exports.ordenarRotas = ordenarRotas;
