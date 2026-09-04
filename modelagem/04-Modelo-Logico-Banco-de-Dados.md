# 🗄️ Modelo Lógico do Banco de Dados — Classdoor

**Projeto:** Classdoor  
**Documento:** Modelo Entidade-Relacionamento (MER Lógico), Dicionário de Dados e Estratégia de Persistência  
**SGBD Alvo:** PostgreSQL 16+  
**Data:** 2026-09-04  
**Responsável:** @Atlas (Product Manager)  

---

## 1. Diagrama Entidade-Relacionamento (ERD / Mermaid)

```mermaid
erDiagram
    USERS ||--o| STUDENTS : "possui perfil"
    USERS ||--o| PROFESSORS : "possui perfil"
    DEPARTMENTS ||--o{ PROFESSORS : "aloca"
    DEPARTMENTS ||--o{ COURSES : "oferece"
    COURSES ||--o{ CLASSES : "possui turmas"
    PROFESSORS ||--o{ CLASSES : "leciona"
    CLASSES ||--|| EVALUATION_POLICIES : "rege"
    CLASSES ||--o{ REVIEWS : "recebe"
    PROFESSORS ||--o{ REVIEWS : "é avaliado em"
    REVIEWS ||--o{ REVIEW_TAGS : "possui"
    TAGS ||--o{ REVIEW_TAGS : "categoriza"
    REVIEWS ||--o{ REVIEW_UPVOTES : "recebe votos"
    USERS ||--o{ REVIEW_UPVOTES : "vota em"

    USERS {
        uuid id PK
        varchar email UK "E-mail institucional (@edu/@br)"
        varchar password_hash "BCrypt Hash"
        varchar name "Nome completo"
        enum role "STUDENT | PROFESSOR | ADMIN"
        boolean is_active "Status de ativação"
        timestamp created_at
        timestamp updated_at
    }

    STUDENTS {
        uuid id PK, FK "Referência a USERS(id)"
        varchar registration_number UK "Matrícula institucional"
        uuid department_id FK
    }

    PROFESSORS {
        uuid id PK, FK "Referência a USERS(id)"
        uuid department_id FK
        varchar title "Dr. / Me. / Esp."
        text bio "Apresentação e ementa resumida"
        decimal average_rating "Nota média agregada (1.00 a 5.00)"
        decimal difficulty_rating "Dificuldade média (1.00 a 5.00)"
        decimal recommendation_rate "Percentual de recomendação (0-100%)"
        int total_reviews "Contador acumulado de reviews"
    }

    DEPARTMENTS {
        uuid id PK
        varchar code UK "Ex: DCOMP, DEMAT"
        varchar name "Ex: Departamento de Computação"
        varchar website_url
    }

    COURSES {
        uuid id PK
        uuid department_id FK
        varchar code UK "Ex: CC0101"
        varchar name "Ex: Algoritmos e Estruturas de Dados"
        text description "Ementa oficial"
        int credits "Número de créditos acadêmicos"
    }

    CLASSES {
        uuid id PK
        uuid course_id FK
        uuid professor_id FK
        varchar semester "Ex: 2026.1"
        varchar code "Turma 01, Turma 02"
        boolean is_active "Turma em andamento"
    }

    EVALUATION_POLICIES {
        uuid id PK
        uuid class_id UK, FK
        enum mode "ANONYMOUS_ONLY | ALLOW_IDENTIFIED"
        timestamp updated_at
    }

    REVIEWS {
        uuid id PK
        uuid professor_id FK "Docente avaliado"
        uuid class_id FK "Turma vinculada"
        int rating "Nota geral (1 a 5)"
        int difficulty "Dificuldade (1 a 5)"
        boolean would_recommend "Recomendaria? (true/false)"
        text comment "Texto da avaliação"
        boolean is_anonymous "Flag de anonimato (default true)"
        varchar student_identifier_display "Nome exibido (NULL se anônimo)"
        varchar audit_hash "Hash SHA-256 (aluno+turma) para unicidade"
        int upvotes_count "Total de upvotes úteis"
        timestamp created_at
    }

    TAGS {
        uuid id PK
        varchar name UK "Ex: Didático, Provas Justas"
        varchar category "PEDAGOGICAL | EXIGENCY | ASSESSMENT"
        varchar icon_class "Classe do Bootstrap Icons"
    }

    REVIEW_TAGS {
        uuid review_id PK, FK
        uuid tag_id PK, FK
    }

    REVIEW_UPVOTES {
        uuid id PK
        uuid review_id FK
        uuid user_id FK
        timestamp created_at
    }
```

