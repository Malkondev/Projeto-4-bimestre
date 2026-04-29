# Documento de Visão

**Projeto:** SmartCloset
**Versão:** 1.0
**Data:** Abril de 2026
**Status:** Em Revisão
**Equipe de Desenvolvimento:** Malkon Gabriel, Levy Lyan, Lauren Vitória

---

## 1. Introdução

### 1.1 Propósito
Este documento define a visão de alto nível do SmartCloset, descrevendo os problemas a serem resolvidos, as necessidades das partes interessadas, as características do produto e os requisitos do sistema. Serve como base para alinhar a equipe de desenvolvimento e os stakeholders durante todas as fases do projeto.

### 1.2 Escopo
O SmartCloset abrange os seguintes processos:
* Cadastro e fotografia de peças de vestuário, sapatos e acessórios.
* Organização do guarda-roupa por categorias, grupos ou cores.
* Montagem e salvamento de combinações (Looks/Outfits).
* Gerenciamento de lista de desejos (*wishlist*) para planejamento de aquisições.
* Geração de sugestões personalizadas de vestuário utilizando Inteligência Artificial (exclusivo Premium).

Fora do escopo (versão 1.0):
* E-commerce ou venda direta de roupas pelo aplicativo.
* Rede social integrada para compartilhamento público de looks.

### 1.3 Definições, Acrônimos e Abreviações

| Termo | Definição |
| :--- | :--- |
| **IA** | Inteligência Artificial. |
| **Look / Outfit** | Combinação de peças de roupa e acessórios montada pelo usuário ou sugerida pelo app. |
| **Premium** | Plano de assinatura paga que libera funcionalidades avançadas, como o *personal stylist* digital. |
| **RF** | Requisito Funcional. |
| **RNF** | Requisito Não Funcional. |

### 1.4 Visão Geral do Documento
Este documento está organizado nas seguintes seções: posicionamento do produto, partes interessadas, visão geral do produto, requisitos e restrições.

---

## 2. Posicionamento

### 2.1 Oportunidade de Negócio
Pessoas frequentemente perdem tempo decidindo o que vestir ou esquecem peças de roupa no fundo de gavetas e armários devido à desorganização visual. Processos manuais de escolha dificultam a exploração de novas combinações e levam a compras desnecessárias de itens repetidos ou que não combinam com o guarda-roupa atual.

### 2.2 Declaração do Problema

| | |
| :--- | :--- |
| **O problema de** | gerenciamento ineficiente do guarda-roupa e dificuldade em montar combinações diárias |
| **Afeta** | pessoas com rotinas corridas, entusiastas de moda e o público em geral |
| **Cujo impacto é** | perda de tempo, esquecimento de peças e aquisições mal planejadas |
| **Uma solução bem-sucedida seria** | um aplicativo que cataloga o guarda-roupa e utiliza IA para atuar como um *personal stylist* 24 horas por dia |

### 2.3 Declaração de Posição do Produto

| | |
| :--- | :--- |
| **Para** | usuários que desejam praticidade, estilo e organização pessoal |
| **Que** | necessitam gerenciar suas roupas de forma inteligente e rápida |
| **O SmartCloset é** | um aplicativo de gestão de estilo e guarda-roupa virtual |
| **Que** | oferece cadastro de peças, criação de looks, lista de desejos e sugestões de vestuário por IA |
| **Diferente de** | depender da memória ou da organização física manual |
| **Nosso produto** | garante um inventário visual completo na palma da mão e otimiza a rotina com sugestões inteligentes baseadas no clima e tendências |

---

## 3. Partes Interessadas e Usuários

### 3.1 Partes Interessadas (Stakeholders)

| Stakeholder | Papel | Interesse |
| :--- | :--- | :--- |
| **Equipe de Desenvolvimento** | Patrocinadores / Desenvolvedores | Sucesso do app, adoção de usuários e conversão para o plano Premium. |
| **Usuários (Plano Gratuito)** | Usuário Principal | Organização do guarda-roupa e criação manual de looks. |
| **Usuários (Plano Premium)** | Usuário Avançado | Sugestões personalizadas por IA, economia de tempo e otimização de estilo. |

### 3.2 Perfis de Usuários

#### 3.2.1 Usuário Padrão (Free)
| Atributo | Descrição |
| :--- | :--- |
| **Representante** | Qualquer pessoa que baixe o aplicativo. |
| **Responsabilidade** | Cadastro de peças, separação por grupos e montagem manual de looks. |
| **Critério de sucesso** | Facilidade em encontrar peças cadastradas e visualizar o próprio guarda-roupa. |

#### 3.2.2 Usuário Premium
| Atributo | Descrição |
| :--- | :--- |
| **Representante** | Assinantes do plano pago. |
| **Responsabilidade** | Consumir as sugestões do *personal stylist* digital. |
| **Critério de sucesso** | Receber sugestões assertivas baseadas no clima e nas peças cadastradas. |

#### 3.2.3 Administrador do Sistema
| Atributo | Descrição |
| :--- | :--- |
| **Representante** | Equipe de TI (Malkon, Levy, Lauren). |
| **Responsabilidade** | Configuração, manutenção e controle do sistema, além de treinamento do modelo de IA. |
| **Critério de sucesso** | Sistema estável, algoritmo de IA preciso e alta disponibilidade. |

---

## 4. Visão Geral do Produto

### 4.1 Principais Funções

| ID | Função | Prioridade |
| :--- | :--- | :--- |
| **F01** | Cadastro de peças via fotografia com catálogo. | Alta |
| **F02** | Organização de peças por grupos (trabalho, lazer, cores, estações). | Alta |
| **F03** | Interface para criação e salvamento de looks/outfits favoritos. | Alta |
| **F04** | Sugestões de combinações personalizadas por IA (Plano Premium). | Alta |
| **F05** | Criação e gestão de lista de desejos de compras futuras. | Média |

---

## 5. Requisitos Funcionais

### 5.1 Lista de Requisitos Funcionais

| ID | Descrição | Prioridade |
| :--- | :--- | :--- |
| **RF001** | O sistema deve permitir ao usuário fotografar e registrar roupas, sapatos e acessórios. | Alta |
| **RF002** | O sistema deve permitir categorizar peças por cor, ocasião e estação do ano. | Alta |
| **RF003** | O sistema deve possuir um módulo de tela livre para sobrepor imagens e criar looks virtuais. | Alta |
| **RF004** | O sistema deve permitir salvar os looks montados em uma galeria de favoritos. | Alta |
| **RF005** | O sistema deve gerar sugestões automáticas de roupas utilizando IA, cruzando o inventário do usuário com dados de clima local. | Alta |
| **RF006** | O sistema deve restringir o acesso à funcionalidade de IA apenas para usuários do Plano Premium. | Alta |
| **RF007** | O sistema deve possuir uma seção de "Lista de Desejos" para cadastrar itens que o usuário almeja comprar. | Média |
| **RF008** | O sistema deve permitir simular a combinação de um item da "Lista de Desejos" com peças já existentes no inventário. | Média |
