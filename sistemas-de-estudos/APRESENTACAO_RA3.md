# Guia rapido para apresentar o RA3

## Persistencia

**Onde os dados ficam?**

No arquivo `backend/data/database.json`, criado automaticamente. O frontend nao
salva mais tarefas e perfil como fonte principal no localStorage. Ele chama a API,
e o backend le e grava o JSON.

**Por que separar `database.js` de `server.js`?**

`server.js` cuida de HTTP, rotas e seguranca. `database.js` cuida da persistencia.
Essa separacao reduz responsabilidade por arquivo e permite trocar o JSON por
MySQL, PostgreSQL ou MongoDB sem reescrever as telas.

## JWT

**Como a autenticacao funciona?**

1. O frontend envia e-mail e senha para `POST /login`.
2. O backend compara a senha com o hash bcrypt.
3. Se estiver correta, gera um JWT com expiracao.
4. O frontend envia o token no header `Authorization`.
5. O middleware valida o token antes de permitir acesso a rotas privadas.

**JWT criptografa os dados?**

Nao. JWT e assinado, nao necessariamente criptografado. A assinatura impede
alteracao sem o segredo. Por isso nao se deve colocar senha ou dado sensivel no
payload.

**Por que validar a sessao ao atualizar a pagina?**

Ter um texto no localStorage nao prova que o token ainda e valido. A rota
`/api/session` verifica assinatura e expiracao no backend antes de restaurar a
interface privada.

## Senha

**Por que bcrypt?**

Bcrypt gera um hash lento e inclui salt, dificultando ataques de forca bruta e
tabelas pre-calculadas. A senha original nao e recuperada; a comparacao tambem e
feita pelo bcrypt.

## Upload

**Como o upload funciona?**

O navegador envia `multipart/form-data`. O Multer valida tipo e tamanho, gera um
nome controlado pelo servidor e salva em `backend/uploads`. O banco guarda apenas
o caminho da imagem.

**Por que nao salvar Base64 no JSON?**

Base64 aumenta o tamanho do arquivo e mistura dados binarios com dados de
negocio. Salvar o arquivo separado e guardar apenas o caminho e mais organizado.

## Interface

**Quais melhorias de experiencia foram feitas?**

- botoes desabilitados durante requisicoes;
- mensagens de sucesso e erro;
- spinner ao validar a sessao;
- estado vazio para lista sem tarefas;
- pre-visualizacao antes do upload;
- responsividade e tema claro/escuro.

## Duas APIs externas

**Quais APIs externas o projeto consome?**

1. JSONPlaceholder: fornece uma lista de usuarios para demonstrar consumo,
   carregamento, busca e tratamento de falha.
2. Open-Meteo: fornece clima atual e previsao para Curitiba, usada na pagina de
   planejamento.

**Por que as chamadas estao em services?**

Cada service concentra URL, parametros e transformacao dos dados de uma API.
Assim a pagina cuida da interface e pode trocar o provedor sem espalhar `fetch`
por varios componentes.

**A API do backend conta como uma das duas APIs externas?**

Nao. O Express faz parte do proprio projeto. As duas externas sao servicos de
terceiros: JSONPlaceholder e Open-Meteo.

## Pergunta aprofundada

**O que mudaria para colocar em producao?**

Eu trocaria o arquivo JSON por banco relacional, usaria HTTPS, segredo JWT em
variavel segura, refresh token, cookies HttpOnly quando adequado, validacao com
uma biblioteca de schema, logs estruturados, testes automatizados e armazenamento
de imagens em um servico de objetos.
