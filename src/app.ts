//No app.ts estará os middleware gerais, como um para adicionar data ou converter as requisições para objetos, também é aqui onde definimos as rotas principais
import storeRoutes from "./routes/storeRoutes";
import express from 'express';
const app = express();


app.use(express.json());

//rotas
app.use('/api/stores', storeRoutes);
export default app;