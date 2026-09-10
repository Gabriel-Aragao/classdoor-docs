# 🧭 01. Visão Geral, Metadados e Governança do Projeto — Classdoor

**Projeto:** Classdoor  
**Documento:** Visão Executiva, Metadados de Engenharia, Git Flow e Políticas de Governança  
**Versão:** 1.0.0  
**Status:** Desenvolvimento Ativo (MVP Frontend-First com Mocks)  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  

---

## 1. Visão do Produto & Objetivos

O **Classdoor** é uma plataforma acadêmica colaborativa inspirada no modelo do *Glassdoor / RateMyProfessors*, projetada para proporcionar transparência pedagógica, engajamento e aprimoramento contínuo no ambiente universitário. A plataforma permite que estudantes avaliem disciplinas e docentes com garantia absoluta de anonimato como padrão (**Privacy by Design**), enquanto fornece aos professores e coordenadores painéis analíticos consolidados sobre o desempenho didático.

### 1.1 Pilares Centrais do Produto
1. **Transparência Acadêmica:** Auxiliar discentes na escolha de disciplinas e docentes com base em métricas reais de didática, nível de exigência, critérios de prova e pontualidade.
2. **Segurança e Privacidade por Padrão:** Proteção integral da identidade do aluno eliminando qualquer risco de retaliação acadêmica.
3. **Feedback Construtivo para Docentes:** Entrega de métricas estruturadas e tendências temporais semestrais para apoiar o aperfeiçoamento didático.
4. **Governança Parametrizável de Turmas:** Flexibilidade para que o docente defina se recebe avaliações estritamente anônimas ou nominais consentidas.

---

## 2. Metadados e Ecossistema de Repositórios

| Repositório | Escopo / Finalidade | Stack Principal |
| :--- | :--- | :--- |
| **`Gabriel-Aragao/classdoor-docs`** | Documentação técnica, requisitos, contratos e specs. | Markdown, DBML, PlantUML |
| **`Gabriel-Aragao/classdoor-frontend`** | Aplicação cliente Single Page Application (SPA). | React 19, Bootswatch Flatly, Zustand, Vite |
| **`Gabriel-Aragao/classdoor-backend`** | API RESTful e motor de persistência transacional. | Spring Boot 3.3+, Java 21, PostgreSQL 16+ |

### 2.1 Fonte Única da Verdade para Design (Figma SSOT)
* **Link Oficial:** [Classdoor no Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)
* **Diretriz de Design:** O workspace oficial do **Figma** é a **Fonte Única da Verdade (Single Source of Truth)** para todos os fluxos, layouts Desktop (1440px), Mobile (390px), tokens visuais e biblioteca de componentes reutilizáveis. O modelo legado no Penpot foi 100% descontinuado.

---

## 3. Matriz de Stakeholders e Catálogo de Agentes

| Papel / Especialidade | Handle | Tipo | Atribuições Principais |
| :--- | :--- | :---: | :--- |
| **CTO & Product Owner** | `@domaragao` | Humano | Direcionamento estratégico, aprovação arquitetural e validação de escopo. |
| **Tech Lead & Arquiteto** | `@dijkstra` | Agente IA | Arquitetura técnica, padrões de código, ADRs, contratos de API e mentoria. |
| **Product Manager (PM)** | `@atlas` | Agente IA | Gestão do backlog, coordenação de sprints, histórias e comunicação. |
| **Frontend Sênior** | `@aria` | Agente IA | Engenharia cliente em React 19, componentes Bootswatch e fluxos de tela. |
| **Backend Sênior** | `@peter` | Agente IA | Serviços Spring Boot 3, controladores REST, DTOs e segurança JWT. |
| **UI/UX Designer** | `@iris` | Agente IA | Design System, protótipos navegáveis no Figma e tokens visuais. |
| **Analista de Requisitos** | `@ada` | Agente IA | Elicitação de regras de negócio, casos de uso e rastreabilidade RF/RNF. |
| **DBA & Arquiteto de Dados** | `@codd` | Agente IA | Modelagem relacional 3FN, migrations, integridade ACID e queries SQL. |
| **QA Sênior Full Stack** | `@qa` | Agente IA | Homologação de critérios de aceite, automação de testes e gate de merge. |
| **Hub de Comunicação** | `@hermes` | Agente IA | Mensageria central, secretariado e roteamento de notificações. |
| **Devs Júnior** | `@andreyrian3`<br>`@jenniferrebecaalvesdebarros` | Humanos | Implementação das tasks e cards do backlog no frontend e backend. |

