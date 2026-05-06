import React from 'react';
import Cabecalho from './components/Cabecalho';
import BarraLateral from './components/BarraLateral';

function Layout({ children, temaEscuro, alternarTema }) {
  return (
    <div className={temaEscuro ? 'tema-escuro' : 'tema-claro'}>
      <Cabecalho />

      <div className="conteudo-layout">
        <BarraLateral />

        <main>
          <button
            onClick={alternarTema}
            style={{ marginBottom: '30px' }}
          >
            Alternar para {temaEscuro ? 'Tema Claro' : 'Tema Escuro'}
          </button>

          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;