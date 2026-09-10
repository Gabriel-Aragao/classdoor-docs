# 📋 Especificações Oficiais do Projeto (Project Specs) — Classdoor

**Projeto:** Classdoor  
**Documento:** Especificação Técnica, Funcional e Arquitetural Centralizada (SSOT de Engenharia)  
**Versão:** 1.0.0  
**Status:** Desenvolvimento Ativo (MVP Frontend-First com Mocks)  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  

---

## 1. Visão Geral & Metadados do Projeto

### 1.1 Descrição
O **Classdoor** é uma plataforma acadêmica colaborativa de avaliação e feedback pedagógico de disciplinas e docentes com garantia de **anonimato por padrão (*Privacy by Design*)**, inspirada no modelo *Glassdoor / RateMyProfessors*.

### 1.2 Repositórios Oficiais
* **Documentação & Engenharia:** `Gabriel-Aragao/classdoor-docs`
* **Frontend (React 19):** `Gabriel-Aragao/classdoor-frontend`
* **Backend (Spring Boot 3):** `Gabriel-Aragao/classdoor-backend`

### 1.3 Fonte Única da Verdade para Design (Figma SSOT)
* **Link Oficial:** [Classdoor no Figma](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0)
* **Diretriz:** O Figma é a Fonte Única da Verdade oficial para todos os layouts Desktop (1440px), Mobile (390px), biblioteca de componentes e tokens de design. O Penpot foi 100% descontinuado.

### 1.4 Matriz de Stakeholders e Agentes

| Papel | Agente / Identificador | Responsabilidade |
| :--- | :--- | :--- |
| **CTO & Product Owner** | `@domaragao` | Direcionamento estratégico, aprovações de arquitetura e priorização. |
| **Tech Lead & Arquiteto** | `@dijkstra` | Arquitetura técnica, padrões de engenharia, ADRs e mentoria. |
| **Product Manager (PM)** | `@atlas` | Gestão de escopo, coordenação de sprints e refinamento de histórias. |
| **Frontend Sênior** | `@aria` | Engenharia da camada cliente em React 19 e Bootswatch. |
| **Backend Sênior** | `@peter` | Engenharia da API RESTful em Spring Boot 3 e Java 21. |
| **UI/UX Designer** | `@iris` | Design System, prototipagem, tokens visuais e telas no Figma. |
| **Analista de Requisitos** | `@ada` | Elicitação, modelagem de regras de negócio e casos de uso. |
| **DBA & Arquiteto de Dados** | `@codd` | Modelagem relacional 3FN, índices, queries e integridade ACID. |
| **QA Sênior Full Stack** | `@qa` | Qualidade, testes automatizados e aprovação exclusiva de PRs/cards. |
| **Hub de Comunicação** | `@hermes` (Friday) | Mensageria central, secretariado e orquestração de entregas. |

---

## 2. Princípios e Diretrizes Arquiteturais

### 2.1 Princípios Fundamentais
1. **Privacidade por Design (*Privacy by Design*):** Nenhuma chave estrangeira de usuário (`user_id`, `student_id`) ou dado de conexão (IP, User-Agent) é vinculado publicamente à avaliação anônima.
2. **Mecanismo Antifraude de Unicidade ($O(1)$):** A regra de "uma avaliação por aluno/turma" é garantida sem quebra de sigilo através do cálculo unilateral:
   $$\text{audit\_hash} = \text{HMAC-SHA256}(\text{APP\_PEPPER}, \text{user\_id} \mathbin{\Vert} \text{class\_id})$$
   persistido com constraint `UNIQUE(audit_hash)`.
3. **Estratégia *Frontend-First* com Mocks:** Entrega inicial do MVP focada no cliente com serviços simulados (`mockAuthService.js`, `mockProfessorService.js`, etc.) e persistência em `localStorage`.
4. **Padronização de Erros RESTful (RFC 7807):** Toda resposta de erro da API segue rigorosamente a especificação `ProblemDetail`.

