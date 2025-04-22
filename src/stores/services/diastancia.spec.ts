import axios from 'axios';
import {
  calculaDistancia,
  converteMedidas,
  ordenarRotas,
  pegaCoordenadas,
} from './diastancia';

jest.mock('axios');
global.fetch = jest.fn();

describe('Funções de distância', () => {
  describe('calculaDistancia', () => {
    it('retorna distância e duração da API', async () => {
      (axios.post as jest.Mock).mockResolvedValue({
        data: {
          routes: [
            {
              distanceMeters: 10000,
              duration: '1200s',
            },
          ],
        },
      });

      const result = await calculaDistancia('Origem', 'Destino');
      expect(result).toEqual({
        distanceMeters: 10000,
        duration: '1200s',
      });
    });
  });

  describe('converteMedidas', () => {
    it('converte metros e segundos corretamente', () => {
      const distancia = { distanceMeters: 15000, duration: '5400s' };
      const resultado = converteMedidas(distancia);
      expect(resultado).toEqual({
        distanciaKm: 15,
        horas: 1,
        minutos: 30,
      });
    });
  });

  describe('ordenarRotas', () => {
    it('ordena lojas pela menor distância', () => {
      const lojas = [
        { nome: 'Loja A', distancia: 20 } as any,
        { nome: 'Loja B', distancia: 10 } as any,
      ];
      const resultado = ordenarRotas(lojas);
      expect(resultado[0].nome).toBe('Loja B');
    });
  });

  describe('pegaCoordenadas', () => {
    it('retorna coordenadas da API Google Maps', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
          status: 'OK',
          results: [
            {
              geometry: {
                location: {
                  lat: -23.55052,
                  lng: -46.633308,
                },
              },
            },
          ],
        }),
      });

      const coordenadas = await pegaCoordenadas('01001-000');
      expect(coordenadas).toEqual({ lat: -23.55052, lng: -46.633308 });
    });

    it('lança erro se a API não retornar OK', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        json: async () => ({ status: 'ZERO_RESULTS' }),
      });

      await expect(pegaCoordenadas('00000-000')).rejects.toThrow(
        'Não foi possível obter as coordenadas.',
      );
    });
  });
});
