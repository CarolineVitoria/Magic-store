import express from "express";
import { criaLoja, todasLojas } from "../controllers/storeController"; 
const router = express.Router();

router.route('/').get(todasLojas)
router.route('/add').post(criaLoja);

export default router;