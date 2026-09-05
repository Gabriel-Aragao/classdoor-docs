# 📚 Classdoor — Documentação Oficial do Projeto

Bem-vindo ao repositório central de documentação e engenharia do **Classdoor**.

Este repositório reúne todos os artefatos de produto, especificações arquiteturais, contratos de integração, guias de design system (Figma) e manuais de colaboração entre desenvolvedores júnior e a equipe de agentes especialistas de IA.

---

## 🧭 Mapa de Documentação

### 1. 🎯 Especificações de Produto & Arquitetura (`especificacoes/`)
* [**User Stories**](especificacoes/User-Stories.md): Detalhamento funcional de todas as histórias de usuário, fluxos, regras de negócio e critérios de aceitação (Gherkin/BDD).
* [**Planejamento de Sprints**](especificacoes/Planejamento-Sprints.md): Fatiamento do MVP em incrementos lógicos, definição de escopo e roadmap de entregas por Sprint.
* [**Especificação Técnica & Arquitetura**](especificacoes/Especificacao-Tecnica-Arquitetura.md): Definição de stack (Spring Boot 3 + Java / React 19 + Bootswatch), padrões de projeto, modelagem relacional e infraestrutura.
* [**Contratos de Integração**](especificacoes/Contratos-Integracao-User-Stories.md): Especificação dos endpoints REST, payloads de request/response, DTOs e códigos de status HTTP para cada User Story.
* [**Especificação do Design System no Figma**](especificacoes/Especificacao-Design-System-Figma.md): Tokens de design (cores, tipografia, espaçamentos, elevações), componentes e diretrizes visuais no Figma.

### 2. 📐 Modelagem & Engenharia de Requisitos (`modelagem/`)
* [**01. Descrição do Projeto**](modelagem/01-Descricao-do-Projeto.md): Visão geral do produto, objetivos, público-alvo e pilares de privacidade.
* [**02. Requisitos Funcionais & Não-Funcionais**](modelagem/02-Requisitos-Funcionais.md): Tabela categorizada de requisitos com priorização MoSCoW (RF01 a RF16) e RNFs.
* [**03. Diagramas de Casos de Uso**](modelagem/03-Diagrama-Casos-de-Uso.md): Atores, diagramas UML em Mermaid e especificações de fluxos.
* [**04. Modelo Lógico do Banco de Dados**](modelagem/04-Modelo-Logico-Banco-de-Dados.md): Diagrama ERD, dicionário de dados PostgreSQL, constraints e índices.

### 3. 📖 Guias Práticos & Operacionais (`guias/`)
* [**Guia de Git & Branches para Desenvolvedores**](guias/Guia-Git-Branches-Junior.md): Padrões de branch (`feat/<id>-desc`), fluxo de trabalho com a branch `dev`, comandos para Windows/Linux e abertura de Pull Requests (`[<ID>] Título`).
* [**Guia de Suporte com Especialistas de IA no Trello**](guias/Guia-Comunicacao-Agentes-Devs-Junior.md): Manual de suporte nos cards do Trello, catálogo de especialistas (@dijkstra, @peter, @aria, @iris, @ada, @codd, @qa, @atlas) e esclarecimento de dúvidas.

### 4. 🎨 Design & Layout (Figma)
* O **[Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)** é a **Fonte Única da Verdade (Single Source of Truth)** oficial para todos os layouts, componentes, tokens visuais e fluxos navegáveis Desktop e Mobile do projeto Classdoor.

---

## 🔄 Diretrizes de Sincronização e Padrões de Commit

1. **Sincronização Bidirecional Obrigatória:**
   * Qualquer alteração realizada na documentação deve ser refletida tanto no **Obsidian Vault** quanto neste repositório GitHub (`Gabriel-Aragao/classdoor-docs`).
2. **Atualizações Passivas:**
   * Antes de realizar edições na documentação, execute um `git pull` neste repositório para incorporar eventuais alterações submetidas pelos desenvolvedores.
   * Replique as novidades para o Obsidian Vault antes de subir novas alterações.
3. **Padrão de Commits:**
   * **Agentes de IA:** utilizam o padrão `[agente] - mensagem` (ex: `[atlas] - atualiza contratos da US02`).
   * **Desenvolvedores:** utilizam Conventional Commits identificados pela sua conta GitHub (ex: `feat(auth): adiciona validacao de email`).
