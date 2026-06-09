import { requisicaoJson } from './apiService';

export function buscarDadosDeEstudo() {
  return requisicaoJson('/api/estudos');
}

export function criarTarefa(dadosTarefa) {
  return requisicaoJson('/api/tarefas', {
    method: 'POST',
    body: JSON.stringify(dadosTarefa),
  });
}

export function finalizarTarefa(id) {
  return requisicaoJson(`/api/tarefas/${id}/concluir`, {
    method: 'PATCH',
  });
}

export function atualizarPerfil(dadosPerfil) {
  return requisicaoJson('/api/perfil', {
    method: 'PUT',
    body: JSON.stringify(dadosPerfil),
  });
}

export function enviarImagemPerfil(arquivo) {
  const formulario = new FormData();
  formulario.append('imagem', arquivo);

  return requisicaoJson('/api/perfil/imagem', {
    method: 'POST',
    body: formulario,
  });
}
