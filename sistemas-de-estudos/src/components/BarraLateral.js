import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function BarraLateral() {
  const navigate = useNavigate();
  const { sair } = useAppContext();

  const encerrarSessao = () => {
    sair();
    navigate('/login');
  };

  return (
    <aside>
      <div className="sidebar-logo">
        <img
          src="/logo.png"
          alt="Logo"
          className="logo-sidebar"
        />
      </div>

      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
            >
              Inicio
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/materias"
              className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
            >
              Materias
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tarefas"
              className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
            >
              Tarefas
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/perfil"
              className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
            >
              Perfil
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/usuarios"
              className={({ isActive }) => (isActive ? 'nav-link ativo' : 'nav-link')}
            >
              Usuarios/API
            </NavLink>
          </li>
          <li>
            <button
              type="button"
              className="botao-secundario botao-bloco"
              onClick={encerrarSessao}
            >
              Sair
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default BarraLateral;
