# Arquitetura do SmartCloset Backend JS

## Camadas da aplicação

```text
Frontend Mobile/Web
        |
        v
API REST Node.js + Express
        |
        v
Middlewares: CORS, JSON, autenticação JWT, validações
        |
        v
Rotas: Auth, Peças, Looks, Wishlist, Sugestões Premium
        |
        v
Serviços: autenticação, persistência em JSON
        |
        v
Banco local: src/data/database.json
```

## Componentes

- **Auth Routes**: cadastro, login e dados do usuário autenticado.
- **Clothing Routes**: cadastro, listagem, edição e remoção de peças.
- **Outfit Routes**: criação de looks e favoritos.
- **Wishlist Routes**: lista de desejos e marcação de comprado.
- **Suggestion Routes**: sugestão simulada de look, restrita a usuários Premium.
- **Middlewares**: autenticação JWT, proteção Premium e tratamento de erros.

## Tecnologias

- JavaScript
- Node.js
- Express
- JWT
- bcryptjs
- Docker
- Persistência inicial em JSON

## Justificativa

O Node.js com Express foi escolhido por permitir uma API simples, rápida e compatível com projetos web/mobile. A persistência em JSON facilita a execução inicial sem exigir instalação de banco de dados, mas a estrutura permite migração futura para PostgreSQL, MySQL ou MongoDB.
