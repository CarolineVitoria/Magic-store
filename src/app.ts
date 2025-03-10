//No app.ts estará os middleware gerais, como um para adicionar data ou converter as requisições para objetos, também é aqui onde definimos as rotas principais
import express from 'express';
import storeRoutes from './routes/storeRoutes';
import { loggerMiddleware } from './middlewares/loggerMiddleware';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);

//rotas
app.use('/api/stores', storeRoutes);
export default app;
