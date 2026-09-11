# 🏛️ 02. Arquitetura, Contratos de Dados, API RESTful e Design System — Classdoor

**Projeto:** Classdoor  
**Documento:** Especificação Arquitetural de Frontend, Backend, Banco de Dados Relacional, Contratos RESTful e Design System  
**Versão:** 2.0.0 — Revisão de Governança, Proteção de Anonimato e Gestão de Turmas  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  

---

## 1. Princípios Arquiteturais & Pilares de Engenharia

### 1.1 Privacidade por Design (*Privacy by Design* & Blindagem de Anonimato)
1. **Anonimato por Padrão (*Default*):** Todas as avaliações no Classdoor são 100% anônimas. Nenhuma chave estrangeira identificável (`user_id`, `student_id`), endereço IP ou User-Agent é persistido publicamente ou associado à avaliação na visão do professor/comunidade.
2. **Mecanismo Antifraude de Unicidade (Hash Unidirecional O(1)):** Para assegurar a regra de negócio *"um aluno só pode avaliar cada turma uma única vez"* sem registrar a chave do usuário na tabela pública `reviews`, a aplicação computa um hash criptográfico unilateral:
   ```text
   audit_hash = HMAC-SHA256(APP_PEPPER, user_id || class_id)
   ```
   A unicidade estrita é garantida a nível de banco de dados pela constraint `UNIQUE(audit_hash)` no PostgreSQL.
3. **Trava de Adição de Alunos Pós-Primeira Avaliação (Anti-Eliminação):** Uma vez que a primeira avaliação for registrada em uma turma (`reviews_count > 0`), o sistema bloqueia permanentemente a inclusão de novos alunos, impedindo que um docente adicione alunos paulatinamente para identificar autores por eliminação.
4. **Quórum Mínimo de Segurança (>= 5 Alunos):** Nenhuma avaliação é permitida em turmas com menos de 5 alunos matriculados.
5. **Toggle de Liberação de Avaliações:** As turmas iniciam com o toggle de avaliações fechado (`is_evaluation_open = false`). O professor ativa o toggle apenas após concluir a importação em lote dos alunos.
6. **Cegueira de Acesso Docente (*Access Blindness*):** O professor tem acesso exclusivamente à lista de e-mails matriculados e à contagem total de discentes, sem acesso a logs de ativação, último acesso, login na plataforma ou status individual de submissão de review.
7. **Modo Nominal Consentido:** Quando a turma está configurada com a política `ALLOW_IDENTIFIED`, o estudante pode optar por assinar a avaliação com seu nome público mediante consentimento explícito.

### 1.2 Estratégia *Frontend-First* com Mocks
O desenvolvimento do MVP é iniciado pela camada cliente em **React 19 + Bootswatch Flatly**. Todas as integrações de rede, autenticação, catálogo de busca, adição em lote de alunos e submissões são atendidas por serviços simulados (`mockAuthService.js`, `mockProfessorService.js`, `mockReviewService.js`, `mockDashboardService.js`) com persistência em memória e `localStorage`.

---

## 2. Arquitetura do Frontend (React 19)

### 2.1 Stack do Frontend
* **Framework:** React 19 (Single Page Application).
* **Linguagem:** JavaScript Puro (ESNext / JSX) — *Diretriz do CTO: Sem TypeScript*.
* **Build Tool:** Vite 5+.
* **Estilização & UI Kit:** Bootstrap 5 integrado com o tema **Bootswatch Flatly**.
* **Ícones:** **Bootstrap Icons (`bi-*`)** monocromáticos (*proibido o uso de emojis nativos do sistema operacional na interface ou código*).
* **Estado Global:** Zustand (stores enxutas e modulares com persistência em `localStorage`).
* **Server State & Cache:** `@tanstack/react-query` v5.
* **Roteamento:** `react-router-dom` v6+.
* **Formulários & Validação:** `react-hook-form` + validação de schema via `zod` ou `yup`.
* **Cliente HTTP:** `axios` com interceptores para injeção de Bearer Token e captura de erros RFC 7807.

