import React from 'react';

function TarefaItem({ titulo, descricao, materia, onDelete }) {
  return (
    <div className="card">
      <h3>{titulo}</h3>

      <p style={{ margin: '10px 0' }}>
        {descricao}
      </p>

      <p>
        <strong>Matéria:</strong> {materia}
      </p>

      <button onClick={onDelete}>
        Concluir
      </button>
    </div>
  );
}

export default TarefaItem;