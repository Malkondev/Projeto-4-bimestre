# Casos de Uso

## UC01 - Autenticar usuário
- Ator: Usuário
- Pré-condição: possuir conta ou realizar cadastro
- Resultado: usuário recebe token JWT

## UC02 - Gerenciar peças
- Ator: Usuário autenticado
- Pré-condição: estar logado
- Resultado: usuário cadastra, lista, atualiza e remove peças

## UC03 - Gerenciar looks
- Ator: Usuário autenticado
- Pré-condição: possuir peças cadastradas
- Resultado: usuário cria looks e marca favoritos

## UC04 - Gerenciar wishlist
- Ator: Usuário autenticado
- Pré-condição: estar logado
- Resultado: usuário cadastra itens desejados

## UC05 - Gerar sugestão Premium
- Ator: Usuário Premium
- Pré-condição: estar logado e possuir plano Premium
- Resultado: API retorna sugestão de combinação
