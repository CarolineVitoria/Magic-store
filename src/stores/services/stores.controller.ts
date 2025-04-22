import {
  Controller,
  Get,
  Param,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { StoresService } from './stores.service';

@Controller('api/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}
  @Get('/')
  async findAll(){
    try{
      const stores = await this.storesService.findAll();
      return {
        stores,
        total: stores.length
      }
    }
  catch (error) {
    if (error instanceof Error) {
      throw new BadRequestException(error.message);
    }
    throw new BadRequestException('Erro ao buscar lojas');
  }
}

  @Get(':cep')
  async getFrete(@Param('cep') cep: string) {
    try {
      const stores = await this.storesService.pegaLojasProximas(cep);

      if (stores.length === 0) {
        throw new NotFoundException('Não foi encontrada nenhuma loja próxima a você');
      }

      const lojaComFrete = await this.storesService.entregaPDVOuVirtual(stores, cep);

      const pins = [
        {
          name: lojaComFrete.name,
          latitude: lojaComFrete.latitude,
          longitude: lojaComFrete.longitude,
        },
      ];

      return {
        stores: [lojaComFrete],
        pins,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Erro ao buscar lojas próximas');
    }
  }

  @Get('by-id/:id')
  async storeByID(@Param('id') id: string) {
    try {
      const store = await this.storesService.findById(id);

      if (!store) {
        throw new NotFoundException('Loja não encontrada');
      }

      const pins = [
        {
          name: store.nome,
          latitude: store.latitude,
          longitude: store.longitude,
        },
      ];

      return {
        store,
        pins,
        limit: 1,
        offset: 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Erro ao buscar loja por ID');
    }
  }

  @Get('by-state/:state')
  async storeByState(@Param('state') state: string) {
    try {
      const formattedState = state.trim();

      const stores = await this.storesService.storeByState(formattedState);

      if (stores.length === 0) {
        throw new NotFoundException('Nenhuma loja encontrada para esse estado');
      }

      return {
        store: stores,
        limit: stores.length,
        offset: 0,
        total: stores.length,
      };
    }catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Erro ao buscar lojas por estado');
    }
    
  }
}
