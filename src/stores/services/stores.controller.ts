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
  @Get()
  async todasLojas() {
    try {
      // Aqui, o serviço pode chamar o modelo ou repositório que acessa o banco
      const stores = await this.storesService.findAll();
      if (stores.length === 0) {
        throw new HttpException(
          'Nenhuma loja encontrada!',
          HttpStatus.NOT_FOUND,
        );
      }
      return stores;
    } catch (error: any) {
      // Caso ocorra um erro na consulta, usamos status 500
      throw new HttpException(
        'Erro ao buscar lojas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':cep')
  async getLojasProximas(@Param('cep') cep: string, @Res() res: Response) {
    try {
      const lojas = await this.storesService.pegaLojasProximas(cep);

      if (lojas.length !== 0) {
        return res.status(HttpStatus.OK).json(lojas);
      } else {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Não foi encontrada nenhuma loja próxima a você',
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Erro desconhecido' });
      }
    }
  }
}
