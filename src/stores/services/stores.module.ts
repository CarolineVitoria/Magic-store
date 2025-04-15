import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import Store from '../../models/StoreModel';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'stores', schema: Store.schema }]), // Registra o modelo Store no módulo
  ],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
