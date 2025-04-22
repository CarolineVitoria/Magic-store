export interface FreteFormatado {
  prazo: string;
  codProdutoAgencia: string;
  price: string;
  description: string;
}

export interface LojaComFreteFormatado {
  name: string;
  city: string;
  postalCode: string;
  type: 'LOJA' | 'PDV';
  distance: string;
  value: FreteFormatado[];
  latitude: string;
  longitude: string;
}
