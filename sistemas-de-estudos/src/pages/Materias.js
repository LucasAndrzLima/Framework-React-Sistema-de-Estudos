import React from 'react';
import CartaoMateria from '../components/CartaoMateria';
import { useAppContext } from '../context/AppContext';

function Materias() {
  const { materias, tarefas, tarefasConcluidas } = useAppContext();

  const calcularProgresso = (materia) => {
    const tarefasPendentesDaMateria = tarefas.filter(
      (tarefa) => tarefa.materia === materia
    );

    const tarefasConcluidasDaMateria = tarefasConcluidas.filter(
      (tarefa) => tarefa.materia === materia
    );

    const total =
      tarefasPendentesDaMateria.length + tarefasConcluidasDaMateria.length;

    if (total === 0) {
      return 0;
    }

    return Math.round((tarefasConcluidasDaMateria.length / total) * 100);
  };

  return (
    <div>
      <h1>Materias</h1>
      <p className="texto-apoio">
        O progresso e atualizado automaticamente a partir do estado compartilhado das tarefas.
      </p>

      {materias.map((materia) => (
        <CartaoMateria
          key={materia}
          titulo={materia}
          descricao={`Progresso das tarefas de ${materia}.`}
          progresso={calcularProgresso(materia)}
        />
      ))}
    </div>
  );
}

export default Materias;
