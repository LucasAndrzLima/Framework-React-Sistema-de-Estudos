# Sistema de Estudos - RA2

Aplicacao React para gerenciamento de estudos com foco em interatividade,
formularios, gerenciamento de estado, consumo de APIs e separacao de
responsabilidades.

## O que foi evoluido para o RA2

1. Formularios controlados com validacao no login, cadastro de tarefas e perfil.
2. Gerenciamento de estado centralizado com `AppContext`.
3. Consumo de API local de autenticacao em `http://localhost:3001/login`.
4. Consumo de API externa em `https://jsonplaceholder.typicode.com/users`.
5. Simulacao de dados quando a API externa, a rede ou o backend nao respondem.
6. Estrutura de services em `src/services`.
7. Perfil privado com upload de imagem, pre-visualizacao e limite de 1MB.
8. Responsividade para desktop, tablet e celular.

## Como executar

### Frontend

```bash
npm install
npm start
```

### Backend opcional

O backend demonstra a autenticacao real via HTTP. Se ele nao estiver rodando, o
frontend usa um login simulado com as mesmas credenciais de demonstracao.

```bash
cd backend
npm install
npm start
```

## Login de demonstracao

- E-mail: `admin@email.com`
- Senha: `123456`

## Estrutura principal

```bash
sistemas-de-estudos
- backend
  - server.js
- src
  - components
  - context
  - data
  - pages
  - services
  - App.js
  - Layout.js
  - index.js
  - style.css
- package.json
```

## Justificativa tecnica

- `AppContext` concentra estado global de autenticacao, tema, perfil e tarefas.
- `localStorage` mantem a persistencia simples sem exigir banco de dados.
- `services` separam as chamadas HTTP dos componentes visuais.
- `authService` tenta a API local e usa fallback simulado para nao travar a apresentacao.
- `userService` consome API externa e tambem retorna dados simulados se a rede falhar.
- Formularios controlados com validacao melhoram usabilidade e previsibilidade.
- Rotas privadas protegem as paginas internas apos o login.
- CSS responsivo garante uso adequado em telas menores.

## Pergunta tecnica possivel

**Por que separar chamadas de API em services em vez de usar `fetch` direto nas paginas?**

Porque a pagina fica responsavel pela interface e pelos eventos do usuario,
enquanto o service fica responsavel pela comunicacao externa. Isso reduz
duplicacao, facilita manutencao, permite trocar API real por dados simulados e
deixa o codigo mais testavel.
