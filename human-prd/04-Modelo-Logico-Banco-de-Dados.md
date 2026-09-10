# 🗄️ Modelo Lógico do Banco de Dados — Classdoor (SDD v2.1.0)

**Projeto:** Classdoor  
**Documento:** Modelo Entidade-Relacionamento (MER Lógico), Especificação DBML (dbdiagram.io), Dicionário de Dados e Estratégia de Persistência  
**Referência Normativa:** `specs/02-Arquitetura-Contratos-e-Design-System.md` (Seção 4) & `specs/03-Requisitos-e-User-Stories.md`  
**SGBD Alvo:** PostgreSQL 16+  
**Data:** 2026-09-10  
**Responsáveis:** @Codd (DBA & Arquiteto de Dados Relacionais) & @Atlas (Product Manager)  

---

## 1. Visualização Gráfica do Modelo Lógico (DBML / SVG)

O modelo relacional do Classdoor segue estritamente a **3ª Forma Normal (3FN)** conforme estabelecido na arquitetura SDD v2.1.0, incorporando a gestão de discentes por turma, travas de segurança/quórum ($\ge 5$ alunos), controle de liberação de avaliações (`is_evaluation_open`) e blindagem estrita de anonimato via `audit_hash` (HMAC-SHA256). As tabelas legadas de tags foram eliminadas da persistência em favor de avaliações puramente qualitativas e quantitativas.

![Modelo Lógico do Banco de Dados - Classdoor](./04-Modelo-Logico-Banco-de-Dados.svg)

---

## 2. Especificação DBML Oficial (dbdiagram.io)

O código DBML abaixo é a fonte canônica de verdade para o PostgreSQL 16+, sincronizado com a Seção 4.1 de `specs/02-Arquitetura-Contratos-e-Design-System.md`. As relações de chave estrangeira são declaradas **exclusivamente inline** nas colunas correspondentes (`ref: > ...` e `ref: - ...`), evitando duplicação de referências no renderizador do dbdiagram.io:

```dbml
// =======================================================
// CLASSDOOR - MODELO LÓGICO DE BANCO DE DADOS (PostgreSQL 16+)
// Versão: SDD v2.1.0 (Conforme specs/02 e specs/03)
// DBA: @Codd (Equipe XIUD)
// =======================================================

// --- TIPOS ENUMERADOS (ENUMS) ---

Enum user_role {
  STUDENT [note: 'Estudante']
  PROFESSOR [note: 'Docente']
}

Enum evaluation_mode {
  ANONYMOUS_ONLY [note: 'Apenas avaliações estritamente anônimas permitidas']
  ALLOW_IDENTIFIED [note: 'Permite avaliações nominais opcionais consentidas']
}

// --- TABELAS CENTRAIS & IDENTIDADE ---

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

// --- ESTRUTURA ACADÊMICA ---

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

// --- MOTOR DE AVALIAÇÕES & GAMIFICAÇÃO ---

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

## 3. Dicionário de Dados & Estrutura das Tabelas

### 3.1. Módulo de Identidade e Autenticação

#### Tabela `users`
Armazena a identidade central, credenciais criptografadas e perfil de acesso unificado de todos os usuários da plataforma.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador universal único do usuário (RFC 4122 / UUIDv7). |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | E-mail do usuário (qualquer provedor válido, sem restrição de domínio corporativo). |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Hash da senha gerado com BCrypt (fator de custo 12) ou Argon2id. |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nome completo do usuário. |
| `role` | `user_role` | `NOT NULL, DEFAULT 'STUDENT'` | Papel de acesso RBAC (`STUDENT` ou `PROFESSOR`). |
| `is_active` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Indicador de conta ativa no sistema. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora de criação da conta. |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora da última alteração de cadastro. |

#### Tabela `students`
Extensão de perfil 1:1 de `users` contendo atributos específicos do corpo discente.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE` | Chave primária e estrangeira vinculada ao registro em `users`. |
| `registration_number` | `VARCHAR(50)` | `NULL, UNIQUE` | Matrícula institucional acadêmica (campo opcional no cadastro). |
| `department_id` | `UUID` | `NULL, REFERENCES departments(id) ON DELETE SET NULL` | Departamento acadêmico de vínculo principal do discente. |

