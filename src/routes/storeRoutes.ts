import express from 'express';
import {
  getLojasProximas,
  todasLojas,
  criaLoja,
} from '../controllers/storeController';
const router = express.Router();

router.route('/').get(todasLojas);
router.route('/add').post(criaLoja);
router.route('/:cep').get(getLojasProximas);

export default router;
