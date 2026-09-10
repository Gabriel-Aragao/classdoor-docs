# 🏛️ 02. Arquitetura, Contratos de Dados, API RESTful e Design System — Classdoor

**Projeto:** Classdoor  
**Documento:** Especificação Arquitetural de Frontend, Backend, Banco de Dados Relacional, Contratos RESTful e Design System  
**Versão:** 1.0.0  
**Data:** 2026-09-08  
**Autor:** @Dijkstra (Tech Lead & Arquiteto de Software Sênior)  
**Stakeholder / CTO & PO:** @domaragao  

---

## 1. Princípios Arquiteturais & Pilares de Engenharia

### 1.1 Privacidade por Design (*Privacy by Design* & Sigilo Absoluto)
1. **Anonimato por Padrão (*Default*):** Todas as avaliações no Classdoor são 100% anônimas. Nenhuma chave estrangeira identificável (`user_id`, `student_id`), endereço IP ou User-Agent é persistido publicamente ou associado à avaliação na visão do professor/comunidade.
2. **Mecanismo Antifraude de Unicidade (Hash Unidirecional O(1)):** Para assegurar a regra de negócio *"um aluno só pode avaliar cada turma uma única vez"* sem registrar a chave do usuário na tabela pública `reviews`, a aplicação computa um hash criptográfico unilateral:
   ```text
   audit_hash = HMAC-SHA256(APP_PEPPER, user_id || class_id)
   ```
   A unicidade estrita é garantida a nível de banco de dados pela constraint `UNIQUE(audit_hash)` no PostgreSQL.
3. **Modo Nominal Consentido:** Quando a turma está configurada com a política `ALLOW_IDENTIFIED`, o estudante pode optar por assinar a avaliação com seu nome público mediante consentimento explícito.

### 1.2 Estratégia *Frontend-First* com Mocks
O desenvolvimento do MVP é iniciado pela camada cliente em **React 19 + Bootswatch Flatly**. Todas as integrações de rede, autenticação, catálogo de busca e submissões são atendidas por serviços simulados (`mockAuthService.js`, `mockProfessorService.js`, `mockReviewService.js`) com persistência em memória e `localStorage`.

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
│   ├── auth/             # Login, Cadastro, Recuperação de Senha e Sessão
│   ├── professors/       # Perfil do professor, listagem e filtros
│   ├── courses/          # Disciplinas, ementas e histórico
│   ├── reviews/          # Criação de review (anônimo/nominal), feed e upvotes
│   └── dashboard/        # Painel do docente (métricas e toggles de política)
├── hooks/                # Custom hooks utilitários
├── services/             # Instância Axios e serviços mockados / API
│   ├── api.js
│   ├── mockAuthService.js
│   ├── mockProfessorService.js
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
* **Criptografia:** BCrypt (custo 12) / Argon2id para senhas de usuários.
* **Validação:** Jakarta Bean Validation (`@Valid`, `@NotNull`, `@Size`, `@Pattern`).
* **Tratamento Global de Exceções:** `@RestControllerAdvice` retornando a estrutura padronizada **RFC 7807 (`ProblemDetail`)**.
* **Documentação Viva:** SpringDoc OpenAPI 3.1 (`/v3/api-docs` e `/swagger-ui.html`).

---

## 4. Modelo Lógico de Banco de Dados (PostgreSQL 16+)

O banco de dados relacional foi modelado na **3ª Forma Normal (3FN)**, garantindo integridade referencial com transações ACID.

### 4.1 Especificação DBML Oficial (dbdiagram.io)