#### Tabela `professors`
Extensão de perfil 1:1 de `users` contendo titulação, biografia e métricas pré-computadas para consulta $O(1)$.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, REFERENCES users(id) ON DELETE CASCADE` | Chave primária e estrangeira vinculada ao registro em `users`. |
| `department_id` | `UUID` | `NOT NULL, REFERENCES departments(id) ON DELETE RESTRICT` | Departamento acadêmico de lotação do docente. |
| `title` | `VARCHAR(50)` | `NULL` | Titulação acadêmica oficial (ex.: Doutor, Mestre, Especialista). |
| `bio` | `TEXT` | `NULL` | Mini-biografia, linhas de pesquisa e áreas de atuação. |
| `average_rating` | `NUMERIC(3, 2)` | `NOT NULL, DEFAULT 0.00, CHECK (average_rating BETWEEN 0.00 AND 5.00)` | Média aritmética consolidada das notas (1.00 a 5.00). |
| `difficulty_rating` | `NUMERIC(3, 2)` | `NOT NULL, DEFAULT 0.00, CHECK (difficulty_rating BETWEEN 0.00 AND 5.00)` | Índice médio de dificuldade percebida (1.00 a 5.00). |
| `recommendation_rate` | `NUMERIC(5, 2)` | `NOT NULL, DEFAULT 0.00, CHECK (recommendation_rate BETWEEN 0.00 AND 100.00)` | Taxa percentual acumulada de recomendação discente. |
| `total_reviews` | `INTEGER` | `NOT NULL, DEFAULT 0, CHECK (total_reviews >= 0)` | Contador acumulado de avaliações válidas recebidas. |

---

### 3.2. Módulo Acadêmico, Turmas e Gestão de Matrículas

#### Tabela `departments`
Unidades administrativas e acadêmicas da universidade.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único do departamento. |
| `code` | `VARCHAR(20)` | `NOT NULL, UNIQUE` | Sigla oficial do departamento (ex.: `DCOMP`, `DEMAT`, `DCC`). |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nome por extenso do departamento acadêmico. |
| `website_url` | `VARCHAR(255)` | `NULL` | Portal institucional ou link oficial do departamento. |

#### Tabela `courses`
Catálogo de disciplinas ofertadas vinculadas aos departamentos.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único da disciplina. |
| `department_id` | `UUID` | `NOT NULL, REFERENCES departments(id) ON DELETE RESTRICT` | Departamento responsável pela oferta da matéria. |
| `code` | `VARCHAR(20)` | `NOT NULL, UNIQUE` | Código acadêmico da disciplina (ex.: `CC0101`, `MAT020`). |
| `name` | `VARCHAR(150)` | `NOT NULL` | Nome completo da disciplina. |
| `description` | `TEXT` | `NULL` | Ementa curricular e objetivos de aprendizagem. |
| `credits` | `INTEGER` | `NOT NULL, DEFAULT 4, CHECK (credits > 0)` | Quantidade de créditos acadêmicos da disciplina. |

#### Tabela `classes`
Instâncias semestrais de turmas com suporte a controle de quórum, liberação e bloqueio de novos alunos.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único da turma. |
| `course_id` | `UUID` | `NOT NULL, REFERENCES courses(id) ON DELETE RESTRICT` | Disciplina associada à turma. |
| `professor_id` | `UUID` | `NOT NULL, REFERENCES professors(id) ON DELETE RESTRICT` | Docente responsável pela turma. |
| `semester` | `VARCHAR(10)` | `NOT NULL` | Período letivo no formato semestral padronizado (`AAAA.1` / `AAAA.2`). |
| `code` | `VARCHAR(20)` | `NOT NULL` | Identificador da turma (ex.: `Turma 01`, `Turma 02`). |
| `is_evaluation_open` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Toggle de liberação de avaliações controlado pelo professor. |
| `students_count` | `INTEGER` | `NOT NULL, DEFAULT 0, CHECK (students_count >= 0)` | Contagem de alunos matriculados (exige $\ge 5$ para abertura). |
| `reviews_count` | `INTEGER` | `NOT NULL, DEFAULT 0, CHECK (reviews_count >= 0)` | Total de avaliações recebidas (se $> 0$, trava adição de alunos). |
| `is_active` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Indicador se a turma está ativa no período letivo corrente. |

> **Restrição de Unicidade Composta:** `CONSTRAINT uk_classes_course_semester_code UNIQUE (course_id, semester, code)` — impede turmas duplicadas no mesmo semestre para a mesma matéria.

#### Tabela `class_students`
Matrículas semestrais de estudantes por turma, viabilizando importação contínua em lote e validação de quórum.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único do registro de matrícula. |
| `class_id` | `UUID` | `NOT NULL, REFERENCES classes(id) ON DELETE CASCADE` | Turma na qual o aluno está matriculado. |
| `student_email` | `VARCHAR(255)` | `NOT NULL` | E-mail do aluno cadastrado ou importado em lote. |
| `student_id` | `UUID` | `NULL, REFERENCES students(id) ON DELETE SET NULL` | Vínculo resolvido automaticamente quando o discente se cadastra. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora da inserção na lista da turma. |

> **Restrição de Unicidade Composta:** `CONSTRAINT uk_class_students_class_email UNIQUE (class_id, student_email)` — impede duplicidade de e-mails na mesma turma.

#### Tabela `evaluation_policies`
Regras de sigilo e anonimato parametrizadas por turma.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único da política. |
| `class_id` | `UUID` | `NOT NULL, UNIQUE, REFERENCES classes(id) ON DELETE CASCADE` | Turma vinculada (relação estrita 1:1). |
| `mode` | `evaluation_mode` | `NOT NULL, DEFAULT 'ANONYMOUS_ONLY'` | Modo de avaliação (`ANONYMOUS_ONLY` ou `ALLOW_IDENTIFIED`). |
| `updated_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora da última alteração de política. |

