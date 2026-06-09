import React, { useCallback, useEffect, useState } from 'react';
import { buscarUsuarios } from '../services/userService';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [ultimaBusca, setUltimaBusca] = useState('');
  const [origemDados, setOrigemDados] = useState('');

  const carregarUsuarios = useCallback(async (termo = '') => {
    try {
      setCarregando(true);
      setErro('');

      const resposta = await buscarUsuarios(termo);

      setUsuarios(resposta.dados);
      setOrigemDados(resposta.origem);
      setUltimaBusca(termo.trim());
    } catch (erroAtual) {
      setErro('Erro ao buscar usuarios.');
      console.error('Erro:', erroAtual);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  return (
    <div>
      <div className="pagina-titulo">
        <div>
          <h1>Usuarios da API</h1>

          <p className="texto-apoio">
            Consumo externo com busca por nome, e-mail, empresa ou cidade.
          </p>
        </div>
        <span className="selo-seguranca">API externa 1: JSONPlaceholder</span>
      </div>

      <div className="card">
        <form
          className="formulario-inline"
          onSubmit={(evento) => {
            evento.preventDefault();
            carregarUsuarios(busca);
          }}
        >
          <input
            type="text"
            placeholder="Buscar por nome, e-mail, empresa ou cidade"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />

          <button type="submit">Buscar</button>
          <button
            type="button"
            className="botao-secundario"
            onClick={() => {
              setBusca('');
              carregarUsuarios('');
            }}
          >
            Limpar
          </button>
        </form>

        <p className="texto-apoio">
          {ultimaBusca
            ? `Resultados para "${ultimaBusca}": ${usuarios.length}`
            : `Total de usuarios carregados: ${usuarios.length}`}
        </p>

        {origemDados && (
          <span className="tag-materia">
            Fonte: {origemDados === 'api' ? 'API externa' : 'dados simulados'}
          </span>
        )}
      </div>

      {carregando && <p>Carregando usuarios...</p>}

      {erro && <p className="erro-geral">{erro}</p>}

      <div>
        {!carregando && !erro && usuarios.length === 0 ? (
          <p>Nenhum usuario encontrado para o filtro informado.</p>
        ) : (
          usuarios.map((usuario) => (
            <div className="card" key={usuario.id}>
              <h2>{usuario.name}</h2>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Cidade:</strong> {usuario.address.city}</p>
              <p><strong>Empresa:</strong> {usuario.company.name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Usuarios;
