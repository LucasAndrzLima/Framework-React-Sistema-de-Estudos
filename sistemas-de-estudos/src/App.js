import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Inicio from './pages/Inicio';
import Materias from './pages/Materias';
import Tarefas from './pages/Tarefas';

function Aplicativo() {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const alternarTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  return (
    <Router>
      <Layout temaEscuro={temaEscuro} alternarTema={alternarTema}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/materias" element={<Materias />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default Aplicativo;