### 2.2 Estrutura Modular de Diretórios (`src/`)
```text
src/
├── app/                  # Providers globais (QueryClient, Router, Theme) e App.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── routes.jsx
├── assets/               # Imagens, SVGs e fontes
├── components/           # Componentes reutilizáveis baseados em Bootswatch Flatly
│   ├── ui/               # Button.jsx, Input.jsx, Card.jsx, Modal.jsx, Badge.jsx
│   ├── layout/           # Navbar.jsx, Footer.jsx, Sidebar.jsx, Container.jsx
│   └── feedback/         # RatingStars.jsx, DifficultyMeter.jsx, AlertMessage.jsx
├── features/             # Módulos verticais de negócio
│   ├── auth/             # Login, Cadastro (qualquer email), Recuperação de Senha e Sessão
│   ├── professors/       # Perfil do professor, listagem e filtros
│   ├── courses/          # Disciplinas, ementas e turmas
│   ├── classes/          # Criação de turmas, Bulk Add de alunos, Toggle de avaliação
│   ├── reviews/          # Criação de review (anônimo/nominal), feed e upvotes
│   └── dashboard/        # Painel do docente (scorecards, histograma, evolução semestral)
├── hooks/                # Custom hooks utilitários
├── services/             # Instância Axios e serviços mockados / API
│   ├── api.js
│   ├── mockAuthService.js
│   ├── mockProfessorService.js
│   ├── mockClassService.js
│   ├── mockReviewService.js
│   └── mockDashboardService.js
├── store/                # Stores do Zustand (userStore.js, filterStore.js)
├── styles/               # index.scss / index.css com importação do Bootswatch Flatly
└── utils/                # Formatadores, helpers e sanitizadores
```

---

## 3. Arquitetura do Backend (Spring Boot 3 & Java 21)

### 3.1 Stack Tecnológica do Backend
* **Framework:** Spring Boot 3.3+ sobre **Java 21 (LTS)**.
* **Segurança:** Spring Security 6 com autenticação Stateless via JWT.
* **Perfis de Acesso (RBAC):** `ROLE_STUDENT` e `ROLE_PROFESSOR` (sem perfil de coordenador).
* **Criptografia:** BCrypt (custo 12) / Argon2id para senhas de usuários.
* **Validação:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@Pattern`, `@Email`).
* **Tratamento Global de Exceções:** `@RestControllerAdvice` retornando a estrutura padronizada **RFC 7807 (`ProblemDetail`)**.
* **Documentação Viva:** SpringDoc OpenAPI 3.1 (`/v3/api-docs` e `/swagger-ui.html`).

---

## 4. Modelo Lógico de Banco de Dados (PostgreSQL 16+)

O banco de dados relacional foi modelado na **3ª Forma Normal (3FN)**, eliminando tabelas de tags e incorporando a gestão de discentes e travas de segurança por turma.

### 4.1 Especificação DBML Oficial (dbdiagram.io)

```dbml
// =======================================================
// CLASSDOOR - MODELO LÓGICO DE BANCO DE DADOS (PostgreSQL 16+)
// =======================================================

Enum user_role {
  STUDENT [note: 'Estudante']
  PROFESSOR [note: 'Docente']
}

Enum evaluation_mode {
  ANONYMOUS_ONLY [note: 'Apenas avaliações estritamente anônimas permitidas']
  ALLOW_IDENTIFIED [note: 'Permite avaliações nominais opcionais consentidas']
}

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [not null, unique, note: 'Qualquer e-mail válido (@gmail, @edu, etc.)']
  password_hash varchar(255) [not null, note: 'Hash BCrypt (custo 12)']
  name varchar(150) [not null]
  role user_role [not null, default: 'STUDENT']
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table students {
  id uuid [pk, ref: - users.id, note: 'Extensão 1:1 de users']
  registration_number varchar(50) [unique, note: 'Matrícula opcional']
  department_id uuid [ref: > departments.id]
}

Table professors {
  id uuid [pk, ref: - users.id, note: 'Extensão 1:1 de users']
  department_id uuid [not null, ref: > departments.id]
  title varchar(50) [note: 'Titulação acadêmica (Dr., Me., Esp.)']
  bio text
  average_rating decimal(3,2) [not null, default: 0.00]
  difficulty_rating decimal(3,2) [not null, default: 0.00]
  recommendation_rate decimal(5,2) [not null, default: 0.00]
  total_reviews integer [not null, default: 0]
}

Table departments {
  id uuid [pk, default: `gen_random_uuid()`]
  code varchar(20) [not null, unique, note: 'Sigla (ex: DCOMP, DEMAT)']
  name varchar(150) [not null]
  website_url varchar(255)
}

Table courses {
  id uuid [pk, default: `gen_random_uuid()`]
  department_id uuid [not null, ref: > departments.id]
  code varchar(20) [not null, unique, note: 'Código da disciplina (ex: CC0101)']
  name varchar(150) [not null]
  description text
  credits integer [not null, default: 4]
}

Table classes {
  id uuid [pk, default: `gen_random_uuid()`]
  course_id uuid [not null, ref: > courses.id]
  professor_id uuid [not null, ref: > professors.id]
  semester varchar(10) [not null, note: 'Período letivo (ex: 2026.1)']
  code varchar(20) [not null, note: 'Identificador de turma (Turma 01)']
  is_evaluation_open boolean [not null, default: false, note: 'Toggle de abertura das avaliações pelo professor']
  students_count integer [not null, default: 0, note: 'Contagem total de alunos matriculados']
  reviews_count integer [not null, default: 0, note: 'Contagem de reviews (se > 0, trava adição de alunos)']
  is_active boolean [not null, default: true]

  indexes {
    (course_id, semester, code) [unique, name: 'uk_classes_course_semester_code']
  }
}

