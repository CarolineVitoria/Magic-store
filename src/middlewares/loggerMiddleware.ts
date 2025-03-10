import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { method, url, body, query } = req;
  const start = Date.now();

  logger.info({
    message: 'Requisição recebida',
    method,
    url,
    body,
    query,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;

    logger.info({
      message: 'Resposta enviada',
      method,
      url,
      status: res.statusCode,
      tempo: `${duration}ms`,
    });
  });

  next();
};
