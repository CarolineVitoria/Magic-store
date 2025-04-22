import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  const mockStoresService = {
    findAll: jest.fn(),
    pegaLojasProximas: jest.fn(),
    entregaPDVOuVirtual: jest.fn(),
    findById: jest.fn(),
    storeByState: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoresController],
      providers: [
        {
          provide: StoresService,
          useValue: mockStoresService,
        },
      ],
    }).compile();

    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar todas as lojas', async () => {
      const storesMock = [{ nome: 'Loja 1' }, { nome: 'Loja 2' }];
      mockStoresService.findAll.mockResolvedValue(storesMock);

      const result = await controller.findAll();
      expect(result).toEqual({ stores: storesMock, total: 2 });
    });
  });

  describe('getFrete', () => {
    it('deve retornar loja com frete e pins', async () => {
      const mockLojas = [{ nome: 'Loja XPTO' }];
      const mockLojaComFrete = {
        name: 'Loja XPTO',
        latitude: '-30.00',
        longitude: '-51.00',
        city: 'Cidade',
        postalCode: '00000',
        type: 'PDV',
        distance: '0 km',
        value: [
          {
            prazo: '1 dia útil',
            codProdutoAgencia: '00000',
            price: 'R$ 15,00',
            description: 'Motoboy',
          },
        ],
      };

      mockStoresService.pegaLojasProximas.mockResolvedValue(mockLojas);
      mockStoresService.entregaPDVOuVirtual.mockResolvedValue(mockLojaComFrete);

      const result = await controller.getFrete('12345678');

      expect(result).toEqual({
        stores: [mockLojaComFrete],
        pins: [
          {
            name: mockLojaComFrete.name,
            latitude: mockLojaComFrete.latitude,
            longitude: mockLojaComFrete.longitude,
          },
        ],
      });
    });

    it('deve lançar erro se nenhuma loja for encontrada', async () => {
      mockStoresService.pegaLojasProximas.mockResolvedValue([]);

      await expect(controller.getFrete('12345678')).rejects.toThrow(
        new HttpException(
          'Não foi encontrada nenhuma loja próxima a você',
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });

  describe('storeByID', () => {
    it('deve retornar loja por ID com pins', async () => {
      const mockStore = {
        nome: 'Loja Teste',
        latitude: '-5.1',
        longitude: '-42.0',
      };
      mockStoresService.findById.mockResolvedValue(mockStore);

      const result = await controller.storeByID('abc123');
      expect(result).toEqual({
        store: mockStore,
        pins: [
          {
            name: mockStore.nome,
            latitude: mockStore.latitude,
            longitude: mockStore.longitude,
          },
        ],
        limit: 1,
        offset: 0,
      });
    });

    it('deve lançar erro se loja não for encontrada', async () => {
      mockStoresService.findById.mockResolvedValue(null);

      await expect(controller.storeByID('invalido')).rejects.toThrow(
        new HttpException('Loja não encontrada', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('storeByState', () => {
    it('deve retornar lojas pelo estado', async () => {
      const mockStores = [{ nome: 'Loja A' }, { nome: 'Loja B' }];
      mockStoresService.storeByState.mockResolvedValue(mockStores);

      const result = await controller.storeByState('SP');
      expect(result).toEqual({
        store: mockStores,
        limit: 2,
        offset: 0,
        total: 2,
      });
    });

    it('deve lançar erro se nenhuma loja for encontrada no estado', async () => {
      mockStoresService.storeByState.mockResolvedValue([]);

      await expect(controller.storeByState('XX')).rejects.toThrow(
        new HttpException('Nenhuma loja encontrada para esse estado', HttpStatus.NOT_FOUND),
      );
    });
  });
});
