import React from 'react';
import { useAppContext } from '../context/AppContext';

function Inicio() {
  const { perfil, tarefas, tarefasConcluidas, usuario } = useAppContext();

  const totalPendentes = tarefas.length;
  const totalConcluidas = tarefasConcluidas.length;
  const totalTarefas = totalPendentes + totalConcluidas;

  const progressoGeral =
    totalTarefas === 0
      ? 0
      : Math.round((totalConcluidas / totalTarefas) * 100);

  return (
    <div>
      <div className="pagina-cabecalho">
        <div>
          <h1>Pagina Inicial</h1>
          <p className="texto-apoio">
            Ola, {perfil.nome || usuario}. Acompanhe seu progresso e as integracoes do projeto.
          </p>
        </div>

        {perfil.imagem ? (
          <img
            src={perfil.imagem}
            alt={`Foto de perfil de ${perfil.nome || usuario}`}
            className="avatar-inicio"
          />
        ) : (
          <div className="logo-central">
            <img
              src="/logo.png"
              alt="Logo do sistema"
            />
          </div>
        )}
      </div>

      <div className="card destaque-inicio">
        <h2>Bem-vindo ao Sistema de Estudos</h2>
        <p>
          Aqui voce pode organizar suas materias, cadastrar tarefas com validacao,
          manter um perfil privado com imagem e consumir servicos externos.
        </p>
        {perfil.objetivo && <p className="texto-apoio">Objetivo atual: {perfil.objetivo}</p>}
      </div>

      <div className="cards-resumo">
        <div className="card card-resumo">
          <h3>Tarefas pendentes</h3>
          <p>{totalPendentes}</p>
        </div>

        <div className="card card-resumo">
          <h3>Tarefas concluidas</h3>
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

        <p className="texto-apoio">
          {progressoGeral}% das tarefas foram concluidas.
        </p>
      </div>

      <div className="grid-duplo">
        <div className="card">
          <h2>Integracoes da aplicacao</h2>
          <div className="lista-status">
            <div className="status-item">
              <strong>API 1:</strong> Login autenticado em <code>localhost:3001/login</code>
            </div>
            <div className="status-item">
              <strong>API 2:</strong> Usuarios externos em <code>jsonplaceholder.typicode.com/users</code>
            </div>
            <div className="status-item">
              <strong>Fallback:</strong> dados simulados quando API ou rede nao respondem.
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Rota privada de perfil</h2>
          <p>
            Na pagina de perfil e possivel validar campos, enviar uma imagem de ate 1MB
            e salvar os dados localmente para reutilizar na navegacao.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
