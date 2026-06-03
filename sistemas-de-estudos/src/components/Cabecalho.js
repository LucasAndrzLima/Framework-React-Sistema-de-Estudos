import React from 'react';
import { useAppContext } from '../context/AppContext';

function Cabecalho() {
  const { alternarTema, estaAutenticado, temaEscuro, usuario } = useAppContext();

  return (
    <header className="cabecalho">
      <div className="cabecalho-conteudo">
        <div className="cabecalho-principal">
          <img
            src="/logo.png"
            alt="Logo"
            className="logo-cabecalho"
          />

          <div>
            <h1>Sistema de Estudos</h1>
            <p className="cabecalho-subtitulo">
              Interatividade, formularios e integracao com servicos.
            </p>
          </div>
        </div>

        <div className="cabecalho-acoes">
          {estaAutenticado && <span className="cabecalho-usuario">Ola, {usuario}</span>}

          <button
            type="button"
            className="botao-secundario"
            onClick={alternarTema}
          >
            {temaEscuro ? 'Tema claro' : 'Tema escuro'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Cabecalho;
