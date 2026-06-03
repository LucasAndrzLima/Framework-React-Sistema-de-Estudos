import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TAMANHO_MAXIMO_IMAGEM = 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];

function validarPerfil(formulario) {
  const novosErros = {};

  if (!formulario.nome.trim()) {
    novosErros.nome = 'Informe o nome exibido no perfil.';
  } else if (formulario.nome.trim().length < 3) {
    novosErros.nome = 'O nome precisa ter pelo menos 3 caracteres.';
  }

  if (!formulario.objetivo.trim()) {
    novosErros.objetivo = 'Descreva o objetivo de estudo.';
  } else if (formulario.objetivo.trim().length < 10) {
    novosErros.objetivo = 'O objetivo precisa ter pelo menos 10 caracteres.';
  }

  if (!formulario.materiaFavorita.trim()) {
    novosErros.materiaFavorita = 'Selecione a materia favorita.';
  }

  return novosErros;
}

function lerArquivoComoBase64(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();

    leitor.onload = () => resolve(leitor.result);
    leitor.onerror = () => reject(new Error('Nao foi possivel processar a imagem.'));
    leitor.readAsDataURL(arquivo);
  });
}

function Perfil() {
  const { materias, perfil, salvarPerfil, usuarioEmail } = useAppContext();
  const [formulario, setFormulario] = useState({
    ...perfil,
    email: usuarioEmail,
  });
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    setFormulario({
      ...perfil,
      email: usuarioEmail,
    });
  }, [perfil, usuarioEmail]);

  const atualizarCampo = ({ target }) => {
    const { name, value } = target;

    setFormulario((valorAtual) => ({
      ...valorAtual,
      [name]: value,
    }));
    setErros((valorAtual) => ({
      ...valorAtual,
      [name]: '',
    }));
    setMensagem('');
  };

  const atualizarImagem = async ({ target }) => {
    const arquivo = target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
      setErros((valorAtual) => ({
        ...valorAtual,
        imagem: 'Use uma imagem JPG, PNG ou WEBP.',
      }));
      setMensagem('');
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      setErros((valorAtual) => ({
        ...valorAtual,
        imagem: 'A imagem deve ter no maximo 1MB.',
      }));
      setMensagem('');
      return;
    }

    try {
      const imagemBase64 = await lerArquivoComoBase64(arquivo);

      setFormulario((valorAtual) => ({
        ...valorAtual,
        imagem: imagemBase64,
      }));
      setErros((valorAtual) => ({
        ...valorAtual,
        imagem: '',
      }));
      setMensagem('');
    } catch (erro) {
      setMensagem(erro.message);
    }
  };

  const enviarFormulario = (evento) => {
    evento.preventDefault();

    const errosEncontrados = validarPerfil(formulario);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      setMensagem('');
      return;
    }

    try {
      salvarPerfil({
        nome: formulario.nome.trim(),
        objetivo: formulario.objetivo.trim(),
        materiaFavorita: formulario.materiaFavorita,
        imagem: formulario.imagem,
      });

      setMensagem('Perfil salvo com sucesso.');
    } catch (erro) {
      setMensagem('Nao foi possivel salvar o perfil. Use uma imagem de ate 1MB.');
    }
  };

  return (
    <div>
      <h1>Perfil privado</h1>
      <p className="texto-apoio">
        Esta rota privada concentra um formulario validado e upload de imagem com pre-visualizacao.
      </p>

      <div className="grid-duplo">
        <div className="card">
          <h2>Dados do perfil</h2>

          <form className="formulario" onSubmit={enviarFormulario}>
            <div className="campo-formulario">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome"
                value={formulario.nome}
                onChange={atualizarCampo}
              />
              {erros.nome && <span className="erro-campo">{erros.nome}</span>}
            </div>

            <div className="campo-formulario">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                value={formulario.email || ''}
                readOnly
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="objetivo">Objetivo de estudo</label>
              <textarea
                id="objetivo"
                name="objetivo"
                placeholder="Ex.: Melhorar meu desempenho em programacao e organizacao."
                value={formulario.objetivo}
                onChange={atualizarCampo}
              />
              {erros.objetivo && (
                <span className="erro-campo">{erros.objetivo}</span>
              )}
            </div>

            <div className="campo-formulario">
              <label htmlFor="materiaFavorita">Materia favorita</label>
              <select
                id="materiaFavorita"
                name="materiaFavorita"
                value={formulario.materiaFavorita}
                onChange={atualizarCampo}
              >
                {materias.map((materia) => (
                  <option key={materia} value={materia}>
                    {materia}
                  </option>
                ))}
              </select>
              {erros.materiaFavorita && (
                <span className="erro-campo">{erros.materiaFavorita}</span>
              )}
            </div>

            <div className="campo-formulario">
              <label htmlFor="imagem">Imagem de perfil</label>
              <input
                id="imagem"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={atualizarImagem}
              />
              <span className="texto-apoio">
                Formatos aceitos: JPG, PNG e WEBP com ate 1MB.
              </span>
              {erros.imagem && <span className="erro-campo">{erros.imagem}</span>}
            </div>

            {mensagem && (
              <p className={mensagem.includes('sucesso') ? 'sucesso-geral' : 'erro-geral'}>
                {mensagem}
              </p>
            )}

            <div className="acoes-formulario">
              <button type="submit">Salvar perfil</button>

              {formulario.imagem && (
                <button
                  type="button"
                  className="botao-secundario"
                  onClick={() => {
                    setFormulario((valorAtual) => ({
                      ...valorAtual,
                      imagem: '',
                    }));
                    setErros((valorAtual) => ({
                      ...valorAtual,
                      imagem: '',
                    }));
                    setMensagem('');
                  }}
                >
                  Remover imagem
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Pre-visualizacao</h2>

          <div className="perfil-preview">
            {formulario.imagem ? (
              <img
                src={formulario.imagem}
                alt={`Pre-visualizacao do perfil de ${formulario.nome || 'usuario'}`}
                className="perfil-imagem"
              />
            ) : (
              <div className="perfil-placeholder">Sem imagem enviada</div>
            )}

            <h3>{formulario.nome || 'Seu nome aparecera aqui'}</h3>
            <p><strong>E-mail:</strong> {formulario.email || '---'}</p>
            <p><strong>Materia favorita:</strong> {formulario.materiaFavorita}</p>
            <p>{formulario.objetivo || 'Seu objetivo de estudo aparecera nesta area.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