Table class_students {
  id uuid [pk, default: `gen_random_uuid()`]
  class_id uuid [not null, ref: > classes.id]
  student_email varchar(255) [not null, note: 'E-mail do aluno matriculado na turma']
  student_id uuid [ref: > students.id, note: 'Vinculado automaticamente quando o aluno se cadastra']
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (class_id, student_email) [unique, name: 'uk_class_students_class_email']
  }
}

Table evaluation_policies {
  id uuid [pk, default: `gen_random_uuid()`]
  class_id uuid [not null, unique, ref: - classes.id]
  mode evaluation_mode [not null, default: 'ANONYMOUS_ONLY']
  updated_at timestamptz [not null, default: `now()`]
}

Table reviews {
  id uuid [pk, default: `gen_random_uuid()`]
  professor_id uuid [not null, ref: > professors.id]
  class_id uuid [not null, ref: > classes.id]
  rating smallint [not null, note: 'Nota geral (1 a 5)']
  difficulty smallint [not null, note: 'Dificuldade (1 a 5)']
  would_recommend boolean [not null]
  comment text [not null, note: 'Comentário textual (min 20 chars)']
  is_anonymous boolean [not null, default: true]
  student_identifier_display varchar(150) [note: 'Preenchido apenas se is_anonymous = false']
  audit_hash varchar(64) [not null, unique, note: 'HMAC-SHA256 para unicidade antifraude']
  upvotes_count integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (professor_id, created_at) [name: 'idx_reviews_professor_created']
    (class_id) [name: 'idx_reviews_class_id']
    audit_hash [unique, name: 'uk_reviews_audit_hash']
  }
}

