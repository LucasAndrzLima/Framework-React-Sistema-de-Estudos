import React from 'react';

function CartaoMateria({ titulo, descricao, progresso }) {
  return (
    <div className="card materia-card">
      <h2>{titulo}</h2>

      <p>{descricao}</p>

      <div className="barra-container">
        <div
          className="barra-progresso"
          style={{ width: `${progresso}%` }}
        ></div>
      </div>

      <p className="texto-apoio">
        {progresso}% concluido
      </p>
    </div>
  );
}

export default CartaoMateria;
