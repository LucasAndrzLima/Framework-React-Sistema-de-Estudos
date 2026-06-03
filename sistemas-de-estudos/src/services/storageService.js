export function lerTexto(chave, valorPadrao = '') {
  return localStorage.getItem(chave) ?? valorPadrao;
}

export function salvarTexto(chave, valor) {
  localStorage.setItem(chave, valor);
}

export function removerItem(chave) {
  localStorage.removeItem(chave);
}

export function lerJson(chave, valorPadrao) {
  const valor = localStorage.getItem(chave);

  if (!valor) {
    return valorPadrao;
  }

  try {
    return JSON.parse(valor);
  } catch (erro) {
    console.error(`Erro ao ler o item "${chave}" do armazenamento local.`, erro);
    return valorPadrao;
  }
}

export function salvarJson(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}
