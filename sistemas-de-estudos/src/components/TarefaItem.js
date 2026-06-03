import React from 'react';

function TarefaItem({ titulo, descricao, materia, onDelete }) {
  return (
    <div className="card tarefa-card">
      <div className="tarefa-topo">
        <span className="tag-materia">{materia}</span>
        <h3>{titulo}</h3>
      </div>

      <p className="texto-tarefa">
        {descricao}
      </p>

      <div className="tarefa-acoes">
        <button type="button" onClick={onDelete}>
          Concluir
        </button>
      </div>
    </div>
  );
}

export default TarefaItem;