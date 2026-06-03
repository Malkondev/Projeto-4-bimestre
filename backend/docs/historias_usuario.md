# Histórias de Usuário - SmartCloset

## HU01 - Cadastro de usuário

**Como** usuário,  
**quero** criar uma conta,  
**para** acessar meu guarda-roupa virtual com segurança.

### Fluxo
1. Usuário informa nome, e-mail e senha.
2. Sistema valida os dados.
3. Sistema cria a conta e retorna um token de acesso.

### Critérios de aceitação
- O sistema não deve aceitar e-mail duplicado.
- O sistema deve proteger a senha usando hash.
- O sistema deve retornar token JWT após cadastro.

---

## HU02 - Cadastro de peça

**Como** usuário,  
**quero** cadastrar roupas, sapatos e acessórios,  
**para** organizar meu guarda-roupa.

### Fluxo
1. Usuário envia nome, categoria, cor, ocasião, estação e imagem.
2. Sistema salva a peça vinculada ao usuário.
3. Sistema permite listar as peças cadastradas.

### Critérios de aceitação
- Nome e categoria são obrigatórios.
- Apenas o usuário dono pode ver suas peças.

---

## HU03 - Criação de look

**Como** usuário,  
**quero** combinar peças cadastradas,  
**para** salvar looks favoritos.

### Fluxo
1. Usuário escolhe peças do inventário.
2. Usuário informa nome e descrição do look.
3. Sistema salva o look.

### Critérios de aceitação
- O look deve possuir pelo menos uma peça.
- O sistema não deve permitir peças de outro usuário.

---

## HU04 - Wishlist

**Como** usuário,  
**quero** cadastrar itens que desejo comprar,  
**para** planejar futuras aquisições.

### Critérios de aceitação
- O usuário pode listar, cadastrar e remover itens.
- O usuário pode marcar um item como comprado.

---

## HU05 - Sugestão Premium

**Como** usuário Premium,  
**quero** receber sugestões automáticas de looks,  
**para** economizar tempo ao escolher roupas.

### Critérios de aceitação
- Apenas usuários Premium podem acessar a rota.
- O sistema deve usar peças cadastradas para montar a sugestão.
- Usuário Free deve receber erro de acesso negado.
