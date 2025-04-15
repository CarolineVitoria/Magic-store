// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { logger } from './utils/logger';

async function bootstrap() {
  // Cria a instância do logger personalizado
  //const myLogger = new logger();

  // Passa o logger ao criar a aplicação
  const app = await NestFactory.create(AppModule);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  //myLogger.log(`App rodando em http://localhost:${PORT}`);
  console.log(`App rodando em http://localhost:${PORT}`);
}
bootstrap();
