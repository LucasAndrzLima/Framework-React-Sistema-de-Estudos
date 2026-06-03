import React from 'react';
import { useLocation } from 'react-router-dom';
import Cabecalho from './components/Cabecalho';
import BarraLateral from './components/BarraLateral';
import { useAppContext } from './context/AppContext';

function Layout({ children }) {
  const location = useLocation();
  const { temaEscuro } = useAppContext();
  const paginaLogin = location.pathname === '/login';

  return (
    <div className={temaEscuro ? 'tema-escuro' : 'tema-claro'}>
      <Cabecalho />

      <div className={paginaLogin ? 'conteudo-login' : 'conteudo-layout'}>
        {!paginaLogin && <BarraLateral />}

        <main className={paginaLogin ? 'main-login' : 'main-conteudo'}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;