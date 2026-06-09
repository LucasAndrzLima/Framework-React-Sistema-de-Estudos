import { requisicaoJson } from './apiService';

export function autenticarUsuario(credenciais) {
  return requisicaoJson('/login', {
    method: 'POST',
    body: JSON.stringify(credenciais),
  });
}

export function validarSessao() {
  return requisicaoJson('/api/session');
}
