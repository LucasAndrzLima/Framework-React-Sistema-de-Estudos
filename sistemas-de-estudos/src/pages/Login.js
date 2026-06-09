import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function validarFormulario({ email, senha }) {
  const novosErros = {};

  if (!email.trim()) {
    novosErros.email = 'Informe o e-mail.';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    novosErros.email = 'Digite um e-mail valido.';
  }

  if (!senha.trim()) {
    novosErros.senha = 'Informe a senha.';
  } else if (senha.trim().length < 6) {
    novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.';
  }

  return novosErros;
}

function Login() {
  const { entrar, estaAutenticado } = useAppContext();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    email: 'admin@email.com',
    senha: '123456',
  });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function fazerLogin(evento) {
    evento.preventDefault();

    const errosEncontrados = validarFormulario(formulario);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      setErroGeral('');
      return;
    }

    setCarregando(true);
    setErroGeral('');

    try {
      await entrar(formulario);
      navigate('/');
    } catch (erro) {
      setErroGeral(erro.message || 'Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  if (estaAutenticado) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1>Login</h1>
        <p className="texto-apoio">
          Entre com uma sessao JWT valida para acessar seus dados persistidos.
        </p>

        <form className="formulario" onSubmit={fazerLogin}>
          <div className="campo-formulario">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={formulario.email}
              onChange={(evento) => {
                const { name, value } = evento.target;

                setFormulario((valorAtual) => ({
                  ...valorAtual,
                  [name]: value,
                }));
                setErros((valorAtual) => ({
                  ...valorAtual,
                  [name]: '',
                }));
                setErroGeral('');
              }}
            />
            {erros.email && <span className="erro-campo">{erros.email}</span>}
          </div>

          <div className="campo-formulario">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={formulario.senha}
              onChange={(evento) => {
                const { name, value } = evento.target;

                setFormulario((valorAtual) => ({
                  ...valorAtual,
                  [name]: value,
                }));
                setErros((valorAtual) => ({
                  ...valorAtual,
                  [name]: '',
                }));
                setErroGeral('');
              }}
            />
            {erros.senha && <span className="erro-campo">{erros.senha}</span>}
          </div>

          {erroGeral && <p className="erro-geral">{erroGeral}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="dica-formulario">
          Demonstracao: admin@email.com / 123456. O backend deve estar em execucao.
        </p>
      </div>
    </div>
  );
}

export default Login;
