import conexaoDB from './../src/config/dbConnect';
//conexão db

//start server
import app from './app';
import logger from './utils/logger';
const PORT = 3000;

conexaoDB().then(() => {
  app.listen(PORT, () => {
    logger.info({ message: `App está rodando em http://localhost:${PORT}` });
  });
});
