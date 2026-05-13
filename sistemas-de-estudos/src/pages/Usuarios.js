import React, { useEffect, useState } from 'react';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscarUsuarios() {
      try {
        const resposta = await fetch('https://jsonplaceholder.typicode.com/users');
        const dados = await resposta.json();

        setUsuarios(dados);
      } catch (erro) {
        setErro('Erro ao buscar usuários da API.');
        console.error('Erro:', erro);
      } finally {
        setCarregando(false);
      }
    }

    buscarUsuarios();
  }, []);

  return (
    <div>
      <h1>Usuários da API</h1>

      <p style={{ marginBottom: '20px' }}>
        Esta página consome dados de uma API externa usando fetch.
      </p>

      {carregando && <p>Carregando usuários...</p>}

      {erro && <p>{erro}</p>}

      <div>
        {usuarios.map((usuario) => (
          <div className="card" key={usuario.id}>
            <h2>{usuario.name}</h2>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Cidade:</strong> {usuario.address.city}</p>
            <p><strong>Empresa:</strong> {usuario.company.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Usuarios;