---

### 3.3. Módulo de Avaliações & Interações Sociais

#### Tabela `reviews`
Núcleo da persistência de feedbacks com garantia de anonimato e integridade antifraude.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único da avaliação. |
| `professor_id` | `UUID` | `NOT NULL, REFERENCES professors(id) ON DELETE CASCADE` | Professor avaliado no contexto da turma. |
| `class_id` | `UUID` | `NOT NULL, REFERENCES classes(id) ON DELETE CASCADE` | Turma cursada pelo estudante avaliador. |
| `rating` | `SMALLINT` | `NOT NULL, CHECK (rating BETWEEN 1 AND 5)` | Avaliação geral (escala inteira de 1 a 5 estrelas). |
| `difficulty` | `SMALLINT` | `NOT NULL, CHECK (difficulty BETWEEN 1 AND 5)` | Nível de dificuldade percebido (1 a 5). |
| `would_recommend` | `BOOLEAN` | `NOT NULL` | Se o discente recomendaria o professor/turma (`TRUE`/`FALSE`). |
| `comment` | `TEXT` | `NOT NULL, CHECK (char_length(comment) >= 20)` | Comentário textual estruturado (mínimo de 20 caracteres). |
| `is_anonymous` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Se a avaliação é anônima. |
| `student_identifier_display` | `VARCHAR(150)` | `NULL` | Nome público exibido (preenchido SOMENTE quando `is_anonymous = FALSE`). |
| `audit_hash` | `VARCHAR(64)` | `NOT NULL, UNIQUE` | Hash SHA-256 (`HMAC_SHA256(pepper, user_id || class_id)`) para impedir votos múltiplos sem quebrar o sigilo. |
| `upvotes_count` | `INTEGER` | `NOT NULL, DEFAULT 0, CHECK (upvotes_count >= 0)` | Total de estudantes que marcaram a avaliação como útil. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora da submissão do feedback. |

