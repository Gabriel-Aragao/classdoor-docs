# 🚀 04. Planejamento de Sprints e Roadmap de Entregas — Classdoor

**Projeto:** Classdoor  
**Metodologia:** Bot-Agile (Ciclos Semanais de Quarta a Quarta)  
**Estratégia de Engenharia:** **Frontend-First (100% Client-Side com Dados Mockados)**  
**Data de Início:** Quarta-feira, 02 de Setembro de 2026  
**Responsável pelo Planejamento:** @Atlas (Product Manager)  
**Supervisão Técnica:** @Dijkstra (Tech Lead)  
**UI/UX Design:** @Iris  
**Stakeholder / CTO & PO:** @domaragao  

---

## 1. Diretriz Estratégica: Frontend-First & Mocks de Cliente

Conforme determinação do CTO/PO (@domaragao):
1. **Foco 100% no Frontend:** O desenvolvimento do MVP é iniciado exclusivamente pela camada cliente em **React 19 + Bootswatch Flatly (Bootstrap 5)**.
2. **Backends Mockados no Cliente:** Não haverá tarefas de Backend até alinhamento prévio. Todas as integrações de rede, autenticação, catálogo de professores, submissão de reviews e dashboards analíticos serão atendidos por serviços simulados (`mockAuthService.js`, `mockProfessorService.js`, `mockReviewService.js`, `mockDashboardService.js`) com persistência em memória e `localStorage`.
3. **Backlog Aberto e Dinâmico:** As tarefas no Trello não possuem atribuição prévia fixa, permitindo que os desenvolvedores juniores (@andreyrian3 e @jenniferrebecaalvesdebarros) e os agentes especialistas puxem os cards dinamicamente.

---

## 2. Cronograma Geral das Sprints (Quarta a Quarta)

```text
Sprint 1: 02/09/2026 a 09/09/2026 — Autenticação Mockada & Telas de Onboarding (US01, US02)
Sprint 2: 09/09/2026 a 16/09/2026 — Tela Principal / Home & Catálogo de Busca Mockado (US03)
Sprint 3: 16/09/2026 a 23/09/2026 — Perfis Detalhados, Motor de Avaliações & Mocks de Reviews (US04, US05, US06, US07)
Sprint 4: 23/09/2026 a 30/09/2026 — Painel Docente, Dashboard Analítico & Homologação MVP Frontend (US08, US09)
```

---

## 3. Detalhamento Executivo dos Cards da Sprint 1 (Ativos no Trello)

### 🚀 Sprint 1: Autenticação Mockada & Telas de Onboarding (US01, US02)
* **Período:** 02/09/2026 (Qua) a 09/09/2026 (Qua)  
* **Objetivo:** Implementar o fluxo completo de Cadastro, Login e Recuperação de Senha no React 19 (Bootswatch Flatly), integrado a uma camada de serviços de autenticação simulada no cliente com persistência no `localStorage`.

---

#### 📌 Card 004: `004 - [Frontend] Serviço de Autenticação Mockado e Estado Global de Sessão (US01 & US02)`
* **User Stories Relacionadas:** US01 & US02
* **Entregáveis:**
  * `src/services/mockAuthService.js`: Funções de cadastro, login com credenciais simuladas, validação de e-mail duplicado e despacho mockado de recuperação de senha com delay simulado (`setTimeout` 300ms).
  * `src/store/userStore.js`: Store global em Zustand com persistência automática de sessão no `localStorage` (armazenando token JWT simulado, dados do usuário e método `logout()`).
* **Critérios de Aceitação:**
  1. Suporte a papéis `STUDENT` e `PROFESSOR`.
  2. Persistência de novos usuários cadastrados no `localStorage` durante a sessão.
  3. Emissão de erros simulados em formato RFC 7807 (`ProblemDetail`).

---

