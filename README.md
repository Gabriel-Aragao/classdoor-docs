# 📚 Classdoor — Documentação Oficial do Projeto

Bem-vindo ao repositório central de documentação e engenharia do **Classdoor**.

Este repositório reúne todos os artefatos de produto, especificações arquiteturais, contratos de integração, guias de design system (Figma) e manuais de colaboração entre desenvolvedores júnior e a equipe de agentes especialistas de IA.

---

## 🧭 Mapa de Documentação

### 1. 🎯 Especificações de Produto, Arquitetura & Governança (`specs/`)
* [**01. Visão Geral, Metadados e Governança**](specs/01-Visao-Geral-e-Governanca.md): Visão do produto, ecossistema de repositórios, matriz de agentes/stakeholders, Git Flow simplificado, padrões de commit e políticas de equipe.
* [**02. Arquitetura, Contratos, Dados e Design System**](specs/02-Arquitetura-Contratos-e-Design-System.md): Arquitetura técnica (React 19 / Spring Boot 3), modelo de dados relacional PostgreSQL (DBML e índices), algoritmos de anonimato, contratos RESTful e tokens de UI do Figma.
* [**03. Catálogo de Requisitos e User Stories**](specs/03-Requisitos-e-User-Stories.md): Catálogo de requisitos funcionais (RF01 a RF16 com MoSCoW), requisitos não-funcionais (RNF01 a RNF06) e especificação completa das User Stories (US01 a US09) com critérios BDD.
* [**04. Planejamento de Sprints e Roadmap**](specs/04-Planejamento-Sprints-e-Roadmap.md): Cronograma das Sprints 1 a 4, estratégia Frontend-First com mocks de cliente e detalhamento executivo dos cards ativos da Sprint 1 (Cards 004 a 007).

### 2. 📐 Documentação de Produto (Human PRD — `human-prd/`)
* [**01. Descrição do Projeto**](human-prd/01-Descricao-do-Projeto.md): Visão geral do produto, objetivos, modelo de domínio acadêmico e pilares de privacidade por design.
* [**02. Requisitos Funcionais & Não-Funcionais**](human-prd/02-Requisitos-Funcionais.md): Tabela de requisitos com priorização MoSCoW (RF01 a RF24) e RNFs.
* [**03. Diagramas de Casos de Uso**](human-prd/03-Diagrama-Casos-de-Uso.md): Atores, diagramas UML em PlantUML / SVG e especificações de fluxos.
* [**04. Modelo Lógico do Banco de Dados**](human-prd/04-Modelo-Logico-Banco-de-Dados.md): Modelo Entidade-Relacionamento (DBML / dbdiagram.io / SVG), dicionário de dados PostgreSQL 16+ e constraints.

### 3. 📖 Guias Práticos & Operacionais (`guias/`)
* [**Guia de Git & Branches para Desenvolvedores**](guias/Guia-Git-Branches-Junior.md): Padrões de branch (`feat/<id>-desc`), fluxo de trabalho com a branch `dev`, comandos para Windows/Linux e abertura de Pull Requests (`[<ID>] Título`).
* [**Guia de Suporte com Especialistas de IA no Trello**](guias/Guia-Comunicacao-Agentes-Devs-Junior.md): Manual de suporte nos cards do Trello, catálogo de especialistas (@dijkstra, @peter, @aria, @iris, @ada, @codd, @qa, @atlas) e esclarecimento de dúvidas.

### 4. 🎨 Design & Layout (Figma)
* O **[Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)** é a **Fonte Única da Verdade (Single Source of Truth)** oficial para todos os layouts, componentes, tokens visuais e fluxos navegáveis Desktop e Mobile do projeto Classdoor.

---

## 🔄 Diretrizes de Manutenção e Padrões de Commit

1. **Atualizações e Versionamento:**
   * Qualquer alteração realizada na documentação deve ser versionada diretamente neste repositório GitHub (`Gabriel-Aragao/classdoor-docs`).
   * Antes de realizar edições na documentação, execute um `git pull` neste repositório para incorporar eventuais alterações submetidas por outros colaboradores.
2. **Padrão de Commits:**
   * **Agentes de IA:** utilizam o padrão `[agente] - mensagem` (ex: `[atlas] - atualiza contratos da US02`).
   * **Desenvolvedores:** utilizam Conventional Commits identificados pela sua conta GitHub (ex: `feat(auth): adiciona validacao de email`).
