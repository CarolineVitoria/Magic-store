import axios from 'axios';
import { calculaFrete } from './frete.service';
import { IDistanciaLojas } from '../interfaces/IDistance';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('calculaFrete', () => {
  const lojaMock: IDistanciaLojas = {
    nome: 'Loja Teste',
    rua: 'Rua A',
    numero: '123',
    bairro: 'Bairro X',
    uf: 'SP',
    complemento: '',
    cep: '01001-000',
    distancia: 10,
    duracao: '0 H, 15 Min',
    coordenadas: { lat: -36.55, lng: -55.23 },
  };

  const cepClienteMock = '01310-100';

  beforeEach(() => {
    process.env.TOKEN_MELHOR_ENVIO = 'fake-token';

    mockedAxios.post.mockResolvedValue({
      data: [
        {
          name: 'PAC',
          delivery_time: 5,
          currency: 'R$',
          price: '20,00',
        },
        {
          name: 'SEDEX',
          delivery_time: 2,
          currency: 'R$',
          price: '35,00',
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o frete formatado corretamente', async () => {
    const result = await calculaFrete(lojaMock, cepClienteMock);

    expect(result).toEqual({
      name: 'Loja Teste',
      city: 'Bairro X',
      postalCode: '01001-000',
      type: 'LOJA',
      distance: '10 km',
      value: [
        {
          prazo: '5 dias úteis',
          codProdutoAgencia: '04510',
          price: 'R$ 20,00',
          description: 'PAC a encomenda economica dos Correios',
        },
        {
          prazo: '2 dias úteis',
          codProdutoAgencia: '04014',
          price: 'R$ 35,00',
          description: 'Sedex a encomenda expressa dos Correios',
        },
      ],
      latitude: '-36.55',
      longitude: '-55.23',
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