---

## 2. Dicionário de Dados & Estrutura das Tabelas

### 2.1. Tabela `users`
Armazena a identidade central e credenciais de acesso de todos os usuários da plataforma.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único global do usuário. |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | E-mail institucional único. |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Hash da senha com BCrypt. |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nome completo do usuário. |
| `role` | `VARCHAR(30)` | `NOT NULL, CHECK (role IN ('STUDENT', 'PROFESSOR', 'ADMIN'))` | Papel do usuário no sistema. |
| `is_active` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Indicador de conta ativa. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Data de criação. |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Data da última alteração. |

---

### 2.2. Tabela `professors`
Estende o usuário com informações acadêmicas e métricas agregadas pré-computadas para alta performance.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE` | Chave estrangeira e primária 1:1 com `users`. |
| `department_id` | `UUID` | `NOT NULL, REFERENCES departments(id)` | Departamento ao qual o professor está alocado. |
| `title` | `VARCHAR(50)` | `NULL` | Titulação acadêmica (ex.: Doutor, Mestre). |
| `bio` | `TEXT` | `NULL` | Mini-biografia e áreas de atuação. |
| `average_rating` | `NUMERIC(3, 2)` | `NOT NULL, DEFAULT 0.00` | Média geral das notas (1.00 a 5.00). |
| `difficulty_rating` | `NUMERIC(3, 2)` | `NOT NULL, DEFAULT 0.00` | Média de dificuldade percebida (1.00 a 5.00). |
| `recommendation_rate` | `NUMERIC(5, 2)` | `NOT NULL, DEFAULT 0.00` | Percentual de recomendação (0% a 100%). |
| `total_reviews` | `INTEGER` | `NOT NULL, DEFAULT 0` | Contador total de avaliações recebidas. |

---

### 2.3. Tabela `reviews` (Motor de Avaliações & Anonimato)
Armazena os feedbacks dos estudantes com garantia de desacoplamento de identidade.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador da avaliação. |
| `professor_id` | `UUID` | `NOT NULL, REFERENCES professors(id) ON DELETE CASCADE` | Professor avaliado. |
| `class_id` | `UUID` | `NOT NULL, REFERENCES classes(id) ON DELETE CASCADE` | Turma avaliada. |
| `rating` | `SMALLINT` | `NOT NULL, CHECK (rating BETWEEN 1 AND 5)` | Nota de 1 a 5 estrelas. |
| `difficulty` | `SMALLINT` | `NOT NULL, CHECK (difficulty BETWEEN 1 AND 5)` | Nível de dificuldade de 1 a 5. |
| `would_recommend` | `BOOLEAN` | `NOT NULL` | Se o aluno recomenda o docente/disciplina. |
| `comment` | `TEXT` | `NOT NULL, CHECK (char_length(comment) >= 20)` | Texto da avaliação detalhada. |
| `is_anonymous` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Flag de avaliação anônima. |
| `student_identifier_display` | `VARCHAR(150)` | `NULL` | Nome público do autor (preenchido SOMENTE se `is_anonymous = FALSE`). |
| `audit_hash` | `VARCHAR(64)` | `NOT NULL, UNIQUE` | Hash SHA-256 (`salt + user_id + class_id`) para evitar avaliações duplicadas sem expor o autor. |
| `upvotes_count` | `INTEGER` | `NOT NULL, DEFAULT 0` | Contagem agregada de votos de utilidade. |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | `NOT NULL, DEFAULT NOW()` | Data de postagem. |

---

## 3. Estratégia de Índices e Performance
Para garantir tempos de resposta $P_{95} < 300\text{ms}$:
1. **`idx_professors_dept_rating`:** `CREATE INDEX idx_professors_dept_rating ON professors(department_id, average_rating DESC);`
2. **`idx_reviews_professor_created`:** `CREATE INDEX idx_reviews_professor_created ON reviews(professor_id, created_at DESC);`
3. **`idx_courses_code_name`:** `CREATE INDEX idx_courses_code_name ON courses(code, name);`
4. **`idx_review_upvotes_unique`:** `CREATE UNIQUE INDEX idx_review_upvotes_user_review ON review_upvotes(user_id, review_id);`