```dbml
// =======================================================
// CLASSDOOR - MODELO LÓGICO DE BANCO DE DADOS (PostgreSQL 16+)
// =======================================================

Enum user_role {
  STUDENT [note: 'Estudante da graduação/pós-graduação']
  PROFESSOR [note: 'Docente ou orientador acadêmico']
  ADMIN [note: 'Administrador e coordenador da plataforma']
}

Enum evaluation_mode {
  ANONYMOUS_ONLY [note: 'Apenas avaliações estritamente anônimas permitidas']
  ALLOW_IDENTIFIED [note: 'Permite avaliações nominais opcionais consentidas']
}

Enum tag_category {
  PEDAGOGICAL [note: 'Metodologia de ensino e didática']
  EXIGENCY [note: 'Rigor acadêmico e pontualidade']
  ASSESSMENT [note: 'Critérios de provas e distribuição de notas']
}

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [not null, unique, note: 'E-mail institucional (@edu / @universidade.br)']
  password_hash varchar(255) [not null, note: 'Hash BCrypt (custo 12)']
  name varchar(150) [not null]
  role user_role [not null, default: 'STUDENT']
  is_active boolean [not null, default: true]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
}

Table students {
  id uuid [pk, ref: - users.id, note: 'Extensão 1:1 de users']
  registration_number varchar(50) [not null, unique, note: 'Matrícula institucional']
  department_id uuid [not null, ref: > departments.id]
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
  is_active boolean [not null, default: true]

  indexes {
    (course_id, semester, code) [unique, name: 'uk_classes_course_semester_code']
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
  comment text [not null, note: 'Comentário (min 20 chars)']
  is_anonymous boolean [not null, default: true]
  student_identifier_display varchar(150) [note: 'Preenchido apenas se is_anonymous = false']
  audit_hash varchar(64) [not null, unique, note: 'HMAC-SHA256 para unicidade antifraude sem quebra de anonimato']
  upvotes_count integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]

  indexes {
    (professor_id, created_at) [name: 'idx_reviews_professor_created']
    (class_id) [name: 'idx_reviews_class_id']
    audit_hash [unique, name: 'uk_reviews_audit_hash']
  }
}

Table tags {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(50) [not null, unique]
  category tag_category [not null]
  icon_class varchar(50) [note: 'Classe Bootstrap Icons (bi-*)']
}

Table review_tags {
  review_id uuid [not null, ref: > reviews.id]
  tag_id uuid [not null, ref: > tags.id]

  indexes {
    (review_id, tag_id) [pk, name: 'pk_review_tags']
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

### 4.2 Estratégia de Indexação e Otimização SQL
```sql
-- 1. Ordenação e paginação de reviews por docente
CREATE INDEX idx_reviews_professor_created ON reviews (professor_id, created_at DESC);

-- 2. Filtro e busca de disciplinas por departamento
CREATE INDEX idx_courses_dept_code ON courses (department_id, code);

-- 3. Ranking de docentes por departamento e média
CREATE INDEX idx_professors_dept_rating ON professors (department_id, average_rating DESC);

-- 4. Consulta de turmas ativas no semestre corrente
CREATE INDEX idx_classes_semester_active ON classes (semester, is_active) WHERE is_active = TRUE;

-- 5. Unicidade e controle atômico de upvotes
CREATE UNIQUE INDEX uk_review_upvotes_user_review ON review_upvotes (user_id, review_id);
```

---

## 5. Contratos de Integração RESTful & Schemas da API

### 5.1 Catálogo de Endpoints

| Método | Endpoint | US | Auth / Role | Status Sucesso | Descrição |
| :--- | :--- | :---: | :---: | :---: | :--- |
| `POST` | `/api/v1/auth/register` | US01 | Pública | `201 Created` | Criação de conta institucional. |
| `POST` | `/api/v1/auth/login` | US02 | Pública | `200 OK` | Autenticação e emissão de token JWT. |
| `POST` | `/api/v1/auth/forgot-password` | US02 | Pública | `200 OK` | Disparo de link de recuperação de senha. |
| `GET` | `/api/v1/home/featured` | US03 | Pública | `200 OK` | Destaques da tela inicial (professores e disciplinas). |
| `GET` | `/api/v1/professors` | US03 | Pública | `200 OK` | Busca paginada de docentes com filtros. |
| `GET` | `/api/v1/professors/{id}` | US04 | Pública | `200 OK` | Perfil do docente com agregados estatísticos. |
| `GET` | `/api/v1/courses` | US03 | Pública | `200 OK` | Busca paginada de disciplinas com filtros. |
| `GET` | `/api/v1/courses/{id}` | US04 | Pública | `200 OK` | Perfil detalhado da disciplina. |
| `GET` | `/api/v1/reviews` | US04 | Pública | `200 OK` | Feed público paginado de avaliações. |
| `POST` | `/api/v1/reviews` | US05/06 | `ROLE_STUDENT` | `201 Created` | Submissão de avaliação (anônima ou nominal). |
| `POST` | `/api/v1/reviews/{id}/useful` | US07 | Autenticado | `200 OK` | Incremento atômico de voto útil. |
| `PATCH`| `/api/v1/courses/{cId}/classes/{clId}/policy` | US08 | `ROLE_PROFESSOR` | `200 OK` | Alternância de política (`ANONYMOUS_ONLY` vs `ALLOW_IDENTIFIED`). |
| `GET` | `/api/v1/professors/{id}/analytics` | US09 | `ROLE_PROFESSOR` / Admin | `200 OK` | Dashboard docente com evolução temporal. |

### 5.2 Schemas JSON de Request e Response

#### A. Cadastro de Usuário (`POST /api/v1/auth/register`)
* **Request:**
  ```json
  {
    "name": "Maria Silva Santos",
    "email": "maria.santos@universidade.edu.br",
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
    "email": "maria.santos@universidade.edu.br",
    "role": "STUDENT",
    "department": "Ciência da Computação",
    "createdAt": "2026-09-08T10:00:00Z"
  }
  ```

#### B. Autenticação (`POST /api/v1/auth/login`)
* **Request:**
  ```json
  {
    "email": "maria.santos@universidade.edu.br",
    "password": "SenhaForte@2026"
  }
  ```
* **Response (`200 OK`):**
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": "usr-12345678-90ab-cdef-1234-567890abcdef",
      "name": "Maria Silva Santos",
      "email": "maria.santos@universidade.edu.br",
      "role": "ROLE_STUDENT"
    }
  }
  ```

