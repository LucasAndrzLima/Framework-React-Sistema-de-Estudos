import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('admin@email.com');
  const [senha, setSenha] = useState('123456');

  const navigate = useNavigate();

  async function fazerLogin() {
    try {
      const resposta = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro);
        localStorage.removeItem('token');
        return;
      }

      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', dados.nome);

      navigate('/');
    } catch (erro) {
      alert('Erro ao conectar com o servidor.');
      console.log(erro);
    }
  }

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={fazerLogin}>
          Entrar
        </button>

        <p style={{ marginTop: '15px' }}>
          Use: admin@email.com / 123456
        </p>
      </div>
    </div>
  );
}

export default Login;