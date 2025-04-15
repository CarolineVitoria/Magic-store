import axios from 'axios';
import { IDistanciaLojas } from '../interfaces/IDistance';

export const calculaFrete = async (
  loja: IDistanciaLojas,
  cepCliente: string,
): Promise<IDistanciaLojas[]> => {
  const url = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

  const token = process.env.TOKEN_MELHOR_ENVIO || 'seu_token_default';

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
    'User-Agent': 'PhysicalStore/1.0',
  };
  const corpo = {
    from: { postal_code: `${loja.cep}` },
    to: { postal_code: `${cepCliente}` },
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
  console.log('em calcula frete');
  console.log(loja);
  console.log(cepCliente);
  const resposta = await axios.post(url, corpo, { headers });
  console.log(resposta);
  return resposta.data as IDistanciaLojas[];
};
