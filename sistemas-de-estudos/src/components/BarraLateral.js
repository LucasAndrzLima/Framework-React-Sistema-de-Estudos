import React from 'react';
import { Link } from 'react-router-dom';

function BarraLateral() {
    const sair = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
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
            <Link to="/">Início</Link>
          </li>

          <li>
            <Link to="/materias">Matérias</Link>
          </li>
          <li>
            <Link to="/usuarios">Usuários/API</Link>
          </li>
          <li>
            <Link to="/tarefas">Tarefas</Link>
          </li>
          <li>
            <button onClick={sair}>Sair</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default BarraLateral;