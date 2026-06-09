const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');

const PASTA_DADOS = path.join(__dirname, '..', 'data');
const ARQUIVO_DADOS = path.join(PASTA_DADOS, 'database.json');
const PASTA_UPLOADS = path.join(__dirname, '..', 'uploads');

const MATERIAS = [
  'Matematica',
  'Historia',
  'Ingles',
  'Biologia',
  'Programacao',
  'Organizacao',
];

// Este objeto e gravado na primeira execucao e funciona como banco JSON inicial.
// A senha e armazenada como hash bcrypt, nunca em texto puro.
async function dadosIniciais() {
  return {
    usuarios: [
      {
        id: 'usuario-admin',
        nome: 'Admin',
        email: 'admin@email.com',
        senhaHash: await bcrypt.hash('123456', 10),
      },
    ],
    perfis: [
      {
        usuarioId: 'usuario-admin',
        nome: 'Admin',
        email: 'admin@email.com',
        objetivo: 'Organizar meus estudos e acompanhar meu progresso.',
        materiaFavorita: 'Programacao',
        imagem: '',
      },
    ],
    tarefas: [
      {
        id: 'tarefa-1',
        usuarioId: 'usuario-admin',
        titulo: 'Estudar React',
        descricao: 'Revisar componentes, props, contexto e hooks.',
        materia: 'Programacao',
        concluida: false,
        criadaEm: new Date().toISOString(),
      },
      {
        id: 'tarefa-2',
        usuarioId: 'usuario-admin',
        titulo: 'Revisar responsividade',
        descricao: 'Testar o sistema em telas de celular e tablet.',
        materia: 'Programacao',
        concluida: false,
        criadaEm: new Date().toISOString(),
      },
    ],
    materias: MATERIAS,
  };
}

async function garantirEstrutura() {
  await fs.mkdir(PASTA_DADOS, { recursive: true });
  await fs.mkdir(PASTA_UPLOADS, { recursive: true });

  try {
    await fs.access(ARQUIVO_DADOS);
  } catch (erro) {
    await escreverBanco(await dadosIniciais());
  }
}

async function lerBanco() {
  await garantirEstrutura();
  return JSON.parse(await fs.readFile(ARQUIVO_DADOS, 'utf8'));
}

async function escreverBanco(dados) {
  await fs.mkdir(PASTA_DADOS, { recursive: true });

  // Primeiro escrevemos em arquivo temporario e depois renomeamos.
  // Isso reduz o risco de corromper o JSON se a aplicacao parar durante a escrita.
  const temporario = `${ARQUIVO_DADOS}.tmp`;
  await fs.writeFile(temporario, JSON.stringify(dados, null, 2), 'utf8');
  await fs.rm(ARQUIVO_DADOS, { force: true });
  await fs.rename(temporario, ARQUIVO_DADOS);
}

async function buscarUsuarioPorEmail(email) {
  const banco = await lerBanco();
  const registro = banco.usuarios.find((usuario) => usuario.email === email);

  if (!registro) {
    return null;
  }

  return {
    ...registro,
    compararSenha: (senha) => bcrypt.compare(senha, registro.senhaHash),
  };
}

async function lerDadosDoUsuario(usuarioId) {
  const banco = await lerBanco();
  const tarefasDoUsuario = banco.tarefas.filter(
    (tarefa) => tarefa.usuarioId === usuarioId
  );

  return {
    materias: banco.materias,
    perfil: banco.perfis.find((perfil) => perfil.usuarioId === usuarioId),
    tarefas: tarefasDoUsuario.filter((tarefa) => !tarefa.concluida),
    tarefasConcluidas: tarefasDoUsuario.filter((tarefa) => tarefa.concluida),
  };
}

async function criarTarefa(usuarioId, dadosTarefa) {
  const banco = await lerBanco();
  const tarefa = {
    id: `tarefa-${Date.now()}`,
    usuarioId,
    ...dadosTarefa,
    concluida: false,
    criadaEm: new Date().toISOString(),
  };

  banco.tarefas.push(tarefa);
  await escreverBanco(banco);
  return tarefa;
}

async function concluirTarefa(usuarioId, tarefaId) {
  const banco = await lerBanco();
  const tarefa = banco.tarefas.find(
    (item) => item.id === tarefaId && item.usuarioId === usuarioId
  );

  if (!tarefa) {
    return null;
  }

  tarefa.concluida = true;
  tarefa.concluidaEm = new Date().toISOString();
  await escreverBanco(banco);
  return tarefa;
}

async function salvarPerfil(usuarioId, dadosPerfil) {
  const banco = await lerBanco();
  const perfil = banco.perfis.find((item) => item.usuarioId === usuarioId);

  Object.assign(perfil, dadosPerfil);
  banco.usuarios.find((usuario) => usuario.id === usuarioId).nome = dadosPerfil.nome;
  await escreverBanco(banco);
  return perfil;
}

async function salvarImagemPerfil(usuarioId, imagem) {
  const banco = await lerBanco();
  const perfil = banco.perfis.find((item) => item.usuarioId === usuarioId);

  perfil.imagem = imagem;
  await escreverBanco(banco);
  return perfil;
}

module.exports = {
  buscarUsuarioPorEmail,
  concluirTarefa,
  criarTarefa,
  lerDadosDoUsuario,
  salvarImagemPerfil,
  salvarPerfil,
};
