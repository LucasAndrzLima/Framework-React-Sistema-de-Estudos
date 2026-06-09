export const API_URL = 'http://localhost:3001';

// Funcao unica para requisicoes. Ela adiciona JWT e trata JSON/erros de forma consistente.
export async function requisicaoJson(caminho, opcoes = {}) {
  const token = localStorage.getItem('token');
  const ehUrlExterna = caminho.startsWith('http://') || caminho.startsWith('https://');
  const ehFormData = opcoes.body instanceof FormData;
  const headers = {
    ...(ehFormData || !opcoes.body ? {} : { 'Content-Type': 'application/json' }),
    // O JWT so e enviado ao nosso backend. Isso evita vazar o token para terceiros.
    ...(!ehUrlExterna && token ? { Authorization: `Bearer ${token}` } : {}),
    ...opcoes.headers,
  };

  let resposta;

  try {
    resposta = await fetch(ehUrlExterna ? caminho : `${API_URL}${caminho}`, {
      ...opcoes,
      headers,
    });
  } catch (erro) {
    throw new Error(
      'Backend indisponivel. Inicie o servidor na pasta backend com npm start.'
    );
  }

  const tipoConteudo = resposta.headers.get('content-type') || '';
  const possuiJson =
    resposta.status !== 204 && tipoConteudo.includes('application/json');
  const dados = possuiJson ? await resposta.json() : null;

  if (!resposta.ok) {
    const erro = new Error(
      dados?.erro || dados?.message || 'Nao foi possivel concluir a requisicao.'
    );
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}
