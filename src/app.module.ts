// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StoresService } from './stores/services/stores.service';
import { DatabaseModule } from './database/database.module';
import { StoresModule } from './stores/services/stores.module';
import { StoresController } from './stores/services/stores.controller';

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
