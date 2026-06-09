const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {
  buscarUsuarioPorEmail,
  concluirTarefa,
  criarTarefa,
  lerDadosDoUsuario,
  salvarPerfil,
  salvarImagemPerfil,
} = require('./src/database');

const app = express();
const PORTA = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'segredo_ra3_apenas_desenvolvimento';
const PASTA_UPLOADS = path.join(__dirname, 'uploads');

// Em desenvolvimento o React pode escolher outra porta se 3000 estiver ocupada
// (por exemplo 3001 ou 3002). Aceitamos somente origens locais, em qualquer porta.
const corsLocal = {
  origin(origem, callback) {
    const origemLocal =
      !origem || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origem);

    if (origemLocal) {
      return callback(null, true);
    }

    callback(new Error('Origem nao permitida pelo CORS.'));
  },
};

// Remove um header que revela a tecnologia usada pelo servidor.
app.disable('x-powered-by');
app.use(cors(corsLocal));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(PASTA_UPLOADS));

// Multer recebe arquivos multipart/form-data e salva somente imagens validas.
const upload = multer({
  storage: multer.diskStorage({
    destination: PASTA_UPLOADS,
    filename: (req, arquivo, callback) => {
      const extensao = path.extname(arquivo.originalname).toLowerCase();
      callback(null, `perfil-${req.usuario.id}-${Date.now()}${extensao}`);
    },
  }),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, arquivo, callback) => {
    const tiposAceitos = ['image/jpeg', 'image/png', 'image/webp'];

    if (!tiposAceitos.includes(arquivo.mimetype)) {
      return callback(new Error('Envie uma imagem JPG, PNG ou WEBP.'));
    }

    callback(null, true);
  },
});

// Middleware aplicado nas rotas privadas. Ele valida assinatura e expiracao do JWT.
function autenticarToken(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token de acesso nao informado.' });
  }

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Sessao expirada ou token invalido.' });
  }
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', projeto: 'Sistema de Estudos RA3' });
});

app.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const senha = String(req.body.senha || '');
    const usuario = await buscarUsuarioPorEmail(email);

    // Para este projeto academico a senha e comparada com o hash persistido.
    // Em sistemas reais, nunca se deve salvar senha em texto puro.
    if (!usuario || !(await usuario.compararSenha(senha))) {
      return res.status(401).json({ erro: 'E-mail ou senha invalidos.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    next(erro);
  }
});

app.get('/api/session', autenticarToken, (req, res) => {
  res.json({ usuario: req.usuario });
});

app.get('/api/estudos', autenticarToken, async (req, res, next) => {
  try {
    res.json(await lerDadosDoUsuario(req.usuario.id));
  } catch (erro) {
    next(erro);
  }
});

app.post('/api/tarefas', autenticarToken, async (req, res, next) => {
  try {
    const titulo = String(req.body.titulo || '').trim();
    const descricao = String(req.body.descricao || '').trim();
    const materia = String(req.body.materia || '').trim();

    if (titulo.length < 3 || descricao.length < 10 || !materia) {
      return res.status(400).json({ erro: 'Preencha corretamente todos os campos.' });
    }

    const tarefa = await criarTarefa(req.usuario.id, {
      titulo,
      descricao,
      materia,
    });

    res.status(201).json({ tarefa });
  } catch (erro) {
    next(erro);
  }
});

app.patch('/api/tarefas/:id/concluir', autenticarToken, async (req, res, next) => {
  try {
    const tarefa = await concluirTarefa(req.usuario.id, req.params.id);

    if (!tarefa) {
      return res.status(404).json({ erro: 'Tarefa nao encontrada.' });
    }

    res.json({ tarefa });
  } catch (erro) {
    next(erro);
  }
});

app.put('/api/perfil', autenticarToken, async (req, res, next) => {
  try {
    const nome = String(req.body.nome || '').trim();
    const objetivo = String(req.body.objetivo || '').trim();
    const materiaFavorita = String(req.body.materiaFavorita || '').trim();

    if (nome.length < 3 || objetivo.length < 10 || !materiaFavorita) {
      return res.status(400).json({ erro: 'Dados de perfil invalidos.' });
    }

    const perfil = await salvarPerfil(req.usuario.id, {
      nome,
      objetivo,
      materiaFavorita,
    });

    res.json({ perfil });
  } catch (erro) {
    next(erro);
  }
});

app.post(
  '/api/perfil/imagem',
  autenticarToken,
  upload.single('imagem'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ erro: 'Selecione uma imagem.' });
      }

      const caminhoPublico = `/uploads/${req.file.filename}`;
      const perfil = await salvarImagemPerfil(req.usuario.id, caminhoPublico);
      res.json({ perfil });
    } catch (erro) {
      next(erro);
    }
  }
);

// Middleware final: transforma erros internos em uma resposta JSON consistente.
app.use((erro, req, res, next) => {
  console.error(erro);

  if (erro instanceof multer.MulterError && erro.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ erro: 'A imagem deve ter no maximo 2MB.' });
  }

  res.status(500).json({ erro: erro.message || 'Erro interno do servidor.' });
});

app.listen(PORTA, () => {
  console.log(`Backend RA3 rodando em http://localhost:${PORTA}`);
});
