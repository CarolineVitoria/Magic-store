import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { StoresService } from './stores.service';

@Controller('api/stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get(':cep')
  async getLojasProximas(@Param('cep') cep: string, @Res() res: Response) {
    try {
      const lojas = await this.storesService.pegaLojasProximas(cep);

      if (lojas.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Não foi encontrada nenhuma loja próxima a você',
        });
      }

      const lojaComFrete = await this.storesService.entregaPDVOuVirtual(
        lojas,
        cep,
      );

      const pins = [
        {
          name: lojaComFrete.name,
          latitude: lojaComFrete.latitude,
          longitude: lojaComFrete.longitude,
        },
      ];

      return res.status(HttpStatus.OK).json({
        stores: [lojaComFrete],
        pins,
        limit: 1,
        offset: 0,
        total: 1,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  @Get('by-id/:id')
  async storeByID(@Param('id') id: string, @Res() res: Response) {
    try {
      const store = await this.storesService.findById(id);

      if (!store) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Loja não encontrada',
        });
      }

      return res.status(HttpStatus.OK).json({
        store,
        limit: 1,
        offset: 0,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }
  @Get('by-state/:state')
  async storeByState(@Param('state') state: string, @Res() res: Response) {
    try {
      let formattedState = state.trim();

      const store = await this.storesService.storeByState(formattedState);

      if (store.length === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Loja não encontrada',
        });
      }
      return res.status(HttpStatus.OK).json({
        store,
        limit: 1,
        offset: 0,
      });
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    if (error instanceof Error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Erro desconhecido' });
    }
  }
}
