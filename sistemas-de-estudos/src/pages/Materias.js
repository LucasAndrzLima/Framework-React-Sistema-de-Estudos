import React from 'react';
import CartaoMateria from '../components/CartaoMateria';

function Materias() {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefasConcluidas = JSON.parse(localStorage.getItem('tarefasConcluidas')) || [];

  const materias = [
    'Matemática',
    'História',
    'Inglês',
    'Biologia',
    'Programação',
    'Organização',
  ];

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
      <h1>Matérias</h1>

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