### 2.2 Stack do Frontend
* **Framework:** React 19 (Single Page Application).
* **Linguagem:** JavaScript Puro (ESNext / JSX) — *Diretriz: Sem TypeScript*.
* **Build Tool:** Vite 5+.
* **Estilização & UI:** Bootstrap 5 integrado com o tema **Bootswatch Flatly**.
* **Ícones:** **Bootstrap Icons (`bi-*`)** monocromáticos (*proibido o uso de emojis do SO na interface/código*).
* **Estado Global:** Zustand (stores modulares com persistência em `localStorage`).
* **Cache & Server State:** `@tanstack/react-query` v5.
* **Roteamento:** `react-router-dom` v6+.
* **Formulários & Schemas:** `react-hook-form` + validação com `zod` ou `yup`.
* **Cliente HTTP:** `axios` com interceptores centralizados para JWT e captura de RFC 7807.

#### Estrutura Modular de Diretórios (`src/`):
```text
src/
├── app/                  # Configuração de providers, rotas e App.jsx
├── assets/               # SVGs, imagens e fontes estáticas
├── components/           # Componentes reutilizáveis Bootstrap/Bootswatch
│   ├── ui/               # Button.jsx, Input.jsx, Card.jsx, Modal.jsx, Badge.jsx
│   ├── layout/           # Navbar.jsx, Footer.jsx, Sidebar.jsx, Container.jsx
│   └── feedback/         # RatingStars.jsx, DifficultyMeter.jsx, AlertMessage.jsx
├── features/             # Módulos verticais de negócio (auth, professors, courses, reviews, dashboard)
├── hooks/                # Custom hooks utilitários globais
├── services/             # Instância Axios e mocks (mockAuthService, mockProfessorService, etc.)
├── store/                # Stores do Zustand (userStore.js, filterStore.js)
├── styles/               # index.scss / index.css com importação do Bootswatch Flatly
└── utils/                # Formatadores, helpers e sanitizadores
```

### 2.3 Stack do Backend
* **Framework:** Spring Boot 3.3+ sobre **Java 21 (LTS)**.
* **Segurança:** Spring Security 6 com autenticação Stateless via JWT.
* **Criptografia:** BCrypt (custo 12) / Argon2id para senhas de usuários.
* **Validação:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, etc.).
* **Tratamento de Exceções:** `@RestControllerAdvice` retornando `ProblemDetail` (RFC 7807).
* **Documentação:** SpringDoc OpenAPI 3.1 (`/v3/api-docs`).

### 2.4 Banco de Dados & Infraestrutura
* **SGBD:** PostgreSQL 16+ modelado na 3ª Forma Normal (3FN).
* **Integridade:** Transações ACID com isolamento padrão.
* **Servidor Alvo:** VPS Oracle Linux configurada pelo CTO.
* **Conteinerização:** Docker & Docker Compose.
* **CI/CD:** GitHub Actions (Lint, Testes, Build, Deploy).

---

## 3. Governança, Git Flow e Políticas de Equipe

### 3.1 Modelo de Branches (Git Flow Simplificado)
* **`main`:** Produção estável e homologada. Commits diretos são estritamente proibidos.
* **`dev`:** Branch principal de desenvolvimento e integração contínua.
* **`feat/<id>-<descricao-curta>`:** Branch de trabalho criada a partir de `dev` (ex: `feat/005-tela-login`).

### 3.2 Convenções de Commit e Pull Request
* **Agentes de IA:** `[agente] - mensagem` (ex: `[dijkstra] - adiciona project-specs.md`).
* **Desenvolvedores:** Conventional Commits (ex: `feat(auth): adicionar validacao bootswatch`).
* **Título do PR:** `[<ID>] Título descritivo da tarefa` (ex: `[005] Implementação da Tela de Login`).

