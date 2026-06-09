import React, { createContext, useContext, useEffect, useState } from 'react';
import { autenticarUsuario, validarSessao } from '../services/authService';
import {
  atualizarPerfil,
  buscarDadosDeEstudo,
  criarTarefa,
  enviarImagemPerfil,
  finalizarTarefa,
} from '../services/studyService';
import { API_URL } from '../services/apiService';
import {
  lerJson,
  lerTexto,
  removerItem,
  salvarJson,
  salvarTexto,
} from '../services/storageService';

const AppContext = createContext(null);
const MATERIAS_PADRAO = ['Matematica', 'Historia', 'Ingles', 'Biologia', 'Programacao'];

function normalizarPerfil(perfil) {
  if (!perfil) {
    return {
      nome: '',
      email: '',
      objetivo: '',
      materiaFavorita: MATERIAS_PADRAO[0],
      imagem: '',
    };
  }

  return {
    ...perfil,
    // O backend salva somente o caminho. O navegador precisa da URL completa.
    imagem:
      perfil.imagem && perfil.imagem.startsWith('/')
        ? `${API_URL}${perfil.imagem}`
        : perfil.imagem || '',
  };
}

export function AppProvider({ children }) {
  // Tema e token continuam locais: tema e preferencia visual; token identifica a sessao.
  const [temaEscuro, setTemaEscuro] = useState(() =>
    lerJson('temaEscuro', false)
  );
  const [token, setToken] = useState(() => lerTexto('token'));
  const [usuario, setUsuario] = useState(null);

  // Dados de dominio agora sao carregados e persistidos pelo backend.
  const [materias, setMaterias] = useState(MATERIAS_PADRAO);
  const [tarefas, setTarefas] = useState([]);
  const [tarefasConcluidas, setTarefasConcluidas] = useState([]);
  const [perfil, setPerfil] = useState(() => normalizarPerfil(null));
  const [inicializando, setInicializando] = useState(Boolean(token));
  const [erroGlobal, setErroGlobal] = useState('');

  useEffect(() => {
    salvarJson('temaEscuro', temaEscuro);
  }, [temaEscuro]);

  useEffect(() => {
    if (token) {
      salvarTexto('token', token);
    } else {
      removerItem('token');
    }
  }, [token]);

  const limparSessao = () => {
    setToken('');
    setUsuario(null);
    setTarefas([]);
    setTarefasConcluidas([]);
    setPerfil(normalizarPerfil(null));
  };

  const carregarDados = async () => {
    const dados = await buscarDadosDeEstudo();
    setMaterias(dados.materias);
    setTarefas(dados.tarefas);
    setTarefasConcluidas(dados.tarefasConcluidas);
    setPerfil(normalizarPerfil(dados.perfil));
  };

  // Ao atualizar a pagina, validamos o JWT no backend antes de aceitar a sessao.
  useEffect(() => {
    if (!token) {
      setInicializando(false);
      return;
    }

    let ativo = true;

    async function restaurarSessao() {
      try {
        const sessao = await validarSessao();
        const dados = await buscarDadosDeEstudo();

        if (!ativo) return;

        setUsuario(sessao.usuario);
        setMaterias(dados.materias);
        setTarefas(dados.tarefas);
        setTarefasConcluidas(dados.tarefasConcluidas);
        setPerfil(normalizarPerfil(dados.perfil));
      } catch (erro) {
        if (ativo) {
          limparSessao();
          setErroGlobal(erro.message);
        }
      } finally {
        if (ativo) setInicializando(false);
      }
    }

    restaurarSessao();
    return () => {
      ativo = false;
    };
  }, [token]);

  const alternarTema = () => {
    setTemaEscuro((valorAtual) => !valorAtual);
  };

  const entrar = async ({ email, senha }) => {
    const dados = await autenticarUsuario({ email, senha });

    // Salvamos o token antes da proxima chamada porque apiService o le do localStorage.
    salvarTexto('token', dados.token);
    setToken(dados.token);
    setUsuario(dados.usuario);
    setErroGlobal('');

    const estudos = await buscarDadosDeEstudo();
    setMaterias(estudos.materias);
    setTarefas(estudos.tarefas);
    setTarefasConcluidas(estudos.tarefasConcluidas);
    setPerfil(normalizarPerfil(estudos.perfil));
  };

  const sair = () => {
    limparSessao();
    setErroGlobal('');
  };

  const adicionarTarefa = async (dadosTarefa) => {
    const resposta = await criarTarefa(dadosTarefa);
    setTarefas((atuais) => [...atuais, resposta.tarefa]);
    return resposta.tarefa;
  };

  const concluirTarefa = async (id) => {
    const resposta = await finalizarTarefa(id);
    setTarefas((atuais) => atuais.filter((tarefa) => tarefa.id !== id));
    setTarefasConcluidas((atuais) => [...atuais, resposta.tarefa]);
  };

  const salvarPerfil = async (dadosPerfil) => {
    const resposta = await atualizarPerfil(dadosPerfil);
    setPerfil(normalizarPerfil(resposta.perfil));
    setUsuario((atual) => ({ ...atual, nome: resposta.perfil.nome }));
    return resposta.perfil;
  };

  const fazerUploadPerfil = async (arquivo) => {
    const resposta = await enviarImagemPerfil(arquivo);
    setPerfil(normalizarPerfil(resposta.perfil));
    return normalizarPerfil(resposta.perfil);
  };

  const valor = {
    temaEscuro,
    alternarTema,
    token,
    usuario,
    usuarioEmail: usuario?.email || '',
    estaAutenticado: Boolean(token && usuario),
    inicializando,
    erroGlobal,
    entrar,
    sair,
    materias,
    tarefas,
    tarefasConcluidas,
    adicionarTarefa,
    concluirTarefa,
    perfil,
    salvarPerfil,
    fazerUploadPerfil,
    recarregarDados: carregarDados,
  };

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const contexto = useContext(AppContext);

  if (!contexto) {
    throw new Error('useAppContext deve ser usado dentro do AppProvider.');
  }

  return contexto;
}
