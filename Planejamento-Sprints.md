# Planejamento de Sprints — Projeto Classdoor (Frontend-First com Mocks)

**Projeto:** Classdoor  
**Metodologia:** Bot-Agile (Ciclos Semanais de Quarta a Quarta)  
**Estratégia de Engenharia:** **Frontend-First (100% Client-Side com Dados Mockados)**  
**Data de Início:** Quarta-feira, 02 de Setembro de 2026  
**Responsável pelo Planejamento:** @Atlas (Product Manager)  
**Supervisão Técnica:** @Dijkstra (Tech Lead)  
**UI/UX Design:** @Iris  
**Stakeholder / CTO:** @domaragao  

---

## 1. Diretriz Estratégica: Frontend-First & Mocks

Conforme determinação do CTO/PO (@domaragao):
1. **Foco 100% no Frontend:** O desenvolvimento da plataforma é iniciado exclusivamente pelo Frontend em **React 19 + Bootswatch (Bootstrap 5)**.
2. **Backends Mockados:** Não haverá tarefas de Backend até alinhamento prévio. Todas as integrações de rede, autenticação, catálogo de professores, submissão de reviews e dashboards analíticos serão atendidos por serviços simulados (`mockAuthService.js`, `mockProfessorService.js`, `mockReviewService.js`) com persistência em memória / `localStorage`.
3. **Backlog Aberto e Dinâmico:** As tarefas no Trello não possuem atribuição prévia fixa, permitindo que os desenvolvedores juniores não-agentes (@andreyrian3 e @jenniferrebecaalvesdebarros) e os agentes especialistas puxem os cards dinamicamente.

---

## 2. Cronograma das Sprints (Quarta a Quarta)

```
Sprint 1: 02/09/2026 a 09/09/2026 — Autenticação Mockada & Telas de Onboarding (US01, US02)
Sprint 2: 09/09/2026 a 16/09/2026 — Tela Principal / Home & Catálogo de Busca Mockado (US03)
Sprint 3: 16/09/2026 a 23/09/2026 — Perfis Detalhados, Motor de Avaliações & Mocks de Reviews (US04, US05, US06, US07)
Sprint 4: 23/09/2026 a 30/09/2026 — Painel Docente, Dashboard Analítico & Homologação MVP Frontend (US08, US09)
```

---

## 3. Detalhamento dos Cards da Sprint 1 (Ativos no Trello)

### 🚀 Sprint 1: Autenticação Mockada & Telas de Onboarding (US01, US02)
**Período:** 02/09/2026 (Qua) a 09/09/2026 (Qua)  
**Objetivo:** Implementar o fluxo completo de Cadastro, Login e Recuperação de Senha no React 19 (Bootswatch Flatly), integrado a uma camada de serviços de autenticação simulada no cliente com persistência no `localStorage`.

| Card ID | Título do Card | User Story | Entregável / Critérios de Aceite |
| :--- | :--- | :--- | :--- |
| **004** | `004 - [Frontend] Serviço de Autenticação Mockado e Estado Global de Sessão (US01 & US02)` | US01 & US02 | `src/services/mockAuthService.js` (cadastro, login, validações e recuperação simulada) + `src/store/userStore.js` (Zustand com persistência no `localStorage`). |
| **005** | `005 - [Frontend] Tela e Fluxo de Cadastro de Usuário com Mock (US01)` | US01 | Rota `/register` com `RegisterPage.jsx`, seleção de perfil (`Estudante`/`Professor`), validações visuais em tempo real, integração com mock e responsividade Desktop/Mobile. |
| **006** | `006 - [Frontend] Tela e Fluxo de Login e Recuperação de Senha com Mock (US02)` | US02 | Rota `/login` com `LoginPage.jsx`, validações, modal "Esqueci minha senha", integração com mock, persistência de sessão e redirecionamento para a Home. |
| **007** | `007 - [QA] Validação de Testes dos Fluxos de Autenticação Mockados (US01 & US02)` | US01 & US02 | Homologação visual (confronto com Penpot 1440px e 390px), validação de cenários de teste (fluxo feliz e exceções) e aprovação exclusiva dos PRs para a branch `dev`. |

---

## 4. Próximas Sprints do Frontend (Visão Geral)

* **Sprint 2 (Home & Catálogo):** `mockProfessorService.js`, Tela Inicial com Hero Search, filtros por departamento e grid responsivo de cards.
* **Sprint 3 (Perfis & Reviews):** `mockReviewService.js`, Página de Perfil com médias agregadas, Modal de Avaliação Anônima/Nominal e Upvotes em reviews.
* **Sprint 4 (Docência & Dashboard):** `mockDashboardService.js`, Painel do Docente com alternância de políticas de turma e gráficos de evolução temporal.

---

## 5. Governança no Trello (Board Classdoor / Dac)
1. **Atribuição:** Aberta no início do ciclo no Trello.
2. **Comunicação:** Padrão `@Nome (Função)` em todos os comentários.
3. **Git Workflow:** Branch por card (`feature/dac-<id>-descricao`) criada a partir de `dev` -> PR para `dev` -> Aprovação exclusiva pelo **@qa**.
