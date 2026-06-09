# Sistema de Estudos - RA3

Entrega final de uma aplicacao React com backend Express, persistencia em arquivo
JSON, autenticacao JWT, upload de imagem e interface responsiva.

## Requisitos atendidos

### Persistencia

- Tarefas, perfil e usuario sao mantidos em `backend/data/database.json`.
- O arquivo e criado automaticamente na primeira execucao.
- Criar ou concluir uma tarefa grava a alteracao no backend.
- Atualizar perfil ou imagem continua valido apos atualizar a pagina.

### Seguranca

- Login real em `POST /login`.
- Senha armazenada como hash bcrypt.
- JWT assinado com expiracao de duas horas.
- Middleware valida `Authorization: Bearer TOKEN`.
- Tarefas, perfil, upload e consulta dos estudos sao rotas privadas.
- O token nao e enviado para APIs externas.

### Upload

- Envio por `multipart/form-data` com Multer.
- Arquivos salvos em `backend/uploads`.
- Aceita JPG, PNG e WEBP.
- Limite de 2MB e nome de arquivo gerado pelo servidor.

### Interface

- Estados de carregamento, erro, sucesso e lista vazia.
- Botoes bloqueados durante requisicoes.
- Tema claro/escuro.
- Layout responsivo para desktop, tablet e celular.
- Indicadores visuais de persistencia e rota protegida.

### APIs externas

1. **JSONPlaceholder** em `https://jsonplaceholder.typicode.com/users`
   - Carrega usuarios externos.
   - Permite filtrar por nome, e-mail, empresa e cidade.
2. **Open-Meteo** em `https://api.open-meteo.com/v1/forecast`
   - Carrega clima atual e previsao de quatro dias para Curitiba.
   - Exibe temperatura, sensacao, vento e chance de chuva.
   - Ajuda o estudante a decidir entre estudar em casa ou no campus.

As chamadas ficam separadas em `userService.js` e `weatherService.js`.

## Como executar

Abra dois terminais dentro de `sistemas-de-estudos`.

Na primeira execucao, instale frontend e backend:

```powershell
npm install
npm run install:backend
```

### Terminal 1 - backend

```powershell
npm run start:backend
```

O backend ficara em `http://localhost:3001`.

### Terminal 2 - frontend

```powershell
npm start
```

O frontend ficara em `http://localhost:3000`.

## Credenciais

- E-mail: `admin@email.com`
- Senha: `123456`

## Endpoints

| Metodo | Rota | Protegida | Responsabilidade |
| --- | --- | --- | --- |
| GET | `/health` | Nao | Verificar se o backend esta ativo |
| POST | `/login` | Nao | Autenticar e gerar JWT |
| GET | `/api/session` | Sim | Validar token e restaurar sessao |
| GET | `/api/estudos` | Sim | Buscar tarefas, perfil e materias |
| POST | `/api/tarefas` | Sim | Persistir nova tarefa |
| PATCH | `/api/tarefas/:id/concluir` | Sim | Concluir uma tarefa |
| PUT | `/api/perfil` | Sim | Atualizar dados do perfil |
| POST | `/api/perfil/imagem` | Sim | Fazer upload da imagem |

As rotas acima pertencem ao backend do projeto. Elas nao contam como APIs
externas; as duas integracoes externas sao JSONPlaceholder e Open-Meteo.

## Estrutura

```text
backend/
  data/              banco JSON gerado em execucao
  src/database.js    leitura e escrita da persistencia
  uploads/           imagens enviadas
  server.js          API, JWT, middleware e rotas
src/
  components/        componentes reutilizaveis
  context/           estado compartilhado e integracao
  pages/             telas da aplicacao
  services/          HTTP, autenticacao, estudos, clima, usuarios e storage
```

## Variavel de seguranca

Em desenvolvimento existe um segredo JWT padrao. Para trocar:

```powershell
$env:JWT_SECRET="uma-chave-longa-e-secreta"
npm run start:backend
```

Em producao o segredo nunca deve ficar no codigo ou no GitHub.

## Validacao

```powershell
npm run build
```

O build de producao deve finalizar com `Compiled successfully`.
