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
│   ├── reviews/          # Criação de review sem tags (anônimo/nominal), feed e upvotes
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
| `GET` | `/api/v1/courses/{id}` | US04 | Pública | `200 OK` | Perfil detalhado da disciplina e turmas. |
| `POST` | `/api/v1/courses/{cId}/classes` | US08 | `ROLE_PROFESSOR` | `201 Created` | Criação de nova turma pelo professor. |
| `POST` | `/api/v1/courses/{cId}/classes/{clId}/students/bulk` | US08 | `ROLE_PROFESSOR` | `200 OK` | Adição em lote de alunos via lista de e-mails. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/toggle-evaluation` | US08 | `ROLE_PROFESSOR` | `200 OK` | Abertura/fechamento de avaliações da turma. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/policy` | US08 | `ROLE_PROFESSOR` | `200 OK` | Alternância de política (`ANONYMOUS_ONLY` vs `ALLOW_IDENTIFIED`). |
| `GET` | `/api/v1/reviews` | US04 | Pública | `200 OK` | Feed público paginado de avaliações (sem tags). |
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

### 6.4 Matriz de Telas no Figma (14 Pranchetas Oficiais)
* **Página 1: Desktop (1440px — Grid 12 colunas):**
  1. `1A. Desktop - Login (US02)` *(Starting Point)*
  2. `1B. Desktop - Cadastro (US01)`
  3. `1C. Desktop - Recuperação de Senha (US02)`
  4. `2. Home & Busca Global (US03)`
  5. `3. Perfil de Docente & Reviews (US04 & US07)`
  6. `4. Modal de Avaliação Anônima & Nominal sem Tags (US05 & US06)`
  7. `5. Painel Docente, Gestão de Turmas & Dashboard (US08 & US09)`
* **Página 2: Mobile (390px — Mobile-First):**
  1. `1A. Mobile - Login (US02)` *(Starting Point)*
  2. `1B. Mobile - Cadastro de Usuário (US01)`
  3. `1C. Mobile - Recuperação de Senha (US02)`
  4. `2. Mobile - Home & Busca Global (US03)`
  5. `3. Mobile - Perfil Docente & Reviews (US04 & US07)`
  6. `4. Mobile - Modal de Avaliação (US05 & US06)`
  7. `5. Mobile - Painel Docente & Dashboard (US08 & US09)`
