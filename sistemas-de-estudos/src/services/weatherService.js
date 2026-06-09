import { requisicaoJson } from './apiService';

// Coordenadas de Curitiba. A API Open-Meteo recebe latitude e longitude.
const LATITUDE_CURITIBA = -25.4284;
const LONGITUDE_CURITIBA = -49.2733;
const API_CLIMA_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE_CURITIBA}` +
  `&longitude=${LONGITUDE_CURITIBA}` +
  '&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=America%2FSao_Paulo&forecast_days=4';

const DESCRICOES_CLIMA = {
  0: 'Ceu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa intensa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva intensa',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  95: 'Trovoadas',
};

function descreverClima(codigo) {
  return DESCRICOES_CLIMA[codigo] || 'Condicao variavel';
}

function formatarDia(dataIso) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${dataIso}T12:00:00`));
}

export async function buscarPrevisaoCuritiba() {
  const dados = await requisicaoJson(API_CLIMA_URL);

  return {
    local: 'Curitiba, PR',
    atual: {
      temperatura: Math.round(dados.current.temperature_2m),
      sensacao: Math.round(dados.current.apparent_temperature),
      vento: Math.round(dados.current.wind_speed_10m),
      descricao: descreverClima(dados.current.weather_code),
      atualizadoEm: dados.current.time,
    },
    previsao: dados.daily.time.map((data, indice) => ({
      data,
      dia: formatarDia(data),
      descricao: descreverClima(dados.daily.weather_code[indice]),
      maxima: Math.round(dados.daily.temperature_2m_max[indice]),
      minima: Math.round(dados.daily.temperature_2m_min[indice]),
      chuva: dados.daily.precipitation_probability_max[indice],
    })),
    origem: 'Open-Meteo',
  };
}