### 3.3 Política de Review e Merge
* **Gate Exclusivo:** O **@qa** é o **único reviewer obrigatório** para aprovar cards no Trello e autorizar merges de Pull Requests na branch `dev`.
* **Critério de Merge:** Aprovação explícita do `@qa` + 100% dos checks de CI (build e testes) verdes.

### 3.4 Comunicação no Trello
* Formato obrigatório de menção: `@Nome (Função)` (ex: `@Dijkstra (Tech Lead)`, `@Peter (Backend)`, `@Aria (Frontend)`, `@QA (QA Sênior)`).

---

## 4. Catálogo de Requisitos

### 4.1 Requisitos Funcionais (RF — MoSCoW)

| ID | Módulo | Descrição do Requisito | Prioridade | User Story | Caso de Uso |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **RF01** | Autenticação | Cadastro com nome, e-mail institucional (`@edu` / `@universidade.br`), senha e perfil (`Estudante` ou `Professor`). | **MUST** | US01 | UC01 |
| **RF02** | Autenticação | Login de usuários existentes com geração de token JWT de sessão. | **MUST** | US02 | UC02 |
| **RF03** | Autenticação | Solicitação de recuperação de senha com envio de link/token com expiração de 30 min. | **MUST** | US02 | UC03 |
| **RF04** | Autenticação | Encerramento seguro da sessão ativa (Logout). | **MUST** | US02 | UC04 |
| **RF05** | Busca & Catálogo | Busca global textual com auto-complete e debounce para professores e disciplinas na Home. | **MUST** | US03 | UC05 |
| **RF06** | Busca & Catálogo | Filtragem avançada por departamento, período letivo e nota média (1 a 5 estrelas). | **SHOULD** | US03 | UC06 |
| **RF07** | Busca & Catálogo | Destaques pedagógicos na Home ("Professores Mais Bem Avaliados" e "Disciplinas Populares"). | **SHOULD** | US03 | UC05 |
| **RF08** | Perfis Acadêmicos | Página de perfil do docente com nota geral, dificuldade, recomendação (%) e histograma. | **MUST** | US04 | UC07 |
| **RF09** | Perfis Acadêmicos | Página da disciplina com ementa, créditos, média histórica e docentes vinculados. | **MUST** | US04 | UC07 |
| **RF10** | Motor de Avaliação | Envio de avaliação: nota geral (1-5), dificuldade (1-5), recomendação (Sim/Não), tags e comentário ($\ge 20$ chars). | **MUST** | US05 | UC08 |
| **RF11** | Motor de Avaliação | Expurgo preventivo e desassociação total de qualquer dado de identificação do autor em reviews anônimas. | **MUST** | US05 | UC11 |
| **RF12** | Motor de Avaliação | Envio de avaliação nominal quando autorizada na política da turma e com consentimento expresso. | **COULD** | US06 | UC09 |
| **RF13** | Moderação & Interação| Voto de utilidade ("Útil" 👍 / Upvote) em avaliações com limite de 1 voto por usuário/review. | **SHOULD** | US07 | UC10 |
| **RF14** | Gestão Docente | Configuração de política de avaliação da turma pelo docente (`Somente Anônimo` vs `Permitir Identificado`). | **SHOULD** | US08 | UC12 |
| **RF15** | Analytics Docente | Dashboard com série temporal semestral de médias e nuvem de tags pedagógicas. | **SHOULD** | US09 | UC13 |
| **RF16** | Analytics Docente | Exportação de relatórios analíticos de desempenho docente nos formatos CSV e PDF. | **COULD** | US09 | UC14 |

### 4.2 Requisitos Não-Funcionais (RNF)