Table review_upvotes {
  id uuid [pk, default: `gen_random_uuid()`]
  review_id uuid [not null, ref: > reviews.id]
  user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (user_id, review_id) [unique, name: 'uk_review_upvotes_user_review']
  }
}
```

---

## 5. Contratos de Integração RESTful & Schemas da API

### 5.1 Catálogo de Endpoints

| Método | Endpoint | US | Auth / Role | Status Sucesso | Descrição |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `POST` | `/api/v1/auth/register` | US01 | Pública | `201 Created` | Criação de conta (qualquer e-mail válido). |
| `POST` | `/api/v1/auth/login` | US02 | Pública | `200 OK` | Autenticação e emissão de token JWT. |
| `POST` | `/api/v1/auth/forgot-password` | US02 | Pública | `200 OK` | Disparo de link de recuperação de senha. |
| `GET` | `/api/v1/home/featured` | US03 | Pública | `200 OK` | Destaques da tela inicial. |
| `GET` | `/api/v1/professors` | US03 | Pública | `200 OK` | Busca paginada de docentes com filtros. |
| `GET` | `/api/v1/professors/{id}` | US04 | Pública | `200 OK` | Perfil do docente com médias e histograma. |
| `GET` | `/api/v1/courses` | US03 | Pública | `200 OK` | Busca paginada de disciplinas com filtros. |
| `POST` | `/api/v1/courses` | US08 | `ROLE_PROFESSOR` | `201 Created` | Cadastro de nova disciplina no catálogo. |
| `GET` | `/api/v1/courses/{id}` | US04 | Pública | `200 OK` | Perfil detalhado da disciplina e turmas. |
| `POST` | `/api/v1/courses/{cId}/classes` | US08 | `ROLE_PROFESSOR` | `201 Created` | Criação de nova turma pelo professor. |
| `POST` | `/api/v1/courses/{cId}/classes/{clId}/students/bulk` | US08 | `ROLE_PROFESSOR` | `200 OK` | Adição contínua em lote de alunos via lista de e-mails. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/toggle-evaluation` | US08 | `ROLE_PROFESSOR` | `200 OK` | Abertura/fechamento de avaliações da turma. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/policy` | US08 | `ROLE_PROFESSOR` | `200 OK` | Alternância de política (`ANONYMOUS_ONLY` vs `ALLOW_IDENTIFIED`). |
| `GET` | `/api/v1/reviews` | US04 | Pública | `200 OK` | Feed público paginado de avaliações. |
| `POST` | `/api/v1/reviews` | US05/06 | `ROLE_STUDENT` | `201 Created` | Submissão de avaliação (valida quórum >= 5 e toggle aberto). |
| `POST` | `/api/v1/reviews/{id}/useful` | US07 | Autenticado | `200 OK` | Incremento atômico de voto útil. |
| `GET` | `/api/v1/professors/{id}/analytics` | US09 | `ROLE_PROFESSOR` | `200 OK` | Métricas, histograma de estrelas e evolução temporal. |
| `GET` | `/api/v1/professors/{id}/analytics/export` | US09 | `ROLE_PROFESSOR` | `200 OK` | Exportação de relatórios (`format=csv` ou `format=pdf`). |

---

### 5.2 Schemas JSON Detalhados de Request e Response

#### A. Cadastro de Usuário (`POST /api/v1/auth/register`)
* **Request (Qualquer e-mail válido aceito):**
  ```json
  {
    "name": "Maria Silva Santos",
    "email": "maria.silva@gmail.com",
    "password": "SenhaForte@2026",
    "role": "STUDENT",
    "department": "Ciência da Computação"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "usr-12345678-90ab-cdef-1234-567890abcdef",
    "name": "Maria Silva Santos",
    "email": "maria.silva@gmail.com",
    "role": "STUDENT",
    "department": "Ciência da Computação",
    "createdAt": "2026-09-08T10:00:00Z"
  }
  ```

#### B. Criação de Turma pelo Professor (`POST /api/v1/courses/{courseId}/classes`)
* **Request:**
  ```json
  {
    "code": "Turma 01",
    "semester": "2026.1"
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "cls-55443322-1100-aabb-ccdd-eeff00112233",
    "courseId": "crs-11223344-5566-7788-99aa-bbccddeeff00",
    "professorId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "code": "Turma 01",
    "semester": "2026.1",
    "isEvaluationOpen": false,
    "studentsCount": 0,
    "reviewsCount": 0,
    "createdAt": "2026-09-08T11:00:00Z"
  }
  ```

#### C. Adição de Alunos em Lote (`POST /api/v1/courses/{courseId}/classes/{classId}/students/bulk`)
* **Request:**
  ```json
  {
    "emailsText": "aluno1@gmail.com, aluno2@universidade.edu\naluno3@outlook.com, aluno4@hotmail.com, aluno5@empresa.com"
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "classId": "cls-55443322-1100-aabb-ccdd-eeff00112233",
    "addedCount": 5,
    "totalStudents": 5,
    "invalidEmails": [],
    "message": "5 alunos matriculados com sucesso na turma."
  }
  ```
* **Regra de Bloqueio (Erro 400 se `reviewsCount > 0`):**
  ```json
  {
    "type": "https://classdoor.acad/errors/class-locked",
    "title": "Adição de Alunos Bloqueada",
    "status": 400,
    "detail": "Não é permitido adicionar novos alunos a uma turma que já recebeu avaliações.",
    "instance": "/api/v1/courses/crs-1/classes/cls-1/students/bulk"
  }
  ```

#### D. Toggle de Liberação de Avaliações (`PATCH /api/v1/courses/{cId}/classes/{clId}/toggle-evaluation`)
* **Request:**
  ```json
  {
    "isEvaluationOpen": true
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "classId": "cls-55443322-1100-aabb-ccdd-eeff00112233",
    "isEvaluationOpen": true,
    "studentsCount": 5,
    "message": "Avaliações liberadas com sucesso para os alunos da turma."
  }
  ```

#### E. Submissão de Avaliação sem Tags (`POST /api/v1/reviews`)
* **Request:**
  ```json
  {
    "targetType": "PROFESSOR",
    "targetId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "classId": "cls-55443322-1100-aabb-ccdd-eeff00112233",
    "rating": 5,
    "difficultyRating": 3,
    "recommend": true,
    "comment": "Excelente professor, didática impecável e suporte constante nas aulas.",
    "isAnonymous": true,
    "studentIdentifier": null
  }
  ```
* **Response (`201 Created`):**
  ```json
  {
    "id": "rev-98765432-10ab-cdef-1234-567890abcdef",
    "targetType": "PROFESSOR",
    "targetId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "rating": 5.0,
    "difficultyRating": 3.0,
    "recommend": true,
    "comment": "Excelente professor, didática impecável e suporte constante nas aulas.",
    "isAnonymous": true,
    "authorDisplayName": "Estudante Anônimo",
    "usefulCount": 0,
    "createdAt": "2026-09-08T14:30:00Z"
  }
  ```

#### F. Analytics Estruturado do Docente (`GET /api/v1/professors/{id}/analytics`)
* **Response (`200 OK`):**
  ```json
  {
    "professorId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "professorName": "Dr. Carlos Eduardo Santos",
    "scorecards": {
      "overallRating": 4.75,
      "difficultyRating": 3.20,
      "recommendationPercentage": 92.5,
      "totalReviews": 40
    },
    "ratingDistribution": {
      "star5": { "count": 25, "percentage": 62.5 },
      "star4": { "count": 10, "percentage": 25.0 },
      "star3": { "count": 3, "percentage": 7.5 },
      "star2": { "count": 2, "percentage": 5.0 },
      "star1": { "count": 0, "percentage": 0.0 }
    },
    "temporalEvolution": [
      {
        "semester": "2024.2",
        "averageRating": 4.50,
        "difficultyRating": 3.40,
        "reviewsCount": 8
      },
      {
        "semester": "2025.1",
        "averageRating": 4.65,
        "difficultyRating": 3.30,
        "reviewsCount": 12
      },
      {
        "semester": "2025.2",
        "averageRating": 4.80,
        "difficultyRating": 3.10,
        "reviewsCount": 20
      }
    ]
  }
  ```

---

## 6. Design System, Tokens Visuais e Telas no Figma

O arquivo do [Figma do Classdoor](https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor?t=SFiBuyhBNLwICYN1-0) é a Fonte Única da Verdade oficial.

### 6.1 Tokens de Cores Semânticas (Bootswatch Flatly)

| Token | Hex | RGB | Aplicação no Sistema |
| :--- | :--- | :--- | :--- |
| `primary` | `#2C3E50` | `44, 62, 80` | Navbar institucional, cabeçalhos e botões principais de ação. |
| `success / accent` | `#18BC9C` | `24, 188, 156` | Indicador de anonimato (`🛡️ 100% Anônimo`), aprovações e sucesso. |
| `warning` | `#F39C12` | `243, 156, 18` | Estrelas de avaliação e destaques de catálogo. |
| `danger` | `#E74C3C` | `231, 76, 60` | Alertas de erro e notas baixas de dificuldade. |
| `info` | `#3498DB` | `52, 152, 219` | Badges informativos e ementas. |
| `background` | `#F8F9FA` | `248, 249, 250` | Fundo principal ergonômico da página. |
| `surface` | `#FFFFFF` | `255, 255, 255` | Cards, modais e containers elevados (`border: 1px solid #E9ECEF`). |

