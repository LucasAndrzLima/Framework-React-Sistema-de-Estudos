import React from 'react';

function CartaoMateria({ titulo, descricao, progresso }) {
  return (
    <div className="card">
      <h2>{titulo}</h2>
  
      <p>{descricao}</p>
  
      <div className="barra-container">
        <div
          className="barra-progresso"
          style={{ width: `${progresso}%` }}
        ></div>
      </div>
  
      <p style={{ marginTop: '10px' }}>
        {progresso}% concluído
      </p>
    </div>
  );
}

export default CartaoMateria;