import React from 'react';

function Inicio() {
  const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  const tarefasConcluidas = JSON.parse(localStorage.getItem('tarefasConcluidas')) || [];

  const totalPendentes = tarefas.length;
  const totalConcluidas = tarefasConcluidas.length;
  const totalTarefas = totalPendentes + totalConcluidas;

  const progressoGeral =
    totalTarefas === 0
      ? 0
      : Math.round((totalConcluidas / totalTarefas) * 100);

  return (
    <div>
      <h1>Página Inicial</h1>
      <div className="logo-central">
  <img
    src="/logo.png"
    alt="Logo do sistema"
  />
</div>
      <div className="card destaque-inicio">
        <h2>Bem-vindo ao Sistema de Estudos</h2>
        <p>
          Aqui você pode organizar suas matérias, acompanhar tarefas pendentes
          e visualizar seu progresso de estudo.
        </p>
      </div>

      <div className="cards-resumo">
        <div className="card card-resumo">
          <h3>Tarefas pendentes</h3>
          <p>{totalPendentes}</p>
        </div>

        <div className="card card-resumo">
          <h3>Tarefas concluídas</h3>
          <p>{totalConcluidas}</p>
        </div>

        <div className="card card-resumo">
          <h3>Progresso geral</h3>
          <p>{progressoGeral}%</p>
        </div>
      </div>

      <div className="card">
        <h2>Resumo do progresso</h2>

        <div className="barra-container">
          <div
            className="barra-progresso"
            style={{ width: `${progressoGeral}%` }}
          ></div>
        </div>

        <p style={{ marginTop: '10px' }}>
          {progressoGeral}% das tarefas foram concluídas.
        </p>
      </div>
    </div>
  );
}

export default Inicio;