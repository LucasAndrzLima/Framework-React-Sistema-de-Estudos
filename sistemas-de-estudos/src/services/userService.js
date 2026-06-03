import { requisicaoJson } from './apiService';

const API_USUARIOS_URL = 'https://jsonplaceholder.typicode.com/users';
const USUARIOS_SIMULADOS = [
  {
    id: 101,
    name: 'Ana Souza',
    email: 'ana.souza@email.com',
    address: { city: 'Curitiba' },
    company: { name: 'Grupo de Estudos Web' },
  },
  {
    id: 102,
    name: 'Bruno Lima',
    email: 'bruno.lima@email.com',
    address: { city: 'Sao Paulo' },
    company: { name: 'Monitoria React' },
  },
  {
    id: 103,
    name: 'Carla Mendes',
    email: 'carla.mendes@email.com',
    address: { city: 'Londrina' },
    company: { name: 'Projeto Integrador' },
  },
];

function filtrarUsuarios(usuarios, termo) {
  const consulta = termo.trim().toLowerCase();

  if (!consulta) {
    return usuarios;
  }

  return usuarios.filter((usuario) => {
    const empresa = usuario.company?.name || '';
    const cidade = usuario.address?.city || '';

    return [usuario.name, usuario.email, empresa, cidade]
      .join(' ')
      .toLowerCase()
      .includes(consulta);
  });
}

export async function buscarUsuarios(termo = '') {
  try {
    const usuarios = await requisicaoJson(API_USUARIOS_URL);

    return {
      dados: filtrarUsuarios(usuarios, termo),
      origem: 'api',
    };
  } catch (erro) {
    console.error('Falha ao consultar API externa. Usando dados simulados.', erro);

    return {
      dados: filtrarUsuarios(USUARIOS_SIMULADOS, termo),
      origem: 'simulada',
    };
  }
}
