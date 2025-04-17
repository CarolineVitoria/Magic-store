import axios from 'axios';
import { IDistancia, IDistanciaLojas } from '../../interfaces/IDistance';

export const calculaDistancia = async (origem: string, destino: string) => {
  const apiKey = process.env.KEY;
  const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'routes.distanceMeters,routes.duration',
  };

  const corpo = {
    origin: { address: origem },
    destination: { address: destino },
    routing_preference: 'TRAFFIC_AWARE',
    travel_mode: 'DRIVE',
  };

  const resposta = await axios.post(url, corpo, { headers });
  return resposta.data.routes[0];
};

export const converteMedidas = (distancia: IDistancia) => {
  const distanciaKm = distancia.distanceMeters / 1000;
  const duracaoSegundos = parseInt(distancia.duration.replace('s', ''));
  const horas = Math.floor(duracaoSegundos / 3600);
  const minutos = Math.floor((duracaoSegundos % 3600) / 60);
  return { distanciaKm, horas, minutos };
};

export const ordenarRotas = (lojas: IDistanciaLojas[]): IDistanciaLojas[] => {
  return lojas.sort((a, b) => Number(a.distancia) - Number(b.distancia));
};
export const pegaCoordenadas = async (
  cep: string,
): Promise<{ lat: number; lng: number }> => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cep)}&key=${process.env.KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return { lat: location.lat, lng: location.lng };
  }

  throw new Error('Não foi possível obter as coordenadas.');
};
