import axios from 'axios';
import { validaCep } from '../utils/validaCep';


export const pegaEndereco = async (cep: string) => {
  
  if (!validaCep(cep)) {
    throw new Error('CEP inválido');
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const { data } = await axios.get(url);

  if (data.erro) {
    throw new Error('CEP não encontrado');
  }
  console.log(data);
  return {
    rua: data.logradouro,
    bairro: data.bairro,
    cidade: data.localidade,
    uf: data.uf,
    estado: data.estado,
    complemento: data.complemento,
    cep: data.cep
  };
};

