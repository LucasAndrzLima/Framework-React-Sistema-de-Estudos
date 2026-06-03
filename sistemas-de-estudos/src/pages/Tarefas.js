import React, { useState } from 'react';
import TarefaItem from '../components/TarefaItem';
import { useAppContext } from '../context/AppContext';

function validarTarefa(novaTarefa) {
  const novosErros = {};

  if (!novaTarefa.titulo.trim()) {
    novosErros.titulo = 'Informe o titulo da tarefa.';
  } else if (novaTarefa.titulo.trim().length < 3) {
    novosErros.titulo = 'O titulo precisa ter pelo menos 3 caracteres.';
  }

  if (!novaTarefa.descricao.trim()) {
    novosErros.descricao = 'Informe a descricao da tarefa.';
  } else if (novaTarefa.descricao.trim().length < 10) {
    novosErros.descricao = 'A descricao precisa ter pelo menos 10 caracteres.';
  }

  if (!novaTarefa.materia.trim()) {
    novosErros.materia = 'Selecione uma materia.';
  }

  return novosErros;
}

function Tarefas() {
  const {
    adicionarTarefa,
    concluirTarefa,
    materias,
    tarefas,
    tarefasConcluidas,
  } = useAppContext();
  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    materia: materias[0],
  });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');

  const atualizarCampo = ({ target }) => {
    const { name, value } = target;

    setNovaTarefa((valorAtual) => ({
      ...valorAtual,
      [name]: value,
    }));
    setErros((valorAtual) => ({
      ...valorAtual,
      [name]: '',
    }));
    setMensagem('');
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();

    const errosEncontrados = validarTarefa(novaTarefa);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      setMensagem('');
      return;
    }

    adicionarTarefa({
      titulo: novaTarefa.titulo.trim(),
      descricao: novaTarefa.descricao.trim(),
      materia: novaTarefa.materia,
    });

    setNovaTarefa({
      titulo: '',
      descricao: '',
      materia: materias[0],
    });
    setErros({});
    setMensagem('Tarefa adicionada com sucesso.');
  };

  return (
    <div>
      <h1>Tarefas</h1>
      <p className="texto-apoio">
        O formulario valida os campos antes de atualizar o estado compartilhado da aplicacao.
      </p>

      <div className="grid-duplo">
        <div className="card">
          <h2>Nova tarefa</h2>

          <form className="formulario" onSubmit={enviarFormulario}>
            <div className="campo-formulario">
              <label htmlFor="titulo">Titulo</label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                placeholder="Ex.: Revisar funcoes em JavaScript"
                value={novaTarefa.titulo}
                onChange={atualizarCampo}
              />
              {erros.titulo && <span className="erro-campo">{erros.titulo}</span>}
            </div>

            <div className="campo-formulario">
              <label htmlFor="descricao">Descricao</label>
              <textarea
                id="descricao"
                name="descricao"
                placeholder="Descreva o que precisa ser feito"
                value={novaTarefa.descricao}
                onChange={atualizarCampo}
              />
              {erros.descricao && (
                <span className="erro-campo">{erros.descricao}</span>
              )}
            </div>

            <div className="campo-formulario">
              <label htmlFor="materia">Materia</label>
              <select
                id="materia"
                name="materia"
                value={novaTarefa.materia}
                onChange={atualizarCampo}
              >
                {materias.map((materia) => (
                  <option key={materia} value={materia}>
                    {materia}
                  </option>
                ))}
              </select>
              {erros.materia && <span className="erro-campo">{erros.materia}</span>}
            </div>

            {mensagem && <p className="sucesso-geral">{mensagem}</p>}

            <button type="submit">Adicionar tarefa</button>
          </form>
        </div>

        <div className="card">
          <h2>Resumo rapido</h2>
          <div className="lista-status">
            <div className="status-item">
              <strong>Pendentes:</strong> {tarefas.length}
            </div>
            <div className="status-item">
              <strong>Concluidas:</strong> {tarefasConcluidas.length}
            </div>
          </div>
        </div>
      </div>

      <div>
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa disponivel.</p>
        ) : (
          tarefas.map((tarefa) => (
            <TarefaItem
              key={tarefa.id}
              titulo={tarefa.titulo}
              descricao={tarefa.descricao}
              materia={tarefa.materia}
              onDelete={() => concluirTarefa(tarefa.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Tarefas;
