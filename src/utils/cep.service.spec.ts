import axios from 'axios';
import { pegaEndereco } from './cep.service';
import { validaCep } from './valida-cep';
import logger from './logger';

jest.mock('axios');
jest.mock('./valida-cep', () => ({
  validaCep: jest.fn(),
}));
jest.mock('./logger', () => ({
  info: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedValidaCep = validaCep as jest.Mock;
const mockedLogger = logger as jest.Mocked<typeof logger>;

describe('pegaEndereco', () => {
  const cep = '91349-900';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar endereço quando o CEP é válido e encontrado', async () => {
    mockedValidaCep.mockReturnValue(true);

    mockedAxios.get.mockResolvedValue({
      data: {
        logradouro: 'Avenida João Wallig',
        bairro: 'Jardim Europa',
        localidade: 'Porto Alegre',
        uf: 'RS',
        estado: 'Rio Grande do Sul',
        complemento: '',
        cep,
      },
    });

    const endereco = await pegaEndereco(cep);

    expect(endereco).toEqual({
      rua: 'Avenida João Wallig',
      bairro: 'Jardim Europa',
      cidade: 'Porto Alegre',
      uf: 'RS',
      estado: 'Rio Grande do Sul',
      complemento: '',
      cep,
    });

    expect(mockedLogger.info).toHaveBeenCalledWith(expect.objectContaining({ cep }));
  });

  it('deve lançar erro se o CEP for inválido', async () => {
    mockedValidaCep.mockReturnValue(false);

    await expect(pegaEndereco('123')).rejects.toThrow('CEP inválido');
  });

  it('deve lançar erro se o CEP não for encontrado', async () => {
    mockedValidaCep.mockReturnValue(true);

    mockedAxios.get.mockResolvedValue({
      data: {
        erro: true,
      },
    });

    await expect(pegaEndereco(cep)).rejects.toThrow('CEP não encontrado');
  });
});
