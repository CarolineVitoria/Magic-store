"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
const loggerMiddleware = (req, res, next) => {
    const { method, url, body, query } = req;
    const start = Date.now();
    logger_1.default.info({
        message: 'Requisição recebida',
        method,
        url,
        body,
        query,
    });
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger_1.default.info({
            message: 'Resposta enviada',
            method,
            url,
            status: res.statusCode,
            tempo: `${duration}ms`,
        });
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
