import { requisicaoJson } from './apiService';

const API_AUTH_URL = 'http://localhost:3001/login';
const USUARIO_DEMO = {
  email: 'admin@email.com',
  senha: '123456',
  nome: 'Admin',
};

export async function autenticarUsuario(credenciais) {
  try {
    return await requisicaoJson(API_AUTH_URL, {
      method: 'POST',
      body: JSON.stringify(credenciais),
    });
  } catch (erro) {
    const email = credenciais.email.trim().toLowerCase();
    const senha = credenciais.senha.trim();

    if (email === USUARIO_DEMO.email && senha === USUARIO_DEMO.senha) {
      return {
        token: `token-simulado-${Date.now()}`,
        nome: USUARIO_DEMO.nome,
        origem: 'simulada',
      };
    }

    throw erro;
  }
}