#### C. Submissão de Avaliação (`POST /api/v1/reviews`)
* **Request Payload:**
  ```json
  {
    "targetType": "PROFESSOR",
    "targetId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    "classId": "cls-55443322-1100-aabb-ccdd-eeff00112233",
    "rating": 5,
    "difficultyRating": 3,
    "recommend": true,
    "tags": ["Didático", "Provas Justas"],
    "comment": "Excelente professor, didática impecável e suporte constante nas monitorias.",
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
    "tags": ["Didático", "Provas Justas"],
    "comment": "Excelente professor, didática impecável e suporte constante nas monitorias.",
    "isAnonymous": true,
    "authorDisplayName": "Estudante Anônimo",
    "usefulCount": 0,
    "createdAt": "2026-09-08T14:30:00Z"
  }
  ```

#### D. Paginação Padrão (Spring Pageable)
```json
{
  "content": [...],
  "page": {
    "number": 0,
    "size": 10,
    "totalElements": 42,
    "totalPages": 5
  }
}
```

#### E. Envelope Padronizado de Erro (RFC 7807)
```json
{
  "type": "https://classdoor.acad/errors/unauthorized-domain",
  "title": "Domínio de E-mail Não Autorizado",
  "status": 400,
  "detail": "O cadastro exige e-mail institucional válido (@universidade.edu / @instituicao.br).",
  "instance": "/api/v1/auth/register",
  "invalidParams": [
    {
      "name": "email",
      "reason": "Domínio não autorizado"
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
* **Busca & Navegação:** `bi-search`, `bi-funnel-fill`, `bi-person-fill`, `bi-person-badge-fill`, `bi-building`, `bi-arrow-left`.
* **Tags Pedagógicas Oficiais:**
  * *Didático:* `bi-lightbulb-fill`
  * *Provas Justas:* `bi-file-earmark-check-fill`
  * *Pontualidade:* `bi-clock-fill`
  * *Trabalho em Grupo:* `bi-people-fill`
  * *Focado em Projetos:* `bi-rocket-takeoff-fill`
  * *Carga Exigente:* `bi-lightning-charge-fill`
* **Reviews & Analytics:** `bi-star-fill`, `bi-hand-thumbs-up-fill`, `bi-graph-up`, `bi-file-earmark-pdf-fill`, `bi-file-earmark-spreadsheet-fill`, `bi-box-arrow-right`.

### 6.4 Matriz de Telas no Figma (14 Pranchetas Oficiais)
* **Página 1: Desktop (1440px — Grid 12 colunas):**
  1. `1A. Desktop - Login (US02)` *(Starting Point)*
  2. `1B. Desktop - Cadastro (US01)`
  3. `1C. Desktop - Recuperação de Senha (US02)`
  4. `2. Home & Busca Global (US03)`
  5. `3. Perfil de Docente & Reviews (US04 & US07)`
  6. `4. Modal de Avaliação Anônima & Nominal (US05 & US06)`
  7. `5. Painel Docente & Dashboard (US08 & US09)`
* **Página 2: Mobile (390px — Mobile-First):**
  1. `1A. Mobile - Login (US02)` *(Starting Point)*
  2. `1B. Mobile - Cadastro de Usuário (US01)`
  3. `1C. Mobile - Recuperação de Senha (US02)`
  4. `2. Mobile - Home & Busca Global (US03)`
  5. `3. Mobile - Perfil Docente & Reviews (US04 & US07)`
  6. `4. Mobile - Modal de Avaliação (US05 & US06)`
  7. `5. Mobile - Painel Docente & Dashboard (US08 & US09)`
