import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';
dotenv.config({ path: './config.env' });

const conexaoDB = async () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION_STRING!);
    logger.info('Conexão com o banco de dados bem-sucedida');
  } catch (err) {
    logger.error(`Falha ao conectar com o banco ${err}`);
  }
};

export default conexaoDB;