| ID | Categoria | Métrica / Critério de Aceitação |
| :--- | :--- | :--- |
| **RNF01** | **Segurança & Privacidade** | Criptografia de senhas via BCrypt (custo 12) / Argon2id; autenticação JWT stateless; HTTPS/TLS 1.3 obrigatório; anonimato garantido por hash HMAC-SHA256 isolado. |
| **RNF02** | **Desempenho** | Tempo de resposta para consultas de catálogo, busca e leitura de perfis: $P_{95} < 300\text{ms}$ sob carga nominal. |
| **RNF03** | **Responsividade & UI** | 100% de aderência ao Figma SSOT nos viewports Desktop (1440px) e Mobile (390px), com tema Bootswatch Flatly. |
| **RNF04** | **Disponibilidade & Integridade** | PostgreSQL 16+ em 3FN, transações ACID e índices otimizados para consultas compostas. |
| **RNF05** | **Acessibilidade (A11y)** | Conformidade WCAG 2.1 AA (contraste $\ge 4.5:1$ em texto normal, $\ge 3:1$ em títulos; navegação completa por teclado). |
| **RNF06** | **Compatibilidade** | Suporte sem falhas nos principais navegadores modernos (Chrome, Firefox, Safari e Edge). |

---

## 5. Especificação Detalhada das User Stories (US01 a US09)

### US01: Criação de Conta / Cadastro de Usuário
* **Como** estudante ou professor
* **Quero** criar uma conta no Classdoor informando meus dados e e-mail institucional
* **Para que** eu possa acessar a plataforma de forma segura e autenticada.
* **Critérios de Aceite:**
  1. Formulário com: Nome completo, E-mail institucional (@universidade.edu / @instituicao.br), Senha (mínimo 8 caracteres com regras de complexidade) e Tipo de Perfil (`Estudante` ou `Professor`).
  2. Validação visual em tempo real com classes e alertas Bootswatch Flatly.
  3. Tratamento de e-mails duplicados com mensagem amigável via RFC 7807.
  4. Redirecionamento automático para a tela de login após cadastro com sucesso.
* **Endpoints:** `POST /api/v1/auth/register`

---

### US02: Autenticação / Login & Recuperação de Senha
* **Como** usuário cadastrado
* **Quero** realizar login com e-mail e senha ou recuperar minha senha caso a esqueça
* **Para que** eu acesse as funcionalidades protegidas e recupere meu acesso de forma segura.
* **Critérios de Aceite:**
  1. Formulário com E-mail, Senha e checkbox "Lembrar de mim".
  2. Autenticação baseada em token JWT com claims de permissão (`ROLE_STUDENT` ou `ROLE_PROFESSOR`).
  3. Modal de "Esqueci minha senha" com geração de token temporário válido por 30 minutos.
  4. Botão de Logout acessível na Navbar em qualquer tela autenticada, limpando a sessão.
* **Endpoints:** `POST /api/v1/auth/login`, `POST /api/v1/auth/forgot-password`

---

### US03: Tela Principal (Home) e Busca Global
* **Como** estudante ou visitante
* **Quero** acessar a Home do Classdoor e pesquisar por professores ou disciplinas com filtros
* **Para que** eu encontre rapidamente o que desejo consultar e veja os destaques acadêmicos.
* **Critérios de Aceite:**
  1. Hero section com campo de busca centralizado com debounce (300ms).
  2. Filtros dinâmicos por Tipo (`Professor` ou `Disciplina`), Departamento e Semestre Letivo.
  3. Grid responsivo de cards com Foto/Avatar, Nome, Departamento, Nota Média (1-5) e Total de Avaliações.
  4. Seções de "Professores em Destaque" e "Disciplinas Mais Avaliadas".
  5. Empty state amigável quando nenhum resultado for encontrado.
* **Endpoints:** `GET /api/v1/professors`, `GET /api/v1/courses`, `GET /api/v1/home/featured`

---

### US04: Visualização de Perfil do Professor / Disciplina
* **Como** estudante ou docente
* **Quero** acessar a página de perfil detalhada de um professor ou disciplina
* **Para que** eu consulte o histórico de avaliações, indicadores pedagógicos consolidados e opiniões.
* **Critérios de Aceite:**
  1. Cabeçalho com Nome, Departamento, Titulação, Nota Geral (1-5), Nível de Dificuldade (1-5) e % de Recomendação.
  2. Distribuição de avaliações em barras de progresso com percentual por estrela (1 a 5).
  3. Badges com as tags pedagógicas mais votadas.
  4. Feed de avaliações com ordenação por "Mais Recentes", "Melhor Avaliadas" e "Mais Úteis".
