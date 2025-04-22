"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const storeController_1 = require("../controllers/storeController");
const router = express_1.default.Router();
router.route('/').get(storeController_1.todasLojas);
router.route('/add').post(storeController_1.criaLoja);
router.route('/:cep').get(storeController_1.getLojasProximas);
exports.default = router;
