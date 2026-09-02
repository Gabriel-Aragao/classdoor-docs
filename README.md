# 📚 Classdoor — Documentação Oficial do Projeto

Bem-vindo ao repositório central de documentação e engenharia do **Classdoor**.

Este repositório reúne todos os artefatos de produto, especificações arquiteturais, contratos de integração, guias de design system (Penpot) e manuais de colaboração entre desenvolvedores júnior e a equipe de agentes especialistas de IA.

---

## 🧭 Mapa de Documentação

### 1. 🎯 Produto & Requisitos
* [**User Stories**](User-Stories.md): Detalhamento funcional de todas as histórias de usuário, fluxos, regras de negócio e critérios de aceitação (Gherkin/BDD).
* [**Planejamento de Sprints**](Planejamento-Sprints.md): Fatiamento do MVP em incrementos lógicos, definição de escopo e roadmap de entregas por Sprint.

### 2. 🏗️ Arquitetura & Engenharia
* [**Especificação Técnica & Arquitetura**](Especificacao-Tecnica-Arquitetura.md): Definição de stack (Spring Boot 3 + Java / React 19 + Bootswatch), padrões de projeto, modelagem relacional e infraestrutura.
* [**Contratos de Integração**](Contratos-Integracao-User-Stories.md): Especificação dos endpoints REST, payloads de request/response, DTOs e códigos de status HTTP para cada User Story.

### 3. 🎨 Design System & UI/UX
* [**Especificação do Design System no Penpot**](Especificacao-Design-System-Penpot.md): Tokens de design (cores, tipografia, espaçamentos, elevações), componentes e links para o protótipo navegável no Penpot.
* [**Protótipo Interativo**](prototypes/classdoor-interactive-prototype.html): Protótipo navegável HTML standalone para validação rápida de layout (Desktop & Mobile).

### 4. 📖 Guias Operacionais & Colaboração
* [**Guia de Git & Branches para Desenvolvedores**](Guia-Git-Branches-Junior.md): Padrões de branch (`feature/<id>-desc`), fluxo de trabalho com a branch `dev`, comandos para Windows/Linux e abertura de Pull Requests.
* [**Guia de Suporte com Especialistas de IA no Trello**](Guia-Comunicacao-Agentes-Devs-Junior.md): Manual de suporte nos cards do Trello, catálogo de especialistas (@dijkstra, @peter, @aria, @iris, @qa, @atlas) e esclarecimento de dúvidas.

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