#### 📌 Card 005: `005 - [Frontend] Tela e Fluxo de Cadastro de Usuário com Mock (US01)`
* **User Story Relacionada:** US01
* **Entregáveis:**
  * Rota `/register` com componente `RegisterPage.jsx`.
  * Formulário responsivo (Desktop 1440px e Mobile 390px conforme prancheta `1B` do Figma).
  * Validação visual em tempo real (Nome, E-mail institucional, Senha forte com confirmação e seletor de perfil `Estudante` / `Professor`).
* **Critérios de Aceitação:**
  1. Integração com `mockAuthService.register()`.
  2. Exibição de alertas de erro ou sucesso via classes Bootswatch Flatly.
  3. Redirecionamento automático para a tela de Login (`/login`) após cadastro bem-sucedido.

---

#### 📌 Card 006: `006 - [Frontend] Tela e Fluxo de Login e Recuperação de Senha com Mock (US02)`
* **User Story Relacionada:** US02
* **Entregáveis:**
  * Rota `/login` com componente `LoginPage.jsx`.
  * Formulário de autenticação com campos de E-mail, Senha e checkbox "Lembrar de mim" (conforme pranchetas `1A` e `1C` do Figma).
  * Modal ou fluxo dedicado para "Esqueci minha senha" com disparo de link simulado.
* **Critérios de Aceitação:**
  1. Integração com `mockAuthService.login()` e atualização da `userStore`.
  2. Redirecionamento automático para a Home (`/`) após login com sucesso.
  3. Botão de Logout integrado na Navbar limpando o estado global de sessão.

---

#### 📌 Card 007: `007 - [QA] Validação de Testes dos Fluxos de Autenticação Mockados (US01 & US02)`
* **User Stories Relacionadas:** US01 & US02
* **Entregáveis:**
  * Relatório de validação de qualidade e homologação visual contra as pranchetas `1A`, `1B` e `1C` do Figma (Desktop 1440px e Mobile 390px).
  * Cobertura de testes dos cenários de fluxo feliz e exceções (campos vazios, e-mail inválido, credenciais incorretas).
* **Critérios de Aceitação:**
  1. Build limpo (`npm run build` e `npm run lint` 100% verdes).
  2. **Aprovação exclusiva do @qa** para autorizar o merge dos Pull Requests na branch `dev`.

---

## 4. Visão Geral das Próximas Sprints do MVP Frontend

### 🌟 Sprint 2 (09/09 a 16/09): Home & Catálogo de Busca
* **Foco:** US03 (Tela Principal e Busca Global).
* **Entregáveis:** `mockProfessorService.js`, Hero Section com campo de busca centralizado com debounce, filtros dinâmicos por departamento/período e grid responsivo de cards de professores e disciplinas.

### 🌟 Sprint 3 (16/09 a 23/09): Perfis Acadêmicos & Motor de Avaliações
* **Foco:** US04, US05, US06, US07 (Perfis Detalhados, Reviews e Upvotes).
* **Entregáveis:** `mockReviewService.js`, página de perfil com métricas e histograma de estrelas, modal de avaliação com toggle de anonimato (`🛡️ 100% Anônimo` vs nominal) e interação de Upvote ("Útil 👍") com idempotência.

### 🌟 Sprint 4 (23/09 a 30/09): Gestão Docente, Analytics & Homologação MVP
* **Foco:** US08 e US09 (Painel Docente e Dashboard Analítico).
* **Entregáveis:** `mockDashboardService.js`, tela de gerenciamento de turmas com alternância de políticas (`Somente Anônimo` vs `Permitir Identificado`), dashboard com gráficos de evolução semestral e homologação final do MVP Frontend.

---

## 5. Governança e Regras de Entrega no Trello

1. **Atribuição Dinâmica:** Desenvolvedores e agentes puxam os cards diretamente da coluna *To Do* para *In Progress*.
2. **Identificação de Menções:** Comentários com `@Nome (Função)` em qualquer dúvida ou atualização de status.
3. **Fluxo de Merge:** Branch individual (`feat/<id>-<desc>`) ➔ PR apontando para `dev` ➔ Validação e aprovação do **@qa** ➔ Merge autorizado na `dev`.
