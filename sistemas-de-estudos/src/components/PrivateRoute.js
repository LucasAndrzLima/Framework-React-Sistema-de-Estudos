import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function PrivateRoute({ children }) {
  const { estaAutenticado, inicializando } = useAppContext();

  // Evita redirecionar para o login enquanto o token salvo ainda esta sendo validado.
  if (inicializando) {
    return (
      <div className="estado-centralizado" role="status">
        <div className="spinner" aria-hidden="true"></div>
        <p>Validando sessao segura...</p>
      </div>
    );
  }

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
