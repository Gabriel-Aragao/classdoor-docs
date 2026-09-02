# Contratos de Dados e Regras Técnicas de Integração — Classdoor

**Projeto:** Classdoor  
**Documento:** Mapeamento de Contratos RESTful, Endpoints e Regras Técnicas (Alinhado ao Fluxo Cronológico US01 a US09)  
**Data de Revisão:** 2026-09-01  
**Arquiteto / Tech Lead:** @Dijkstra (Tech Lead)  
**Stakeholders:** @domaragao (CTO/PO), @atlas (Product Manager), @aria (Frontend), @peter (Backend), @qa (Quality Assurance), @hermes (Friday)

---

## 1. Mapeamento Sequencial de Endpoints por User Story

| User Story | Método HTTP | Endpoint | Descrição / Responsabilidade |
| :--- | :--- | :--- | :--- |
| **US01** (Cadastro) | `POST` | `/api/v1/auth/register` | Criação de conta com e-mail institucional e tipo de perfil (`ROLE_STUDENT`, `ROLE_PROFESSOR`) |
| **US02** (Login & Sessão) | `POST` | `/api/v1/auth/login` | Autenticação por e-mail/senha retornando token JWT e claims de permissão |
| **US02** (Recuperação) | `POST` | `/api/v1/auth/forgot-password` | Disparo de link de recuperação de acesso para o e-mail cadastrado |
| **US03** (Busca & Home) | `GET` | `/api/v1/professors` | Busca paginada de professores com filtros (`query`, `department`, `page`, `size`, `sort`) |
| **US03** (Busca & Home) | `GET` | `/api/v1/courses` | Busca paginada de disciplinas com filtros (`query`, `department`, `code`, `page`, `size`, `sort`) |
| **US03** (Destaques) | `GET` | `/api/v1/home/featured` | Lista consolidada de professores e disciplinas em destaque na Home |
| **US04** (Perfil Detalhado) | `GET` | `/api/v1/professors/{id}` | Perfil detalhado com métricas agregadas (score médio, dificuldade, % recomendação, tags) |
| **US04** (Perfil Detalhado) | `GET` | `/api/v1/courses/{id}` | Perfil detalhado da disciplina com histórico de turmas e notas |
| **US04** (Feed de Reviews) | `GET` | `/api/v1/reviews` | Listagem pública paginada de reviews (`targetType`, `targetId`, `sort=recent\|rating\|useful`) |
| **US05 / US06** (Envio Review) | `POST` | `/api/v1/reviews` | Submissão de avaliação (anônima padrão ou nominal autorizada) |
| **US07** (Voto Útil / Upvote) | `POST` | `/api/v1/reviews/{id}/useful` | Incremento atômico de voto "Útil" com debounce/idempotência |
| **US08** (Políticas de Turma) | `PATCH` | `/api/v1/courses/{courseId}/classes/{classId}/policy` | Alternância de política da turma pelo professor (`ANONYMOUS_ONLY` vs `ALLOW_IDENTIFIED`) |
| **US09** (Analytics Docente) | `GET` | `/api/v1/professors/{id}/analytics` | Métricas consolidadas, série temporal semestral e nuvem de tags agregadas |

---

## 2. Contratos de Payload e Schemas (JSON)

### 2.1 US01 — Cadastro de Usuário (`POST /api/v1/auth/register`)
#### Request:
```json
{
  "name": "Maria Silva Santos",
  "email": "maria.santos@universidade.edu.br",
  "password": "SenhaForte@2026",
  "role": "STUDENT", // "STUDENT" | "PROFESSOR"
  "department": "Ciência da Computação"
}
```
#### Response (HTTP 201 Created):
```json
{
  "id": "usr-12345678-90ab-cdef-1234-567890abcdef",
  "name": "Maria Silva Santos",
  "email": "maria.santos@universidade.edu.br",
  "role": "STUDENT",
  "department": "Ciência da Computação",
  "createdAt": "2026-09-01T10:00:00Z"
}
```

