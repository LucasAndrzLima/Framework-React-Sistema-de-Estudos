import React, { useEffect, useMemo, useState } from 'react';
import { useAppContext } from '../context/AppContext';

const TAMANHO_MAXIMO_IMAGEM = 2 * 1024 * 1024;
const TIPOS_IMAGEM_ACEITOS = ['image/jpeg', 'image/png', 'image/webp'];

function validarPerfil(formulario) {
  const novosErros = {};

  if (!formulario.nome.trim() || formulario.nome.trim().length < 3) {
    novosErros.nome = 'Informe um nome com pelo menos 3 caracteres.';
  }

  if (!formulario.objetivo.trim() || formulario.objetivo.trim().length < 10) {
    novosErros.objetivo = 'Descreva o objetivo com pelo menos 10 caracteres.';
  }

  if (!formulario.materiaFavorita.trim()) {
    novosErros.materiaFavorita = 'Selecione a materia favorita.';
  }

  return novosErros;
}

function Perfil() {
  const {
    fazerUploadPerfil,
    materias,
    perfil,
    salvarPerfil,
    usuarioEmail,
  } = useAppContext();
  const [formulario, setFormulario] = useState({
    ...perfil,
    email: usuarioEmail,
  });
  const [arquivoImagem, setArquivoImagem] = useState(null);
  const [erros, setErros] = useState({});
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setFormulario({
      ...perfil,
      email: usuarioEmail,
    });
  }, [perfil, usuarioEmail]);

  // URL temporaria usada somente para mostrar a imagem antes do upload.
  const imagemPreview = useMemo(() => {
    if (arquivoImagem) {
      return URL.createObjectURL(arquivoImagem);
    }

    return formulario.imagem;
  }, [arquivoImagem, formulario.imagem]);

  useEffect(() => {
    return () => {
      if (imagemPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(imagemPreview);
      }
    };
  }, [imagemPreview]);

  const atualizarCampo = ({ target }) => {
    const { name, value } = target;
    setFormulario((valorAtual) => ({ ...valorAtual, [name]: value }));
    setErros((valorAtual) => ({ ...valorAtual, [name]: '' }));
    setMensagem('');
  };

  const selecionarImagem = ({ target }) => {
    const arquivo = target.files?.[0];

    if (!arquivo) return;

    if (!TIPOS_IMAGEM_ACEITOS.includes(arquivo.type)) {
      setErros((atuais) => ({
        ...atuais,
        imagem: 'Use uma imagem JPG, PNG ou WEBP.',
      }));
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_IMAGEM) {
      setErros((atuais) => ({
        ...atuais,
        imagem: 'A imagem deve ter no maximo 2MB.',
      }));
      return;
    }

    setArquivoImagem(arquivo);
    setErros((atuais) => ({ ...atuais, imagem: '' }));
    setMensagem('');
  };

  const enviarFormulario = async (evento) => {
    evento.preventDefault();
    const errosEncontrados = validarPerfil(formulario);

    if (Object.keys(errosEncontrados).length > 0) {
      setErros(errosEncontrados);
      return;
    }

    try {
      setSalvando(true);
      setMensagem('');

      await salvarPerfil({
        nome: formulario.nome.trim(),
        objetivo: formulario.objetivo.trim(),
        materiaFavorita: formulario.materiaFavorita,
      });

      if (arquivoImagem) {
        await fazerUploadPerfil(arquivoImagem);
        setArquivoImagem(null);
      }

      setMensagem('Perfil e imagem persistidos com sucesso.');
    } catch (erro) {
      setMensagem(erro.message);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div>
      <div className="pagina-titulo">
        <div>
          <h1>Perfil</h1>
          <p className="texto-apoio">
            Dados protegidos por JWT e imagem armazenada no servidor.
          </p>
        </div>
        <span className="selo-seguranca">Rota protegida</span>
      </div>

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
                value={formulario.nome}
                onChange={atualizarCampo}
              />
              {erros.nome && <span className="erro-campo">{erros.nome}</span>}
            </div>

            <div className="campo-formulario">
              <label htmlFor="email">E-mail da conta</label>
              <input id="email" type="email" value={formulario.email || ''} readOnly />
              <span className="ajuda-campo">O e-mail vem da identidade presente no JWT.</span>
            </div>

            <div className="campo-formulario">
              <label htmlFor="objetivo">Objetivo de estudo</label>
              <textarea
                id="objetivo"
                name="objetivo"
                value={formulario.objetivo}
                onChange={atualizarCampo}
              />
              {erros.objetivo && <span className="erro-campo">{erros.objetivo}</span>}
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
                  <option key={materia} value={materia}>{materia}</option>
                ))}
              </select>
            </div>

            <div className="campo-formulario">
              <label htmlFor="imagem">Imagem de perfil</label>
              <input
                id="imagem"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={selecionarImagem}
              />
              <span className="ajuda-campo">
                JPG, PNG ou WEBP. Limite de 2MB. O upload ocorre ao salvar.
              </span>
              {erros.imagem && <span className="erro-campo">{erros.imagem}</span>}
            </div>

            {mensagem && (
              <p className={mensagem.includes('sucesso') ? 'sucesso-geral' : 'erro-geral'}>
                {mensagem}
              </p>
            )}

            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando no servidor...' : 'Salvar perfil'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2>Pre-visualizacao</h2>
          <div className="perfil-preview">
            {imagemPreview ? (
              <img
                src={imagemPreview}
                alt={`Perfil de ${formulario.nome || 'usuario'}`}
                className="perfil-imagem"
              />
            ) : (
              <div className="perfil-placeholder">Sem imagem</div>
            )}

            <div>
              <h3>{formulario.nome || 'Nome do estudante'}</h3>
              <p><strong>E-mail:</strong> {formulario.email || '---'}</p>
              <p><strong>Materia favorita:</strong> {formulario.materiaFavorita}</p>
              <p>{formulario.objetivo || 'Defina seu objetivo de estudo.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