* **Endpoints:** `GET /api/v1/professors/{id}`, `GET /api/v1/courses/{id}`, `GET /api/v1/reviews`

---

### US05: Envio de Avaliação 100% Anônima (Padrão)
* **Como** estudante autenticado
* **Quero** avaliar um professor ou disciplina de forma estritamente anônima
* **Para que** eu emita meu feedback sincero sem qualquer risco de retaliação acadêmica.
* **Critérios de Aceite:**
  1. Formulário modal/página com Nota Geral (1-5), Dificuldade (1-5), Recomendação (Sim/Não), até 3 tags pedagógicas e comentário ($\ge 20$ e $\le 1000$ caracteres).
  2. Badge destacado `🛡️ 100% Anônimo` visível durante todo o preenchimento.
  3. Expurgo de `user_id`/IP na persistência da avaliação pública; unicidade garantida por `audit_hash` HMAC-SHA256.
  4. Exibição do autor no feed público estaticamente como `"Estudante Anônimo"`.
* **Endpoints:** `POST /api/v1/reviews`

---

### US06: Envio de Avaliação Nominal (Opcional)
* **Como** estudante autenticado
* **Quero** enviar uma avaliação nominal quando expressamente permitido pela política da turma
* **Para que** meu feedback assinado contribua para o reconhecimento do trabalho docente.
* **Critérios de Aceite:**
  1. Habilitado apenas se a turma possuir política `ALLOW_IDENTIFIED`.
  2. Checkbox obrigatório de consentimento expresso.
  3. Exibição do nome público do estudante no card da avaliação.
* **Endpoints:** `POST /api/v1/reviews`

---

### US07: Interação de Voto Útil (Upvote) em Avaliações
* **Como** estudante autenticado
* **Quero** marcar uma avaliação como útil
* **Para que** feedbacks construtivos e relevantes ganhem destaque.
* **Critérios de Aceite:**
  1. Botão "Útil 👍 (N)" em cada card de review.
  2. Controle de debounce e bloqueio de múltiplos votos pelo mesmo usuário (idempotência relacional).
* **Endpoints:** `POST /api/v1/reviews/{id}/useful`

---

### US08: Gestão de Turmas e Políticas de Avaliação pelo Professor
* **Como** professor autenticado
* **Quero** gerenciar minhas turmas e definir a política de privacidade das avaliações
* **Para que** eu escolha se receberei apenas avaliações anônimas ou também nominais.
* **Critérios de Aceite:**
  1. Listagem das disciplinas e turmas ativas vinculadas ao docente.
  2. Seletor de política: `Somente Anônimo (Padrão)` ou `Permitir Identificado`.
  3. Notificação visual de confirmação ao atualizar a regra.
* **Endpoints:** `PATCH /api/v1/courses/{courseId}/classes/{classId}/policy`

---

### US09: Dashboard Analítico de Satisfação e Relatórios
* **Como** professor ou coordenador
* **Quero** acompanhar gráficos de evolução pedagógica e exportar relatórios
* **Para que** eu visualize pontos fortes, oportunidades de melhoria e dados históricos.
* **Critérios de Aceite:**
  1. Gráficos de evolução temporal semestral das notas médias.
  2. Painel comparativo de distribuição de estrelas e taxa de recomendação.
  3. Ranking e nuvem de tags pedagógicas mais votadas.
  4. Exportação dos dados analíticos em CSV e PDF.
* **Endpoints:** `GET /api/v1/professors/{id}/analytics`

---

## 6. Contratos de Dados e Regras de API (RESTful)

### 6.1 Mapeamento Geral de Endpoints

