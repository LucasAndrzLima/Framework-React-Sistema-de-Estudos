import React from 'react';

function Cabecalho() {
  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <img
          src="/logo.png"
          alt="Logo"
          className="logo-cabecalho"
        />

        <h1>Sistema de Estudos</h1>
      </div>
    </header>
  );
}

export default Cabecalho;