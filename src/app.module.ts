import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { StoresModule } from './stores/services/stores.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'config.env' }),

    DatabaseModule,

    StoresModule,
  ],
})
export class AppModule {}