| Método | Endpoint | US | Auth / Role | Status Sucesso | Descrição |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `POST` | `/api/v1/auth/register` | US01 | Pública | `201 Created` | Criação de conta institucional discente/docente. |
| `POST` | `/api/v1/auth/login` | US02 | Pública | `200 OK` | Autenticação com retorno de JWT e dados de perfil. |
| `POST` | `/api/v1/auth/forgot-password` | US02 | Pública | `200 OK` | Disparo de link de recuperação de acesso. |
| `GET` | `/api/v1/professors` | US03 | Pública | `200 OK` | Busca paginada de docentes com filtros. |
| `GET` | `/api/v1/courses` | US03 | Pública | `200 OK` | Busca paginada de disciplinas com filtros. |
| `GET` | `/api/v1/home/featured` | US03 | Pública | `200 OK` | Docentes e disciplinas em destaque na Home. |
| `GET` | `/api/v1/professors/{id}` | US04 | Pública | `200 OK` | Perfil do docente com agregados estatísticos. |
| `GET` | `/api/v1/courses/{id}` | US04 | Pública | `200 OK` | Perfil detalhado da disciplina e histórico. |
| `GET` | `/api/v1/reviews` | US04 | Pública | `200 OK` | Feed público paginado de avaliações. |
| `POST` | `/api/v1/reviews` | US05/06 | `ROLE_STUDENT` | `201 Created` | Submissão de avaliação (anônima ou nominal). |
| `POST` | `/api/v1/reviews/{id}/useful` | US07 | Autenticado | `200 OK` | Incremento atômico idempotente de voto útil. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/policy` | US08 | `ROLE_PROFESSOR` | `200 OK` | Alternância de política da turma (`ANONYMOUS_ONLY` vs `ALLOW_IDENTIFIED`). |
| `GET` | `/api/v1/professors/{id}/analytics` | US09 | `ROLE_PROFESSOR` / Admin | `200 OK` | Métricas agregadas e série temporal. |

### 6.2 Estrutura de Erros RFC 7807 (ProblemDetails)
```json
{
  "type": "https://classdoor.acad/errors/unauthorized-domain",
  "title": "Domínio de E-mail Não Autorizado",
  "status": 400,
  "detail": "O cadastro exige e-mail institucional válido (@universidade.edu / @instituicao.br).",
  "instance": "/api/v1/auth/register"
}
```

---

## 7. Design System, Tokens Visuais & Telas do Figma

### 7.1 Paleta de Cores Semântica (Bootswatch Flatly)

| Nome do Token | Valor Hex | RGB | Aplicação no Sistema |
| :--- | :--- | :--- | :--- |
| `primary` | `#2C3E50` | `44, 62, 80` | Navbar institucional, cabeçalhos e botões principais de ação. |
| `success / accent` | `#18BC9C` | `24, 188, 156` | Indicador de anonimato (`🛡️ 100% Anônimo`), aprovações e sucesso. |
| `warning` | `#F39C12` | `243, 156, 18` | Estrelas de avaliação e destaques de catálogo. |
| `danger` | `#E74C3C` | `231, 76, 60` | Alertas de erro e notas baixas de dificuldade. |
| `info` | `#3498DB` | `52, 152, 219` | Badges informativos e ementas. |
| `background` | `#F8F9FA` | `248, 249, 250` | Fundo principal da página. |
| `surface` | `#FFFFFF` | `255, 255, 255` | Cards, modais e containers elevados (`border: 1px solid #E9ECEF`). |

### 7.2 Tipografia (Inter)
* **Família:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Escala:**
  * `H1`: 36px (`2.25rem`) / Peso 700 (Bold)
  * `H2`: 28px (`1.75rem`) / Peso 700 (Bold)
  * `H3`: 20px (`1.25rem`) / Peso 600 (Semi-bold)
  * `Body`: 16px (`1.00rem`) / Peso 400 (Regular)
  * `Small`: 14px (`0.875rem`) / Peso 400 (Regular)
  * `Badge`: 12px (`0.75rem`) / Peso 600 (Semi-bold)

