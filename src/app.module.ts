// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { StoresModule } from './stores/services/stores.module';


@Module({
  imports: [
    // Carrega variáveis de ambiente do .env
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config.env' }),

    // Módulo para conectar ao banco (database.module.ts)
    DatabaseModule,

    // Módulo com as rotas e serviços de "stores"
    StoresModule,
  ],
})
export class AppModule {}
