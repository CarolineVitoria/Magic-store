// src/stores/stores.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Importar o decorator InjectModel
import { Model } from 'mongoose';
import { IStore } from '../../interfaces/IStore';
import { pegaEndereco } from '../../utils/cep.service';
import { IDistanciaLojas } from '../../interfaces/IDistance';
import Store from '../../models/StoreModel';
import { calculaFrete } from '../../utils/frete.service';
import { LojaComFreteFormatado } from '../../interfaces/IFrete';
import {
  calculaDistancia,
  converteMedidas,
  ordenarRotas,
  pegaCoordenadas,
} from './diastancia';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('stores') private readonly storeModel: Model<IStore>,
  ) {}

  async findAll(): Promise<IStore[]> {
    return this.storeModel.find().exec();
  }

  async pegaLojasProximas(cep: string): Promise<IDistanciaLojas[]> {
    const enderecoCliente = await pegaEndereco(cep);
    const enderecoFormatado = `${enderecoCliente.rua}, ${enderecoCliente.bairro}, ${enderecoCliente.cidade} - ${enderecoCliente.uf}, Brasil`;

    const lojas = await this.storeModel.find();
    const lojasPorDistancia: IDistanciaLojas[] = [];

    for (const loja of lojas) {
      if (
        loja.rua === enderecoCliente.rua &&
        loja.bairro === enderecoCliente.bairro &&
        loja.estado === enderecoCliente.estado
      ) {
        const coordenadasLoja = await pegaCoordenadas(loja.cep);
        lojasPorDistancia.push({
          nome: loja.nome,
          rua: loja.rua,
          distancia: 0,
          duracao: '0 H, 0 Min',
          numero: loja.numero || 'Não informado',
          bairro: loja.bairro,
          uf: loja.uf,
          complemento: loja.complemento || 'Não informado',
          cep: loja.cep,
          coordenadas: coordenadasLoja,
        });
        continue;
      }

      const enderecoLoja = loja.numero
        ? `${loja.rua}, ${loja.numero} ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`
        : `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;

      const distancia = await calculaDistancia(enderecoFormatado, enderecoLoja);
      const coordenadasLoja = await pegaCoordenadas(enderecoLoja);
      const medidas = converteMedidas(distancia);

      const distanciaLoja: IDistanciaLojas = {
        nome: loja.nome,
        distancia: medidas.distanciaKm,
        duracao: `${medidas.horas} H, ${medidas.minutos} Min`,
        rua: loja.rua,
        numero: loja.numero || 'Não informado',
        bairro: loja.bairro,
        uf: loja.uf,
        complemento: loja.complemento || 'Não informado',
        cep: loja.cep,
        coordenadas: coordenadasLoja,
      };

      console.log(lojasPorDistancia.push(distanciaLoja));
      console.log(lojasPorDistancia);
    }

    return ordenarRotas(lojasPorDistancia);
  }
  async entregaPDVOuVirtual(
    lojasPorDistancia: IDistanciaLojas[],
    cepCliente: string,
  ): Promise<LojaComFreteFormatado> {
    for (const loja of lojasPorDistancia) {
      if (loja.distancia <= 50) {
        return {
          name: loja.nome,
          city: loja.bairro,
          postalCode: loja.cep,
          type: 'PDV',
          distance: `${loja.distancia} km`,
          value: [
            {
              prazo: '1 dia útil',
              codProdutoAgencia: '00000',
              price: 'R$ 15,00',
              description: 'Motoboy',
            },
          ],
          latitude: loja.coordenadas.lat.toString(),
          longitude: loja.coordenadas.lng.toString(),
        };
      }
    }

    return await calculaFrete(lojasPorDistancia[0], cepCliente);
  }

  async findById(id: string) {
    return this.storeModel.findById(id);
  }
  async storeByState(state: string) {
    return await this.storeModel.find({
      $or: [
        { estado: { $regex: `^${state}`, $options: 'i' } },
        { uf: { $regex: `^${state}`, $options: 'i' } },
      ],
    });
  }
}
