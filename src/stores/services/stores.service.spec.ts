import { Test, TestingModule } from '@nestjs/testing';
import { StoresService } from './stores.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IStore } from '../../interfaces/IStore';
import * as cepService from '../../utils/cep.service';
import * as freteService from '../../utils/frete.service';
import * as distanciaUtils from './diastancia';

describe('StoresService', () => {
  let service: StoresService;
  let model: Model<IStore>;

  const mockStoreModel = {
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getModelToken('stores'),
          useValue: mockStoreModel,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
    model = module.get<Model<IStore>>(getModelToken('stores'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todas as lojas', async () => {
      const mockStores = [{ nome: 'Loja 1' }, { nome: 'Loja 2' }];
      mockStoreModel.find.mockReturnValue({ exec: jest.fn().mockResolvedValue(mockStores) });

      const result = await service.findAll();
      expect(result).toEqual(mockStores);
    });
  });

  describe('findById', () => {
    it('deve retornar uma loja pelo ID', async () => {
      const mockStore = { nome: 'Loja XPTO' };
      mockStoreModel.findById.mockResolvedValue(mockStore);

      const result = await service.findById('fake-id');
      expect(result).toEqual(mockStore);
    });
  });

  describe('storeByState', () => {
    it('deve retornar lojas por estado ou UF', async () => {
      const mockStores = [{ estado: 'São Paulo' }, { uf: 'SP' }];
      mockStoreModel.find.mockResolvedValue(mockStores);

      const result = await service.storeByState('sp');
      expect(result).toEqual(mockStores);
    });
  });

  describe('entregaPDVOuVirtual', () => {
    it('deve retornar uma loja com entrega tipo PDV', async () => {
      const lojas = [{
        nome: 'Loja Teste',
        bairro: 'Centro',
        cep: '12345-000',
        distancia: 10,
        coordenadas: { lat: -23.5, lng: -46.6 }
      }];

      const result = await service.entregaPDVOuVirtual(lojas as any, '12345-000');
      expect(result.type).toBe('PDV');
    });

    it('deve retornar uma entrega virtual caso a distância seja maior que 50km', async () => {
      const lojas = [{
        nome: 'Loja Longa',
        bairro: 'Centro',
        cep: '99999-000',
        distancia: 60,
        coordenadas: { lat: -23.5, lng: -46.6 }
      }];

      const frete = {
        name: 'Entrega Virtual',
        city: 'Virtual',
        postalCode: '00000-000',
        type: 'VIRTUAL',
        distance: '60 km',
        value: [],
        latitude: '-20.5',
        longitude: '-40.6'
      };

      jest.spyOn(freteService, 'calculaFrete').mockResolvedValue(frete as any);

      const result = await service.entregaPDVOuVirtual(lojas as any, '12345-000');
      expect(result.type).toBe('VIRTUAL');
    });
  });

  describe('pegaLojasProximas', () => {
    it('deve calcular distâncias e ordenar lojas', async () => {
      const cepMock = {
        rua: 'Rua A',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estado: 'São Paulo',
        uf: 'SP',
      };

      const mockLojas = [
        {
          nome: 'Loja 1',
          rua: 'Rua A',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'São Paulo',
          uf: 'SP',
          cep: '01000-000',
        },
      ];

      const coordenadasMock = { lat: -23.5, lng: -46.6 };

      jest.spyOn(cepService, 'pegaEndereco').mockResolvedValue(cepMock as any);
      jest.spyOn(distanciaUtils, 'pegaCoordenadas').mockResolvedValue(coordenadasMock);
      jest.spyOn(distanciaUtils, 'ordenarRotas').mockImplementation(lojas => lojas);

      mockStoreModel.find.mockResolvedValue(mockLojas);

      const result = await service.pegaLojasProximas('01000-000');
      expect(result).toHaveLength(1);
      expect(result[0].nome).toBe('Loja 1');
    });
  });
});
