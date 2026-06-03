import React, { createContext, useContext, useEffect, useState } from 'react';
import { MATERIAS, PERFIL_INICIAL, TAREFAS_INICIAIS } from '../data/estudos';
import { autenticarUsuario } from '../services/authService';
import {
  lerJson,
  lerTexto,
  removerItem,
  salvarJson,
  salvarTexto,
} from '../services/storageService';

const CHAVES_STORAGE = {
  temaEscuro: 'temaEscuro',
  token: 'token',
  usuario: 'usuario',
  usuarioEmail: 'usuarioEmail',
  tarefas: 'tarefas',
  tarefasConcluidas: 'tarefasConcluidas',
  perfil: 'perfil',
};

const AppContext = createContext(null);

function montarPerfilInicial(nome, email) {
  return {
    ...PERFIL_INICIAL,
    nome: nome || '',
    email: email || '',
  };
}

export function AppProvider({ children }) {
  const [temaEscuro, setTemaEscuro] = useState(() =>
    lerJson(CHAVES_STORAGE.temaEscuro, false)
  );
  const [token, setToken] = useState(() => lerTexto(CHAVES_STORAGE.token));
  const [usuario, setUsuario] = useState(() => lerTexto(CHAVES_STORAGE.usuario));
  const [usuarioEmail, setUsuarioEmail] = useState(() =>
    lerTexto(CHAVES_STORAGE.usuarioEmail)
  );
  const [tarefas, setTarefas] = useState(() =>
    lerJson(CHAVES_STORAGE.tarefas, TAREFAS_INICIAIS)
  );
  const [tarefasConcluidas, setTarefasConcluidas] = useState(() =>
    lerJson(CHAVES_STORAGE.tarefasConcluidas, [])
  );
  const [perfil, setPerfil] = useState(() => {
    const perfilSalvo = lerJson(CHAVES_STORAGE.perfil, null);
    const perfilBase = montarPerfilInicial(
      lerTexto(CHAVES_STORAGE.usuario),
      lerTexto(CHAVES_STORAGE.usuarioEmail)
    );

    if (perfilSalvo) {
      return {
        ...perfilBase,
        ...perfilSalvo,
        email: perfilBase.email || perfilSalvo.email || '',
      };
    }

    return perfilBase;
  });

  useEffect(() => {
    salvarJson(CHAVES_STORAGE.temaEscuro, temaEscuro);
  }, [temaEscuro]);

  useEffect(() => {
    if (token) {
      salvarTexto(CHAVES_STORAGE.token, token);
      return;
    }

    removerItem(CHAVES_STORAGE.token);
  }, [token]);

  useEffect(() => {
    if (usuario) {
      salvarTexto(CHAVES_STORAGE.usuario, usuario);
      return;
    }

    removerItem(CHAVES_STORAGE.usuario);
  }, [usuario]);

  useEffect(() => {
    if (usuarioEmail) {
      salvarTexto(CHAVES_STORAGE.usuarioEmail, usuarioEmail);
      return;
    }

    removerItem(CHAVES_STORAGE.usuarioEmail);
  }, [usuarioEmail]);

  useEffect(() => {
    salvarJson(CHAVES_STORAGE.tarefas, tarefas);
  }, [tarefas]);

  useEffect(() => {
    salvarJson(CHAVES_STORAGE.tarefasConcluidas, tarefasConcluidas);
  }, [tarefasConcluidas]);

  useEffect(() => {
    setPerfil((perfilAtual) => ({
      ...montarPerfilInicial(usuario, usuarioEmail),
      ...perfilAtual,
      nome: perfilAtual.nome || usuario,
      email: usuarioEmail,
    }));
  }, [usuario, usuarioEmail]);

  const alternarTema = () => {
    setTemaEscuro((valorAtual) => !valorAtual);
  };

  const entrar = async ({ email, senha }) => {
    const dados = await autenticarUsuario({ email, senha });

    setToken(dados.token);
    setUsuario(dados.nome);
    setUsuarioEmail(email);

    return dados;
  };

  const sair = () => {
    setToken('');
    setUsuario('');
    setUsuarioEmail('');
  };

  const adicionarTarefa = ({ titulo, descricao, materia }) => {
    const tarefaCriada = {
      id: Date.now(),
      titulo,
      descricao,
      materia,
    };

    setTarefas((tarefasAtuais) => [...tarefasAtuais, tarefaCriada]);

    return tarefaCriada;
  };

  const concluirTarefa = (id) => {
    setTarefas((tarefasAtuais) => {
      const tarefaConcluida = tarefasAtuais.find((tarefa) => tarefa.id === id);

      if (!tarefaConcluida) {
        return tarefasAtuais;
      }

      setTarefasConcluidas((tarefasFinalizadas) => [
        ...tarefasFinalizadas,
        tarefaConcluida,
      ]);

      return tarefasAtuais.filter((tarefa) => tarefa.id !== id);
    });
  };

  const salvarPerfil = (dadosPerfil) => {
    const perfilAtualizado = {
      ...montarPerfilInicial(usuario, usuarioEmail),
      ...perfil,
      ...dadosPerfil,
      email: usuarioEmail,
    };

    salvarJson(CHAVES_STORAGE.perfil, perfilAtualizado);
    setPerfil(perfilAtualizado);
  };

  const valor = {
    temaEscuro,
    alternarTema,
    token,
    usuario,
    usuarioEmail,
    estaAutenticado: Boolean(token),
    entrar,
    sair,
    materias: MATERIAS,
    tarefas,
    tarefasConcluidas,
    adicionarTarefa,
    concluirTarefa,
    perfil,
    salvarPerfil,
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
