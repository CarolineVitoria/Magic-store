// src/stores/stores.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; // Importar o decorator InjectModel
import { Model } from 'mongoose';
import { IStore } from '../../interfaces/IStore';
import { pegaEndereco } from '../../utils/cep.service';
import { IDistanciaLojas } from '../../interfaces/IDistance';
import Store from '../../models/StoreModel';
import { calculaFrete } from '../../utils/frete.service';
import { calculaDistancia, converteMedidas, ordenarRotas } from './diastancia';

@Injectable()
export class StoresService {
  constructor(
    @InjectModel('stores') private readonly storeModel: Model<IStore>, // Use o nome correto 'stores'
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
        });
        continue;
      }

      const enderecoLoja = loja.numero
        ? `${loja.rua}, ${loja.numero} ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`
        : `${loja.rua}, ${loja.bairro}, ${loja.cidade} - ${loja.uf}, Brasil`;

      const distancia = await calculaDistancia(enderecoFormatado, enderecoLoja);
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
      };

      console.log(lojasPorDistancia.push(distanciaLoja));
    }

    ordenarRotas(lojasPorDistancia);
    const resultadoPDV = await this.entregaPDVOuVirtual(lojasPorDistancia, cep);
    return resultadoPDV;
  }
  async entregaPDVOuVirtual(
    lojasPorDistancia: IDistanciaLojas[],
    cepCliente: string,
  ): Promise<IDistanciaLojas[]> {
    for (const loja of lojasPorDistancia) {
      if (loja.distancia <= 50) {
        loja.tipo = 'PDV';
        loja.frete = '$15,00';
        loja.descricao = 'Carro';
        loja.prazo = '1 dia útil';
        return [loja]; // Retorna array com um item
      }
    }
    return await calculaFrete(lojasPorDistancia[0], cepCliente); // Já é array
  }
}
