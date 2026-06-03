export async function requisicaoJson(url, opcoes = {}) {
  const headers = {
    ...(opcoes.body ? { 'Content-Type': 'application/json' } : {}),
    ...opcoes.headers,
  };

  const resposta = await fetch(url, {
    ...opcoes,
    headers,
  });

  const tipoConteudo = resposta.headers.get('content-type') || '';
  const possuiJson =
    resposta.status !== 204 && tipoConteudo.includes('application/json');
  const dados = possuiJson ? await resposta.json() : null;

  if (!resposta.ok) {
    throw new Error(
      dados?.erro || dados?.message || 'Nao foi possivel concluir a requisicao.'
    );
  }

  return dados;
}
