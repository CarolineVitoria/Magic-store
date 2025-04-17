import axios from 'axios';
import { IDistanciaLojas } from '../interfaces/IDistance';
import { LojaComFreteFormatado, FreteFormatado } from '../interfaces/IFrete';
export const calculaFrete = async (
  loja: IDistanciaLojas,
  cepCliente: string,
): Promise<LojaComFreteFormatado> => {
  const url = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

  const token = process.env.TOKEN_MELHOR_ENVIO || 'seu_token_default';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'PhysicalStore/1.0',
  };

  const corpo = {
    from: { postal_code: loja.cep },
    to: { postal_code: cepCliente },
    products: [
      {
        id: '1',
        width: 15,
        height: 10,
        length: 20,
        weight: 1,
        insurance_value: 0,
        quantity: 1,
      },
    ],
  };
  console.log('test');
  const { data } = await axios.post(url, corpo, { headers });
  console.log(data);

  const codigosCorreios: Record<string, string> = {
    PAC: '04510',
    SEDEX: '04014',
  };

  const descricoesCorreios: Record<string, string> = {
    PAC: 'PAC a encomenda economica dos Correios',
    SEDEX: 'Sedex a encomenda expressa dos Correios',
  };

  const fretes: FreteFormatado[] = data.slice(0, 2).map((frete: any) => {
    const nome = frete.name.toUpperCase();
    return {
      prazo: `${frete.delivery_time} dias úteis`,
      codProdutoAgencia: codigosCorreios[nome] || '00000',
      price: `${frete.currency} ${frete.price}`,
      description: descricoesCorreios[nome] || nome,
    };
  });

  return {
    name: loja.nome,
    city: loja.bairro,
    postalCode: loja.cep,
    type: 'LOJA',
    distance: `${loja.distancia} km`,
    value: fretes,
    latitude: loja.coordenadas.lat.toString(),
    longitude: loja.coordenadas.lng.toString(),
  };
};