---

## 4. Governança de Código, Git Flow e Políticas de Equipe

### 4.1 Modelo de Branches (Git Flow Simplificado)
Para garantir isolamento, rastreabilidade e estabilidade nas entregas:
1. **`main` (Produção):** Código estável e homologado. Commits diretos na `main` são estritamente bloqueados.
2. **`dev` (Integração Contínua):** Branch central de desenvolvimento. **Todas as novas features saem da `dev` e retornam para a `dev` via Pull Request**.
3. **`feat/<id>-<descricao-curta>` (Feature Branches):** Branches individuais de trabalho criadas a partir da `dev` (ex: `feat/005-tela-login`, `feat/006-cadastro-usuario`).

```text
       (Início da Task)
 [dev] ───────────────> [feat/005-tela-login]
   │                               │
   │                        (Desenvolvimento & Testes)
   │                               │
   │                          (Abertura de PR)
   │                               ▼
 [dev] <────────── (Gate Exclusivo: Aprovação @qa) ┘
```

### 4.2 Padrões de Commit
* **Agentes Especialistas de IA:** Padrão obrigatório `[agente] - mensagem` (ex: `[dijkstra] - atualiza especificacao de specs`).
* **Desenvolvedores Humanos:** Padrão **Conventional Commits** identificado pela conta GitHub (ex: `feat(auth): adicionar validacao bootswatch`, `fix(ui): ajustar layout do mobile`).

### 4.3 Padrão de Abertura de Pull Request (PR)
* **Target Base:** Sempre a branch **`dev`** (*nunca a `main`*).
* **Título do PR:** `[<ID>] Título descritivo da tarefa` (ex: `[005] Implementação da Tela de Login`).
* **Estrutura Obrigatória da Descrição:**
  ```markdown
  ## 📌 Resumo da Entrega
  Implementação da tela de login utilizando React 19 e componentes Bootswatch Flatly.

  ## ✅ Critérios de Aceite Atendidos
  - [x] Formulário com campos de E-mail, Senha e Lembrar-me
  - [x] Validação visual de campos obrigatórios
  - [x] Integração com mockAuthService
  - [x] npm run build e testes aprovados
  ```

### 4.4 Política Exclusiva de Review e Merge (Gatekeeper @qa)
* O **@qa** é o **único reviewer obrigatório** com autoridade para aprovar cards no Trello e autorizar merges de PRs na branch `dev`.
* O merge exige: (1) Aprovação explícita do `@qa` + (2) 100% das suites de CI/CD verdes.
* O Tech Lead (`@dijkstra`) atua em arquitetura estratégica, ADRs e decisões transversais, sem necessidade de aprovação individual de cada PR.

### 4.5 Comunicação no Trello (Board Dac / Classdoor)
* Todas as mensagens nos cards do Trello devem iniciar obrigatoriamente com o identificador formal `@Nome (Função)` (ex: `@Dijkstra (Tech Lead)`, `@Peter (Backend)`, `@QA (QA Sênior)`).

---

## 5. Índice e Guia dos Documentos da Pasta `specs/`

Para aprofundamento em cada dimensão técnica do projeto, consulte os documentos dedicados da pasta `specs/`:

* 🏛️ **[02. Arquitetura, Contratos, Dados e Design System](02-Arquitetura-Contratos-e-Design-System.md):**  
  Especificação completa da stack React 19 / Spring Boot 3, modelo lógico relacional (PostgreSQL 3FN/ACID), cálculo de hash de anonimato, contratos RESTful (endpoints, payloads, RFC 7807) e catálogo de Design Tokens / Vitrine de Ícones do Figma.
* 📋 **[03. Catálogo de Requisitos e User Stories](03-Requisitos-e-User-Stories.md):**  
  Detalhamento dos requisitos funcionais (RF01 a RF16) com priorização MoSCoW, requisitos não-funcionais (RNF01 a RNF06) e especificação completa das User Stories (US01 a US09) com critérios BDD.
* 🚀 **[04. Planejamento de Sprints e Roadmap](04-Planejamento-Sprints-e-Roadmap.md):**  
  Cronograma semanal das Sprints 1 a 4, estratégia Frontend-First com mocks de cliente e detalhamento executivo dos cards ativos da Sprint 1 (Cards 004, 005, 006 e 007).
