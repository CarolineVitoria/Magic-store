"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storesProviders = void 0;
// src/stores/stores.providers.ts
const StoreModel_1 = __importDefault(require("../models/StoreModel"));
exports.storesProviders = [
    {
        provide: 'STORE_MODEL',
        useValue: StoreModel_1.default,
    },
];