---

### 2.2 US02 — Autenticação / Login (`POST /api/v1/auth/login`)
#### Request:
```json
{
  "email": "maria.santos@universidade.edu.br",
  "password": "SenhaForte@2026"
}
```
#### Response (HTTP 200 OK):
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

---

### 2.3 US03 & US04 — Envelope de Paginação Padrão (Spring Pageable)
```json
{
  "content": [
    {
      "id": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
      "name": "Dr. Carlos Eduardo Santos",
      "department": "Ciência da Computação",
      "avatarUrl": "https://api.dicebear.com/7.x/initials/svg?seed=Carlos+Santos",
      "averageRating": 4.6,
      "difficultyRating": 3.2,
      "recommendationPercentage": 88,
      "totalReviews": 42,
      "topTags": ["Didático", "Provas Claras", "Pontual"]
    }
  ],
  "page": {
    "number": 0,
    "size": 10,
    "totalElements": 1,
    "totalPages": 1
  }
}
```

---

### 2.4 US05 & US06 — Submissão de Avaliação (`POST /api/v1/reviews`)
#### Request Payload:
```json
{
  "targetType": "PROFESSOR", // "PROFESSOR" | "COURSE"
  "targetId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "rating": 5, // Inteiro ou Float de 1 a 5
  "difficultyRating": 3, // Inteiro de 1 a 5
  "recommend": true, // Boolean
  "tags": ["Didático", "Provas Justas"], // Array de strings (max 3)
  "comment": "Excelente professor, explica com muita clareza e traz exemplos práticos de mercado.",
  "isAnonymous": true, // Boolean (default: true)
  "studentIdentifier": null // Obrigatório ser null se isAnonymous == true; Nome público se false
}
```

#### Response (HTTP 201 Created):
```json
{
  "id": "rev-98765432-10ab-cdef-1234-567890abcdef",
  "targetType": "PROFESSOR",
  "targetId": "prof-a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
  "rating": 5.0,
  "difficultyRating": 3.0,
  "recommend": true,
  "tags": ["Didático", "Provas Justas"],
  "comment": "Excelente professor, explica com muita clareza e traz exemplos práticos de mercado.",
  "isAnonymous": true,
  "authorDisplayName": "Estudante Anônimo",
  "usefulCount": 0,
  "createdAt": "2026-09-01T14:30:00Z"
}
```

---

## 3. Regras Técnicas de Segurança, Anonimato e Integração

1. **Expurgo de Metadados em Avaliações Anônimas (US05):**
   - Em submissões com `isAnonymous === true`:
     - O backend **NÃO** vincula o registro da avaliação a chaves estrangeiras públicas do usuário (`user_id`, `student_id`, IP de origem).
     - O campo `authorDisplayName` retornado na API pública será estaticamente `"Estudante Anônimo"`.
     - Caso `studentIdentifier` seja enviado preenchido com `isAnonymous: true`, a requisição será rejeitada com erro `400 Bad Request`.

2. **Validação de Modo Nominal (US06 & US08):**
   - Em submissões com `isAnonymous === false`:
     - O backend deve checar se a turma/disciplina possui autorização explícita (`ALLOW_IDENTIFIED`).
     - Caso contrário, a requisição é rejeitada com código `403 Forbidden` informando que a disciplina opera exclusivamente em modo anônimo.

3. **Controle de Idempotência no Upvote (US07):**
   - O endpoint `/api/v1/reviews/{id}/useful` exige proteção contra requisições repetidas em curto intervalo (debounce na UI e controle de sessão/cookie descartável no backend).

4. **Tratamento de Erros Padronizado (RFC 7807 Problem Details):**
```json
{
  "type": "https://classdoor.acad/errors/unauthorized-domain",
  "title": "Domínio de E-mail Não Autorizado",
  "status": 400,
  "detail": "O cadastro exige e-mail institucional válido (@universidade.edu / @instituicao.br).",
  "instance": "/api/v1/auth/register"
}
```
