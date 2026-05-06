import React, { useState, useEffect } from 'react';
import TarefaItem from '../components/TarefaItem';

function Tarefas() {
  const tarefasIniciais = [
    { id: 1, titulo: 'Estudar React', descricao: 'Revisar componentes, props e hooks', materia: 'Programação' },
    { id: 2, titulo: 'Fazer exercícios de matemática', descricao: 'Resolver 10 questões de álgebra', materia: 'Matemática' },
    { id: 3, titulo: 'Ler capítulo de História', descricao: 'Estudar Revolução Industrial', materia: 'História' },
    { id: 4, titulo: 'Praticar inglês', descricao: 'Treinar vocabulário por 20 minutos', materia: 'Inglês' },
    { id: 5, titulo: 'Revisar CSS', descricao: 'Estudar flexbox, grid e responsividade', materia: 'Programação' },
    { id: 6, titulo: 'Fazer resumo de Biologia', descricao: 'Criar resumo sobre células', materia: 'Biologia' },
    { id: 7, titulo: 'Organizar caderno', descricao: 'Separar anotações por matéria', materia: 'Organização' },
    { id: 8, titulo: 'Estudar JavaScript', descricao: 'Revisar funções, arrays e objetos', materia: 'Programação' },
  ];

  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem('tarefas');

    if (tarefasSalvas) {
      return JSON.parse(tarefasSalvas);
    }

    return tarefasIniciais;
  });

  const [tarefasConcluidas, setTarefasConcluidas] = useState(() => {
    const concluidasSalvas = localStorage.getItem('tarefasConcluidas');

    if (concluidasSalvas) {
      return JSON.parse(concluidasSalvas);
    }

    return [];
  });

  const [novaTarefa, setNovaTarefa] = useState({
    titulo: '',
    descricao: '',
    materia: 'Matemática',
  });

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }, [tarefas]);

  useEffect(() => {
    localStorage.setItem('tarefasConcluidas', JSON.stringify(tarefasConcluidas));
  }, [tarefasConcluidas]);

  const adicionarTarefa = () => {
    if (
      novaTarefa.titulo.trim() === '' ||
      novaTarefa.descricao.trim() === '' ||
      novaTarefa.materia.trim() === ''
    ) {
      alert('Preencha o título, a descrição e a matéria da tarefa.');
      return;
    }

    const tarefaCriada = {
      id: Date.now(),
      titulo: novaTarefa.titulo,
      descricao: novaTarefa.descricao,
      materia: novaTarefa.materia,
    };

    setTarefas([...tarefas, tarefaCriada]);

    setNovaTarefa({
      titulo: '',
      descricao: '',
      materia: 'Matemática',
    });
  };

  const concluirTarefa = (id) => {
    const tarefaConcluida = tarefas.find((tarefa) => tarefa.id === id);

    if (!tarefaConcluida) {
      return;
    }

    setTarefasConcluidas([...tarefasConcluidas, tarefaConcluida]);
    setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
  };

  return (
    <div>
      <h1>Tarefas</h1>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Título da tarefa"
          value={novaTarefa.titulo}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, titulo: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Descrição da tarefa"
          value={novaTarefa.descricao}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, descricao: e.target.value })
          }
        />

        <select
          value={novaTarefa.materia}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, materia: e.target.value })
          }
        >
          <option value="Matemática">Matemática</option>
          <option value="História">História</option>
          <option value="Inglês">Inglês</option>
          <option value="Biologia">Biologia</option>
          <option value="Programação">Programação</option>
          <option value="Organização">Organização</option>
        </select>

        <button onClick={adicionarTarefa}>
          Adicionar Tarefa
        </button>
      </div>

      <div>
        {tarefas.length === 0 ? (
          <p>Nenhuma tarefa disponível.</p>
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