### 7.3 Vitrine Oficial de Ícones (Bootstrap Icons `bi-*`)
* **Autenticação & Segurança:** `bi-mortarboard-fill`, `bi-shield-check`, `bi-shield-lock-fill`, `bi-key-fill`, `bi-envelope-fill`, `bi-check-circle-fill`.
* **Busca & Navegação:** `bi-search`, `bi-funnel-fill`, `bi-person-fill`, `bi-person-badge-fill`, `bi-building`, `bi-arrow-left`.
* **Tags Pedagógicas Oficiais:**
  * Didático: `bi-lightbulb-fill`
  * Provas Justas: `bi-file-earmark-check-fill`
  * Pontualidade: `bi-clock-fill`
  * Trabalho em Grupo: `bi-people-fill`
  * Focado em Projetos: `bi-rocket-takeoff-fill`
  * Carga Exigente: `bi-lightning-charge-fill`
* **Reviews & Analytics:** `bi-star-fill`, `bi-hand-thumbs-up-fill`, `bi-graph-up`, `bi-file-earmark-pdf-fill`, `bi-file-earmark-spreadsheet-fill`, `bi-box-arrow-right`.

### 7.4 Matriz de Telas no Figma (14 Pranchetas Oficiais)
* **Desktop (1440px — Grid 12 colunas):**
  1. `1A. Desktop - Login (US02)` *(Starting Point)*
  2. `1B. Desktop - Cadastro (US01)`
  3. `1C. Desktop - Recuperação de Senha (US02)`
  4. `2. Home & Busca Global (US03)`
  5. `3. Perfil de Docente & Reviews (US04 & US07)`
  6. `4. Modal de Avaliação Anônima & Nominal (US05 & US06)`
  7. `5. Painel Docente & Dashboard (US08 & US09)`
* **Mobile (390px — Mobile-First):**
  1. `1A. Mobile - Login (US02)` *(Starting Point)*
  2. `1B. Mobile - Cadastro de Usuário (US01)`
  3. `1C. Mobile - Recuperação de Senha (US02)`
  4. `2. Mobile - Home & Busca Global (US03)`
  5. `3. Mobile - Perfil Docente & Reviews (US04 & US07)`
  6. `4. Mobile - Modal de Avaliação (US05 & US06)`
  7. `5. Mobile - Painel Docente & Dashboard (US08 & US09)`

---

## 8. Roadmap e Planejamento de Sprints

```
Sprint 1: 02/09 a 09/09 — Autenticação Mockada & Onboarding (US01, US02)
Sprint 2: 09/09 a 16/09 — Home & Catálogo de Busca Mockado (US03)
Sprint 3: 16/09 a 23/09 — Perfis Detalhados, Motor de Avaliações & Mocks (US04, US05, US06, US07)
Sprint 4: 23/09 a 30/09 — Painel Docente, Dashboard Analítico & Homologação MVP (US08, US09)
```

### Cards da Sprint 1 (Ativos no Trello)
* **Card 004:** `[Frontend] Serviço de Autenticação Mockado e Estado Global de Sessão (US01 & US02)` — `mockAuthService.js` e `userStore.js` (Zustand com `localStorage`).
* **Card 005:** `[Frontend] Tela e Fluxo de Cadastro de Usuário com Mock (US01)` — Rota `/register`, `RegisterPage.jsx`, validações visuais e integração com mock.
* **Card 006:** `[Frontend] Tela e Fluxo de Login e Recuperação de Senha com Mock (US02)` — Rota `/login`, `LoginPage.jsx`, modal "Esqueci minha senha" e sessão.
* **Card 007:** `[QA] Validação de Testes dos Fluxos de Autenticação Mockados (US01 & US02)` — Homologação visual contra Figma 1440px/390px e aprovação dos PRs para `dev`.