### 6.2 Tipografia (Inter)
* **Família:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
* **Escala:**
  * `H1`: 36px (`2.25rem`) / Peso 700
  * `H2`: 28px (`1.75rem`) / Peso 700
  * `H3`: 20px (`1.25rem`) / Peso 600
  * `Body`: 16px (`1.00rem`) / Peso 400
  * `Small`: 14px (`0.875rem`) / Peso 400
  * `Badge`: 12px (`0.75rem`) / Peso 600

### 6.3 Vitrine Oficial de Ícones (Bootstrap Icons `bi-*`)
* **Autenticação & Segurança:** `bi-mortarboard-fill`, `bi-shield-check`, `bi-shield-lock-fill`, `bi-key-fill`, `bi-envelope-fill`, `bi-check-circle-fill`.
* **Busca, Navegação & Turmas:** `bi-search`, `bi-funnel-fill`, `bi-person-fill`, `bi-people-fill`, `bi-person-badge-fill`, `bi-building`, `bi-plus-circle-fill`, `bi-toggle-on`, `bi-toggle-off`, `bi-arrow-left`.
* **Reviews & Analytics:** `bi-star-fill`, `bi-hand-thumbs-up-fill`, `bi-graph-up`, `bi-bar-chart-fill`, `bi-file-earmark-pdf-fill`, `bi-file-earmark-spreadsheet-fill`, `bi-box-arrow-right`.

### 6.4 Matriz de Telas no Figma (20 Pranchetas Oficiais)

O design oficial do Classdoor no Figma (`https://www.figma.com/design/LxCytRCFqQGshvVnVnDxum/Classdoor`) é estruturado em **três páginas oficiais**, cobrindo 100% dos requisitos funcionais (RF01 a RF24) e User Stories (US01 a US09) definidos em `specs/03-Requisitos-e-User-Stories.md`. O módulo docente (US08 & US09) é decomposto em 4 telas dedicadas (**5A, 5B, 5C, 5D**) para garantir máxima clareza operacional e excelência em UX:

---

#### 📄 Página 1: Desktop (1440px — Grid 12 Colunas)

