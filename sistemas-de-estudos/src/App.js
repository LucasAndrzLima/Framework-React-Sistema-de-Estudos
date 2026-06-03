import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Inicio from './pages/Inicio';
import Materias from './pages/Materias';
import Tarefas from './pages/Tarefas';
import Usuarios from './pages/Usuarios';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import PrivateRoute from './components/PrivateRoute';

function Aplicativo() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />

          <Route
            path="/materias"
            element={
              <PrivateRoute>
                <Materias />
              </PrivateRoute>
            }
          />

          <Route
            path="/tarefas"
            element={
              <PrivateRoute>
                <Tarefas />
              </PrivateRoute>
            }
          />

          <Route
            path="/perfil"
            element={
              <PrivateRoute>
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <PrivateRoute>
                <Usuarios />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default Aplicativo;