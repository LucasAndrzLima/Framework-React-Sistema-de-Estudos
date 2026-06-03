import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function PrivateRoute({ children }) {
  const { estaAutenticado } = useAppContext();

  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;