| # | Identificação da Tela | User Story | Rota / Viewport | Requisitos Atendidos & Componentes de Interface |
| :--- | :--- | :---: | :---: | :--- |
| **1A** | `1A. Desktop - Login (US02)` ⭐ *(Starting Point)* | **US02** | `/login`<br>`1440 × 900 px` | • **Header/Navbar:** Logotipo Classdoor com `bi-mortarboard-fill` (#18BC9C), links "Ajuda & FAQ" e "Sobre o Projeto".<br>• **Card de Login:** Segmented control ("Acessar Conta" ativo / "Criar Nova Conta" inativo), campo E-mail (`estudante@universidade.edu`), campo Senha mascarada, checkbox "Lembrar de mim", link "Esqueci minha senha" e botão "Entrar no Classdoor" (`#2C3E50`).<br>• **Banner de Segurança:** Callout com `bi-shield-lock-fill` (#0369A1) informando isolamento de identidade e anonimato total.<br>• **CTA Secundário:** Botão "Criar Nova Conta" (`#18BC9C`). |
| **1B** | `1B. Desktop - Cadastro (US01)` | **US01** | `/cadastro`<br>`1440 × 900 px` | • **Header/Navbar:** Padrão institucional Classdoor.<br>• **Card de Cadastro:** Segmented control alternando para criação de conta; campos: Nome Completo, E-mail (suporte a qualquer e-mail válido sem restrição de domínio institucional), Seletor de Perfil Universitário ("Sou Estudante" / "Sou Professor"), Senha com checklist dinâmico de segurança (mínimo 8 caracteres, letras e números).<br>• **Botão Principal:** "Criar Minha Conta" (`#18BC9C`) com feedback de validação e link de retorno para Login. |
| **1C** | `1C. Desktop - Recuperação de Senha (US02)` | **US02** | `/recuperar-senha`<br>`1440 × 900 px` | • **Header/Navbar:** Padrão institucional Classdoor.<br>• **Card de Recuperação:** Ícone central `bi-key-fill` (#2980B9) em container circular, texto explicativo sobre o envio de link temporário com validade de 30 minutos, campo E-mail, botão "Enviar Link de Recuperação" (`#18BC9C`), botão outline "Voltar para o Login" e banner de segurança `bi-shield-check`. |
| **2** | `2. Home & Busca Global (US03)` | **US03** | `/`<br>`1440 × 960 px` | • **Navbar Autenticada:** Logo, identificação do usuário com perfil ("Lucas Silva - Estudante") e botão "Sair" (`bi-box-arrow-right`).<br>• **Hero Section:** Título de impacto e caixa de busca global com `bi-search` e debounce de 300ms.<br>• **Sidebar de Filtros Acadêmicos:** Filtro por tipo (Todos, Docentes, Cursos), Departamento (dropdown), Semestre Letivo (`2026.1`, `2026.2`), slider de nota mínima (1.0★ a 5.0★) e botão "Limpar Filtros".<br>• **Grid de Resultados & Destaques:** Cards estruturados com avatar/iniciais, nome do docente/disciplina, departamento, nota média com `bi-star-fill` (#F39C12), volume de reviews, badges institucionais e botão "Ver Perfil Completo". |
| **3** | `3. Perfil de Docente & Reviews (US04 & US07)` | **US04**<br>**US07** | `/professores/:id`<br>`1440 × 1000 px` | • **Header do Perfil:** Botão "← Voltar à Busca", avatar com iniciais, nome do professor/disciplina, departamento e botão de destaque "⭐ Avaliar Professor" (`#2C3E50`).<br>• **Painel de Scorecards (Métricas):** 4 cards com Nota Média Geral (ex: `4.6 ★`), Taxa de Recomendação (`88%`), Nível de Dificuldade (`3.2 / 5.0`) e Total de Reviews (`42 feedbacks`).<br>• **Gráfico de Histograma:** Distribuição percentual de 1 a 5 estrelas em barras horizontais.<br>• **Feed de Avaliações:** Seletor de ordenação (*Mais Recentes*, *Melhor Avaliadas*, *Mais Úteis*); cards de avaliação contendo badge de anonimato (`bi-shield-check` - "Estudante Anônimo") ou nome público (se nominal autorizado), data, semestre da turma, nota geral, dificuldade, recomendação, parecer qualitativo e botão de interação "Útil 👍" (`bi-hand-thumbs-up-fill` - US07) com contador e idempotência. |
| **4** | `4. Modal de Avaliação Anônima & Nominal (US05 & US06)` | **US05**<br>**US06** | `/avaliar (Modal)`<br>`1440 × 960 px` | • **Container Modal Sobreposto:** Backdrop escurecido (#000000 com 50% de opacidade) e card central elevado.<br>• **Validações de Regra de Negócio:** Quórum mínimo ($\ge 5$ alunos matriculados) e verificação de liberação da turma (`isEvaluationOpen == true`).<br>• **Estrutura Direta de 4 Campos (Sem Tags de Destaque):**<br>&nbsp;&nbsp;1. **Nota Geral do Professor:** Seletor interativo de estrelas (1 a 5 `bi-star-fill`).<br>&nbsp;&nbsp;2. **Nível de Dificuldade:** Escala numérica (1 a 5).<br>&nbsp;&nbsp;3. **Recomendação:** Botões de alternância ("Sim, Recomendo" / "Não Recomendo").<br>&nbsp;&nbsp;4. **Comentário Descritivo:** Campo de feedback qualitativo com contador de caracteres (mínimo 20 e máximo 1000 caracteres).<br>• **Blindagem de Anonimato:** Callout `bi-shield-check` ("Garantia de Anonimato 100% — Identidade e IP isolados via HMAC-SHA256").<br>• **Opção de Avaliação Nominal:** Seletor condicional à política da turma (`ALLOW_IDENTIFIED`) com checkbox obrigatório de consentimento expresso ("Concordo em exibir meu nome público").<br>• **Ações:** Botão outline "Cancelar" e botão "Publicar Minha Avaliação" (`#18BC9C`). |
| **5A** | `5A. Desktop - Painel Docente & Minhas Turmas (US08)` | **US08** | `/dashboard`<br>`1440 × 960 px` | • **Header Docente:** Identificação do professor ("Prof. Dr. Carlos Santos"), avatar e logout.<br>• **Scorecards Rápidos do Docente:** Média Geral Docente, Total de Turmas Ativas, Alunos Impactados e Média de Participação.<br>• **Barra de Ações:** Filtro de período letivo (`2026.1 (Atual) ▼`) e botão de destaque "➕ Cadastrar Nova Turma" (`#18BC9C` — link para 5B).<br>• **Grid de Cards de Turmas:** Listagem visual das turmas ativas e históricas. Cada card exibe: Código e Nome da Disciplina (ex: "CC0201 - Algoritmos"), Código da Turma ("Turma 01"), Período Semestral (`2026.1`), Badge de Status (`Avaliações Abertas` verde / `Fechada` cinza), total de alunos matriculados, nota média da turma com estrelas, botão "Gerenciar Turma" (navega para 5C) e botão "Ver Relatórios" (navega para 5D). |
| **5B** | `5B. Desktop - Criação de Turma & Nova Disciplina (US08)` | **US08** | `/dashboard/turmas/nova`<br>`1440 × 960 px` | • **Header/Breadcrumb:** "Painel Docente > Cadastrar Nova Turma".<br>• **Seção 1 (Disciplina):** Opção de selecionar disciplina existente no catálogo via dropdown com busca ou alternar para *"Cadastrar Nova Disciplina"* abrindo campos: Código (ex: "CC0202"), Nome, Departamento e Ementa.<br>• **Seção 2 (Turma & Período):** Código da Turma (ex: "Turma 01") e Seletor de Período Semestral padronizado (`2026.1`, `2026.2`).<br>• **Seção 3 (Alunos em Lote):** Campo de importação em lote (*Bulk Import*) com suporte a múltiplos e-mails separados por vírgula, ponto e vírgula ou quebra de linha.<br>• **Seção 4 (Política de Privacidade):** Seletor inicial (`Somente Anônimo` / `Permitir Identificado`).<br>• **Ações:** Botão outline "Cancelar" e botão "Salvar e Criar Turma" (`#18BC9C` — redireciona para 5C). |
| **5C** | `5C. Desktop - Detalhes e Gestão da Turma (US08)` | **US08** | `/dashboard/turmas/:id`<br>`1440 × 960 px` | • **Header da Turma:** Breadcrumb "Minhas Turmas > CC0201 - Turma 01 (2026.1)", status da turma e atalho para Relatórios (5D).<br>• **Card de Controle de Avaliações:** **Toggle "Liberar Avaliações para os Alunos" (`isEvaluationOpen`)** com trava de segurança para quórum mínimo ($\ge 5$ alunos) e feedback de status em tempo real.<br>• **Seção de Gestão de Alunos (Adição Contínua & Blindagem):**<br>&nbsp;&nbsp;– Campo de inclusão de novos alunos em lote ativo enquanto `reviewsCount == 0`.<br>&nbsp;&nbsp;– Banner de bloqueio automático ativado após a 1ª avaliação: *"Não é permitido adicionar novos alunos a uma turma que já recebeu avaliações, visando resguardar o sigilo e anonimato discente."*<br>&nbsp;&nbsp;– **Cegueira de Acesso Docente (*Access Blindness*):** Tabela/lista de e-mails matriculados e contagem total, **sem exibir** status individual de login, ativação ou quem avaliou.<br>• **Configuração de Política:** Alternância entre `Somente Anônimo` e `Permitir Identificado`. |
| **5D** | `5D. Desktop - Dashboard Analítico & Relatórios (US09)` | **US09** | `/dashboard/relatorios`<br>`1440 × 1000 px` | • **Header:** Seletor de visão (Visão Geral Docente ou Turma Específica) e filtro de período semestral.<br>• **Painel de Scorecards Analíticos:** Nota Média Geral, Índice de Dificuldade, Taxa de Recomendação (%) e Total de Reviews Válidas.<br>• **Gráfico 1 — Histograma / Distribuição de Notas:** Barras horizontais com distribuição percentual e absoluta de 1 a 5 estrelas (Excelente a Péssimo).<br>• **Gráfico 2 — Série Temporal Semestral:** Gráfico de evolução semestral comparando médias históricas de Nota Geral e Dificuldade ao longo dos semestres.<br>• **Feedbacks Qualitativos:** Listagem estruturada de comentários textuais com proteção rigorosa do anonimato discente.<br>• **Barra de Exportação Estruturada:** Botão "Exportar Relatório CSV" (`bi-file-earmark-spreadsheet-fill`) e botão "Exportar Relatório PDF" (`bi-file-earmark-pdf-fill`). |

---

#### 📱 Página 2: Mobile (390px — Mobile-First)

| # | Identificação da Tela | User Story | Viewport | Adaptação Ergonômica & Comportamento Responsivo |
| :--- | :--- | :---: | :---: | :--- |
| **1A** | `1A. Mobile - Login (US02)` ⭐ *(Starting Point)* | **US02** | `390 × 844 px` | Card de login verticalizado em coluna única, touch targets $\ge 44$px, inputs com preenchimento total de largura, banner de segurança `bi-shield-lock-fill` adaptado e alternância fluida para cadastro. |
| **1B** | `1B. Mobile - Cadastro de Usuário (US01)` | **US01** | `390 × 844 px` | Formulário de criação de conta otimizado para teclado mobile, suporte a qualquer e-mail válido, seletor tátil de perfil (Estudante/Professor) e checklist de senha compacto. |
| **1C** | `1C. Mobile - Recuperação de Senha (US02)` | **US02** | `390 × 844 px` | Fluxo enxuto com ícone `bi-key-fill`, campo de e-mail e botão de envio em destaque para rápida recuperação de acesso no celular. |
| **2** | `2. Mobile - Home & Busca Global (US03)` | **US03** | `390 × 844 px` | Header com busca instantânea colapsável, gaveta/drawer de filtros por departamento e semestre letivo, grid de cards em coluna única com scroll vertical e TabBar de navegação fixa na base. |
| **3** | `3. Mobile - Perfil Docente & Reviews (US04 & US07)` | **US04**<br>**US07** | `390 × 844 px` | Scorecards de métricas dispostos em carrossel horizontal de 2 colunas, histograma de notas compacto, feed vertical de avaliações com botão de upvote ("Útil 👍" — US07) acessível ao toque e TabBar inferior. |
| **4** | `4. Mobile - Modal de Avaliação (US05 & US06)` | **US05**<br>**US06** | `390 × 844 px` | Bottom sheet / Modal de tela cheia com quórum mínimo ($\ge 5$), seletor de estrelas tátil com espaçamento ergonômico, campo de comentário adaptado para digitação móvel e banner de anonimato. |
| **5A** | `5A. Mobile - Painel Docente & Minhas Turmas (US08)` | **US08** | `390 × 844 px` | Visão inicial do professor no mobile: scorecards compactos, botão flutuante/topo "➕ Nova Turma" e lista de cards verticais de turmas com status e ações rápidas ("Gerenciar" e "Relatórios"). |
| **5B** | `5B. Mobile - Criação de Turma & Disciplina (US08)` | **US08** | `390 × 844 px` | Formulário mobile em etapas/scroll contínuo para seleção/criação de disciplina, definição de período, área de colagem de e-mails de alunos e botão fixo de criação na base. |
| **5C** | `5C. Mobile - Detalhes e Gestão da Turma (US08)` | **US08** | `390 × 844 px` | Gestão da turma no celular: toggle tátil de liberação de avaliações, área de adição contínua de alunos com validação de bloqueio, contagem total de discentes sob cegueira de acesso e TabBar. |
| **5D** | `5D. Mobile - Dashboard Analítico & Relatórios (US09)` | **US09** | `390 × 844 px` | Visualização analítica responsiva: scorecards em grid 2x2, histograma de barras, gráfico temporal adaptado e botões full-width de exportação (CSV / PDF). |

---

#### 🎨 Página 3: Design System & Tokens (Figma Component Library)
* **Design Tokens do Bootswatch Flatly:** 10 variáveis semânticas cadastradas (`color/primary` `#2C3E50`, `color/success` `#18BC9C`, `color/warning` `#F39C12`, `color/danger` `#E74C3C`, `color/info` `#3498DB`, `color/background` `#F8F9FA`, `color/surface` `#FFFFFF`, `color/text-dark` `#2C3E50`, `color/text-muted` `#7B8A8B`, `color/border` `#CED4DA`).
* **Tipografia:** Família Inter com escalas completas para Display (28px Bold), Headings (22px/18px/16px), Body (14px) e Badges (11px/12px).
* **Biblioteca de Componentes com AutoLayout:** Botões (`Primary`, `Success`, `Outline`, `Upvote`), Badges de Anonimato, Controles de Formulário, Scorecards de Métricas e Modais.
* **Vitrine Oficial de 24 Ícones do Bootstrap Icons (`bi-*`):** Todos vetoriais e monocromáticos categorizados em *Autenticação & Segurança*, *Busca & Navegação*, *Tags Pedagógicas* e *Reviews, KPIs & Exportação*.