#### Tabela `review_upvotes`
Controle transacional de votos de utilidade para evitar múltiplos votos pelo mesmo usuário.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, DEFAULT gen_random_uuid()` | Identificador único do registro de voto. |
| `review_id` | `UUID` | `NOT NULL, REFERENCES reviews(id) ON DELETE CASCADE` | Avaliação que recebeu o voto útil. |
| `user_id` | `UUID` | `NOT NULL, REFERENCES users(id) ON DELETE CASCADE` | Usuário autenticado que emitiu o upvote. |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT NOW()` | Data e hora de registro do voto. |

> **Restrição de Unicidade Composta:** `CONSTRAINT uk_review_upvotes_user_review UNIQUE (user_id, review_id)` — assegura 1 upvote por usuário em cada avaliação.

---

## 4. Governança de Integridade, Quórum e Segurança de Dados (SDD v2.1.0)

1. **Protocolo de Blindagem de Anonimato & Prevenção de Duplicidade:**
   - A coluna `audit_hash` na tabela `reviews` armazena um hash criptográfico unilateral calculado na aplicação:  
     $$\text{audit\_hash} = \text{HMAC-SHA256}(\text{APP\_PEPPER}, \text{user\_id} \mathbin{\Vert} \text{class\_id})$$
   - A constraint `UNIQUE(audit_hash)` impede avaliações duplicadas pelo mesmo estudante na mesma turma sem armazenar a chave estrangeira `user_id`, garantindo conformidade estrita com a LGPD e o RNF01.
2. **Regras de Negócio de Matrículas e Quórum Mínimo:**
   - **Quórum Mínimo ($\ge 5$ alunos):** A liberação das avaliações pelo professor (`classes.is_evaluation_open = true`) exige quórum mínimo de 5 alunos matriculados (`classes.students_count >= 5`).
   - **Trava de Adição de Alunos:** Caso `classes.reviews_count > 0`, qualquer inserção em `class_students` para aquela turma é bloqueada a nível de aplicação e trigger de banco, impedindo ataques de desanonimização por eliminação.
   - **Cegueira de Acesso Docente (*Access Blindness*):** O sistema exibe ao docente apenas a listagem de e-mails matriculados e contadores agregados, omitindo expressamente status de ativação, logins recentes ou indicadores individuais de quem já avaliou.
3. **Estratégia de Exclusão em Cascata (`ON DELETE`):**
   - **`CASCADE`:** Utilizado nas extensões de perfil 1:1 (`students`, `professors`), políticas (`evaluation_policies`), matrículas (`class_students`) e votos (`review_upvotes`).
   - **`SET NULL`:** Utilizado na referência `class_students.student_id` para preservar a lista de e-mails matriculados caso um usuário seja excluído.
   - **`RESTRICT`:** Utilizado nas entidades estruturais (`departments`, `courses`, `classes`) para impedir deleções acidentais de dados históricos.

---

## 5. Estratégia de Indexação e Performance

Para assegurar tempos de resposta em $P_{95} < 300\text{ms}$ sob alta concorrência:

```sql
-- 1. Otimização para listagem e ordenação de avaliações por professor
CREATE INDEX idx_reviews_professor_created 
  ON reviews (professor_id, created_at DESC);

-- 2. Otimização para busca de avaliações por turma
CREATE INDEX idx_reviews_class_id 
  ON reviews (class_id);

-- 3. Otimização para busca e validação de matrículas por turma e e-mail
CREATE INDEX idx_class_students_class_id 
  ON class_students (class_id);

CREATE INDEX idx_class_students_student_email 
  ON class_students (student_email);

-- 4. Otimização para busca e filtragem de disciplinas por departamento
CREATE INDEX idx_courses_dept_code 
  ON courses (department_id, code);

-- 5. Otimização para agregação e ranking de professores por departamento
CREATE INDEX idx_professors_dept_rating 
  ON professors (department_id, average_rating DESC);

-- 6. Otimização de consultas de turmas ativas e abertas por semestre
CREATE INDEX idx_classes_semester_open 
  ON classes (semester, is_evaluation_open) 
  WHERE is_active = TRUE;

-- 7. Índice de unicidade de upvotes por usuário e review
CREATE UNIQUE INDEX uk_review_upvotes_user_review 
  ON review_upvotes (user_id, review_id);
```
