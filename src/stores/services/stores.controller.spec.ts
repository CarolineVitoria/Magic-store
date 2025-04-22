import { Test, TestingModule } from '@nestjs/testing';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  const mockStoresService = {
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

  describe('getLojasProximas', () => {
    it('deve retornar lojas e pins corretamente', async () => {
      const mockLojas = [{ nome: 'Loja XPTO' }];
      const mockLojaComFrete = {
        name: 'Loja XPTO',
        latitude: '-30.00',
        longitude: '-51.00',
      };

      mockStoresService.pegaLojasProximas.mockResolvedValue(mockLojas);
      mockStoresService.entregaPDVOuVirtual.mockResolvedValue(mockLojaComFrete);

      const result = await controller.getFrete('12345678');

      expect(result).toEqual({
        stores: [mockLojaComFrete],
        pins: [
          {
            name: 'Loja XPTO',
            latitude: '-30.00',
            longitude: '-51.00',
          },
        ],

      });

      expect(service.pegaLojasProximas).toHaveBeenCalledWith('12345678');
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
});
